


class AttackSystem extends Phaser.GameObjects.Rectangle {
    constructor(owner, scene, width, height) {
        super(scene, 0, 0, width, height);
        this.owner = owner;
        attacksGroup.add(owner);

    }
}

const initPlayerOverlap = (scene) => {
    scene.physics.add.overlap(localPlayer, externalPlayers, 
        //proccess collide
        (localPlayer, other) => {
            if (other.y > localPlayer.y + (playerConfig.height / 2)) {
                localPlayer.overlaps.down.push(other)                
            }
            if (other.y < localPlayer.y - (playerConfig.height / 2)) {
                localPlayer.overlaps.up.push(other)                
            }
            if (other.x > localPlayer.x) {
                localPlayer.overlaps.right.push(other)                
            }
            if (other.x < localPlayer.x) {
                localPlayer.overlaps.left.push(other)
            }
        },
        //check, if true, then call proccess collide
        (localPlayer, other) => {

            return true
        },
    scene);
    
}