
import logging # Use logger

from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.conf import settings
from django.urls import reverse
from urllib.parse import urlencode, urlparse, urlunparse

# Allauth imports
from allauth.core.exceptions import ImmediateHttpResponse # To force redirect
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialAccount, SocialLogin
from allauth.account.models import EmailAddress
from allauth.account.utils import user_email # Helper to get email
from allauth.account.adapter import DefaultAccountAdapter
# Make sure DefaultSocialAccountAdapter is imported if not already via Patched
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialApp
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from urllib.parse import urlencode, urlparse, urlunparse
from django.http import HttpResponseRedirect # Ensure this import is present at the top of your file

from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken # Ensure imported
from django.contrib.sites.models import Site# --- Your PatchedSocialAccountAdapter (Keep As Is - with get_app fix) ---
class PatchedSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_app(self, request, provider, site=None, **kwargs):
        # Your existing logic using .first() to prevent MultipleObjectsReturned
        print(f"PatchedSocialAccountAdapter.get_app called for provider='{provider}'")
        # if not site:
        #     site = get_current_site(request)

        site = site or Site.objects.get_current()

        apps = SocialApp.objects.filter(provider=provider, sites=site)
        if not apps.exists():
             raise SocialApp.DoesNotExist(f"Configuration Error: No SocialApp found for provider='{provider}' and site='{site.name}' (Site ID: {site.id}).")
        if apps.count() > 1:
            print(f"⚠️ WARNING: Multiple SocialApp entries found for provider='{provider}' and site='{site.name}' (Site ID: {site.id}). Using the first one found (ID: {apps.first().id}).")
        return apps.first()


class CustomAccountAdapter(DefaultAccountAdapter):

    def get_login_redirect_url(self, request):
        # Keep all your detailed logging here
        user = getattr(request, 'user', None)
        print("\n" + "="*20 + " CustomAccountAdapter.get_login_redirect_url CALLED " + "="*20)
        if user:
             print(f"User Object: {user} (ID: {user.pk}, Email: {user.email})")
             print(f"User Authenticated: {user.is_authenticated}") # Check status when called
        else:
             print("User Object: None")

        if user and user.is_authenticated:
            print("User is authenticated, proceeding with JWT generation and redirect to FRONTEND.")
            try:
                simplejwt_refresh = RefreshToken.for_user(user)
                access_token = str(simplejwt_refresh.access_token)
                print(f"JWT Access Token Generated: {access_token[:15]}...")

                frontend_url_str = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
                frontend_callback_path = '/auth/callback'

                url_parts = list(urlparse(frontend_url_str))
                url_parts[2] = frontend_callback_path
                query_params = {'access_token': access_token}
                url_parts[4] = urlencode(query_params)
                redirect_url_generated = urlunparse(url_parts) # Use a different variable name just in case

                print(f"FINAL REDIRECT URL: {redirect_url_generated}")
                print("=" * 60 + "\n")
                return redirect_url_generated # Return the generated URL
            except Exception as e:
                print(f"!!! ERROR generating JWT or URL: {e}")
                print("=" * 60 + "\n")
                fallback_frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
                return f"{fallback_frontend_url}/signin?error=token_generation_failed"
        else:
            print("!!! User NOT authenticated OR issue detected in get_login_redirect_url. Falling back.")
            # Use LOGIN_REDIRECT_URL as the ultimate fallback if frontend redirect isn't possible
            fallback_url = settings.LOGIN_REDIRECT_URL # Directly use the setting
            print(f"Fallback Redirect URL (from settings.LOGIN_REDIRECT_URL): {fallback_url}")
            print("Check if ACCOUNT_ADAPTER is correctly set and if auth middleware ran before this.")
            print("=" * 60 + "\n")
            # Consider if you REALLY want to send users to "/" or maybe to frontend signin on failure
            # return f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')}/signin?error=auth_failed_during_redirect"
            return fallback_url # Return "/" (or your LOGIN_REDIRECT_URL)


    # --- ADD THIS METHOD ---
    def post_login(self, request, user, **kwargs):
        """
        Override post_login to directly control the redirect after login.
        Ensures the URL from get_login_redirect_url (which handles JWT/frontend) is used.
        """
        print("\n" + "="*20 + " CustomAccountAdapter.post_login CALLED " + "="*20)
        print(f"User passed to post_login: {user} (ID: {user.pk})")
        print(f"Is authenticated within post_login scope: {user.is_authenticated}") # Should be True here

        # Get the URL determined by our logic (either frontend+JWT or fallback)
        url = self.get_login_redirect_url(request)

        print(f"URL determined by get_login_redirect_url to redirect to: {url}")
        print("=" * 60 + "\n")

        # Create and return the redirect response
        return redirect(url)

    # Keep your working get_logout_redirect_url
    def get_logout_redirect_url(self, request):
        # ... (your frontend signin redirect) ...
        frontend_url_str = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        frontend_signin_path = '/signin'
        url_parts = list(urlparse(frontend_url_str))
        url_parts[2] = frontend_signin_path
        url_parts[4] = ''
        logout_redirect_url = urlunparse(url_parts) # Use specific variable name
        print(f"CustomAccountAdapter: Redirecting to {logout_redirect_url} on logout.")
        return logout_redirect_url

