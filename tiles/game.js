var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.tilemap('mappa', 'mappa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'grass-tiles-2-small.png');

}

var player;
var cursors;

function create() {

    map = game.add.tilemap('mappa');
    map.addTilesetImage('terreno', 'tiles')
    layer = map.createLayer('livello1');
    map.setCollisionBetween(1, 100);

    // The player and its settings
    player = game.add.sprite(32, 0, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys()

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }

    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.velocity.y = -200;
    }
}
