
const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 2000 },
      fps: 50
    }
  },
  scene: GameScene
};


const game = new Phaser.Game(config);

window.gameLoaded();