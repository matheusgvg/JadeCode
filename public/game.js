const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const GAME = {
    scene: "menu",
    started: false,
    score: 0,
    lives: 3,
    vinylsCollected: 0,
    currentLevel: 1,
    cameraX: 0
};

const music = new Audio("music/1.mp3");
music.loop = true;
music.volume = 0.5;

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

function bindTouch(id, key) {

    const btn = document.getElementById(id);

    btn.addEventListener("touchstart", e => {
        e.preventDefault();
        keys[key] = true;
    });

    btn.addEventListener("touchend", e => {
        e.preventDefault();
        keys[key] = false;
    });

    btn.addEventListener("mousedown", () => {
        keys[key] = true;
    });

    btn.addEventListener("mouseup", () => {
        keys[key] = false;
    });
}

bindTouch("leftBtn", "ArrowLeft");
bindTouch("rightBtn", "ArrowRight");
bindTouch("jumpBtn", " ");

const stars = [];

for(let i=0;i<150;i++){

    stars.push({
        x:Math.random()*5000,
        y:Math.random()*canvas.height,
        size:Math.random()*3+1
    });

}

const player = {

    x:100,
    y:200,

    width:40,
    height:40,

    vx:0,
    vy:0,

    speed:5,

    jumpForce:16,

    grounded:false,

    color:"#00FFD0"

};

const level = {

    width:5000,

    platforms:[

        {x:0,y:650,w:600,h:50},
        {x:700,y:560,w:180,h:25},
        {x:1000,y:470,w:180,h:25},
        {x:1300,y:380,w:180,h:25},
        {x:1700,y:500,w:200,h:25},
        {x:2100,y:420,w:200,h:25},
        {x:2500,y:320,w:180,h:25},
        {x:2900,y:500,w:220,h:25},
        {x:3300,y:400,w:220,h:25},
        {x:3800,y:300,w:250,h:25}

    ]

};

const vinyls = [

    {x:760,y:510,collected:false},
    {x:1050,y:420,collected:false},
    {x:1350,y:330,collected:false},
    {x:2150,y:370,collected:false},
    {x:3850,y:250,collected:false}

];

function startGame(){

    if(GAME.started) return;

    GAME.started = true;
    GAME.scene = "intro";

    music.play().catch(()=>{});

}

canvas.addEventListener("click", startGame);
canvas.addEventListener("touchstart", startGame);

function updatePlayer(){

    player.vx = 0;

    if(keys["ArrowLeft"])
        player.vx = -player.speed;

    if(keys["ArrowRight"])
        player.vx = player.speed;

    if(keys[" "] && player.grounded){

        player.vy = -player.jumpForce;
        player.grounded = false;

    }

    player.x += player.vx;

    player.vy += 0.8;
    player.y += player.vy;

    player.grounded = false;

    for(const p of level.platforms){

        if(
            player.x + player.width > p.x &&
            player.x < p.x + p.w &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + 35 &&
            player.vy > 0
        ){

            player.y = p.y - player.height;
            player.vy = 0;
            player.grounded = true;

        }
    }

    if(player.y > canvas.height + 500){

        GAME.lives--;

        player.x = 100;
        player.y = 200;

        if(GAME.lives <= 0){

            GAME.scene = "gameover";

        }
    }

    GAME.cameraX =
        player.x - canvas.width/3;

}

function updateVinyls(){

    vinyls.forEach(v=>{

        if(v.collected) return;

        const dx = player.x - v.x;
        const dy = player.y - v.y;

        const dist = Math.sqrt(dx*dx+dy*dy);

        if(dist < 50){

            v.collected = true;

            GAME.score += 100;
            GAME.vinylsCollected++;

        }

    });

}

function drawStars(){

    stars.forEach(star=>{

        ctx.fillStyle="white";

        ctx.fillRect(

            star.x - GAME.cameraX*0.2,
            star.y,
            star.size,
            star.size

        );

    });

}

function drawBackground(){

    ctx.fillStyle="#070B1A";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawStars();

    ctx.fillStyle="#101A35";

    ctx.fillRect(
        0,
        canvas.height-220,
        canvas.width,
        220
    );
}

