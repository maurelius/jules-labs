 # Golf Booking Backend

This is the Django backend for the Golf Booking application. It provides the API endpoints for managing tee times, golfers, and bookings.

## Table of Contents

- [Golf Booking Backend](#golf-booking-backend)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup and Installation](#setup-and-installation)
  - [Database Migrations](#database-migrations)
  - [Running the Server](#running-the-server)
  - [Accessing the API](#accessing-the-api)

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
-   **pip**: Python's package installer (usually comes with Python)

## Setup and Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd golf_booking_backend
    ```

2.  **Install Python dependencies:**
    It's highly recommended to use a virtual environment to manage dependencies.

    ```bash
    # Create a virtual environment
    python -m venv venv

    # Activate the virtual environment
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate
    ```

    Once the virtual environment is active, install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

## Database Migrations

Apply the database migrations to set up your database schema. If this is the first time setting up the project, you might need to create a superuser for the Django admin panel.

1.  **Apply migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

2.  **Create a superuser (optional, for admin access):**
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to create your superuser account.

## Running the Server

To start the Django development server:

```bash
python manage.py runserver
```

The server will typically run on `http://127.0.0.1:8000/` by default.

## Accessing the API

Once the server is running, the API endpoints will be available at:

-   **Base API URL:** `http://127.0.0.1:8000/api/`
-   **Tee Times:** `http://127.0.0.1:8000/api/teetimes/`
-   **Admin Panel:** `http://127.0.0.1:8000/admin/` (Requires superuser login)