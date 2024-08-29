'use client';

import React, { useEffect, useRef, useState } from 'react';
import './Tetris.module.css';

function Tetris() {
  const canvasRef = useRef(null);
  const upcomingRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  let ctx, uctx;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ucanvas = upcomingRef.current;
    
    // Überprüfen, ob die Referenzen existieren
    if (canvas && ucanvas) {
      ctx = canvas.getContext('2d');
      uctx = ucanvas.getContext('2d');
      run();
    }

    // Event Listener für das Resizing hinzufügen
    window.addEventListener('resize', resize, false);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 };

  const i = { size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan' };
  const j = { size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue' };
  const l = { size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' };
  const o = { size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' };
  const s = { size: 3, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green' };
  const t = { size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' };
  const z = { size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red' };

  const nx = 10;
  const ny = 20;
  const nu = 5;

  // Spielgeschwindigkeit
  const speed = {
    start: 90.0,
    decrement: 0.001,
    min: 0.5,
  };

  let dx, dy, blocks, actions, playing, dt, current, next, score, vscore, rows, step;
  let pieces = [];

  function hide(id) {
    document.getElementById(id).style.visibility = 'hidden';
  }

  function show(id) {
    document.getElementById(id).style.visibility = null;
  }

  function html(id, html) {
    document.getElementById(id).innerHTML = html;
  }

  function timestamp() {
    return new Date().getTime();
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomChoice(choices) {
    return choices[Math.round(random(0, choices.length - 1))];
  }

  function eachblock(type, x, y, dir, fn) {
    let bit, result, row = 0,
      col = 0,
      blocks = type.blocks[dir];
    for (bit = 0x8000; bit > 0; bit = bit >> 1) {
      if (blocks & bit) {
        fn(x + col, y + row);
      }
      if (++col === 4) {
        col = 0;
        ++row;
      }
    }
  }

  function occupied(type, x, y, dir) {
    let result = false;
    eachblock(type, x, y, dir, function(x, y) {
      if (x < 0 || x >= nx || y < 0 || y >= ny || getBlock(x, y)) result = true;
    });
    return result;
  }

  function unoccupied(type, x, y, dir) {
    return !occupied(type, x, y, dir);
  }

  function randomPiece() {
    if (pieces.length === 0)
      pieces = [i, i, i, i, j, j, j, j, l, l, l, l, o, o, o, o, s, s, s, s, t, t, t, t, z, z, z, z];
    const type = pieces.splice(random(0, pieces.length - 1), 1)[0];
    return { type: type, dir: DIR.UP, x: Math.round(random(0, nx - type.size)), y: 0 };
  }

  function run() {
    addEvents();
    resize();
    reset();
    frame();
  }

  function addEvents() {
    document.addEventListener('keydown', keydown, false);
  }

  function resize() {
    if (canvasRef.current && upcomingRef.current) {
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      upcomingRef.current.width = upcomingRef.current.clientWidth;
      upcomingRef.current.height = upcomingRef.current.clientHeight;
      dx = canvasRef.current.width / nx;
      dy = canvasRef.current.height / ny;
      invalidate();
      invalidateNext();
    }
  }

  function keydown(ev) {
    if (playing && !isPaused) {
      switch (ev.keyCode) {
        case KEY.LEFT:
          actions.push(DIR.LEFT);
          break;
        case KEY.RIGHT:
          actions.push(DIR.RIGHT);
          break;
        case KEY.UP:
          actions.push(DIR.UP);
          break;
        case KEY.DOWN:
          actions.push(DIR.DOWN);
          break;
        case KEY.ESC:
          lose();
          break;
      }
    } else if (ev.keyCode === KEY.SPACE) {
      play();
    }
    ev.preventDefault();
  }

  function play() {
    hide('start');
    setIsPaused(false);
    reset();
    playing = true;
  }

  function lose() {
    show('start');
    setVisualScore();
    playing = false;
  }

  function setVisualScore(n) {
    vscore = n || score;
    invalidateScore();
  }

  function setScore(n) {
    score = n;
    setVisualScore(n);
  }

  function addScore(n) {
    score = score + n;
  }

  function clearScore() {
    setScore(0);
  }

  function clearRows() {
    setRows(0);
  }

  function setRows(n) {
    rows = n;
    step = Math.max(speed.min, speed.start - speed.decrement * rows);
    invalidateRows();
  }

  function addRows(n) {
    setRows(rows + n);
  }

  function getBlock(x, y) {
    return blocks && blocks[x] ? blocks[x][y] : null;
  }

  function setBlock(x, y, type) {
    blocks[x] = blocks[x] || [];
    blocks[x][y] = type;
    invalidate();
  }

  function clearBlocks() {
    blocks = [];
    invalidate();
  }

  function clearActions() {
    actions = [];
  }

  function setCurrentPiece(piece) {
    current = piece || randomPiece();
    invalidate();
  }

  function setNextPiece(piece) {
    next = piece || randomPiece();
    invalidateNext();
  }

  function reset() {
    dt = 0;
    clearActions();
    clearBlocks();
    clearRows();
    clearScore();
    setCurrentPiece(next);
    setNextPiece();
  }

  function update(idt) {
    if (playing && !isPaused) {
      if (vscore < score) setVisualScore(vscore + 1);
      handle(actions.shift());
      dt = dt + idt;
      if (dt > step) {
        dt = dt - step;
        drop();
      }
    }
  }

  function handle(action) {
    switch (action) {
      case DIR.LEFT:
        move(DIR.LEFT);
        break;
      case DIR.RIGHT:
        move(DIR.RIGHT);
        break;
      case DIR.UP:
        rotate();
        break;
      case DIR.DOWN:
        drop();
        break;
    }
  }

  function move(dir) {
    const x = current.x,
      y = current.y;
    let newX = x;
    let newY = y;
    switch (dir) {
      case DIR.RIGHT:
        newX = x + 1;
        break;
      case DIR.LEFT:
        newX = x - 1;
        break;
      case DIR.DOWN:
        newY = y + 1;
        break;
    }
    if (unoccupied(current.type, newX, newY, current.dir)) {
      current.x = newX;
      current.y = newY;
      invalidate();
      return true;
    } else {
      return false;
    }
  }

  function rotate() {
    const newdir = current.dir === DIR.MAX ? DIR.MIN : current.dir + 1;
    if (unoccupied(current.type, current.x, current.y, newdir)) {
      current.dir = newdir;
      invalidate();
    }
  }

  function drop() {
    if (!move(DIR.DOWN)) {
      addScore(10);
      dropPiece();
      removeLines();
      setCurrentPiece(next);
      setNextPiece(randomPiece());
      clearActions();
      if (occupied(current.type, current.x, current.y, current.dir)) {
        lose();
      }
    }
  }

  function dropPiece() {
    eachblock(current.type, current.x, current.y, current.dir, function(x, y) {
      setBlock(x, y, current.type);
    });
  }

  function removeLines() {
    let x, y, complete, n = 0;
    for (y = ny; y > 0; --y) {
      complete = true;
      for (x = 0; x < nx; ++x) {
        if (!getBlock(x, y)) complete = false;
      }
      if (complete) {
        removeLine(y);
        y = y + 1; // recheck same line
        n++;
      }
    }
    if (n > 0) {
      addRows(n);
      addScore(100 * Math.pow(2, n - 1)); // 1: 100, 2: 200, 3: 400, 4: 800
    }
  }

  function removeLine(n) {
    let x, y;
    for (y = n; y >= 0; --y) {
      for (x = 0; x < nx; ++x) setBlock(x, y, y === 0 ? null : getBlock(x, y - 1));
    }
  }

  const invalid = {};

  function invalidate() {
    invalid.court = true;
  }

  function invalidateNext() {
    invalid.next = true;
  }

  function invalidateScore() {
    invalid.score = true;
  }

  function invalidateRows() {
    invalid.rows = true;
  }

  function draw() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5); // für scharfe 1px schwarze Linien
    drawCourt();
    drawNext();
    drawScore();
    drawRows();
    ctx.restore();
  }

  function drawCourt() {
    if (invalid.court) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (playing) drawPiece(ctx, current.type, current.x, current.y, current.dir);
      let x, y, block;
      for (y = 0; y < ny; y++) {
        for (x = 0; x < nx; x++) {
          block = getBlock(x, y);
          if (block) drawBlock(ctx, x, y, block.color);
        }
      }
      ctx.strokeRect(0, 0, nx * dx - 1, ny * dy - 1); // Spielfeldbegrenzung
      invalid.court = false;
    }
  }

  function drawNext() {
    if (invalid.next) {
      const padding = (nu - next.type.size) / 2; // Einfacher Versuch, die Anzeige des nächsten Stücks zu zentrieren
      uctx.save();
      uctx.translate(0.5, 0.5);
      uctx.clearRect(0, 0, nu * dx, nu * dy);
      drawPiece(uctx, next.type, padding, padding, next.dir);
      uctx.strokeStyle = 'black';
      uctx.strokeRect(0, 0, nu * dx - 1, nu * dy - 1);
      uctx.restore();
      invalid.next = false;
    }
  }

  function drawScore() {
    if (invalid.score) {
      html('score', ('00000' + Math.floor(vscore)).slice(-5));
      invalid.score = false;
    }
  }

  function drawRows() {
    if (invalid.rows) {
      html('rows', rows);
      invalid.rows = false;
    }
  }

  function drawPiece(ctx, type, x, y, dir) {
    eachblock(type, x, y, dir, function(x, y) {
      drawBlock(ctx, x, y, type.color);
    });
  }

  function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * dx, y * dy, dx, dy);
    ctx.strokeRect(x * dx, y * dy, dx, dy);
  }

  function frame() {
    const now = timestamp();
    update(Math.min(1, (now - dt) / 1000.0)); // requestAnimationFrame muss große Deltas verarbeiten können, die auftreten, wenn es im Hintergrund oder in einem nicht sichtbaren Tab "hiberniert"
    draw();
    if (!isPaused) {
      requestAnimationFrame(frame);
    }
  }

  function togglePause() {
    setIsPaused(!isPaused);
    if (!isPaused) {
      frame(); // Spielschleife fortsetzen
    }
  }

  return (
    <div id="tetris">
      <div id="menu">
        <p id="start">
          <button onClick={play}>Start</button>
        </p>
        <p id="pause">
          <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
        </p>
        <p>
          <canvas id="upcoming" ref={upcomingRef}></canvas>
        </p>
        <p>
          score <span id="score">00000</span>
        </p>
        <p>
          rows <span id="rows">0</span>
        </p>
      </div>
      <canvas id="canvas" ref={canvasRef}>
        Sorry, this example cannot be run because your browser does not support
        the &lt;canvas&gt; element
      </canvas>
    </div>
  );
}

export default Tetris;