function drawMenu(){

    drawBackground();

    ctx.textAlign="center";

    ctx.fillStyle="#FFFFFF";

    ctx.font="bold 58px Arial";

    ctx.fillText(
        "JADE'S MIDNIGHT",
        canvas.width/2,
        180
    );

    ctx.fillText(
        "ADVENTURE",
        canvas.width/2,
        250
    );

    ctx.font="26px Arial";

    ctx.fillStyle="#C7C7C7";

    ctx.fillText(
        "Uma aventura inspirada em noites,",
        canvas.width/2,
        350
    );

    ctx.fillText(
        "trens e músicas inesquecíveis.",
        canvas.width/2,
        390
    );

    ctx.fillStyle="#00FFD0";

    ctx.fillText(
        "Toque para começar",
        canvas.width/2,
        500
    );

}

//parte2

// ===========================
// INTRO
// ===========================

let introTimer = 0;

const monkey = {
    x: 520,
    y: 590,
    width: 35,
    height: 35
};

const checkpoint = {
    x: 2400,
    y: 270,
    active: false
};

const movingPlatforms = [
    {
        x: 1900,
        y: 300,
        w: 150,
        h: 20,
        minX: 1900,
        maxX: 2300,
        dir: 1,
        speed: 1.5
    }
];

const enemies = [
    {
        x: 1500,
        y: 330,
        w: 35,
        h: 35,
        dir: 1,
        speed: 1.5,
        minX: 1450,
        maxX: 1700
    },
    {
        x: 3100,
        y: 450,
        w: 35,
        h: 35,
        dir: -1,
        speed: 2,
        minX: 2950,
        maxX: 3250
    }
];

const rainDrops = [];

for(let i=0;i<200;i++){

    rainDrops.push({
        x: Math.random()*5000,
        y: Math.random()*canvas.height,
        speed: 8 + Math.random()*8
    });

}

let dialog = {
    active:false,
    text:"",
    timer:0
};

let achievement = {
    active:false,
    text:"",
    timer:0
};

function showDialog(text){

    dialog.active = true;
    dialog.text = text;
    dialog.timer = 300;

}

function unlockAchievement(text){

    achievement.active = true;
    achievement.text = text;
    achievement.timer = 300;

}

function updateIntro(){

    introTimer++;

    if(introTimer > 500){

        GAME.scene = "game";

    }

}

function drawIntro(){

    drawBackground();

    ctx.fillStyle="white";
    ctx.textAlign="center";

    ctx.font="48px Arial";

    ctx.fillText(
        "09/06/2026",
        canvas.width/2,
        180
    );

    ctx.font="28px Arial";

    if(introTimer < 150){

        ctx.fillText(
            "Uma noite comum...",
            canvas.width/2,
            300
        );

    }
    else if(introTimer < 300){

        ctx.fillText(
            "Um trem está prestes a partir.",
            canvas.width/2,
            300
        );

    }
    else{

        ctx.fillText(
            "Destino: 505",
            canvas.width/2,
            300
        );

    }

    ctx.fillStyle="#00FFD0";

    ctx.fillText(
        "Jade, sua aventura está começando.",
        canvas.width/2,
        450
    );

}

// ===========================
// CHUVA
// ===========================

function updateRain(){

    rainDrops.forEach(r=>{

        r.y += r.speed;

        if(r.y > canvas.height){

            r.y = -20;
            r.x = Math.random()*5000;

        }

    });

}

function drawRain(){

    ctx.strokeStyle="rgba(180,200,255,0.5)";

    rainDrops.forEach(r=>{

        ctx.beginPath();

        ctx.moveTo(
            r.x - GAME.cameraX*0.3,
            r.y
        );

        ctx.lineTo(
            r.x - GAME.cameraX*0.3 - 4,
            r.y + 10
        );

        ctx.stroke();

    });

}

// ===========================
// INIMIGOS
// ===========================

function updateEnemies(){

    enemies.forEach(enemy=>{

        enemy.x += enemy.speed * enemy.dir;

        if(enemy.x < enemy.minX)
            enemy.dir = 1;

        if(enemy.x > enemy.maxX)
            enemy.dir = -1;

        const collision =
            player.x < enemy.x + enemy.w &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.h &&
            player.y + player.height > enemy.y;

        if(collision){

            GAME.lives--;

            player.x = checkpoint.active
                ? checkpoint.x
                : 100;

            player.y = 150;

            if(GAME.lives <= 0){

                GAME.scene = "gameover";

            }

        }

    });

}

// ===========================
// PLATAFORMAS MÓVEIS
// ===========================

function updateMovingPlatforms(){

    movingPlatforms.forEach(p=>{

        p.x += p.speed * p.dir;

        if(p.x <= p.minX)
            p.dir = 1;

        if(p.x >= p.maxX)
            p.dir = -1;

        if(
            player.x + player.width > p.x &&
            player.x < p.x + p.w &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + 20 &&
            player.vy >= 0
        ){

            player.y = p.y - player.height;
            player.vy = 0;
            player.grounded = true;

            player.x += p.speed * p.dir;

        }

    });

}

