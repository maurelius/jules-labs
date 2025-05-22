import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GolferListPage from './pages/GolferListPage';
import GolferFormPage from './pages/GolferFormPage';
import TeeSheetPage from './pages/TeeSheetPage';
import TeeTimeFormPage from './pages/TeeTimeFormPage';
import BookingListPage from './pages/BookingListPage';
import NewBookingPage from './pages/NewBookingPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  // For now, let's assume the user is not authenticated.
  // Later, this will come from an AuthContext or actual login.
  const isAuthenticated = true; // TEMPORARILY SET TO TRUE FOR TESTING PAGES

  return (
    <>
      {/* Conditionally render Navbar; for now, show if "authenticated" */}
      {isAuthenticated && <Navbar />}
      <div className="container" style={{padding: '20px'}}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
          
          <Route 
            path="/" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/golfers" 
            element={isAuthenticated ? <GolferListPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/golfers/new" 
            element={isAuthenticated ? <GolferFormPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/golfers/edit/:id" 
            element={isAuthenticated ? <GolferFormPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/teetimes" 
            element={isAuthenticated ? <TeeSheetPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/teetimes/new" 
            element={isAuthenticated ? <TeeTimeFormPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/teetimes/edit/:id" 
            element={isAuthenticated ? <TeeTimeFormPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/bookings" 
            element={isAuthenticated ? <BookingListPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/bookings/new" 
            element={isAuthenticated ? <NewBookingPage /> : <Navigate to="/login" replace />} 
          />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
