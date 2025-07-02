# Barbershop Appointment System

A full-featured web application for managing barbershop appointments, built with a Node.js/Express backend and a React/Firebase frontend.

## Features

- User authentication (Firebase Auth)
- Book, view, and manage appointments
- Admin dashboard for managing users, times, and reservations
- Multi-language support (English & Hebrew, RTL/LTR)
- Responsive UI with modern design (Tailwind CSS)

## Project Structure

```
sano/
├── backend/         # Node.js/Express API server
│   ├── routes/      # API route handlers (appointments, times, user)
│   ├── firebase-admin.json  # Firebase service account (DO NOT COMMIT)
│   ├── ...
├── frontend/        # React client app
│   ├── components/  # React components (Admin, Appointment, Pages, SideBar, etc.)
│   ├── src/         # App entry, i18n, locales
│   ├── styles/      # Tailwind CSS and custom styles
│   ├── ...
├── run-all.bat      # Script to run both backend and frontend
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Firebase project (for Auth and Firestore)

### Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/barbershop-appointment.git
   cd barbershop-appointment
   ```
2. **Backend setup:**
   - Copy your Firebase service account key to `backend/firebase-admin.json` (never commit this file).
   - Install dependencies:
     ```sh
     cd backend
     npm install
     ```
   - Create a `.env` file for backend secrets (see `.env.example` if available).
3. **Frontend setup:**
   - Install dependencies:
     ```sh
     cd ../frontend
     npm install
     ```
   - Create a `.env` file for frontend Firebase config (see `.env.example` if available).

### Running the App
- **Start backend:**
  ```sh
  cd backend
  npm start
  ```
- **Start frontend:**
  ```sh
  cd frontend
  npm run dev
  ```
- Or use `run-all.bat` to start both (Windows only).

### Environment Variables
- Never commit `.env` or `firebase-admin.json` files.
- See `.gitignore` for sensitive file patterns.

## Security
- All sensitive files are ignored via `.gitignore`.
- Do not share or commit service account keys or environment files.

## License
MIT

---

*For questions or contributions, open an issue or pull request on GitHub.*
