export class Section {
  position: number;
  length: number;

  constructor() {
    this.position = (Math.random() * 200 + 40) | 0;
    this.length = 20;
  }
}
