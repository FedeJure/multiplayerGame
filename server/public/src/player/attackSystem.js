


class AttackSystem extends Phaser.GameObjects.Rectangle {
    constructor(owner, scene, width, height) {
        super(scene, 0, 0, width, height);
        this.owner = owner;
        attacksGroup.add(owner);

    }
}

const initAttackSystem = (scene) => {
    scene.physics.add.overlap(localPlayer, externalPlayers, 
        //proccess collide
        (localPlayer, other) => {
            console.log(localPlayer)
        },
        //check, if true, then call proccess collide
        (localPlayer, other) => {

            return true
        },
    scene);
    
}