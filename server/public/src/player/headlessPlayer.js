class HeadlessPlayer extends BasePlayer {
  constructor(scene, x, y, name, playerId) {
    super(scene, x, y, name, playerId);
    this.anim = "idle";
    //this.collisionableZone = new ColisionPlayerZone(scene, this);
    //this.add(this.collisionableZone);
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
      name: this.nameText,
      life: this.attackSystem.life,
      maxLife: this.attackSystem.maxLife
    };
  }
}
