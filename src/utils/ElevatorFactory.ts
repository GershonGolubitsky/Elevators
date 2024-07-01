import Elevator from '../models/Elevator.ts';
import Floor from '../models/Floor.ts';

class ElevatorService {
  elevators: Elevator[];
  floors: Floor[];
  callQueue: { floorNumber: number, callback: (time: number) => void }[] = [];

  constructor(numFloors: number, numElevators: number) {
    this.floors = Array.from({ length: numFloors }, (_, i) => new Floor(i));
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i));
  }

  callElevator(floorNumber: number, callback: (time: number) => void): number {
    const availableElevator = this.findNearestElevator(floorNumber);
    if (!availableElevator) {
      this.callQueue.push({ floorNumber, callback });
      return -1;
    }
    const travelTime = this.calculateTime(availableElevator.position, floorNumber);
    availableElevator.moveTo(floorNumber, travelTime);

    setTimeout(() => {
      availableElevator.isAvailable = true;
      this.processCallQueue();
    }, (travelTime + 2) * 1000);

    callback(travelTime);
    return travelTime;
  }

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
      nearestElevator.isAvailable = false;
    }
    return nearestElevator;
  }

  calculateTime(currentPosition: number, targetPosition: number): number {
    return Math.abs(currentPosition - targetPosition) * 0.5;
  }

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
      }, (travelTime + 2) * 1000);

      nextCall.callback(travelTime);
    } else {
      this.callQueue.unshift(nextCall);
    }
  }
}

export default ElevatorService;
