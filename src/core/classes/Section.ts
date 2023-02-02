export class Section {
  trackId: number | null = null;
  start: number;
  end: number;

  constructor() {
    this.start = Math.random() * 200 + 40;
    this.end = this.start + 20;
  }
}
