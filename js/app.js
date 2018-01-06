let allEnemies = [];
let noMove;
let level = 1;
//let user = getCookie("username");
let viewOptions = false;
let paused = false;
let startMusic = true;
let enableSfx = true;
let enableMusic = true;
let sfxVol = 10;
let musicVol = 10;
let gotCookie;

// Define variables for the color cycler background
let hue = 0;
let hue2 = 89;
let cycleSpeed = .1;
const body = document.getElementsByTagName("BODY")[0];
//const pauseButton = document.getElementsByTagName("BUTTON");
let colorCycle = setInterval(cycleColors, 10);

const roachRun = new sound('sounds/roachrun.mp3');
const ouchSound = new sound('sounds/ouch.mp3');
const wonSound = new sound('sounds/drip.mp3');
const upSound = new sound('sounds/up.mp3');
const downSound = new sound('sounds/down.mp3');
let gameMusic = new sound('sounds/bensound-psychedelic.mp3');

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

            this.enemiesArray[allEnemies.length] = new Enemy(position, speed);

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
};

function modal(show,text,size,color) {
    $('#toggle').html(text);
    $('#toggle').css('font-size',size);
    $('#toggle').css('color',color);
    $('#toggle').toggle(show);
}

function pauseGame() {
    if (!paused) {
        modal("scale","<h2>Game Paused!</h2>","450%","green");
        clearInterval(colorCycle);
        noMove = true;
        paused = true;
        gameMusic.stop();
    } else {
        colorCycle = setInterval(cycleColors, 10);
        noMove = false;
        paused = false;
        if (enableMusic) {gameMusic.play();};
        modal("scale");
    }
}

