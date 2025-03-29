import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignupPage from '../components/loginsignup';
import PokemonTeamManager from '../components/pokemonteammanager';

function App() {
  // You'll want to manage authentication state
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        {/* Login/Signup Route */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
            <Navigate to="/home" replace /> : 
            <LoginSignupPage setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        
        {/* Home Page Route - Protected */}
        <Route 
          path="/home" 
          element={
            isAuthenticated ? 
            <PokemonTeamManager initialPokedex={[]} /> : 
            <Navigate to="/auth" replace />
          } 
        />

        {/* Redirect to auth by default */}
        <Route 
          path="/" 
          element={<Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;