logger = logging.getLogger(__name__)


# --- ENSURE THIS HELPER FUNCTION IS DEFINED AT THE TOP OF YOUR FILE ---
def get_frontend_url(path, query_params=None):
    frontend_url_str = settings.FRONTEND_URL
    url_parts = list(urlparse(frontend_url_str))
    url_parts[2] = path # e.g., /signin, /auth/callback
    if query_params:
        url_parts[4] = urlencode(query_params)
    else:
        url_parts[4] = ''
    return urlunparse(url_parts)


class CombinedSocialAccountAdapter(PatchedSocialAccountAdapter):  # Your existing class definition
    """
    Handles SOCIAL account actions. Inherits get_app fix.
    Overrides methods to prevent Django template rendering for SPA.
    """

    # Your existing is_open_for_signup method
    def is_open_for_signup(self, request, sociallogin):
        return True

    # Your existing pre_social_login method
    def pre_social_login(self, request, sociallogin: SocialLogin):
        if request.user.is_authenticated:  # User already logged in (connect flow)
            logger.info(f"CombinedSocial: User {request.user.pk} already logged in, allowing account connection.")
            return  # Let it proceed

        email = user_email(sociallogin.user) or sociallogin.account.extra_data.get('email')
        if email:
            try:
                existing_email_obj = EmailAddress.objects.select_related('user').get(email__iexact=email)
                existing_user = existing_email_obj.user  # The local user with this email

                # Check if THIS specific social account provider is ALREADY connected to THIS existing_user
                is_already_connected = SocialAccount.objects.filter(
                    provider=sociallogin.account.provider,  # e.g., 'google'
                    uid=sociallogin.account.uid,  # The unique ID from Google for this user
                    user=existing_user
                ).exists()

                # If the social account is already fully connected, let allauth log them in normally.
                if is_already_connected:
                    logger.info(
                        f"CombinedSocial: Social account ({sociallogin.account.provider}, uid: {sociallogin.account.uid}) for email {email} is already connected to user {existing_user.pk}. Allowing login.")
                    return  # Let allauth proceed to log in this user

                # CONFLICT: Email exists for a local user, BUT THIS Google account is NOT YET linked to them.
                # This is where allauth might show the /3rdparty/signup/ page.
                # We want to intercept and redirect to our frontend.
                logger.warning(
                    f"CombinedSocial: Conflict for {email}. User {existing_user.pk} exists, "
                    f"but this specific Google account (uid: {sociallogin.account.uid}) is not yet linked. "
                    f"Redirecting to frontend signin with error."
                )
                redirect_url = get_frontend_url('/signin', {'error': 'social_account_email_exists', 'email': email})
                raise ImmediateHttpResponse(redirect(redirect_url))

            except EmailAddress.DoesNotExist:
                # No local account with this email. This is a NEW signup via social.
                logger.info(
                    f"CombinedSocial: No existing local user found for email {email}. Proceeding with NEW social signup.")
                # Allauth will proceed to sign up, then user_logged_in signal should handle redirect.
            except Exception as e:
                logger.error(f"CombinedSocial: Error in pre_social_login for {email}: {e}", exc_info=True)
        else:
            logger.warning("CombinedSocial: Could not determine email from social login in pre_social_login.")

    # --- METHOD TO ADD/MODIFY ---
    def get_social_account_signup_redirect_url(self, request, sociallogin):
        """
        Overrides the redirect URL when allauth wants to show its own
        3rd party social signup confirmation page (e.g., /accounts/3rdparty/signup/).
        We redirect to the frontend's signin page with an error code.
        """
        social_email = user_email(sociallogin.user) or sociallogin.account.extra_data.get('email', 'unknown')
        logger.warning(
            f"CombinedSocialAdapter: Intercepting get_social_account_signup_redirect_url "
            f"for sociallogin with email '{social_email}'. Allauth wants to show its confirm page. "
            f"Redirecting to frontend instead."
        )

        error_code = 'social_signup_requires_frontend_step'
        # Use the get_frontend_url helper function
        redirect_url = get_frontend_url('/signin', {'error': error_code, 'email': social_email})

        return redirect_url  # Return the URL string, allauth will handle the HttpResponseRedirect

    # def get_social_account_signup_redirect_url(self, request, sociallogin):
    #     """
    #     Overrides the redirect URL when allauth wants to show its own
    #     3rd party social signup confirmation page (e.g., /accounts/3rdparty/signup/).
    #     We redirect to the frontend's signin page with an error code.
    #     """
    #     social_email = user_email(sociallogin.user) or sociallogin.account.extra_data.get('email', 'unknown')
    #     logger.warning(
    #         f"CombinedSocialAdapter: Intercepting get_social_account_signup_redirect_url "
    #         f"for sociallogin with email '{social_email}'. Allauth wants to show its confirm page. "
    #         f"Redirecting to frontend instead."
    #     )
    #
    #     error_code = 'social_signup_requires_frontend_step'
    #     # Use the get_frontend_url helper function
    #     redirect_url = get_frontend_url('/signin', {'error': error_code, 'email': social_email})
    #
    #     return redirect_url  # Return the URL string, allauth will handle the HttpResponseRedirect

    # --- METHOD TO ADD/MODIFY ---
    def respond_social_account_already_in_use(self, request, sociallogin):
        """
        Called when the social account is already connected to a *different* local user.
        Redirects to frontend signin page with an error.
        """
        social_email = user_email(sociallogin.user) or sociallogin.account.extra_data.get('email', 'unknown')
        logger.warning(
            f"CombinedSocialAdapter: Social account for email '{social_email}' "
            f"is already in use by another local user. Redirecting to frontend."
        )
        # Use the get_frontend_url helper function
        redirect_url = get_frontend_url('/signin', {'error': 'social_account_in_use', 'email': social_email})
        # This method should return an HttpResponseRedirect directly
        return HttpResponseRedirect(redirect_url)

    # --- KEEP THIS METHOD (if you still want it and the user_logged_in signal isn't primary) ---
    # --- OR COMMENT IT OUT if user_logged_in signal handles all post-login redirects reliably ---
    # def get_signup_redirect_url(self, request):
    #     # This is called AFTER a NEW social user is created and auto-signed up.
    #     # The user_logged_in signal is the preferred primary redirect mechanism.
    #     # This method can act as a fallback.
    #     user = getattr(request, 'user', None)
    #     logger.info(
    #         f"CombinedSocialAdapter.get_signup_redirect_url: User={user}, "
    #         f"Authenticated={user.is_authenticated if user else False}. (This is a fallback redirect)."
    #     )
    #     if user and user.is_authenticated:
    #         try:
    #             refresh = RefreshToken.for_user(user)
    #             return get_frontend_url('/auth/callback', {'access_token': str(refresh.access_token)})
    #         except Exception as e:
    #             logger.error(f"CombinedSocialAdapter: Error generating JWT in get_signup_redirect_url: {e}")
    #             return get_frontend_url('/signin', {'error': 'token_gen_failed_social_signup_adapter'})
    #     return get_frontend_url('/signin', {'error': 'social_signup_redirect_failed_adapter'})

