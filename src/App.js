import React, { useEffect, useState } from 'react';
import Shifts from './components/Shifts';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Available shifts');
  const [selectedCity, setSelectedCity] = useState('Helsinki');
  const [shifts, setShifts] = useState([]);

  const cities = ['Helsinki', 'Tampere', 'Turku'];

  useEffect(() => {
    fetch('http://localhost:8080/shifts')
      .then(response => response.json())
      .then(data => setShifts(data))
      .catch(error => console.error('Error fetching shifts:', error));
  }, []);

  const getAvailableShiftsCount = (city) => {
    return shifts.filter(shift => shift.area === city && !shift.booked).length;
  };

  return (
    <div className="app">
      <div className="nav">
        <span 
          className={activeTab === 'My shifts' ? 'active' : ''} 
          onClick={() => setActiveTab('My shifts')}
        >
          My shifts
        </span>
        <span 
          className={activeTab === 'Available shifts' ? 'active' : ''} 
          onClick={() => setActiveTab('Available shifts')}
        >
          Available shifts
        </span>
      </div>

      {activeTab === 'Available shifts' && (
        <div className="city-tabs">
          {cities.map(city => (
            <span 
              key={city} 
              className={selectedCity === city ? 'active' : ''} 
              onClick={() => setSelectedCity(city)}
            >
              {city} ({getAvailableShiftsCount(city)})
            </span>
          ))}
        </div>
      )}

      <Shifts activeTab={activeTab} selectedCity={selectedCity} shifts={shifts} setShifts={setShifts} />
    </div>
  );
};

export default App;
