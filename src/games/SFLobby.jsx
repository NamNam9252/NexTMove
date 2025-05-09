"use client";
import React, { useRef, useEffect, useState } from 'react';
import './SFLobby.css';

const CELL_SIZE = 24;
const BOARD_WIDTH = 24;
const BOARD_HEIGHT = 24;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};
const SEGMENT_SPACING = 0.7; // Lower = tighter, higher = looser, 1 = 1 cell

function getKeyByValue(value) {
  return Object.keys(DIRECTIONS).find(
    (k) => DIRECTIONS[k].x === value.x && DIRECTIONS[k].y === value.y
  );
}

function randomFood(snake) {
  let x, y;
  do {
    x = Math.floor(Math.random() * BOARD_WIDTH);
    y = Math.floor(Math.random() * BOARD_HEIGHT);
  } while (snake.some((segment) => segment.x === x && segment.y === y));
  return { x, y };
}

function Controls() {
  return (
    <div className="sf-controls">
      <div className="sf-controls-title">Use arrow keys to control</div>
      <div className="sf-controls-arrows">
        <div className="sf-controls-row"><span className="sf-arrow sf-arrow-up">↑</span></div>
        <div className="sf-controls-row">
          <span className="sf-arrow sf-arrow-left">←</span>
          <span className="sf-arrow sf-arrow-down">↓</span>
          <span className="sf-arrow sf-arrow-right">→</span>
        </div>
      </div>
      <div className="sf-controls-spacebar">Space</div>
      <div className="sf-controls-instruction">press spacebar to start</div>
    </div>
  );
}

function QRPlaceholder() {
  return (
    <div className="sf-qr-placeholder">
      <div className="sf-qr-box">QR</div>
    </div>
  );
}

