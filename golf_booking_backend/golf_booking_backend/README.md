# Golf Booking Backend Project Core

This directory (`golf_booking_backend/golf_booking_backend/`) contains the core configuration files for the Django project. It defines the overall settings, URL routing, and server configurations for the entire Golf Booking Backend application.

It's the heart of the Django project, where global settings are managed and the individual Django applications (like `teetimes` and `api`) are integrated.

## Contents

-   **`settings.py`**:
    This is the main configuration file for the Django project. It includes:
    -   Database settings.
    -   Installed Django applications (`INSTALLED_APPS`), which tells Django which apps are part of this project.
    -   Middleware settings for handling requests and responses.
    -   Static files configuration.
    -   CORS (Cross-Origin Resource Sharing) settings, defining which origins are allowed to make requests to this backend.
    -   Security settings (e.g., `SECRET_KEY`, `DEBUG`).

-   **`urls.py`**:
    This file defines the master URL routing for the entire Django project. It includes:
    -   Paths to the Django admin site.
    -   Inclusion of URL patterns from individual Django applications (e.g., `api.urls`, `teetimes.urls`). This acts as the central dispatch for all incoming HTTP requests, directing them to the appropriate application's URL configurations.

-   **`wsgi.py`**:
    This file is the Web Server Gateway Interface (WSGI) entry point for your application. It's used by WSGI-compatible web servers (like Gunicorn, Apache with mod_wsgi) to serve your Django application in production. For development, Django's built-in server uses this.

-   **`asgi.py`**:
    This file is the Asynchronous Server Gateway Interface (ASGI) entry point for your application. It's used by ASGI-compatible web servers (like Daphne, Uvicorn) to serve asynchronous Django applications, which is useful for websockets or long-polling.

-   **`__init__.py`**:
    This empty file indicates that the `golf_booking_backend` directory itself should be treated as a Python package.

## Relationship to Project Root

This `golf_booking_backend` directory (the inner one) is the actual Python package for your Django project. The outer `golf_booking_backend/` directory (the project root) contains `manage.py` and other top-level project files, but the core Django configuration resides here.

When you run Django commands like `python manage.py runserver`, `manage.py` looks inside this inner `golf_booking_backend` directory for `settings.py` and other configuration files. 