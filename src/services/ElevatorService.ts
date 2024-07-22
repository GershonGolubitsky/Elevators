import Elevator from '../models/Elevator.ts';
import Floor from '../models/Floor.ts';

class ElevatorService {
  elevators: Elevator[];
  floors: Floor[];

  // Constructor initializes elevators and floors
  constructor(numFloors: number, numElevators: number) {
    this.floors = Array.from({ length: numFloors }, (_, i) => new Floor(i));
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i));
  }

  // Calls the nearest elevator to the specified floor
  callElevator(floorNumber: number, callback: (time: number) => void, callTime: number): number | null {
    const nearestElevator = this.findOptimalElevator(floorNumber);
    if (nearestElevator === null) return null;
    if (this.isElevatorAtFloor(floorNumber)) return null;

    const travelTime = this.calculateTime(nearestElevator.startPosition, floorNumber);
    const elapsedTime = nearestElevator.startTime ? (Date.now() - nearestElevator.startTime) / 1000 : 0;
    const totalTime = travelTime + callTime - elapsedTime;

    console.log(`Call Elevator to floor ${floorNumber} - Travel Time: ${travelTime}, Elapsed Time: ${elapsedTime}, Total Time: ${totalTime}`);
    this.processElevatorCall(nearestElevator, floorNumber, travelTime, totalTime, callback);

    return totalTime;
  }

  // Processes the next call in the queue for the specified elevator
  processNextCall(elevator: Elevator, callback: (time: number) => void) {
    if (elevator.queue.length > 0) {
      const nextFloor = elevator.queue.shift();
      if (nextFloor !== undefined) {
        console.log(`Processing next call to floor ${nextFloor}`);
        this.processElevatorCall(elevator, nextFloor, this.calculateTime(elevator.position, nextFloor), 0, callback);
      }
    }
  }

  // Checks if an elevator is already at the specified floor
  private isElevatorAtFloor(floorNumber: number): boolean {
    return this.elevators.some(elevator => elevator.position === floorNumber || elevator.queue.includes(floorNumber));
  }

  // Processes the elevator call: moves elevator or adds the call to the queue
  private processElevatorCall(elevator: Elevator, floorNumber: number, travelTime: number, totalTime: number, callback: (time: number) => void) {
    if (elevator.isAvailable) {
      console.log(`Moving elevator ${elevator.id} to floor ${floorNumber}`);
      this.moveElevator(elevator, floorNumber, travelTime, totalTime, callback);
    } else {
      console.log(`Adding floor ${floorNumber} to queue of elevator ${elevator.id}`);
      elevator.queue.push(floorNumber);
    }
  }

  // Moves the elevator to the specified floor
  private moveElevator(elevator: Elevator, floorNumber: number, travelTime: number, totalTime: number, callback: (time: number) => void) {
    elevator.moveTo(floorNumber, travelTime);
    elevator.isAvailable = false;
    elevator.startTime = Date.now(); // Set current time as start time

    setTimeout(() => {
      elevator.isAvailable = true;
      elevator.startPosition = elevator.position;
      elevator.startTime = null; // Reset start time
      callback(totalTime);
      this.processNextCall(elevator, callback);
    }, (totalTime + 2) * 1000); // Total time plus 2 seconds for door operations
  }

  // Finds the optimal (nearest) elevator to the specified floor
  findOptimalElevator(floorNumber: number): Elevator | null {
    let minTime = Infinity;
    let optimalElevator: Elevator | null = null;

    for (const elevator of this.elevators) {
      const travelTime = this.calculateTotalTime(elevator, floorNumber);
      if (travelTime < minTime) {
        minTime = travelTime;
        optimalElevator = elevator;
      }
    }

    console.log(`Optimal elevator for floor ${floorNumber} is ${optimalElevator ? optimalElevator.id : 'None'} with travel time ${minTime}`);
    return optimalElevator;
  }

  // Calculates the travel time between two positions
  calculateTime(startPosition: number, targetPosition: number): number {
    return Math.abs(startPosition - targetPosition) * 0.5;
  }

  // Estimates the total time for a busy elevator to reach a new floor
  estimateTimeForBusyElevator(elevator: Elevator, newFloor: number): number {
    let totalTime = 0;
    let currentPosition = elevator.startPosition;

    for (const floor of elevator.queue) {
      totalTime += this.calculateTime(currentPosition, floor) + 2;
      currentPosition = floor;
    }

    totalTime += this.calculateTime(currentPosition, newFloor) + 2;
    return totalTime;
  }

  // Calculates the total time for an elevator to reach a specified floor, considering its current state and queue
  calculateTotalTime(elevator: Elevator, floorNumber: number): number {
    if (elevator.isAvailable) {
      return this.calculateTime(elevator.startPosition, floorNumber);
    } else {
      let totalTime = 0;
      let currentPosition = elevator.startPosition;

      for (const floor of elevator.queue) {
        totalTime += this.calculateTime(currentPosition, floor) + 2;
        currentPosition = floor;
      }

      totalTime += this.calculateTime(currentPosition, floorNumber) + 2;
      const elapsedTime = elevator.startTime ? (Date.now() - elevator.startTime) / 1000 : 0;
      console.log(`Elevator ${elevator.id} total time to floor ${floorNumber} including elapsed time: ${totalTime - elapsedTime}`);
      return totalTime - elapsedTime;
    }
  }
}

export default ElevatorService;
