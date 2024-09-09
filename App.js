// App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import MapPage from './MapPage';
import RestaurantPreferencesPage from './RestaurantPreferencesPage';
import RecommendationsPage from './RecommendationsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/preferences" element={<RestaurantPreferencesPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;