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
    leftButton.ontouchstart = ev => {
      controls.left.isDown = true;
    }
    leftButton.ontouchend = ev => {
      controls.left.isDown = false;
    }
    rightButton.ontouchstart = ev => {
      controls.right.isDown = true;
    }
    rightButton.ontouchend = ev => {
      controls.right.isDown = false;
    }
    jumpButton.ontouchstart = ev => {
      controls.jump.isDown = true;
    }
    jumpButton.ontouchend = ev => {
      controls.jump.isDown = false;
    }
  } else {

  }
};
