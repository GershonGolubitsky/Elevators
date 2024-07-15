import Elevator from '../models/Elevator.ts';
import Floor from '../models/Floor.ts';

class ElevatorService {
  elevators: Elevator[];
  floors: Floor[];

  constructor(numFloors: number, numElevators: number) {
    this.floors = Array.from({ length: numFloors }, (_, i) => new Floor(i));
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i));
  }

  callElevator(floorNumber: number, callback: (time: number) => void, callTime: number): number | null {
    const nearestElevator = this.findOptimalElevator(floorNumber);

    if (nearestElevator === null) {
      return null;
    }

    const elevatorAtFloor = this.elevators.find(elevator =>
      elevator.position === floorNumber ||
      elevator.queue.includes(floorNumber)
    );

    if (elevatorAtFloor) {
      return null;
    }

    const travelTime = this.calculateTime(nearestElevator.startPosition, floorNumber);
    const totalTime = travelTime + callTime;

    if (nearestElevator.isAvailable) {
      nearestElevator.moveTo(floorNumber, travelTime);
      nearestElevator.isAvailable = false;

      setTimeout(() => {
        nearestElevator.isAvailable = true;
        nearestElevator.startPosition = nearestElevator.position;
        callback(totalTime);

        this.processNextCall(nearestElevator, callback);
      }, (totalTime + 2) * 1000);

      return totalTime;
    } else {
      const estimatedTime = this.estimateTimeForBusyElevator(nearestElevator, floorNumber);
      nearestElevator.queue.push(floorNumber);

      setTimeout(() => {
        nearestElevator.moveTo(floorNumber, estimatedTime);
        nearestElevator.isAvailable = false;

        setTimeout(() => {
          nearestElevator.isAvailable = true;
          nearestElevator.startPosition = nearestElevator.position;
          callback(estimatedTime);

          this.processNextCall(nearestElevator, callback);
        }, (estimatedTime + 2) * 1000);
      }, estimatedTime * 1000);

      return estimatedTime;
    }
  }

  processNextCall(elevator: Elevator, callback: (time: number) => void) {
    if (elevator.queue.length > 0) {
      const nextFloor = elevator.queue.shift();
      if (nextFloor !== undefined) {
        const travelTime = this.calculateTime(elevator.position, nextFloor);
        elevator.moveTo(nextFloor, travelTime);

        setTimeout(() => {
          elevator.isAvailable = true;
          elevator.startPosition = elevator.position;
          callback(travelTime);

          setTimeout(() => {
            this.processNextCall(elevator, callback);
          }, 2000);
        }, travelTime * 1000);
      }
    }
  }

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

    return optimalElevator;
  }

  calculateTime(startPosition: number, targetPosition: number): number {
    return Math.abs(startPosition - targetPosition) * 0.5;
  }

  estimateTimeForBusyElevator(elevator: Elevator, newFloor: number): number {
    let totalTime = 0;
    let currentPosition = elevator.startPosition;

    // Calculate time for each floor in the queue
    for (const floor of elevator.queue) {
      totalTime += this.calculateTime(currentPosition, floor) + 2; // +2 seconds for stopping
      currentPosition = floor;
    }

    // Add time for the new floor
    totalTime += this.calculateTime(currentPosition, newFloor) + 2; // +2 seconds for stopping

    return totalTime;
  }

  calculateTotalTime(elevator: Elevator, floorNumber: number): number {
    if (elevator.isAvailable) {
      return this.calculateTime(elevator.startPosition, floorNumber);
    } else {
      let totalTime = 0;
      let currentPosition = elevator.startPosition;

      // Calculate time for each floor in the queue
      for (const floor of elevator.queue) {
        totalTime += this.calculateTime(currentPosition, floor) + 2; // +2 seconds for stopping
        currentPosition = floor;
      }

      // Add time for the target floor
      totalTime += this.calculateTime(currentPosition, floorNumber) + 2; // +2 seconds for stopping

      return totalTime;
    }
  }
}

export default ElevatorService;
