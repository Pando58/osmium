export class Player {
  ctx: AudioContext | null = null;

  constructor() {}

  play() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }
}