Player.prototype.handleInput = function(key) {
        let thus = this;
        if((key === 'pause') && (!viewOptions)) {
            pauseGame();
        }

        if(key === 'options') {
            optionsScreen();
        }

        if(key === 'music') {
            if (enableMusic) {
                enableMusic=false;
                document.getElementById("enableMusic").checked = false;
                if (gotCookie) {setCookie("music","false",60)};
                gameMusic.stop();
            } else {enableMusic=true;
                document.getElementById("enableMusic").checked = true;
                if (gotCookie) {setCookie("music","true",60)}; gameMusic.play();};
        }

        if(key === 'sfx') {
            if (enableSfx) {
                enableSfx=false;
                document.getElementById("enableSfx").checked = false;
                if (gotCookie) {setCookie("sfx","false",60)};
            } else {
                enableSfx=true;
                document.getElementById("enableSfx").checked = true;
                if (gotCookie) {setCookie("sfx","true",60)};}
        }

        if (noMove) {return} else {
            if(key === 'left') {
                    if (this.ix > 0) {
                        this.ix--;
                        for (var i = 0; i < 101; i++) {
                            setTimeout(function(){thus.x--},i);
                        }
                    }
            }

            if(key === 'right') {
                    if (this.ix < 4) {
                        this.ix++;
                        for (var i = 0; i < 101; i++) {
                            setTimeout(function(){thus.x++},i);
                        }
                    }
            }

            if(key === 'up') {
                    if (this.iy > 0) {
                        if (enableSfx) {upSound.play();};
                        this.iy--;
                        for (var i = 0; i < 83; i++) {
                            setTimeout(function(){thus.y--},i);
                        }
                    }
            }

            if(key === 'down') {
                    if (this.iy < 5) {
                        if (enableSfx) {downSound.play();};
                        this.iy++;
                        for (var i = 0; i < 83; i++) {
                            setTimeout(function(){thus.y++},i);
                        }
                    }
            }
        }
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
        40: 'down',
        79: 'options',
        80: 'pause',
        77: 'music',
        70: 'sfx'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function won() {
    level++;
    modal("scale","<h2>Level " + level + "</h2>","500%","hsl(" + hue + ",100%, 50%)");
    if (enableSfx) {wonSound.play();};
    paused = true;
    clearTimeout();
    player.y = -28;
    noMove = true;
    if (gotCookie) {setCookie("level", level, 60);}
    $('body > canvas').css('transform','rotateX(360deg)');
    setTimeout(function(){$('body > canvas').css('transition','0ms');},1010);
    setTimeout(function(){$('body > canvas').css('transform','none');},1020);
    setTimeout(initGame,1050);
    setTimeout(function(){modal("scale");},1500);
}

function gotcha() {
    modal("shake","<h2>Ouch!</h2>","500%","red");
    if (enableSfx) {ouchSound.play();};
    paused = true;
    clearTimeout();
    noMove = true;
    level = 1;
    if (gotCookie) {setCookie("level", level, 60);}
    $('body > canvas').css('transform','rotateZ(720deg)');
    setTimeout(function(){$('body > canvas').css('transition','0ms');},1010);
    setTimeout(function(){$('body > canvas').css('transform','none');},1020);
    setTimeout(initGame,1050);
    setTimeout(function(){modal("scale");},1500);
}

$('#pauseButton').on("click",function(){
    if (!viewOptions) {pauseGame();}
});
$('#optionsButton').on("click",function(){
    optionsScreen();
});
$('#optionsOkay').on("click",function(){
    optionsScreen();
})

$(document).on({
    click: function(){
        optionsScreen();
    }
}, '#optionsOkay');

$(document).on({
    change: function() {
        if (enableMusic) {
            enableMusic=false;
            document.getElementById("enableMusic").checked = false;
            if (gotCookie) {setCookie("music","false",60)};
            gameMusic.stop();
        } else {
            enableMusic=true;
            document.getElementById("enableMusic").checked = true;
            if (gotCookie) {setCookie("music","true",60)};
            gameMusic.play();}
    }
}, '#enableMusic');

$(document).on({
    change: function() {
        musicVol = document.getElementById("musicVol").value;
        gameMusic.sound.volume = musicVol/10;
        if (gotCookie) {setCookie("musicVol", musicVol,60)};
    }
}, '#musicVol');

$(document).on({
    change: function() {
        sfxVol = document.getElementById("sfxVol").value;
        roachRun.sound.volume = sfxVol/10;
        ouchSound.sound.volume = sfxVol/10;
        wonSound.sound.volume = sfxVol/10;
        upSound.sound.volume = sfxVol/10;
        downSound.sound.volume = sfxVol/10
        ouchSound.play();
        if (gotCookie) {setCookie("sfxVol", sfxVol,60)};
    }
}, '#sfxVol');

$(document).on({
  change: function() {
        if (enableSfx) {
            enableSfx=false;
            document.getElementById("enableSfx").checked = false;
            if (gotCookie) {setCookie("sfx","false",60)};
        } else {
            enableSfx=true;
            document.getElementById("enableSfx").checked = true;
            if (gotCookie) {setCookie("sfx","true",60)};}
    }
}, '#enableSfx');

function optionsScreen(){
    if (!viewOptions) {
        if (paused) {return;};
        viewOptions=true;
        $('#options').toggle('scale');
        noMove = true;
        paused = true;
        if (enableMusic) {
            document.getElementById("enableMusic").checked = true;
        } else {document.getElementById("enableMusic").checked = false;}
        if (enableSfx) {
            document.getElementById("enableSfx").checked = true;
        } else {document.getElementById("enableSfx").checked = false;}


    } else {
        $('#options').toggle('scale');
        viewOptions=false;
        noMove = false;
        paused = false;
    }
    document.getElementById("musicVol").value = musicVol;
    document.getElementById("sfxVol").value = sfxVol;
}







$('body > audio:nth-child(9)').bind('ended', function()  {
    gameMusic.currentTime = 0;
    gameMusic.play();
});

function initGame() {
    if (gotCookie) {
        level = Number(getCookie("level"));
        enableMusic = bool(getCookie("music"));
        musicVol = Number(getCookie("musicVol"));
        gameMusic.sound.volume = musicVol/10;
        console.log("music vol", musicVol);
        enableSfx = bool(getCookie("sfx"));
        sfxVol = Number(getCookie("sfxVol"));
        roachRun.sound.volume = sfxVol/10;
        ouchSound.sound.volume = sfxVol/10;
        wonSound.sound.volume = sfxVol/10;
        upSound.sound.volume = sfxVol/10;
        downSound.sound.volume = sfxVol/10

        console.log(user,level,enableMusic,enableSfx);
    }

    if ((startMusic) && (enableMusic)) {
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
    $('body > canvas').css('transition','1000ms');
    paused = false;
    noMove = true;
    setTimeout(function(){noMove=false;},1000);
    if (enableSfx) {roachRun.play();};
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

//Background color cycler
function cycleColors(){
    hue+=cycleSpeed;
    hue2+=cycleSpeed;
    hue%=361;
    hue2%=361;
    body.style.background = 'radial-gradient(circle, hsl(' + hue + ',100%, 75%), hsl(' + hue2 + ',100%, 50%)';
}

//Convert string to boolean
function bool(v){ return v==="false" ? false : !!v; }

//Cookie handler section
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function killCookie() {
    setCookie("username", "", 0);
    setCookie("level", "", 0);
    setCookie("music", "", 0);
    setCookie("sfx", "", 0);
    setCookie("musicVol", "", 0);
    setCookie("sfxVol", "", 0);
}

function checkCookie() {
    user=getCookie("username");
    if (user === "") {
        user = prompt("Please enter your name:","");
        if (user != "" && user != null) {
            gotCookie = true;
            setCookie("username", user, 60);
            setCookie("level", level, 60);
            setCookie("music", true, 60);
            setCookie("sfx", true, 60);
            setCookie("musicVol", musicVol, 60);
            setCookie("sfxVol", sfxVol, 60);
        } else {gotCookie=false; user="Incognito"; return;}
    }
    gotCookie = true; return;
}


checkCookie();
setTimeout(function(){modal("shake","<h1>Bugs!</h1>","500%","#ffff00");},500);
setTimeout(function(){modal("scale");},1600);
setTimeout(function(){$('canvas').toggle('scale');},100);
setTimeout(function(){$('.conPanel').css('display','inline')},500);
initGame();

