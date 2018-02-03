// Define varaiable
let allEnemies = [];
let noMove;
let level = 1;
let viewOptions = false;
let paused = false;
let startMusic = true;
let enableSfx = true;
let enableMusic = true;
let sfxVol = 10;
let musicVol = 10;
let user = '';
let playerChar = 'images/char-boy.png';
let skill = 1;
let changeSkill = false;
let gotCookie;
let holdGame = false;
let hue = 0;
let hue2 = 89;
let cycleSpeed = .1;
let colorCycle = setInterval(cycleColors, 10);
const roachRun = new sound('sounds/roachrun.mp3');
const ouchSound = new sound('sounds/ouch.mp3');
const wonSound = new sound('sounds/drip.mp3');
const upSound = new sound('sounds/up.mp3');
const downSound = new sound('sounds/down.mp3');
const gameMusic = new sound('sounds/bensound-psychedelic.mp3');
const body = document.querySelector('body');
const userSubmitButton = document.getElementById('userSubmit');
const domOptionsScreen = document.getElementById('options');
const domConPanel = document.getElementById('conPanel');
const domWhoAreYouScreen = document.getElementById('userText');

// Enemies our player must avoid
var Enemy = function(position, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = Math.floor(Math.random() * (0 - (-120) + -120) + -120);

    this.y = (83 * position) - 20;

    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (paused) {return;}
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < 610) {
        this.x = this.x + this.speed * dt;
    } else {
        this.x = Math.floor(Math.random() * (0 - (-120) + -120) + -120);
        this.y = Math.floor(Math.random() * (3 - 1 + 1) + 1) * 83 - 20;
        this.speed = Math.floor(Math.random() * ((200*skill) - 50 + 50) + 50);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemies = function() {
    this.enemiesArray = [];
};

Enemies.prototype.create = function(number) {
        for(var i = 0; i < number; i++) {
            let speed = Math.floor(Math.random() * ((200*skill) - 50 + 50) + 50);
            let position = Math.floor(Math.random() * (3 - 1 + 1) + 1);
            this.enemiesArray[allEnemies.length] = new Enemy(position, speed);
            allEnemies.push(this.enemiesArray[allEnemies.length]);
        }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
        this.sprite = playerChar;
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
                }
            }
        }
    }
    if (player.y === -27) {
        won();
    }
};

//Thats one way to do a modal
function modal(show,text,size,color) {
    $('#toggle').html(text);
    $('#toggle').css('font-size',size);
    $('#toggle').css('color',color);
    $('#toggle').toggle(show);
}

//Pause game function
function pauseGame() {
    if (!paused) {
        modal('scale','<h1>Game Paused!</h1>','2.5em','green');
        clearInterval(colorCycle);
        noMove = true;
        paused = true;
        gameMusic.stop();
    } else {
        colorCycle = setInterval(cycleColors, 10);
        noMove = false;
        paused = false;
        if (enableMusic) {gameMusic.play();}
        modal('scale');
    }
}

