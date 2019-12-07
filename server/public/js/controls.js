let controls = null;

const initControls = (input) => {
    controls = input.keyboard.addKeys({
        up: "W",
        down: "S",
        left: "A",
        right: "D",
        jump: "SPACE",
        attack1: "U",
        attack2: "I",
        attack3: "O",
        lag: "L"
      });
}