// Draw a green checkerboard background
function drawCheckerboard(ctx, width, height, cellSize) {
  const color1 = '#b6e388';
  const color2 = '#a3d977';
  for (let y = 0; y < height / cellSize; y++) {
    for (let x = 0; x < width / cellSize; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// Draw the snake as a thick, rounded tube
function drawInterpolatedSnakeTube(ctx, snake, cellSize) {
  if (snake.length < 2) return;
  ctx.save();
  ctx.strokeStyle = '#3498ff';
  ctx.lineWidth = cellSize * 0.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = '#1e90ff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(
    snake[0].x * cellSize + cellSize / 2,
    snake[0].y * cellSize + cellSize / 2
  );
  for (let i = 1; i < snake.length; i++) {
    ctx.lineTo(
      snake[i].x * cellSize + cellSize / 2,
      snake[i].y * cellSize + cellSize / 2
    );
  }
  ctx.stroke();
  ctx.restore();
}

// Draw the snake head (cartoon style)
function drawSnakeHeadGoogle(ctx, x, y, size, angle) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(angle);
  ctx.fillStyle = '#3498ff';
  ctx.strokeStyle = '#1e90ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.save();
  ctx.translate(-size * 0.18, -size * 0.18);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(size * 0.18, -size * 0.18);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#0a3d62';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, size * 0.18, size * 0.18, 0, Math.PI, false);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

// Draw a cartoon apple as food
function drawApple(ctx, x, y, size) {
  ctx.save();
  // Apple body
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2.3, 0, Math.PI * 2);
  ctx.fillStyle = '#ff4d4d';
  ctx.shadowColor = '#b91c1c';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;
  // Apple shine
  ctx.beginPath();
  ctx.arc(x + size / 2.5, y + size / 2.5, size / 8, 0, Math.PI * 2);
  ctx.fillStyle = '#fff8';
  ctx.fill();
  // Apple leaf
  ctx.beginPath();
  ctx.ellipse(x + size / 1.5, y + size / 2.5, size / 8, size / 4, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.fill();
  ctx.restore();
}

const SFLobby = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [food, setFood] = useState(randomFood(INITIAL_SNAKE));
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pendingDir, setPendingDir] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const [speed, setSpeed] = useState(180);
  const dirQueueRef = useRef([]);
  // For smooth animation
  const [moveProgress, setMoveProgress] = useState(1);
  const prevSnakeRef = useRef(INITIAL_SNAKE);
  const animFrameRef = useRef();
  const [shake, setShake] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKey(e.key);
      if (!isRunning && (e.key === 'Enter' || e.key === ' ')) {
        resetGame();
        setIsRunning(true);
      }
      if (DIRECTIONS[e.key]) {
        dirQueueRef.current.push(DIRECTIONS[e.key]);
      }
    };
    const handleKeyUp = (e) => {
      setPressedKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning]);

  // Classic cell-by-cell snake movement, but store previous snake for animation
  useEffect(() => {
    if (!isRunning) return;
    let lastFrameTime = performance.now();
    let lastMoveTime = performance.now();
    let animationFrame;
    function gameLoop(time) {
      const delta = time - lastFrameTime;
      lastFrameTime = time;
      let progress = Math.min((time - lastMoveTime) / speed, 1);
      setMoveProgress(progress);
      if (progress >= 1) {
        lastMoveTime = time;
        let newDir = direction;
        // Apply direction queue for sharp turns
        while (dirQueueRef.current.length) {
          const nextDir = dirQueueRef.current.shift();
          const opp = {
            ArrowUp: 'ArrowDown',
            ArrowDown: 'ArrowUp',
            ArrowLeft: 'ArrowRight',
            ArrowRight: 'ArrowLeft',
          };
          if (getKeyByValue(nextDir) !== opp[getKeyByValue(direction)]) {
            newDir = nextDir;
            break;
          }
        }
        setDirection(newDir);
        prevSnakeRef.current = snake;
        const newHead = {
          x: snake[0].x + newDir.x,
          y: snake[0].y + newDir.y,
        };
        // Collision
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_WIDTH ||
          newHead.y < 0 ||
          newHead.y >= BOARD_HEIGHT ||
          snake.some((s) => s.x === newHead.x && s.y === newHead.y)
        ) {
          setGameOver(true);
          setIsRunning(false);
          setMoveProgress(1);
          return;
        }
        let newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(randomFood(newSnake));
          setScore((s) => s + 1);
          // Increase speed every 5 points
          if (score % 5 === 4) {
            setSpeed((s) => Math.max(60, s - 10));
          }
        } else {
          newSnake.pop();
        }
        setSnake(newSnake);
        setMoveProgress(0);
      }
      animationFrame = requestAnimationFrame(gameLoop);
      animFrameRef.current = animationFrame;
    }
    animationFrame = requestAnimationFrame(gameLoop);
    animFrameRef.current = animationFrame;
    return () => cancelAnimationFrame(animationFrame);
  }, [isRunning, direction, food, speed, snake]);

  // Draw everything with smooth interpolation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCheckerboard(ctx, canvas.width, canvas.height, CELL_SIZE);
    drawApple(ctx, food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE);
    // Interpolate each segment between previous and current position
    const prevSnake = prevSnakeRef.current;
    const curSnake = snake;
    const interpSnake = curSnake.map((seg, i) => {
      const prev = prevSnake[i] || seg;
      return {
        x: prev.x + (seg.x - prev.x) * moveProgress,
        y: prev.y + (seg.y - prev.y) * moveProgress,
      };
    });
    drawInterpolatedSnakeTube(ctx, interpSnake, CELL_SIZE);
    // Head angle
    let headX = interpSnake[0].x, headY = interpSnake[0].y, angle = 0;
    if (interpSnake.length > 1) {
      const seg = interpSnake[1];
      angle = Math.atan2(seg.y - headY, seg.x - headX) + Math.PI;
    }
    drawSnakeHeadGoogle(ctx, headX * CELL_SIZE, headY * CELL_SIZE, CELL_SIZE, angle);
  }, [snake, food, direction, moveProgress]);

  // Trigger shake animation on crash
  useEffect(() => {
    if (gameOver) {
      setShake(true);
      const timeout = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [gameOver]);

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTIONS.ArrowRight);
    setFood(randomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    dirQueueRef.current = [];
    prevSnakeRef.current = INITIAL_SNAKE;
    setMoveProgress(1);
  }

  return (
    <div className="sf-lobby-3col">
      <div className="sf-lobby-left"><Controls /></div>
      <div className="sf-lobby-center">
        {gameOver && (
          <div className="sf-gameover-bar">
            <span role="img" aria-label="skull">💀</span>
            Game Over! Press <b>Spacebar</b> to restart
          </div>
        )}
        <div className={`sf-scorebar${gameOver ? ' gameover' : ''}`}>
          <span role="img" aria-label="apple">🍎</span> {score} &nbsp; <span role="img" aria-label="trophy">🏆</span> {score}
        </div>
        <div className={`sf-board-wrapper${shake ? ' shake' : ''}`}>
          <canvas
            ref={canvasRef}
            width={CELL_SIZE * BOARD_WIDTH}
            height={CELL_SIZE * BOARD_HEIGHT}
            className="sf-lobby-canvas"
          />
        </div>
        {(!isRunning && !gameOver) && <div className="sf-lobby-hint">Press <b>Spacebar</b> to start</div>}
        {gameOver && <div className="sf-lobby-hint gameover">Game Over! Press <b>Spacebar</b> to restart</div>}
        <div className="sf-speed-slider">
          <label htmlFor="speed-slider">Snake Speed</label>
          <input
            id="speed-slider"
            type="range"
            min={60}
            max={400}
            step={10}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          />
          <span className="sf-speed-label">{speed <= 100 ? 'Very Fast' : speed <= 180 ? 'Fast' : speed <= 260 ? 'Normal' : speed <= 340 ? 'Slow' : 'Very Slow'} ({speed} ms)</span>
        </div>
      </div>
      <div className="sf-lobby-right"><QRPlaceholder /></div>
    </div>
  );
};

export default SFLobby;
