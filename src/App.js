import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// These will be implemented in the next steps
import InvoiceList from './pages/InvoiceList';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoiceView from './pages/InvoiceView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/invoices" element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <InvoiceList />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/new" element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <InvoiceCreate />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/invoices/:id" element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <InvoiceView />
                </>
              </ProtectedRoute>
            } />
            
            {/* Redirect to invoices page by default if authenticated, otherwise to login */}
            <Route path="*" element={<Navigate to="/invoices" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
