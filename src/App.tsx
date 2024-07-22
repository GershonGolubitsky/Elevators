import React from 'react';
import Building from './components/Building.tsx';
// import './styles/help.css'; 
// import './styles/main.css';

const App = () => {
  const buildings = [
    { id: 1, numFloors: 30, numElevators: 4 },
    { id: 2, numFloors: 100, numElevators: 1 },
    { id: 3, numFloors: 1, numElevators: 1 },
    { id: 4, numFloors: 6, numElevators: 2 }
  ];

  return (
    <div className="App">
      <div className="buildings-container">
        {buildings.map(building => (
          <Building 
            key={building.id} 
            numFloors={building.numFloors} 
            numElevators={building.numElevators} 
          />
        ))}
      </div>
    </div>
  );
};

export default App;
