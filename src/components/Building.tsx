import React, { useState, useEffect } from 'react';
import ElevatorService from '../services/ElevatorService.ts';
import ElevatorComponent from './Elevator.tsx';
import ElevatorButton from './ElevatorButton.tsx';
import '../styles/styles.css';

const Building = ({ numFloors, numElevators }) => {
  const [elevatorService] = useState(new ElevatorService(numFloors, numElevators));
  const [elevators, setElevators] = useState(elevatorService.elevators);
  const [timers, setTimers] = useState({});
  const [buttonStates, setButtonStates] = useState({});

  useEffect(() => {
    setElevators(elevatorService.elevators);
  }, [elevatorService.elevators]);

  const callElevator = (floorNumber) => {
    const optimalElevator = elevatorService.findOptimalElevator(floorNumber);

    if (optimalElevator === null) {
      setButtonStates(prevState => ({ ...prevState, [floorNumber]: false }));
      return;
    }

    if (!timers[floorNumber]) {
      const travelTime = elevatorService.calculateTotalTime(optimalElevator, floorNumber);
      const adjustedTravelTime = travelTime + (timers[floorNumber] || 0);
      setTimers(prevTimers => ({ ...prevTimers, [floorNumber]: adjustedTravelTime }));

      const interval = setInterval(() => {
        setTimers(prevTimers => {
          const newTimers = { ...prevTimers };
          if (newTimers[floorNumber] > 0) {
            newTimers[floorNumber] -= 0.5;
          } else {
            clearInterval(interval);
            setButtonStates(prevState => ({ ...prevState, [floorNumber]: false }));
            delete newTimers[floorNumber];
          }
          return newTimers;
        });
      }, 500);
    }

    setButtonStates(prevState => ({ ...prevState, [floorNumber]: true }));

    elevatorService.callElevator(floorNumber, () => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        delete newTimers[floorNumber];
        return newTimers;
      });
    }, timers[floorNumber] || 0);
  };

  return (
    <div className="building">
      <div className="floor-container">
        {[...Array(numFloors).keys()].map((floorNumber, index) => (
          <div key={floorNumber} className="floor-wrapper">
            <div className="floor">
              <ElevatorButton 
                floorNumber={floorNumber} 
                onClick={() => callElevator(floorNumber)} 
                timer={timers[floorNumber]}
                isActive={buttonStates[floorNumber]}
              />
            </div>
            {index < numFloors && <div className="blackline"></div>}
          </div>
        ))}
      </div>
      <div className="elevator-container">
        {elevators.map(elevator => (
          <ElevatorComponent key={elevator.id} elevator={elevator} />
        ))}
      </div>
    </div>
  );
};

export default Building;
