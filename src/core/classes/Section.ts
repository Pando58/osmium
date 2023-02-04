export class Section {
  start: number;
  end: number;

  constructor() {
    this.start = (Math.random() * 200 + 40) | 0;
    this.end = this.start + 20;
  }
}
