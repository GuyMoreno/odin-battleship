class Ship {
  #length;
  #hits = 0;
  constructor(length) {
    this.#length = length;
  }

  hit() {
    if (this.#hits < this.#length) {
      this.#hits += 1;
    }
  }

  // for testing and potential future UI display
  getHits() {
    return this.#hits;
  }
  
  get length() {
    return this.#length;
  }

  isSunk() {
    return this.#hits >= this.#length;
  }
}

export default Ship;
