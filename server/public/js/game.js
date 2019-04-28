const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: [MainScene]
};


const game = new Phaser.Game(config);