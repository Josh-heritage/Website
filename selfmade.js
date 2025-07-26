document.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const colwidth = width / 3;
const lineHeight = 20;
const changeofbug = 0.3;

const logsfillers = [
    '<div class=aner">',
    '<script src=.js">',
    'xxxxxxxxxxxxxxxxx', //ideal length is 17
    '<span style="cols',
    '<a href="/404">Bs',
    '<section id="logs',
    'input type="texts',
    '<Page not founds>',
    'body onload="insa',
    'background: #111;',
    'fetch("/sys/.js")',
    'socket.bind(":3")',
    'sudo pacman -Syu',
    'git clone joshua',
    'chmod +x /boot.sh',
    'ping 192.168.234.',
    'sudo -rm -fr /*',
    'sudo fdisk -l',
    'sudo ncdu /usr/sh',
    'chnpw -i /mnt/SAM',
    'Nmap -Sn test.com'
  ];

const words = [
    "sudo",
    "patch", 
    "reboot", 
    "clear", 
    "inject", 
    "nmap", 
    "trace", 
    "scan", 
    "reset", 
    "fix", 
    "terminal", 
    "repair", 
    "debug",  
    "sync",
    "linux",
    "update",
    "install",
    "compile",
    "execute",
    "connect",
    "monitor",
    "shutdown",
    "configure",
    "validate",
    "encrypt",
    "decrypt",
    "compress",
    "decompress",
    "backup",
    "restore",
    "archive",
    "deploy",
    "kernel"
];


function drawBackground() {
    ctx.strokeStyle = "#333";
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colwidth, 0);
        ctx.lineTo(i * colwidth, height);
        ctx.stroke();
    }
    
    
}


let lives = 3;
let score = 0;
let gameOver = false;
let gameRunning = false;


const startbutton = document.getElementById("startbutton");

startbutton.addEventListener("click", () => {
    if (gameOver) {
        location.reload();
    } else if (!gameRunning) {
        gameRunning = true;
        startbutton.textContent = "Restart Game";
        lives = 3
        score = 0
        gameOver = false;
        const scoreDisplay = document.getElementById("score");
        scoreDisplay.textContent = `Score: ${score}`;
        updatewords();
        startgame();
    }
});


function updatelives() {
    lives -= 1;
    const livesDisplay = document.getElementById("lives");
    livesDisplay.textContent = `Lives: ${lives}`;
};

function updatescore() {
    score += 1;
    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = `Score: ${score}`;
};

function activewords() {
    const shuffled = words.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
};

//let activeWords = activewords();

function updatewords() {
    for (let i = 0; i < 3; i++) {
        const wordElement = document.getElementById(`word${i}`);
        if (wordElement) {
            wordElement.textContent = activewords()[i];
        }
    }
};

function generatealog() {
    const base = logsfillers[Math.floor(Math.random() * logsfillers.length)];
    const column = Math.floor(Math.random() * 3); // generate either position 0, 1 or 2

    let log = base;
    let containBug = false;

    if (Math.random() < changeofbug) {
        containBug = true;
        const bug = "[BUG]";
        const position = Math.floor(Math.random() * 3); // also generates position 0, 1 or 2

        if (position === 0) {
            log = bug + log;
        } else if (position === 1) {
            log = log + bug;
        } else {
            const words = base.split(" ");
            const middle = Math.floor(words.length / 2);
            words.splice(middle, 0, bug);
            log = words.join(" ");
        }}
        return {
            text: log,
            containBug: containBug,
            column: column
        };


    }

let logs = [];

function movelogsup() {
    if (gameOver) return;
    logs.push(generatealog());
    if (logs.length > 20) {
        logs.shift();    // Removes the oldest log if we have more than 20
        if (logs[0].containBug) {      // check to see if logs[0] works instead of defining another variable of removedline
            updatelives();
            console.log("Bug escaped! Lives left:", lives);
            if (lives <= 0) {
                endGame();
            }
        }
    }
}

function drawlogs() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#333";
    ctx.font = "16px monospace";


    logs.forEach((log, index) => {
        const col = index % 3;
        const x = col * colwidth + 10; // Add some padding
        const y = height - (index * lineHeight) - 10; // Adjust for line height and padding


        const bugMatch = log.text.indexOf("[BUG]") !== -1; // if its got a bug, true and vice versa


        ctx.fillStyle = bugMatch ? "red" : "#0f0"; // Compact if else statement

        if (bugMatch) {
            const beforeBug = log.text.split("[BUG]")[0];
            const afterBug = log.text.split("[BUG]")[1];
            const bug = "[BUG]";

            ctx.fillStyle = "#0f0";
            ctx.fillText(beforeBug, x, y);
            const beforeWidth = ctx.measureText(beforeBug).width;

            ctx.fillStyle = "red";
            ctx.fillText(bug, x + beforeWidth, y);
            const bugWidth = ctx.measureText(bug).width;

            ctx.fillStyle = "#0f0"
            ctx.fillText(afterBug, x + beforeWidth + bugWidth, y)

        } else {
            ctx.fillStyle = "#0f0"
            ctx.fillText(log.text, x, y);
        }
    });
}


const inputContainer = document.getElementById("inputContainer");
const hiddenInput = document.getElementById("hiddenInput");

let typed = "";

hiddenInput.focus(); // captures input without user clicking

function rendertyped() {
    inputContainer.innerHTML = ""; // Clear previous input

    for (const letter of typed) {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.colour = "#0f0";
        span.style.transition = "color 0.2s ease";
        inputContainer.appendChild(span);
    }
}

function removebug(col) {
    for (let i=0; i < logs.length; i++) {
        if (logs[i].text.toLowerCase().includes("[bug]") && i % 3 === col) {
            logs.splice(i, 1);
            updatescore();
            return true; // Exit loop after removing one bug
        }
    }
    return false; // No bug found in that column
}


hiddenInput.addEventListener("input", (event) => {
    typed = event.target.value.toLowerCase();
    rendertyped();

    const columnIndex = words.findIndex(word => word.toLowerCase() === typed);
    if (columnIndex !== -1) {
        const removed = removebug(columnIndex)
        if (removed) {
            typed = "";
            hiddenInput.value = ""; 
            rendertyped();
            updatewords();

            word = activewords(); // Update words after removing a bug
            updatewords();
        } else {
            console.log("No bug found in that column.");
        }
}
});


window.addEventListener("click", () => hiddenInput.focus()); //maintains focus on input rather than user clicking everytime
window.addEventListener("keydown", () => hiddenInput.focus());

function endGame() {
    gameOver = true;

    lines = Array(20).fill().map(() => ({
      text: "!!! SYSTEM FAILURE !!!",
      column: Math.floor(Math.random() * 3),
      containBug: false
    }));
  
    drawLogs();
  }

  let gamespeed = 1000
  let currentSpeed = gamespeed;

  function startgame() {
    if (!gameOver) {
        movelogsup();
        drawlogs();
        

        currentSpeed = Math.max(250, gamespeed - score * 10)
        setTimeout(startgame, currentSpeed);
    }
  }


drawBackground();



});