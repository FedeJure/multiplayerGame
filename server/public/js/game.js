const config = {
  type: Phaser.AUTO,
  parent: 'gameZone',
  width: window.innerWidth,
  height: window.innerHeight,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 2000 }
    }
  },
  scene: [MainScene]
};

window.addEventListener('resize', () => {
  resizeGame();
});

const resizeGame = () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
}


const game = new Phaser.Game(config);

$(document).ready(() => {
  if (typeof window.orientation !== "undefined") {
    $('*').addClass('isMobile');
  }
});