# --- END OF HELPER FUNCTION ---

# # --- Your CustomAccountAdapter (Keep As Is - handles standard login/logout) ---
# class CustomAccountAdapter(DefaultAccountAdapter):
#     # Keep your working get_login_redirect_url with detailed logging
#     def get_login_redirect_url(self, request):
#         # ... (Your JWT + Frontend Redirect logic for standard login) ...
#         # ... Make sure it has detailed logging ...
#         user = getattr(request, 'user', None)
#         print("\n" + "="*20 + " CustomAccountAdapter.get_login_redirect_url CALLED " + "="*20)
#         # ... (rest of detailed logging and logic) ...
#         if user and user.is_authenticated:
#             # ... JWT + Redirect logic ...
#             return redirect_url
#         else:
#             # ... Fallback logic ...
#             return fallback_url
#
#     # Keep your working get_logout_redirect_url
#     def get_logout_redirect_url(self, request):
#         # ... (your frontend signin redirect) ...
#         return redirect_url
#
# # --- CombinedSocialAccountAdapter (Modify this one) ---
# class CombinedSocialAccountAdapter(PatchedSocialAccountAdapter): # Inherits get_app fix
#     """
#     Handles SOCIAL account actions. Inherits get_app fix.
#     Overrides get_signup_redirect_url to redirect to frontend with JWT.
#     """
#
#     # --- ADD THIS METHOD ---
#     def get_signup_redirect_url(self, request):
#         """
#         Redirect to frontend with JWT token after SOCIAL SIGNUP.
#         This is likely the hook used after SOCIALACCOUNT_AUTO_SIGNUP.
#         """
#         user = getattr(request, 'user', None) # User should have been logged in by perform_login
#
#         # --- START DIAGNOSTIC LOGGING ---
#         print("\n" + "="*20 + " CombinedSocialAccountAdapter.get_signup_redirect_url CALLED " + "="*20)
#         if user:
#             print(f"User Object: {user} (ID: {user.pk}, Email: {user.email})")
#             print(f"User Authenticated: {user.is_authenticated}")
#         else:
#             print("User Object: None")
#         # --- END DIAGNOSTIC LOGGING ---
#
#         if user and user.is_authenticated:
#             print("User is authenticated, proceeding with JWT generation and redirect to FRONTEND.")
#             try:
#                 simplejwt_refresh = RefreshToken.for_user(user)
#                 access_token = str(simplejwt_refresh.access_token)
#                 print(f"JWT Access Token Generated: {access_token[:15]}...")
#
#                 frontend_url_str = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
#                 frontend_callback_path = '/auth/callback'
#
#                 url_parts = list(urlparse(frontend_url_str))
#                 url_parts[2] = frontend_callback_path
#                 query_params = {'access_token': access_token}
#                 url_parts[4] = urlencode(query_params)
#                 redirect_url = urlunparse(url_parts)
#
#                 print(f"FINAL REDIRECT URL (from social signup): {redirect_url}")
#                 print("="*60 + "\n")
#                 return redirect_url
#             except Exception as e:
#                 print(f"!!! ERROR generating JWT or URL in get_signup_redirect_url: {e}")
#                 print("="*60 + "\n")
#                 fallback_frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
#                 return f"{fallback_frontend_url}/signin?error=token_generation_failed_social"
#         else:
#             # --- Fallback Path Logging ---
#             print("!!! User NOT authenticated OR issue detected in get_signup_redirect_url. Falling back.")
#             # Fallback to default social account redirect logic (often LOGIN_REDIRECT_URL)
#             fallback_url = super().get_signup_redirect_url(request)
#             print(f"Fallback Redirect URL (from super get_signup_redirect_url): {fallback_url}")
#             print("="*60 + "\n")
#             return fallback_url # Let it fallback to "/" which causes TemplateDoesNotExist
#
#     # Keep other methods minimal unless needed
#     def is_open_for_signup(self, request, sociallogin):
#         return True
#
#     def pre_social_login(self, request, sociallogin):
#         pass
#
#     # NO save_user override here - let default handle verification based on settings

