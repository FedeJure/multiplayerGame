const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 2000 }
    }
  },
  scene: [MainScene]
};


const game = new Phaser.Game(config);