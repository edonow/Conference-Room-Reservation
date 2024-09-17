# Conference Room Reservation System

This system allows users to reserve and pay for five different types of conference rooms. Administrators can view past reservation data, manage future bookings, and handle reservations for a special "Incubation Room." Administrators can also make reservations on behalf of guests, requiring guest details such as name, email, and password.

## Technologies Used

- **MySQL**: Database management
- **FastAPI**: Web framework for building APIs
- **Next.js**: Web application framework for server-side rendering
- **Stripe**: Online payment processing

## Installation and Setup

### Step 1: Set Environment Variables

Set the environment variables in `/app/.env` and `/api/.env`.

#### MySQL settings (in `/app/.env`)
```bash
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database_name
MYSQL_HOST=mysql_hostname
```
#### Table names (in /app/.env)
```bash
USER_TABLE_NAME=your_user_table
RESERVED_TABLE_NAME=your_reserved_table
```
#### Administrator settings (in /app/.env)
```bash
ADMIN_FIRST_NAME=admin_first_name
ADMIN_LAST_NAME=admin_last_name
ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
```
#### Next.js settings (in /api/.env)
```bash
NEXT_PUBLIC_ADMIN_EMAIL=same_as_admin_email
NEXT_PUBLIC_ADMIN_PASSWORD=same_as_admin_password
API_URL=your_fastapi_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```
### Step 2: Start the Application
```bash
docker-compose up -d --build
```

## Features
- User Management: Create, read, update, and delete user data.
- Authentication: Log in, issue tokens, and log out users.
- Reservation Management: Create, read, and delete reservations.
