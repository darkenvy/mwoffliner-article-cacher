
class Timer {
  constructor() {
    this.deltas = {};
  }

  start(name) {
    this.deltas[name] = Date.now();
  }

  end(name) {
    const delta = Date.now() - this.deltas[name];
    delete this.deltas[name];

    return delta;
  }
}

module.exports = Timer;
