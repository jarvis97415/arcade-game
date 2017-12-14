var allEnemies = [];
var noMove;
var level = 1;
var paused = false;
var startMusic = true;

const roachRun = new sound('sounds/roachrun.mp3');
const ouchSound = new sound('sounds/ouch.mp3');
const wonSound = new sound('sounds/drip.mp3');
const upSound = new sound('sounds/up.mp3');
const downSound = new sound('sounds/down.mp3');
var gameMusic = new sound('sounds/bensound-psychedelic.mp3');
gameMusic.loop = true;

// Enemies our player must avoid
var Enemy = function(position, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = Math.floor(Math.random() * (0 - -120 + -120) + -120);

    this.y = (83 * position) - 20;

    //this.height = 50;

    //this.width = 50;

    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (paused) {return};
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //this.x < 610 ? this.x = this.x + this.speed * dt : this.x = Math.floor(Math.random() * (0 - -100 + -100) + -100);
    if (this.x < 610) {
        this.x = this.x + this.speed * dt
    } else {
        this.x = Math.floor(Math.random() * (0 - -120 + -120) + -120);
        this.y = (Math.floor(Math.random() * (3 - 1 + 1) + 1) * 83) - 20;
        this.speed = Math.floor(Math.random() * (200 - 50 + 50) + 50);
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Enemies = function() {
        /* Enemies generated are pushed into this array
         * before being pushed into the global allEnemies array
         */
        this.enemiesArray = [];
};


Enemies.prototype.create = function(number) {

        for(var i = 0; i < number; i++) {

            var speed = Math.floor(Math.random() * (200 - 50 + 50) + 50);

            var position = Math.floor(Math.random() * (3 - 1 + 1) + 1);
            // Instatiate a new enemy object.
            this.enemiesArray[allEnemies.length] = new Enemy(position, speed);
            // Push the new enemy into the allEnemies array.
            allEnemies.push(this.enemiesArray[allEnemies.length]);
        }

};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

        this.sprite = 'images/char-boy.png';

        this.x = 202;
        this.ix = 2;

        this.y = 388;
        this.iy = 5;

        this.height = 50;

        this.width = 50;
};

Player.prototype.update = function() {

    if (!paused) {for (var i = 0; i < allEnemies.length; i++) {
            if (allEnemies[i].y -7 === this.y) {
                if ((allEnemies[i].x + 70) > player.x && allEnemies[i].x < (player.x + 70)) {
                    gotcha();
                };
            }
        }
    }
    if (player.y === -27) {
        won();
    }
        //this.xNow = this.x;
        //this.yNow = this.y;
};


Player.prototype.handleInput = function(key) {
        if (noMove) {return}

        this.y = (this.iy * 83) - 27;
        this.x = this.ix * 101;

        if(key === 'left') {
                if (this.ix > 0) {
                    this.ix--;
                    for (var i = 0; i < 101; i++) {
                        setTimeout(function(){player.x--},i);
                    }
                }
        }

        if(key === 'right') {
                if (this.ix < 4) {
                    this.ix++;
                    for (var i = 0; i < 101; i++) {
                        setTimeout(function(){player.x++},i);
                    }
                }
        }

        if(key === 'up') {
                if (this.iy > 0) {
                    upSound.play();
                    this.iy--;
                    for (var i = 0; i < 83; i++) {
                        setTimeout(function(){player.y--},i);
                    }
                }
        }

        if(key === 'down') {
                if (this.iy < 5) {
                    downSound.play();
                    this.iy++;
                    for (var i = 0; i < 83; i++) {
                        setTimeout(function(){player.y++},i);
                    }
                }
        }

        if (key === 'up' || key === 'down') {
            setTimeout(function(){this.y = (this.iy * 83) - 27},84);
        }

        if (key === "left" || key === "right") {
            setTimeout(function(){this.x = this.ix * 101},102);
        }

/*
                //this.x > 0 ? this.x = this.xNow - 101 : this.x = 0;
                if (this.x > 0) {
                    noMove = true;
                    setTimeout(function(){noMove = false},102)
                    for (var i = 0; i < 101; i++) {
                        setTimeout(function(){player.x = player.x - 1},i);
                    }
                }
        }

        if(key === 'up') {
                //this.y > -27 ? this.y = this.yNow - 83 : this.y = -27;
                if (this.y > -27) {
                    noMove = true;
                    setTimeout(function(){noMove = false},102)
                    for (var i = 0; i < 83; i++) {
                        setTimeout(function(){player.y = player.y - 1},i);
                    }
                }
        }

        if(key === 'right') {
                //this.x < 404 ? this.x = this.xNow + 101 : this.x = 404;
                if (this.x < 404) {
                    noMove = true;
                    setTimeout(function(){noMove = false},102)
                    for (var i = 0; i < 101; i++) {
                        setTimeout(function(){player.x = player.x + 1},i);
                    }
                }
        }

        if(key === 'down') {
                //this.y < 388 ? this.y = this.yNow + 83 : this.y = 388;
                if (this.y < 388) {
                    noMove = true;
                    setTimeout(function(){noMove = false},102)
                    for (var i = 0; i < 83; i++) {
                        setTimeout(function(){player.y = player.y + 1},i);
                    }
                }
        }*/
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemies = new Enemies();
var player = new Player();

Player.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function won() {
    wonSound.play();
    paused = true;
    clearTimeout();
    player.y = -28;
    noMove = true;
    console.log("Won!");
    level++;
    $('body > canvas').css('transform','rotateX(360deg)');
    setTimeout(function(){$('body > canvas').css('transition','0ms');},1050);
    setTimeout(function(){$('body > canvas').css('transform','none');},1100);
    setTimeout(function(){$('body > canvas').css('transition','1000ms');},1150);
    setTimeout(initGame,1000);
}

function gotcha() {
    ouchSound.play();
    paused = true;
    clearTimeout();
    noMove = true;
    console.log('Gotcha!');
    level = 1;
    $('body > canvas').css('transform','rotateZ(720deg)');
    setTimeout(function(){$('body > canvas').css('transition','0ms');},1010);
    setTimeout(function(){$('body > canvas').css('transform','none');},1020);
    //setTimeout(function(){$('body > canvas').css('transition','1000ms');},1150);
    setTimeout(initGame,1050);
}

$('body > audio:nth-child(8)').bind('ended', function()  {
    gameMusic.currentTime = 0;
    gameMusic.play();
});


function initGame() {
    if (startMusic) {
        gameMusic.play();
        startMusic = false;
    }
    clearTimeout();
    player.x = 202;
    player.y = 388;
    player.ix = 2;
    player.iy = 5;
    allEnemies = [];
    enemies.create(2 * level);
    noMove = false;
    $('body > canvas').css('transition','1000ms');
    paused = false;
    roachRun.play();
};

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}


function main() {

}

initGame();
main();