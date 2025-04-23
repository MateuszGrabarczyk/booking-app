# Booking app

[![Docker](https://img.shields.io/badge/Docker-available-blue)](https://www.docker.com/)

## Description

This project is a simple booking app, where user can register and log in. Admin in Django-Admin panel can add a dedicated time slot with a start date, end date and category. Logged user can choose a time slot in the calendar and book it. User can also set his preferences (categories), and the time slots in the calendar will be automatically filtered with the preferences set by the user. User can also delete his booking of the time slot.

## Built With

- **Backend:** Python 3.10, Django 4.x & Django REST Framework
- **Frontend:** React (Next.js)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Prerequisites

- Docker & Docker Compose installed on your machine
- Git (to clone the repository)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MateuszGrabarczyk/booking-app.git
   ```

2. **In main folder, run the command to build Docker project**

   ```bash
   docker-compose build
   ```

3. **Run the Docker Container:**

   ```bash
   docker-compose up -d
   ```

4. **Verify**

- Django API: http://localhost:8000/
- Next.js App: http://localhost:3000/

## Usage

1. There is an admin account created on setup with given credentials for testing purposes:

   ```bash
   email: admin@example.com
   password: admin
   ```

2. Go to localhost:8000/admin and log in with given credentials.

3. In admin panel add testing time slots.

4. To interact with frontend, go to localhost:3000.

5. Register an account, log in and interact with the calendar and setting preferences.

## Running Tests

To execute tests, run this command in the backend container:

```bash
python manage.py test
```
