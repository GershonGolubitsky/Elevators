import Elevator from '../models/Elevator.ts';
import Floor from '../models/Floor.ts';

class ElevatorService {
  elevators: Elevator[];
  floors: Floor[];
  callQueue: { floorNumber: number, callback: (time: number) => void }[] = [];

  constructor(numFloors: number, numElevators: number) {
    // Initialize floors and elevators
    this.floors = Array.from({ length: numFloors }, (_, i) => new Floor(i));
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i));
  }

  // Call an elevator to a specific floor
  callElevator(floorNumber: number, callback: (time: number) => void): number {
    const availableElevator = this.findNearestElevator(floorNumber);
    if (!availableElevator) {
      this.callQueue.push({ floorNumber, callback });
      return -1; // Return -1 if no available elevator
    }
    const travelTime = this.calculateTime(availableElevator.position, floorNumber);
    availableElevator.moveTo(floorNumber, travelTime);

    setTimeout(() => {
      availableElevator.isAvailable = true;
      this.processCallQueue();
    }, (travelTime + 2) * 1000); // Simulate travel time and door operations

    callback(travelTime); // Callback with the travel time
    return travelTime; // Return the travel time
  }

  // Find the nearest available elevator
  findNearestElevator(floorNumber: number): Elevator | null {
    let minDistance = Infinity;
    let nearestElevator: Elevator | null = null;

    for (const elevator of this.elevators) {
      const distance = Math.abs(elevator.position - floorNumber);
      if (distance < minDistance && elevator.isAvailable) {
        minDistance = distance;
        nearestElevator = elevator;
      }
    }

    if (nearestElevator) {
      nearestElevator.isAvailable = false; // Mark the elevator as unavailable
    }
    return nearestElevator; // Return the nearest available elevator
  }

  // Calculate travel time based on the distance
  calculateTime(currentPosition: number, targetPosition: number): number {
    return Math.abs(currentPosition - targetPosition) * 0.5; // Assume a fixed speed
  }

  // Process the call queue
  processCallQueue() {
    if (this.callQueue.length === 0) return;

    const nextCall = this.callQueue.shift();
    if (!nextCall) return;

    const nearestElevator = this.findNearestElevator(nextCall.floorNumber);
    if (nearestElevator) {
      const travelTime = this.calculateTime(nearestElevator.position, nextCall.floorNumber);
      nearestElevator.moveTo(nextCall.floorNumber, travelTime);

      setTimeout(() => {
        nearestElevator.isAvailable = true;
        this.processCallQueue();
      }, (travelTime + 2) * 1000); // Simulate travel time and door operations

      nextCall.callback(travelTime); // Callback with the travel time
    } else {
      this.callQueue.unshift(nextCall); // Re-add the call to the queue if no elevator is available
    }
  }
}

export default ElevatorService;
