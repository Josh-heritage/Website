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
    'xxxxxxxxxxxxxxxxx', //ideal length
    '<span style="cols',
    '<a href="/404">Bs',
    '<section id="logs',
    '<input type="texs',
    '<!-- Page not fos',
    '<body onload="ins',
    '{ background: #0s',
    '</html> hjasdashs'
  ];
  
const commandWords = ["trace", "patch", "flush", "reboot", "clear", "inject", "scrub", "halt"];


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
  
  let commands = pickThreeCommands(); // e.g. ["flush", "trace", "clear"]
  




function drawBackground() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // draw vertical column lines
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
const maxLines = 20; // depends on canvas height

function scrollLines() {
  lines.push(generateLine());
  if (lines.length > maxLines) lines.shift();
}

function drawLogs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px monospace";
  
  
    ctx.textAlign = "left";
  
    // Draw vertical dividers
    ctx.strokeStyle = "#222";
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * colWidth, 0);
      ctx.lineTo(i * colWidth, canvas.height);
      ctx.stroke();
    }


  
    // Draw logs with extra padding at top
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

// Call once at start and whenever commands change
updateCommandDisplay();


const typedInputContainer = document.getElementById("typedInputContainer");
const hiddenInput = document.getElementById("hiddenInput");
  
let typedText = "";
  
// Focus hidden input to capture keyboard
hiddenInput.focus();
  
  function renderTypedText() {
    // Clear old content
    typedInputContainer.innerHTML = "";
  
    // For each letter, create a span with a 'lit' style
    for (const letter of typedText) {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.color = "#0f0";  // bright green to indicate 'lit'
      span.style.transition = "color 0.2s ease";
      typedInputContainer.appendChild(span);
    }
  }
  
  // Listen for input events on hidden input
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

  
        // **Pick new commands and update display!**
        commands = pickThreeCommands();
        updateCommandDisplay();
      } else {
        // Optional: no bug to remove in that column
      }
    }
  });
  
  
  
  // Keep focus on hidden input (important for continuous typing)
  window.addEventListener("click", () => hiddenInput.focus());
  window.addEventListener("keydown", () => hiddenInput.focus());
  
function removeBugFromColumn(col) {
  // Find the first bug in the lines array in column `col`
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].isBug && lines[i].column === col) {
      lines.splice(i, 1); // Remove that bug line
      return true; // Success
    }
  }
  return false; // No bug found in that column
}



  

setInterval(() => {
    scrollLines();
    drawLogs();
  }, 1000);
  





drawBackground();
