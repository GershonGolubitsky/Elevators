import React from 'react';

interface ElevatorButtonProps {
  floorNumber: number;
  onClick: () => void;
  timer: number;
  isQueued: boolean;
  noElevatorAvailable: boolean;
  isActive: boolean;
}

const ElevatorButton: React.FC<ElevatorButtonProps> = ({
  floorNumber,
  onClick,
  timer,
  isQueued,
  noElevatorAvailable,
  isActive,
}) => {
  return (
    <button onClick={onClick} disabled={!isActive}>
      {timer !== null ? timer : 'Call Elevator'}
    </button>
  );
};

export default ElevatorButton;
