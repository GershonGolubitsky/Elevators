import React, { useState, useEffect } from 'react';
import ElevatorButton from './ElevatorButton.tsx';
import '../styles/styles.css';

const Floor = ({ floorNumber, elevatorService, queuedCalls, noElevatorAvailable }) => {
  const [waitTime, setWaitTime] = useState<number | null>(null);

  // Handle elevator call
  const callElevator = () => {
    const time = elevatorService.callElevator(floorNumber);
    setWaitTime(time);
  };

  // Update wait time every second
  useEffect(() => {
    if (waitTime !== null) {
      const timer = setInterval(() => {
        setWaitTime(prev => (prev !== null && prev > 0 ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [waitTime]);

  return (
    <div className="floor">
      <div className="blackline" />
      <div className="floor-content">
        <span>{floorNumber}</span>
        <div className="button-timer-container">
          <ElevatorButton 
            onClick={callElevator} 
            floorNumber={floorNumber} 
            timer={waitTime} 
            isQueued={queuedCalls.has(floorNumber)}
            noElevatorAvailable={noElevatorAvailable}
            isActive={true} 
          />
          {waitTime !== null && <span className="timer">{waitTime}</span>}
        </div>
      </div>
    </div>
  );
};

export default Floor;
