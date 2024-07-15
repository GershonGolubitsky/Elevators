class Elevator {
  id: number;
  position: number;
  startPosition: number;
  isAvailable: boolean;
  transitionTime: number;
  queue: number[];

  constructor(id: number) {
    this.id = id;
    this.position = 0;
    this.startPosition = 0;
    this.isAvailable = true;
    this.transitionTime = 0;
    this.queue = [];
  }

  moveTo(floor: number, travelTime: number) {
    this.position = floor;
    this.transitionTime = travelTime;
  }
}

export default Elevator;