// ===========================
// CHECKPOINT
// ===========================

function updateCheckpoint(){

    const near =
        Math.abs(player.x - checkpoint.x) < 60;

    if(near && !checkpoint.active){

        checkpoint.active = true;

        showDialog(
            "Checkpoint ativado!"
        );

    }

}

// ===========================
// MONKEY
// ===========================

function updateMonkey(){

    const near =
        Math.abs(player.x - monkey.x) < 80;

    if(
        near &&
        !dialog.active
    ){

        showDialog(
            "Miau! Continue seguindo para o trem 505."
        );

    }

}

// ===========================
// CONQUISTA
// ===========================

function updateAchievements(){

    if(
        GAME.vinylsCollected === 5
    ){

        unlockAchievement(
            "Colecionadora de Vinis"
        );

        GAME.vinylsCollected = 999;

    }

}

// ===========================
// HUD
// ===========================

function drawHUD(){

    ctx.fillStyle="white";
    ctx.textAlign="left";

    ctx.font="22px Arial";

    ctx.fillText(
        "❤️ " + GAME.lives,
        20,
        35
    );

    ctx.fillText(
        "Score: " + GAME.score,
        20,
        70
    );

}

// ===========================
// DESENHOS
// ===========================

function drawWorld(){

    drawBackground();
    drawRain();

    ctx.save();

    ctx.translate(-GAME.cameraX,0);

    level.platforms.forEach(p=>{

        ctx.fillStyle="#59412E";

        ctx.fillRect(
            p.x,
            p.y,
            p.w,
            p.h
        );

    });

    movingPlatforms.forEach(p=>{

        ctx.fillStyle="#6A7CFF";

        ctx.fillRect(
            p.x,
            p.y,
            p.w,
            p.h
        );

    });

    vinyls.forEach(v=>{

        if(v.collected) return;

        ctx.fillStyle="#FFD700";

        ctx.beginPath();

        ctx.arc(
            v.x,
            v.y,
            12,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

    enemies.forEach(enemy=>{

        ctx.fillStyle="#FF5555";

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.w,
            enemy.h
        );

    });

    ctx.fillStyle="#FFFFFF";

    ctx.fillRect(
        monkey.x,
        monkey.y,
        monkey.width,
        monkey.height
    );

    ctx.fillStyle=
        checkpoint.active
        ? "#00FF66"
        : "#AAAAAA";

    ctx.fillRect(
        checkpoint.x,
        checkpoint.y,
        15,
        120
    );

    ctx.fillStyle=player.color;

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    ctx.restore();

    drawHUD();

}

// ===========================
// DIÁLOGO
// ===========================

function drawDialog(){

    if(!dialog.active)
        return;

    dialog.timer--;

    if(dialog.timer <= 0){

        dialog.active = false;
        return;

    }

    ctx.fillStyle=
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        50,
        canvas.height-180,
        canvas.width-100,
        120
    );

    ctx.fillStyle="white";

    ctx.font="24px Arial";

    ctx.fillText(
        dialog.text,
        80,
        canvas.height-110
    );

}

// ===========================
// CONQUISTAS
// ===========================

function drawAchievement(){

    if(!achievement.active)
        return;

    achievement.timer--;

    if(achievement.timer <= 0){

        achievement.active = false;
        return;

    }

    ctx.fillStyle=
        "rgba(0,0,0,0.8)";

    ctx.fillRect(
        canvas.width-350,
        20,
        320,
        70
    );

    ctx.fillStyle="#FFD700";

    ctx.font="22px Arial";

    ctx.fillText(
        "🏆 " + achievement.text,
        canvas.width-330,
        65
    );

}

//parte3

// ===========================
// TREM 505
// ===========================

const train505 = {

    x: 4500,
    y: 520,

    width: 260,
    height: 100

};

// ===========================
// SAVE
// ===========================

function saveGame(){

    localStorage.setItem(
        "jadeAdventureSave",
        JSON.stringify({
            score: GAME.score,
            level: GAME.currentLevel,
            checkpoint: checkpoint.active
        })
    );

}

function loadGame(){

    const save =
        localStorage.getItem(
            "jadeAdventureSave"
        );

    if(!save) return;

    try{

        const data =
            JSON.parse(save);

        GAME.score =
            data.score || 0;

        GAME.currentLevel =
            data.level || 1;

        checkpoint.active =
            data.checkpoint || false;

    }
    catch(e){

        console.log(e);

    }

}

loadGame();

// ===========================
// FINAL
// ===========================

let endingTimer = 0;

function updateEnding(){

    endingTimer++;

}

function drawEnding(){

    drawBackground();

    ctx.fillStyle="white";
    ctx.textAlign="center";

    ctx.font="60px Arial";

    ctx.fillText(
        "Destino: 505",
        canvas.width/2,
        140
    );

    ctx.font="28px Arial";

    if(endingTimer < 300){

        ctx.fillText(
            "O trem finalmente chegou.",
            canvas.width/2,
            260
        );

    }
    else if(endingTimer < 600){

        ctx.fillText(
            "Uma jornada cheia de vinis,",
            canvas.width/2,
            260
        );

        ctx.fillText(
            "estrelas e aventuras.",
            canvas.width/2,
            310
        );

    }
    else{

        ctx.fillText(
            "Feliz aniversário, Jade ❤️",
            canvas.width/2,
            260
        );

        ctx.fillText(
            "09/06/2026",
            canvas.width/2,
            320
        );

    }

    ctx.fillStyle="#00FFD0";

    ctx.fillText(
        "Obrigado por jogar.",
        canvas.width/2,
        450
    );

}

// ===========================
// GAME OVER
// ===========================

function drawGameOver(){

    ctx.fillStyle="#000";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle="#FF4444";

    ctx.textAlign="center";

    ctx.font="70px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width/2,
        200
    );

    ctx.fillStyle="white";

    ctx.font="28px Arial";

    ctx.fillText(
        "Clique para recomeçar",
        canvas.width/2,
        320
    );

}