# --- Modify CustomAccountAdapter ---

# --- Your CombinedSocialAccountAdapter (Keep As Is - with get_signup_redirect_url commented out) ---
# class CombinedSocialAccountAdapter(PatchedSocialAccountAdapter):
#     """
#     Handles SOCIAL account actions. Inherits get_app fix.
#     Let ACCOUNT_ADAPTER handle the final login redirect via post_login override.
#     """
#     # def get_signup_redirect_url(self, request): # Keep commented out
#     #    ...
#
#     def is_open_for_signup(self, request, sociallogin):
#         return True
#
#     # def pre_social_login(self, request, sociallogin):
#     #     pass
#     def pre_social_login(self, request, sociallogin: SocialLogin):
#         """
#         Intercept before social login completes. Check for existing local user conflict.
#         """
#         # If the user is already logged in, they are connecting accounts, allow it.
#         if request.user.is_authenticated:
#             logger.info(f"pre_social_login: User {request.user.pk} already logged in, allowing account connection.")
#             return  # Let the connection process continue normally
#
#         # Get the email address associated with this social login attempt
#         email = user_email(sociallogin.user)  # sociallogin.user is populated tentatively by allauth
#         if not email:
#             # Try getting it from extra_data if not on the tentative user object yet
#             email = sociallogin.account.extra_data.get('email')
#
#         if email:
#             # Check if an EmailAddress record exists for this email
#             try:
#                 existing_email = EmailAddress.objects.select_related('user').get(email__iexact=email)
#                 existing_user = existing_email.user
#
#                 # Check if THIS specific social account is already connected to THIS user
#                 has_social_account = SocialAccount.objects.filter(
#                     provider=sociallogin.account.provider,
#                     user=existing_user
#                 ).exists()
#
#                 # THE CONFLICT: User exists via email, but NOT linked to this social account
#                 if existing_user and not has_social_account:
#                     logger.warning(
#                         f"pre_social_login: Conflict detected! Email {email} exists for local user {existing_user.pk}, but Google account is not linked.")
#
#                     # Construct redirect URL to frontend signin page with error code
#                     frontend_url_str = settings.FRONTEND_URL
#                     signin_path = '/signin'  # Your React signin route
#                     error_code = 'social_account_email_exists'
#
#                     url_parts = list(urlparse(frontend_url_str))
#                     url_parts[2] = signin_path
#                     query_params = {'error': error_code, 'email': email}  # Pass email too? Optional.
#                     url_parts[4] = urlencode(query_params)
#                     redirect_url = urlunparse(url_parts)
#
#                     logger.info(f"pre_social_login: Raising ImmediateHttpResponse to redirect to: {redirect_url}")
#                     # Interrupt allauth flow and force redirect
#                     raise ImmediateHttpResponse(redirect(redirect_url))
#
#             except EmailAddress.DoesNotExist:
#                 # No local account found with this email, proceed with signup/login flow
#                 logger.info(f"pre_social_login: No existing local user found for email {email}. Proceeding.")
#                 pass
#             except Exception as e:
#                 # Log other unexpected errors during lookup
#                 logger.error(f"pre_social_login: Error during email/user lookup for {email}: {e}", exc_info=True)
#                 # Maybe raise ImmediateHttpResponse to a generic error page? For now, let it proceed maybe.
#
#         else:
#             logger.warning("pre_social_login: Could not determine email from social login. Cannot check for conflict.")
#         # If no exception was raised, let the default process continue
#         # (which will eventually call get_signup_redirect_url if it's a new user)

# users/adapter.py
# ... (all your existing imports and other adapter classes should remain unchanged) ...

# Your existing PatchedSocialAccountAdapter should be here, unchanged.
# class PatchedSocialAccountAdapter(DefaultSocialAccountAdapter):
#     ...

# Your existing CustomAccountAdapter should be here, unchanged.
# class CustomAccountAdapter(DefaultAccountAdapter):
#     ...

# --- MODIFICATION IS WITHIN THIS CLASS ---
# --- COMBINED SOCIAL ACCOUNT ADAPTER ---
