// main.jsx
// Entry point for the React frontend application.
// Sets up React root rendering, React StrictMode, React Router, and global styles.
// Renders the App component inside a BrowserRouter for client-side routing support.
//
// Imports:
// - StrictMode: Helps identify potential problems in an application.
// - createRoot: Creates a root to render the React app (React 18+ API).
// - BrowserRouter: Enables client-side routing for the app.
// - App: Main application component.
// - index.css: Global styles for the app.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import '../styles/index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
