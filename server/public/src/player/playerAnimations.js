const playerAnimations = {
    idle: (player, force) => {
        if (!force && player.sprite.anims.currentAnim.key == "idle") return;
        player.sprite.flipX = player.side;
        player.sprite.anims.play("idle");
    },
    walk: (player, force) => {
        if (!force && player.sprite.anims.currentAnim.key == "walk" && player.sprite.flipX == player.side)
            return;
        player.sprite.flipX = player.side;
        player.sprite.anims.play("walk");
    },
    jump: (player, force) => {
        if (!force && player.sprite.anims.currentAnim.key == "jump") return;
        player.sprite.flipX = player.side;
        player.sprite.anims.play("jump");
    },
    attack1: (player, force) => {
        if (!force && player.sprite.anims.currentAnim.key == "attack1") return;
        player.sprite.canAnimate = false;
        player.sprite.flipX = player.side;
        player.sprite.anims.play("attack1");
    }
};