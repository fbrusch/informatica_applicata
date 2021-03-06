var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('ghost', 'assets/ghost.png');
    game.load.image('candy', 'assets/candy.png');


}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {


    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.physicsGroup();

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // aggiungiamo il nostro fantasmino

    ghost = createGhost(400,365,400,700);
    ghost2 = createGhost(10,200,10,200);
    ghost3 = createGhost(200,500,10,800);

    // aggiungiamo un'arma

    weapon = game.add.weapon(10, 'candy');
    weapon.bullets.setAll("width", 20);
    weapon.bullets.setAll("height", 20);
    weapon.setBulletBodyOffset(20, 20);
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletAngleOffset = 90;
    weapon.bulletSpeed = 400;
    weapon.fireAngle = 0;
    weapon.trackSprite(player,10,20);
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    //  We need to enable physics on the player

    //  Player physics properties. Give the little guy a slight bounce.

    //  Our two animations, walking left and right.

    //  Finally some stars to collect
    stars = game.add.physicsGroup();

    //  We will enable physics for any star that is created in this group


    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(weapon.bullets, ghost3, function(w,g) {
        w.kill();
    });

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;


    // ghost

    updateGhost(ghost);
    updateGhost(ghost2);
    updateGhost(ghost3);

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

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }

    if(fireButton.isDown) {
      weapon.fire();
    }

}

function createGhost(x,y,leftLimit, rightLimit) {
  g = game.add.sprite(x,y,'ghost');
  g.width = 48; g.height = 32;
  game.physics.arcade.enable(g);
  g.body.velocity.x = 100;
  g.leftLimit = leftLimit;
  g.rightLimit = rightLimit;
  return g;
}

function updateGhost(ghost) {
  if(ghost.x <= ghost.leftLimit) {
    ghost.body.velocity.x = 100;
  } else if (ghost.x >= ghost.rightLimit) {
    ghost.body.velocity.x = -100;
  }

  game.physics.arcade.overlap(ghost, player, function() {
    player.kill();
  });
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}
