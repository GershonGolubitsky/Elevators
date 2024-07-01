class Elevator {
  id: number;
  position: number;
  isAvailable: boolean;
  transitionTime: number;

  constructor(id: number) {
    this.id = id;
    this.position = 0;
    this.isAvailable = true;
    this.transitionTime = 0;
  }

  // Move elevator to specified floor
  moveTo(floor: number, travelTime: number) {
    this.position = floor;
    this.transitionTime = travelTime;
  }
}

export default Elevator;
