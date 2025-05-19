import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import TagsPage from './pages/TagsPage';
import StoriesPage from './pages/StoriesPage';
import PlacesPage from './pages/PlacesPage';

// Placeholder components for the main sections
const Collections = () => <div className="p-4 text-white">Collections Page</div>;

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <Navigate to="/places" replace />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/places"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-screen">
                      <PlacesPage />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <Collections />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tags"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <TagsPage />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stories"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <StoriesPage />
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
