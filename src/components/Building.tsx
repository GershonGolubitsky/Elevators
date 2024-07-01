import React, { useState, useEffect } from 'react';
import ElevatorService from '../services/ElevatorService.ts';
import Elevator from '../models/Elevator.ts';
import ElevatorComponent from './Elevator.tsx';
import ElevatorButton from './ElevatorButton.tsx';
import '../styles/styles.css';

const Building = ({ numFloors, numElevators }) => {
  const [elevatorService] = useState(new ElevatorService(numFloors, numElevators));
  const [elevators, setElevators] = useState<Elevator[]>(elevatorService.elevators);
  const [timers, setTimers] = useState<{ [key: number]: number }>({});
  const [queuedCalls, setQueuedCalls] = useState<Set<number>>(new Set());
  const [noElevatorAvailable, setNoElevatorAvailable] = useState<{ [key: number]: boolean }>({});
  const [buttonStates, setButtonStates] = useState<{ [key: number]: boolean }>({});

  // Update elevators state when elevatorService.elevators changes
  useEffect(() => {
    setElevators(elevatorService.elevators);
  }, [elevatorService.elevators]);

  // Handle elevator call
  const callElevator = (floorNumber: number) => {
    setButtonStates(prevState => ({ ...prevState, [floorNumber]: true }));
    elevatorService.callElevator(floorNumber, (travelTime) => {
      if (travelTime === -1) {
        setQueuedCalls(prevQueuedCalls => new Set(prevQueuedCalls.add(floorNumber)));
        setNoElevatorAvailable(prevState => ({ ...prevState, [floorNumber]: true }));
      } else {
        setNoElevatorAvailable(prevState => ({ ...prevState, [floorNumber]: false }));
        setTimers(prevTimers => ({ ...prevTimers, [floorNumber]: travelTime }));

        // Update timers every 0.5 seconds
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
    });
  };

  // Process queued calls every 0.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queuedCalls.forEach(floorNumber => {
        elevatorService.callElevator(floorNumber, (travelTime) => {
          if (travelTime !== -1) {
            setQueuedCalls(prevQueuedCalls => {
              const newQueuedCalls = new Set(prevQueuedCalls);
              newQueuedCalls.delete(floorNumber);
              return newQueuedCalls;
            });
            setNoElevatorAvailable(prevState => ({ ...prevState, [floorNumber]: false }));
            setTimers(prevTimers => ({ ...prevTimers, [floorNumber]: travelTime }));

            // Update timers every 0.5 seconds
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
        });
      });
    }, 500);

    return () => clearInterval(interval);
  }, [queuedCalls, elevatorService, timers]);

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
                isQueued={queuedCalls.has(floorNumber)}
                noElevatorAvailable={noElevatorAvailable[floorNumber]}
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
