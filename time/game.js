var game = new Phaser.Game(600, 400, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.tilemap('mappa', 'mappa.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'grass-tiles-2-small.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('candy', 'assets/candy.png');
    game.load.image('ghost', 'assets/ghost.gif');
    game.load.image('potion', 'assets/potion.png');

}

var player;
var cursors;
var nemico_attivo;
var player_invincibile;

function create() {
    
    player_invincibile = false;

    
    
    nemico_attivo = true;
    map = game.add.tilemap('mappa');
    map.addTilesetImage('terreno', 'tiles')
    layer = map.createLayer('livello1');
    map.setCollisionBetween(1, 100);

    // The player and its settings
    player = game.add.sprite(600, 500, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    enemy = game.add.sprite(160, 256, 'ghost');
    enemy.width = 30; enemy.height = 30;
    game.physics.arcade.enable(enemy);
    enemy.body.velocity.x = 100;
    star = game.add.sprite(192, 0, 'star');
    game.physics.arcade.enable(star);
    cursors = game.input.keyboard.createCursorKeys()

    game.camera.follow(player);
    layer.resizeWorld();

    weapon = game.add.weapon(1, 'candy');
    weapon.trackSprite(player, 16,16);
    weapon.bullets.setAll("width",60);
    weapon.bullets.setAll("height", 60);
    weapon.bulletSpeed = 400;
    weapon.fireAngle = 90;
    
    pozione = game.add.sprite(400, 430, 'potion');
    game.physics.arcade.enable(pozione);
    pozione.height = 30;
    pozione.width = 30;
}


function update() {

    game.physics.arcade.collide(player, pozione, function(player, pozione) {
        pozione.kill();
        player_invincibile = true;
        player.alpha = 0.5;
    })
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(player, star, function(p,s) {
        s.kill();
    });
    game.physics.arcade.overlap(enemy, player, function(e,p) {
        if(nemico_attivo == true) {
            if(player_invincibile == false)
                p.kill();

        }
    })

    game.physics.arcade.overlap(enemy, weapon.bullets, function(e,b) {
        e.alpha = 0.5;
        nemico_attivo = false;
        //        tra 4 secondi, esegui questo codice:
        game.time.events.add(Phaser.Timer.SECOND * 4, function() {
            e.alpha = 1;
            nemico_attivo = true;

        })
    });

    player.body.velocity.x = 0;

    if(enemy.x > 260) {
        enemy.body.velocity.x = -100;
    }
    if(enemy.x < 160) {
        enemy.body.velocity.x = 100;
    }

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
        weapon.fireAngle = 180;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
        weapon.fireAngle = 0;
    }
    else if (cursors.down.isDown) {
        weapon.fire();
    }
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
