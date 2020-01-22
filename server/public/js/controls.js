let controls = null;

const initControls = input => {
  const isMobile = typeof window.orientation !== "undefined";

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

  if (true) {
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const jumpButton = document.getElementById("jumpButton");
    leftButton.onmousedown = ev => {
      controls.left.isDown = true;
    }
    leftButton.onmouseup = ev => {
      controls.left.isDown = false;
    }
    rightButton.onmousedown = ev => {
      controls.right.isDown = true;
    }
    rightButton.onmouseup = ev => {
      controls.right.isDown = false;
    }
    jumpButton.onmousedown = ev => {
      controls.jump.isDown = true;
    }
    jumpButton.onmouseup = ev => {
      controls.jump.isDown = false;
    }
  } else {

  }
};
