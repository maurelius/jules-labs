import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TeeSheetPage from './pages/TeeSheetPage';
import TeeTimeFormPage from './pages/TeeTimeFormPage';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <ThemeProvider>
            <StyledThemeProvider theme={theme}>
                <div>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/teetimes" element={<TeeSheetPage />} />
                            <Route path="/teetimes/new" element={<TeeTimeFormPage />} />
                            <Route path="/teetimes/:id" element={<TeeTimeFormPage />} />
                        </Route>
                    </Routes>
                </div>
            </StyledThemeProvider>
        </ThemeProvider>
    );
}

export default App;
