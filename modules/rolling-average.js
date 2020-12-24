
class RollingAverage {
  constructor() {
    this.average = 0;
    this.count = 0;
  }

  add(value) {
    // https://stackoverflow.com/questions/12636613/how-to-calculate-moving-average-without-keeping-the-count-and-data-total
    this.count = this.count + 1;
    this.average = this.average * (this.count - 1) / this.count + value / this.count;
  }

  getAverage() {
    return this.average || 0;
  }

  getCount() {
    return this.count;
  }
}

module.exports = RollingAverage;
