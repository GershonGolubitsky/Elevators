class Elevator {
  id: number;
  position: number;
  startPosition: number;
  isAvailable: boolean;
  transitionTime: number;
  queue: number[];
  startTime: number | null; 

  constructor(id: number) {
    this.id = id;
    this.position = 0;
    this.startPosition = 0;
    this.isAvailable = true;
    this.transitionTime = 0;
    this.queue = [];
    this.startTime = null;
  }

  moveTo(floor: number, travelTime: number) {
    this.position = floor;
    this.transitionTime = travelTime;
    this.startTime = Date.now(); 
  }
}

export default Elevator;
