const SIDE = { left: -1, right: 1 };

const CreatePlayer = (playerId, x, y) => {
  return {
    name,
    rotation: 0,
    x,
    y,
    velocityX: 0,
    velocityy: 0,
    playerId: playerId,
    grounded: false,
    image: "player",
    anim: "idle",
    side: SIDE.right,
    onAction: false,
    input: {
      left: false,
      right: false,
      up: false
    },
    attacks: {
      attack1: {
        duration: 500,
        anim: "attack1"
      }
    },
    jumps: 2,
    restartJumps() {
      this.jumps = 2;
    }
  };
};
