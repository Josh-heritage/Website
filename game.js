document.addEventListener("DOMContentLoaded", () => {



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Config
const cols = 3;
const width = canvas.width;
const height = canvas.height;
const colWidth = width / cols;
const lineHeight = 20;
const bgColor = "#111";
const lineColor = "#0f0"; // default text color



const codeTemplates = [
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
  
const commandWords = [
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
    "compile",,
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



const startRestartBtn = document.getElementById("startRestartBtn");

let gameRunning = false;

startRestartBtn.addEventListener("click", () => {
  if (gameOver) {
    location.reload();
  } else if (!gameRunning) {
    gameRunning = true;
    startRestartBtn.textContent = "Restart Game";
    lives = 3;
    score = 0;
    gameOver = false;
    updateLivesDisplay();
    updateScore(0);
    tick();
  }
});







let lives = 3;
let gameOver = false;







function updateLivesDisplay() {
  const el = document.getElementById("lives");
  if (el) el.textContent = lives;
}


let score = 0;

function updateScore(amount) {
  score += amount;

  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = score;
  } else {
    console.warn("Score element not found in the DOM.");
  }
}


function pickThreeCommands() {
    const shuffled = commandWords.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3); // Pick first 3
  }
  
  let commands = pickThreeCommands(); 
  




function drawBackground() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#222";
  for (let i = 1; i < cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * colWidth, 0);
    ctx.lineTo(i * colWidth, height);
    ctx.stroke();
  }
}


function generateLine() {
    const base = codeTemplates[Math.floor(Math.random() * codeTemplates.length)];
    const chanceOfBug = 0.3;
    const col = Math.floor(Math.random() * 3); // 3 columns: 0, 1, 2
  
    let line = base;
    let isBug = false;
  
    if (Math.random() < chanceOfBug) {
      isBug = true;
      const bug = "[BUG]";
      const position = Math.floor(Math.random() * 3);
  
      if (position === 0) {
        line = `${bug} ${base}`;
      } else if (position === 1) {
        const words = base.split(" ");
        const mid = Math.floor(words.length / 2);
        words.splice(mid, 0, bug);
        line = words.join(" ");
      } else {
        line = `${base} ${bug}`;
      }
    }
  
    return { text: line, isBug, column: col };
  }
  

let lines = [];
const maxLines = 20; 

function scrollLines() {
    if (gameOver) return;
  
    lines.push(generateLine());
  
    if (lines.length > maxLines) {
      const removedLine = lines.shift();
  
      if (removedLine.isBug) {
        lives--;
        updateLivesDisplay();
        console.log("Bug escaped! Lives left:", lives);
  
        if (lives <= 0) {
          endGame();
        }
      }
    }
  }
  

function drawLogs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px monospace";
  
  
    ctx.textAlign = "left";
  
   
    ctx.strokeStyle = "#222";
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * colWidth, 0);
      ctx.lineTo(i * colWidth, canvas.height);
      ctx.stroke();
    }


  
    
    const topPadding = 50;
    ctx.font = "14px monospace";
    for (let i = 0; i < lines.length; i++) {
      const y = canvas.height - topPadding - (lines.length - i - 1) * lineHeight;
      const line = lines[i];
      const x = line.column * colWidth + 10;
  
      const bugMatch = line.text.indexOf("[BUG]");
      if (bugMatch === -1) {
        ctx.fillStyle = "#0f0";
        ctx.fillText(line.text, x, y);
      } else {
        const before = line.text.slice(0, bugMatch);
        const bug = "[BUG]";
        const after = line.text.slice(bugMatch + bug.length);
  
        ctx.fillStyle = "#0f0";
        ctx.fillText(before, x, y);
        const beforeWidth = ctx.measureText(before).width;
  
        ctx.fillStyle = "red";
        ctx.fillText(bug, x + beforeWidth, y);
        const bugWidth = ctx.measureText(bug).width;
  
        ctx.fillStyle = "#0f0";
        ctx.fillText(after, x + beforeWidth + bugWidth, y);
      }
    }
  }
  
function updateCommandDisplay() {
  for (let i = 0; i < 3; i++) {
    const cmdDiv = document.getElementById(`cmd${i}`);
    cmdDiv.textContent = `[${commands[i]}]`;
  }
}


updateCommandDisplay();


const typedInputContainer = document.getElementById("typedInputContainer");
const hiddenInput = document.getElementById("hiddenInput");
  
let typedText = "";
 

hiddenInput.focus();
  
  function renderTypedText() {
    // Clear old content
    typedInputContainer.innerHTML = "";
  
    
    for (const letter of typedText) {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.color = "#0f0"; 
      span.style.transition = "color 0.2s ease";
      typedInputContainer.appendChild(span);
    }
  }
  

  function pickThreeCommands() {
    const shuffled = commandWords.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }
  
  function updateCommandDisplay() {
    for (let i = 0; i < 3; i++) {
      const cmdDiv = document.getElementById(`cmd${i}`);
      cmdDiv.textContent = `[${commands[i]}]`;
    }
  }
  
  hiddenInput.addEventListener("input", (e) => {
    typedText = e.target.value.toLowerCase();
    renderTypedText();
  
    const colIndex = commands.findIndex(cmd => cmd === typedText);
    if (colIndex !== -1) {
      const removed = removeBugFromColumn(colIndex);
      if (removed) {
        // Clear input on success
        typedText = "";
        hiddenInput.value = "";
        renderTypedText();
        updateScore(1)

  
        commands = pickThreeCommands();
        updateCommandDisplay();
      } else {
        // pass
      }
    }
  });
  
  
  
  // Keep focus on hidden input
  window.addEventListener("click", () => hiddenInput.focus());
  window.addEventListener("keydown", () => hiddenInput.focus());
  
function removeBugFromColumn(col) {

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].isBug && lines[i].column === col) {
      lines.splice(i, 1);
      return true; 
    }
  }
  return false; // No bug found in that column
}

function endGame() {
    gameOver = true;
  
    lines = Array(maxLines).fill().map(() => ({
      text: "!!! SYSTEM FAILURE !!!",
      column: Math.floor(Math.random() * cols),
      isBug: false
    }));
  
    drawLogs();
  }
  

let baseSpeed = 1000;
let currentSpeed = baseSpeed;



function tick() {
    if (!gameOver) {
      scrollLines();
      drawLogs();
  
      currentSpeed = Math.max(250, baseSpeed - score * 10);
      setTimeout(tick, currentSpeed);
    }
  }
  
//  tick();
  
 // 1 second per scroll

//setInterval(() => {
//    scrollLines();
 //   drawLogs();
 // }, 1000*gamespeed);
  



drawBackground();

});