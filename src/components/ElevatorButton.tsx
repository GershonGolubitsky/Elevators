import React from 'react';
import '../styles/styles.css';

const ElevatorButton = ({ onClick, floorNumber, timer, isQueued, noElevatorAvailable, isActive }) => {
  const isWaiting = timer !== undefined && timer > 0;

  return (
    <div className="button-timer-container">
      <button 
        className={`metal linear ${isWaiting || isActive ? 'waiting' : ''} ${isQueued ? 'queued' : ''} ${noElevatorAvailable ? 'no-elevator' : ''}`} 
        onClick={onClick}
      >
        {floorNumber}
      </button>
      {timer !== undefined && <div className="timer">{timer.toFixed(1)}</div>}
    </div>
  );
};

export default ElevatorButton;
