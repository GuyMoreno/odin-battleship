class Ship {
  #length;
  #hits = 0;
  constructor(length) {
    this.#length = length;
  }

  hit() {
    this.#hits += 1;
  }

  // 💡 Added: A public getter for testing and potential future UI display
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
