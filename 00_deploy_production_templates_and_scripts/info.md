# Personal Website (Full-Stack: Django & React/Vite)

This repository contains the full-stack codebase for Mario Fungo's personal website. It's built with a Django backend for robust data management and a React frontend (using Vite) for a dynamic and responsive user experience, featuring authentication, content management, and professional showcases.

## Table of Contents

1.  [Overview](#1-overview)
2.  [Features](#2-features)
3.  [Project Structure](#3-project-structure)
4.  [Setup and Installation](#4-setup-and-installation)
    *   [Prerequisites](#prerequisites)
    *   [Backend Setup (Django)](#backend-setup-django)
    *   [Frontend Setup (React/Vite)](#frontend-setup-reactvite)
    *   [Running the Applications](#running-the-applications)
5.  [Key API Endpoints](#5-key-api-endpoints)
6.  [Deployment Considerations](#6-deployment-considerations)
7.  [Current Status & Future Enhancements](#7-current-status--future-enhancements)
8.  [License](#8-license)

## 1. Overview

This project serves as a dynamic personal website showcasing Mario Fungo's professional profile, interests, and projects. It implements a robust authentication system, allowing for both public and restricted content access. The design emphasizes a clean, modern aesthetic with a focus on user experience and administrative content management.

## 2. Features

### 2.1. Full-Stack Authentication System (Email-based JWT)
*   **Secure User Management**: Custom `CustomUser` model with email as the primary identifier.
*   **Registration**: New users are initially `inactive` for administrative review/activation.
*   **Login/Logout**: JWT-based authentication for secure session management with token refresh.
*   **Profile Management**: Endpoints for fetching/updating user details (name, email) and changing passwords.
*   **Admin Integration**: Seamless management of users through the Django Admin panel.

### 2.2. Frontend Layout & Navigation
*   **Responsive Layout**: Centralized `Layout` component wrapping all pages for consistent `Navbar` and `Footer`.
*   **Intuitive Navigation**: Simplified, dark-themed `Navbar` with conditional links (Home, CV, On the Web, About, Login/Register). Includes Admin access links for staff users.
*   **Clean Footer**: Essential site navigation and copyright information.

### 2.3. Document Management System
*   **Categorized Storage**: Models for `DocumentCategory` and `Document` (e.g., CVs, cover letters).
*   **Current Document Flag**: Logic to mark a single document as "current" (e.g., current CV) within its category.
*   **Public Access**: Dedicated endpoint for publicly accessing the current CV.
*   **Admin Interface**: Protected frontend page for administrators to upload, manage, and categorize documents.

### 2.4. Photo & Gallery Management System
*   **Organized Image Galleries**: Models for `Gallery` and `GalleryImage` for structured photo storage.
*   **Bulk Upload**: Frontend support for uploading multiple images at once to a selected gallery.
*   **Admin Interface**: Protected frontend page for administrators to upload, list, and manage images and galleries.

### 2.5. Core Content Pages
*   **Dynamic Landing Page (`Welcome.tsx`)**:
    *   Engaging rotating text banner (`react-fast-marquee`) with custom messages.
    *   Content dynamically loaded from JSON, reflecting personal bio, tagline, and interests (Business, Tech, Politics, Social Impact) with philosophical quotes and styled `react-icons`.
    *   Dynamic `BannerPlaceholder` pulling and cycling images from a dedicated Django gallery (`page-logos`).
*   **Curriculum Vitae (`CVPage.tsx`)**: Renders a comprehensive, HTML-formatted CV from JSON data. Includes options to "Ask for More Information" and "Download CV".
*   **Online Presence (`OnlinePresencePage.tsx`)**: Lists and links to social media and other online profiles.
*   **About (`AboutPage.tsx`)**: Explains the personal website's purpose, featuring subtle keyword highlights (Red, Green, Dark Grey) inspired by the Palestine flag.

## 3. Project Structure

PersonalWebsiteDemo/
├── .gitignore # Git ignore rules for both backend & frontend
├── backend/ # Django Backend Project
│ ├── .env # Environment variables for Django (NOT committed)
│ ├── db.sqlite3 # SQLite database (ignored by Git)
│ ├── manage.py # Django management command utility
│ ├── requirements.txt # Python dependencies
│ ├── core/ # Core Django configurations/utilities (e.g., base views)
│ ├── document_store/ # Django app for document management
│ ├── media/ # User-uploaded files (ignored by Git)
│ ├── personalsite/ # Main Django project settings (settings.py, urls.py)
│ ├── photo_store/ # Django app for photo & gallery management
│ └── users/ # Django app for custom user model and authentication
└── frontend/ # React/Vite Frontend Project
├── .env.local # Frontend environment variables (NOT committed)
├── node_modules/ # Node.js dependencies (ignored by Git)
├── public/ # Static assets served directly (e.g., index.html)
├── src/ # React source code
│ ├── api/ # Axios client and API service functions
│ │ ├── api.ts
│ │ ├── cv_api.ts
│ │ └── photos_api.ts
│ ├── components/ # Reusable React components
│ │ ├── auth/ # Auth forms (SignInNew, SignUpNew)
│ │ ├── layout/ # Layout components (Navbar, Footer, Layout, BannerPlaceholder, RotatingBanner)
│ │ └── FadeIn.tsx # Generic FadeIn animation component
│ ├── contexts/ # React Contexts (AuthContext)
│ ├── data/ # JSON data for static content (cvData.json, welcomeContent.json, termsAndConditions.json)
│ ├── images/ # Local image assets (e.g., default_avatar.png)
│ ├── pages/ # Main application pages (Welcome, CVPage, AboutPage, Login, Register, Dashboard, DocumentManagement, PhotoManagement, OnlinePresence)
│ ├── constants.ts # Frontend constants (e.g., token keys)
│ ├── index.css # Main CSS file (Tailwind directives)
│ └── main.tsx # Vite React entry point
├── index.html # Main HTML template for Vite
├── package.json # Node.js project dependencies & scripts
├── postcss.config.js # PostCSS configuration (Tailwind CSS v4)
├── tailwind.config.ts # Tailwind CSS configuration
└── vite.config.ts # Vite build configuration (includes proxy settings)

## 4. Setup and Installation

### Prerequisites

*   **Python 3.8+**
*   **Node.js 18+ & npm**
*   **Git**

### Backend Setup (Django)

1.  **Navigate to the backend directory:**
    ```bash
    cd PersonalWebsiteDemo/backend
    ```
2.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    # .\venv\Scripts\activate  # On Windows
    ```
    *(Note: If your venv is outside the project as per previous discussions, activate that one instead.)*
3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Ensure `requirements.txt` is up-to-date with `pip freeze > requirements.txt` after installing all necessary packages like `django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `psycopg2-binary`, `python-decouple`, etc.)*
4.  **Create a `.env` file for Django:**
    In the `backend/` directory, create a file named `.env` and add:
    ```
    SECRET_KEY='your_django_secret_key_here'
    DEBUG=True
    # Add other Django-specific environment variables as needed (e.g., database URLs for production)
    ```
5.  **Run database migrations:**
    ```bash
    python manage.py makemigrations users document_store photo_store # (and any other apps you created)
    python manage.py migrate
    ```
6.  **Create a Django superuser (for admin access):**
    ```bash
    python manage.py createsuperuser
    ```
7.  **Create `media` folder**:
    ```bash
    mkdir media
    ```

### Frontend Setup (React/Vite)

1.  **Navigate to the frontend directory:**
    ```bash
    cd PersonalWebsiteDemo/frontend
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env.local` file for Vite:**
    In the `frontend/` directory, create a file named `.env.local` and add:
    ```
    VITE_API_URL=http://localhost:8080 # IMPORTANT: Match your Django backend's port.
    ```

### Running the Applications

1.  **Start the Django backend server:**
    ```bash
    cd PersonalWebsiteDemo/backend
    source venv/bin/activate # Activate your venv if not already active
    python manage.py runserver 0.0.0.0:8080 # Or desired port
    ```
    *(Note: Your Django backend should now be accessible at `http://localhost:8080` (or your chosen port)).*
2.  **Start the React frontend development server:**
    ```bash
    cd PersonalWebsiteDemo/frontend
    npm run dev
    ```
    *(Your Vite frontend will typically start at `http://localhost:5173`).*

Access your application by navigating to `http://localhost:5173` in your web browser.

## 5. Key API Endpoints

All API endpoints are prefixed with `/api/` (proxied by Vite in development).

*   **Authentication:**
    *   `POST /api/users/register/`
    *   `POST /api/users/login/`
    *   `POST /api/users/logout/`
    *   `GET/PATCH /api/users/profile/`
    *   `POST /api/users/change-password/`
    *   `POST /api/token/refresh/`
*   **Document Management:**
    *   `GET /api/documents/categories/`
    *   `GET /api/documents/documents/`
    *   `GET /api/documents/documents/current_cv/` (Public)
    *   `POST/PATCH/DELETE /api/documents/documents/{id}/` (Admin)
*   **Photo & Gallery Management:**
    *   `GET /api/photos/galleries/`
    *   `GET /api/photos/images/`
    *   `POST/PATCH/DELETE /api/photos/galleries/{id}/` (Admin)
    *   `POST/PATCH/DELETE /api/photos/images/{id}/` (Admin)
*   **Admin Interface:**
    *   `http://localhost:5173/admin/` (Proxied by Vite to Django admin)

## 6. Deployment Considerations

*   **Production Serving**: For production, Django's `runserver` and Vite's `npm run dev` are unsuitable. You would typically use:
    *   **Gunicorn/uWSGI** for serving the Django backend.
    *   **Nginx/Apache** for serving the static frontend files (after `npm run build` in `frontend/dist`) and proxying API requests to Gunicorn/uWSGI.
    *   Nginx/Apache would also serve `MEDIA_ROOT` and `STATIC_ROOT` directly.
*   **Environment Variables**: Use robust environment variable management (e.g., `django-decouple` for Django, server environment variables for Vite) and set `DEBUG=False` in production.
*   **HTTPS**: Always use HTTPS in production.

## 7. Current Status & Future Enhancements

The project currently has a fully functional core authentication, content display, and administrative management for documents and photos.

**Future Enhancements could include:**

*   **Email Verification**: Implement email-based verification for new user registrations.
*   **Password Reset**: Add "Forgot Password" functionality.
*   **Profile Pictures**: Re-integrate profile picture upload/display.
*   **Restricted Content**: Implement the hierarchy for Recruiter/Basic User roles and restrict content dynamically.
*   **Contact Form**: Add a contact form that saves submissions to the backend.
*   **Frontend Profile Management**: Build a proper UI for managing user profile (beyond basic name/password).
*   **Blog/Project Display**: Develop dedicated pages for blog posts and project showcases.
*   **Improved Styling**: Further refine the UI/UX.

## 8. License

[Choose a license, e.g., MIT, Apache 2.0, or specify "All rights reserved."]