class HeadlessPlayer extends BasePlayer {
  constructor(scene, x, y, name, playerId) {
    super(scene, x, y, name, playerId);
    this.anim = "idle";
  }

  updateState(playerInfo) {
    this.setRotation(playerInfo.rotation);
    this.setPosition(playerInfo.x, playerInfo.y);
    this.updatePlayerName();
  }

  restartJumps() {
    this.jumps = initialJumps;
  }

  getRepresentation() {
    return {
      x: this.x,
      y: this.y,
      velocityX: this.body.velocity.x,
      velocityY: this.body.velocity.y,
      side: this.side,
      jumps: this.jumps,
      grounded: this.grounded,
      playerId: this.playerId,
      onAction: this.onAction,
      anim: this.anim,
      name: this.nameText
    };
  }
}
