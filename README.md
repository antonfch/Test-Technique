# Fullstack Application: Symfony Backend & Next.js Frontend

This repository contains a fullstack application with the following structure:

- `backend/`: Symfony backend with a MySQL database using PHPMyAdmin (via XAMPP).
- `frontend/`: Next.js frontend.

## Prerequisites

Make sure you have the following installed:

- PHP 8.1 or higher
- Composer
- XAMPP (or any equivalent for MySQL and PHPMyAdmin)
- Node.js
- npm or yarn

---

## Backend Setup (Symfony)

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install PHP dependencies with Composer:

   ```bash
   composer install
   ```

3. Configure the database:

   - Start XAMPP and ensure the MySQL server is running.
   - Create a database in PHPMyAdmin (e.g., `symfony_database`).
   - Update the `.env` file with your database URL:
     ```env
     DATABASE_URL="mysql://username:password@127.0.0.1:3306/symfony_database"
     ```
     Replace `username` and `password` with your MySQL credentials.

4. Run database migrations:

   ```bash
   php bin/console doctrine:migrations:migrate
   ```

5. Start the Symfony development server:

   ```bash
   symfony server:start
   ```

   or

   ```bash
   php -S 127.0.0.1:8000 -t public
   ```

   The backend will be available at `http://127.0.0.1:8000`.

---

## Frontend Setup (Next.js)

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the API URL:

   - Create a `.env.local` file in the `frontend` directory and add the following line:
     ```env
     NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
     ```
     Adjust the URL if your Symfony backend is running on a different host or port.

4. Start the Next.js development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000`.

---

## Additional Notes

- Make sure the Symfony backend is running before starting the frontend.
- You can access PHPMyAdmin at `http://localhost/phpmyadmin` to manage your database.
- Update the `.env` files as necessary to match your local environment.
- ⚠️⚠️You will come accross an error when adding a product or a category, you'll need to add manually at least category on your database ⚠️⚠️

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
