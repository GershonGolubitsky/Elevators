import React, { useEffect } from 'react';
import '../styles/styles.css';
import ding from '../assets/ding.mp3';

const Elevator = ({ elevator }) => {
  const { id, position, transitionTime } = elevator;

  const elevatorStyle = {
    transform: `translateY(-${position * 117}px)`,
    transition: `transform ${transitionTime}s ease-in-out`,
  };

  useEffect(() => {
    if (transitionTime > 0) {
      const timer = setTimeout(() => {
        const audio = new Audio(ding);
        audio.play();
      }, transitionTime * 1000);

      return () => clearTimeout(timer);
    }
  }, [position, transitionTime]);

  return (
    <div className="elevator" style={elevatorStyle}>
      <img src="elv.png" alt={`Elevator ${id}`} className="elevator-image" />
    </div>
  );
};

export default Elevator;
