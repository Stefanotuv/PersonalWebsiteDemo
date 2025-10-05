import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from .models import CustomUser
import datetime
# Get an instance of a logger
logger = logging.getLogger(__name__)


@receiver(post_save, sender=CustomUser)
def notify_admin_on_new_user(sender, instance, created, **kwargs):
    """
    Sends an email notification to the admin when a new user registers.
    """
    if created:
        admin_email = settings.ADMIN_NOTIFICATION_EMAIL
        if not admin_email:
            logger.warning("ADMIN_NOTIFICATION_EMAIL setting is not configured. Cannot send new user notification.")
            return

        subject = f"New User Registration: {instance.email}"

        message_body = f"""
        A new user has registered on your personal website.

        User Details:
        - Name: {instance.get_full_name()}
        - Email: {instance.email}
        - Date Joined: {instance.date_joined.strftime('%Y-%m-%d %H:%M:%S')}

        Stated Interest:
        ------------------
        {instance.interest_notes if instance.interest_notes else 'No interest was shared.'}
        ------------------

        The user account is currently inactive. You can activate it via the Django Admin panel.
        """

        try:
            send_mail(
                subject=subject,
                message=message_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_email],
                fail_silently=False,
            )
            logger.info(f"Admin notification sent for new user: {instance.email}")
        except Exception as e:
            # Log the error if the email fails to send
            logger.error(f"Failed to send new user notification email for {instance.email}. Error: {e}")


# # --- SIGNAL 2: SEND A WELCOME EMAIL TO THE NEW USER (New code) ---
# @receiver(post_save, sender=CustomUser)
# def send_welcome_email_to_new_user(sender, instance, created, **kwargs):
#     """
#     Sends a welcome/confirmation email to the new user upon registration.
#     """
#     if created:
#         subject = "Welcome to Stefano's Website!"
#
#         # Personalize the message using the user's name
#         user_name = instance.first_name or instance.email
#
#         message_body = f"""
#         Hi {user_name},
#
#         Thank you for registering on my personal website. Your account has been created successfully.
#
#         Please note that your account is currently pending activation by an administrator. You will be able to log in once it has been approved.
#
#         Best regards,
#         Stefano
#         """
#
#         try:
#             send_mail(
#                 subject=subject,
#                 message=message_body,
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 recipient_list=[instance.email],  # <-- This sends the email TO THE NEW USER
#                 fail_silently=False,
#             )
#             logger.info(f"Welcome email sent successfully to new user: {instance.email}")
#         except Exception as e:
#             logger.error(f"Failed to send WELCOME email to {instance.email}. Error: {e}")

# --- SIGNAL 2: SEND A WELCOME EMAIL TO THE NEW USER (Improved HTML Version) ---
@receiver(post_save, sender=CustomUser)
def send_welcome_email_to_new_user(sender, instance, created, **kwargs):
    """
    Sends a welcome/confirmation email (HTML format) to the new user upon registration.
    """
    if created:
        subject = "Welcome to Stefano's Website!"
        user_name = instance.first_name or instance.get_username() # Use username as fallback

        # --- 1. Plain Text Version (for email clients that don't support HTML) ---
        plain_text_message = f"""
        Hi {user_name},

        Thank you for registering on my personal website. Your account has been created successfully.

        Please note that your account is currently pending activation by an administrator. You will be able to log in once it has been approved.

        Best regards,
        Stefano
        """

        # --- 2. HTML Version (with inline CSS for compatibility) ---
        html_message = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; border-collapse: collapse;">
                <tr>
                    <td align="center" bgcolor="#2d3748" style="padding: 20px 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                        Stefano's Website
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" style="padding: 40px 30px;">
                        <h1 style="font-size: 22px; color: #333333; margin: 0 0 20px 0;">Welcome, {user_name}!</h1>
                        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 15px 0;">
                            Thank you for registering on my personal website. Your account has been created successfully.
                        </p>
                        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 15px 0;">
                            Please note that your account is currently <strong>pending activation</strong> by an administrator. You will be able to log in once it has been approved.
                        </p>
                        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 30px 0 10px 0;">
                            Best regards,
                        </p>
                        <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0;">
                            Stefano
                        </p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#edf2f7" style="padding: 20px 30px; text-align: center; color: #718096; font-size: 12px;">
                        © {datetime.date.today().year} Stefano's Website. All rights reserved.                    
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

        try:
            # --- 3. Use EmailMultiAlternatives to send both versions ---
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_text_message, # The plain-text version
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[instance.email] # Send to the new user
            )
            msg.attach_alternative(html_message, "text/html") # Attach the HTML version
            msg.send(fail_silently=False)

            logger.info(f"HTML Welcome email sent successfully to new user: {instance.email}")
        except Exception as e:
            logger.error(f"Failed to send HTML WELCOME email to {instance.email}. Error: {e}")