canvas.addEventListener("click", ()=>{

    if(GAME.scene !== "gameover")
        return;

    location.reload();

});

// ===========================
// DESENHAR TREM
// ===========================

function drawTrain(){

    ctx.fillStyle="#444";

    ctx.fillRect(
        train505.x,
        train505.y,
        train505.width,
        train505.height
    );

    ctx.fillStyle="#FFD700";

    ctx.fillRect(
        train505.x + 20,
        train505.y + 20,
        40,
        40
    );

    ctx.fillRect(
        train505.x + 90,
        train505.y + 20,
        40,
        40
    );

    ctx.fillRect(
        train505.x + 160,
        train505.y + 20,
        40,
        40
    );

    ctx.fillStyle="white";

    ctx.font="20px Arial";

    ctx.fillText(
        "505",
        train505.x + 95,
        train505.y - 10
    );

}

// ===========================
// DETECTAR FINAL
// ===========================

function updateTrain(){

    const reached =

        player.x + player.width >
        train505.x;

    if(reached){

        saveGame();

        GAME.scene = "ending";

    }

}

// ===========================
// UPDATE PRINCIPAL
// ===========================

function updateGame(){

    updatePlayer();

    updateVinyls();

    updateEnemies();

    updateRain();

    updateMonkey();

    updateCheckpoint();

    updateAchievements();

    updateMovingPlatforms();

    updateTrain();

}

// ===========================
// DESENHO PRINCIPAL
// ===========================

function drawGame(){

    drawWorld();

    ctx.save();

    ctx.translate(
        -GAME.cameraX,
        0
    );

    drawTrain();

    ctx.restore();

    drawDialog();

    drawAchievement();

}

// ===========================
// CRÉDITOS
// ===========================

function drawCredits(){

    ctx.fillStyle="rgba(0,0,0,0.5)";

    ctx.fillRect(
        0,
        canvas.height-120,
        canvas.width,
        120
    );

    ctx.fillStyle="white";

    ctx.textAlign="center";

    ctx.font="18px Arial";

    ctx.fillText(
        "Jade's Midnight Adventure",
        canvas.width/2,
        canvas.height-80
    );

    ctx.fillText(
        "Criado especialmente para Jade",
        canvas.width/2,
        canvas.height-50
    );

    ctx.fillText(
        "Inspirado por noites, trens e música.",
        canvas.width/2,
        canvas.height-20
    );

}

// ===========================
// LOOP PRINCIPAL
// ===========================

function loop(){

    requestAnimationFrame(loop);

    switch(GAME.scene){

        case "menu":

            drawMenu();

        break;

        case "intro":

            updateIntro();

            drawIntro();

        break;

        case "game":

            updateGame();

            drawGame();

            drawCredits();

        break;

        case "ending":

            updateEnding();

            drawEnding();

        break;

        case "gameover":

            drawGameOver();

        break;

    }

}

loop();