Player.prototype.handleInput = function(key) {
        let thus = this;
        if((key === 'pause') && (!viewOptions) && (!holdGame)) {
            pauseGame();
        }

        if((key === 'options') && (!holdGame)) {
            optionsScreen();
        }

        if(key === 'music') {
            if (enableMusic) {
                enableMusic=false;
                document.getElementById('enableMusic').checked = false;
                if (gotCookie) {setCookie('music','false',60);}
                gameMusic.stop();
            } else {
                enableMusic=true;
                document.getElementById('enableMusic').checked = true;
                if (gotCookie) {setCookie('music','true',60);}
                gameMusic.play();
            }
        }

        if(key === 'sfx') {
            if (enableSfx) {
                enableSfx=false;
                document.getElementById('enableSfx').checked = false;
                if (gotCookie) {setCookie('sfx','false',60);}
            } else {
                enableSfx=true;
                document.getElementById('enableSfx').checked = true;
                if (gotCookie) {setCookie('sfx','true',60);}
            }
        }

        if (noMove) {return;} else {
            if(key === 'left') {
                    if (this.ix > 0) {
                        this.ix--;
                        for (var i = 0; i < 101; i++) {
                            setTimeout(function(){thus.x--;},i);
                        }
                    }
            }

            if(key === 'right') {
                    if (this.ix < 4) {
                        this.ix++;
                        for (var i = 0; i < 101; i++) {
                            setTimeout(function(){thus.x++;},i);
                        }
                    }
            }

            if(key === 'up') {
                    if (this.iy > 0) {
                        if (enableSfx) {upSound.play();}
                        this.iy--;
                        for (var i = 0; i < 83; i++) {
                            setTimeout(function(){thus.y--;},i);
                        }
                    }
            }

            if(key === 'down') {
                    if (this.iy < 5) {
                        if (enableSfx) {downSound.play();}
                        this.iy++;
                        for (var i = 0; i < 83; i++) {
                            setTimeout(function(){thus.y++;},i);
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
function gameKeyEventHandler() {
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
}

//Won level, increment level and init game
function won() {
    level++;
    modal('scale','<h1>Level ' + level + '</h1>','2.7em','hsl(' + hue + ',100%, 50%)');
    if (enableSfx) {wonSound.play();}
    paused = true;
    clearTimeout();
    player.y = -28;
    noMove = true;
    if (gotCookie) {setCookie('level', level, 60);}
    $('canvas').css('transform','rotateX(360deg)');
    setTimeout(function(){$('canvas').css('transition','0ms');},1010);
    setTimeout(function(){$('canvas').css('transform','none');},1020);
    setTimeout(initGame,1050);
    setTimeout(function(){modal('scale');},2000);
}

//Player bit, reset level to 1 and init game
function gotcha() {
    modal('shake','<h1>Ouch!</h1>','3.75em','red');
    if (enableSfx) {ouchSound.play();}
    paused = true;
    clearTimeout();
    noMove = true;
    level = 1;
    if (gotCookie) {setCookie('level', level, 60);}
    $('canvas').css('transform','rotateZ(720deg)');
    setTimeout(function(){$('canvas').css('transition','0ms');},1010);
    setTimeout(function(){$('canvas').css('transform','none');},1020);
    setTimeout(initGame,1050);
    setTimeout(function(){modal('scale');},1500);
}

//Event handler section

//Event Handler for the control panel 'click'
function initConPanelEventHandlers() {
    domConPanel.addEventListener('click', doConButtons, false);
}

//function to be called upon a click event on the control panel
function doConButtons(event) {
    if (event.target !== event.currentTarget) {
        var clidkedItem = event.target.id;
        switch(clidkedItem) {
            case 'pauseButton':
                if (!viewOptions) {pauseGame();}
            break;
            case 'optionsButton':
                optionsScreen();
                if (changeSkill) {
                    changeSkill=false;
                    setTimeout(function(){initGame();},500);
                }
            break;
        }
    }
    event.stopPropagation();
}

//Add Event Handlers when the options screen is displayed
function initOptionsEventHandlers() {
    domOptionsScreen.addEventListener('click', doOptions, false);
    domOptionsScreen.addEventListener('change', doChangeOptions, false);
}

//function to be called upon a 'click' within the options screen
function doOptions(event) {
    if (event.target !== event.currentTarget) {
        var clidkedItem = event.target.id;
        switch(clidkedItem) {
            case 'optionsOkay':
                optionsScreen();
                if (changeSkill) {
                    changeSkill=false;
                    setTimeout(function(){initGame();},500);
                }
            break;
            case 'killCookie':
                optionsScreen();
                $('canvas').toggle('scale');
                killCookie();
                setTimeout(function(){window.location.reload(true);},500);
            break;
            case 'charboyimg':
                player.sprite = 'images/char-boy.png';
                if (gotCookie) {setCookie('char','images/char-boy.png',60);}
            break;
            case 'chargirlimg':
                player.sprite = 'images/char-pink-girl.png';
                if (gotCookie) {setCookie('char','images/char-pink-girl.png',60);}
            break;
        }
    }
    event.stopPropagation();
}

//function to handle changes made to options settings
function doChangeOptions(event) {
    if (event.target !== event.currentTarget) {
        var changedItem = event.target.id;
        switch (changedItem) {
            case 'enableMusic':
                if (enableMusic) {
                    enableMusic=false;
                    document.getElementById('enableMusic').checked = false;
                    if (gotCookie) {setCookie('music','false',60);}
                    gameMusic.stop();
                } else {
                    enableMusic=true;
                    document.getElementById('enableMusic').checked = true;
                    if (gotCookie) {setCookie('music','true',60);}
                    gameMusic.play();
                }
            break;
            case 'musicVol':
                musicVol = document.getElementById('musicVol').value;
                gameMusic.sound.volume = musicVol/10;
                if (gotCookie) {setCookie('musicVol', musicVol,60);}
            break;
            case 'enableSfx':
                if (enableSfx) {
                    enableSfx=false;
                    document.getElementById('enableSfx').checked = false;
                    if (gotCookie) {setCookie('sfx','false',60);}
                } else {
                    enableSfx=true;
                    document.getElementById('enableSfx').checked = true;
                    if (gotCookie) {setCookie('sfx','true',60);}}
            break;
            case 'sfxVol':
                sfxVol = document.getElementById('sfxVol').value;
                roachRun.sound.volume = sfxVol/10;
                ouchSound.sound.volume = sfxVol/10;
                wonSound.sound.volume = sfxVol/10;
                upSound.sound.volume = sfxVol/10;
                downSound.sound.volume = sfxVol/10;
                if (enableSfx) {ouchSound.play();}
                if (gotCookie) {setCookie('sfxVol', sfxVol,60);}
            break;
            case 'skill':
                changeSkill=true;
                skill = document.getElementById('skill').value;
                level = 1;
                if (gotCookie) {
                    setCookie('skill',skill,60);
                    setCookie('level',level,60);
                }
            break;
        }
    }
}

//Display or hide the options screen
function optionsScreen(){
    if (!viewOptions) {
        if (paused) {return;}
        initOptionsEventHandlers();
        viewOptions=true;
        $('#options').toggle('fade');
        noMove = true;
        paused = true;
        if (enableMusic) {
            document.getElementById('enableMusic').checked = true;
        } else {document.getElementById('enableMusic').checked = false;}
        if (enableSfx) {
            document.getElementById('enableSfx').checked = true;
        } else {document.getElementById('enableSfx').checked = false;}
    } else {
        domOptionsScreen.removeEventListener('click', doOptions, false);
        domOptionsScreen.removeEventListener('change', doChangeOptions, false);
        $('#options').toggle('fade');
        viewOptions=false;
        noMove = false;
        paused = false;
    }
    document.getElementById('musicVol').value = musicVol;
    document.getElementById('sfxVol').value = sfxVol;
    document.getElementById('skill').value = skill;
}

//Wait for song 'ended' value and restart music
$('audio:last-child').bind('ended', function()  {
    gameMusic.currentTime = 0;
    gameMusic.play();
});

//Initiate game play
function initGame() {
    clearTimeout();
    player.x = 202;
    player.y = 388;
    player.ix = 2;
    player.iy = 5;
    allEnemies = [];
    enemies.create(skill * level);
    $('body > canvas').css('transition','1000ms');
    paused = false;
    noMove = true;
    if (!holdGame) {setTimeout(function(){noMove=false;},1000);
        if (enableSfx) {roachRun.play();}
        if ((startMusic) && (enableMusic)) {
        gameMusic.play();
        startMusic = false;
    }}
}

//Sound and music handling routine
function sound(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
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
function bool(v){ return v==='false' ? false : !!v; }

//Cookie handler functions

//Write cookie key and value
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = 'expires=' + d.toGMTString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

//Read cookie value
function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

//Clear all cookie keys and values
function killCookie() {
    setCookie('username', '', 0);
    setCookie('level', '', 0);
    setCookie('music', '', 0);
    setCookie('sfx', '', 0);
    setCookie('musicVol', '', 0);
    setCookie('sfxVol', '', 0);
    setCookie('char','',0);
    setCookie('skill','',0);
}

//Check for existing cookie
//If none exists ask user for name and initiate a new cookie
//If cookies exist, read the keys/values and refresh the expiration dates
function checkCookie() {
    user=getCookie('username');
    if (user === '') {
        whoAreYou();
    } else {readCookie();setUser();}
}

//Set game variables to the values of the cookies keys
function readCookie() {
    level = Number(getCookie('level'));
    enableMusic = bool(getCookie('music'));
    musicVol = Number(getCookie('musicVol'));
    gameMusic.sound.volume = musicVol/10;
    enableSfx = bool(getCookie('sfx'));
    sfxVol = Number(getCookie('sfxVol'));
    roachRun.sound.volume = sfxVol/10;
    ouchSound.sound.volume = sfxVol/10;
    wonSound.sound.volume = sfxVol/10;
    upSound.sound.volume = sfxVol/10;
    downSound.sound.volume = sfxVol/10;
    player.sprite = getCookie('char');
    skill = Number(getCookie('skill'));
}

//Creates new cookies or refreshs existing ones to prevent expiration of unchanged settings.
function setUser() {
    setCookie('username', user, 60);
    setCookie('level', level, 60);
    setCookie('music', true, 60);
    setCookie('sfx', true, 60);
    setCookie('musicVol', musicVol, 60);
    setCookie('sfxVol', sfxVol, 60);
    setCookie('char','images/char-boy.png',60);
    setCookie('skill',skill);
    gotCookie = true;
}

//If no player name is provided the game will call the user 'incognito'
//and no cookies will be created thus not saving progress or settings.
function submitUser() {
    user = document.getElementById('userText').value;
    if (user !== '' && user !== null) {setUser();} else {gotCookie=false; user='Incognito';}
    holdGame = false;
    $('#whoAreYou').css('display','none');
    if (enableSfx) {roachRun.play();}
    if ((startMusic) && (enableMusic)) {
    gameMusic.play();
    startMusic = false;
    }
    userSubmitButton.removeEventListener('click',submitUser);
    domWhoAreYouScreen.removeEventListener('keypress', userNameEnter, false);
    initAll();
}

//function to detect if the 'enter' key is pressed upon players name entered.
function userNameEnter(event) {
    let key = event.key;
    if (key === 'Enter') {submitUser();}
    event.stopPropagation();
}

//Get users name in order to create cookies.
function whoAreYou() {
    noMove = true;
    holdGame = true;
    $('#whoAreYou').css('display','block');
    userSubmitButton.addEventListener('click',submitUser);
    domWhoAreYouScreen.addEventListener('keypress', userNameEnter, false);
}

//Animated 'Bugs!' opening title
function welcome() {
    setTimeout(function(){modal('shake','<h1>Bugs!</h1>','3.2em','#ffff00');},500);
    setTimeout(function(){modal('scale');},1600);
    setTimeout(function(){$('canvas').toggle('scale');},100);
    setTimeout(function(){$('#conPanel').css('display','inline');},500);
}

//Call function to check for existing cookies
checkCookie();

//If nothing is holding the game from starting call the function to init everything
if (!holdGame) {initAll();}

//function puts entire game into execution
function initAll() {
    welcome();
    initConPanelEventHandlers();
    gameKeyEventHandler();
    initGame();
}