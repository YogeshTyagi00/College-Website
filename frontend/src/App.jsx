import { BrowserRouter as Router, Route, Routes } from
  "react-router-dom"
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import SocietyPage from "./pages/SocietyPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { useAuthStore } from "./store/authStore.js";
import LoginPage from "./pages/LoginPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";

//protect authenticated routes from being accessed by unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

//redirect to home if already authenticated
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {

  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  return (
    <div>
      <Router>
        <Routes>

          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/news" element={
            <ProtectedRoute>
              <NewsPage />
            </ProtectedRoute>
          } />

          <Route path="/society" element={
            <ProtectedRoute>
              <SocietyPage />
            </ProtectedRoute>
          } />
           
        <Route path="/events" element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
          } /> 

          <Route path="/signup" element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          } />

          <Route path="/login" element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          } />

        </Routes>
        <Toaster />
      </Router>
    </div>
  )
}

export default App