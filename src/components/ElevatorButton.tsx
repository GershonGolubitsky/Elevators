import React from 'react';
import '../styles/styles.css';

interface ElevatorButtonProps {
  floorNumber: number;
  onClick: () => void;
  timer: number;
  isActive: boolean;
}

const ElevatorButton: React.FC<ElevatorButtonProps> = ({ onClick, floorNumber, timer, isActive }) => {
  const isWaiting = timer !== undefined && timer > 0;

  return (
    <div className="button-timer-container">
      <button 
        className={`metal linear ${isWaiting || isActive ? 'waiting' : ''}`} 
        onClick={onClick}
      >
        {floorNumber}
      </button>
      {timer !== undefined && <div className="timer">{timer.toFixed(1)}</div>}
    </div>
  );
};

export default ElevatorButton;
