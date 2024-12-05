# Fullstack Application: Symfony Backend & Next.js Frontend

## Why These Technologies?

### Next.js

Next.js was chosen as the frontend framework for its many advantages, including:

- **Server-side Rendering (SSR)** and **Static Site Generation (SSG)** for improved performance and SEO.
- Built-in support for API routes, making it easier to handle frontend-backend interactions.
- Optimized development and deployment experience with Vercel.

### Shadcn

Shadcn was used for building UI components because of:

- Pre-built, accessible, and customizable components.
- Modern design patterns that integrate seamlessly with Tailwind CSS.
- Flexibility to extend components to fit specific project needs.

### TypeScript

TypeScript was chosen for its advantages, such as:

- **Static typing**, which helps prevent runtime errors and improves code quality.
- Enhanced developer experience with better autocompletion and tooling support.
- Scalability for larger codebases.

---

This repository contains a fullstack application with the following structure:

- `teachr-backend/`: Symfony backend with a MySQL database using PHPMyAdmin (via XAMPP).
- `teachr-frontend/`: Next.js frontend.

## Prerequisites

Make sure you have the following installed:

- PHP 8.1 or higher
- Composer
- XAMPP (or any equivalent for MySQL and PHPMyAdmin)
- Node.js
- npm or yarn

---

## Backend Setup (Symfony)

1. Navigate to the `teachr-backend` directory:

   ```bash
   cd teachr-backend
   ```

2. Install PHP dependencies with Composer:

   ```bash
   composer install
   ```

3. Configure the database:

   - Start XAMPP and ensure the MySQL server is running.
   - Create a database in PHPMyAdmin (e.g., `symfony_db`).
   - Update the `.env` file with your database URL:
     ```env
     DATABASE_URL="mysql://username:password@127.0.0.1:3306/symfony_db"
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
   cd teachr-frontend
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
