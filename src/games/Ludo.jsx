"use client";
import React, { useState } from "react";

const BOARD_SIZE = 15;
const PLAYER_COLORS = ["red", "green", "yellow", "blue"];

// Helper to get cell type and color for Ludo layout
function getCellType(row, col) {
  // Home areas
  if (row < 6 && col < 6) return { type: "home", color: "yellow" };
  if (row < 6 && col > 8) return { type: "home", color: "green" };
  if (row > 8 && col < 6) return { type: "home", color: "blue" };
  if (row > 8 && col > 8) return { type: "home", color: "red" };

  // Center home triangle
  if (row >= 6 && row <= 8 && col >= 6 && col <= 8) return { type: "center", color: null };

  // Safe paths (colored)
  if (col === 7 && row < 6) return { type: "safe", color: "yellow" };
  if (row === 7 && col > 8) return { type: "safe", color: "green" };
  if (col === 7 && row > 8) return { type: "safe", color: "blue" };
  if (row === 7 && col < 6) return { type: "safe", color: "red" };

  // Main path (white)
  if (
    (row === 6 && col > 0 && col < 6) ||
    (row === 8 && col > 8 && col < 14) ||
    (col === 6 && row > 0 && row < 6) ||
    (col === 8 && row > 8 && row < 14) ||
    (row === 6 && col > 8 && col < 14) ||
    (row === 8 && col > 0 && col < 6) ||
    (col === 6 && row > 8 && row < 14) ||
    (col === 8 && row > 0 && row < 6)
  ) {
    return { type: "path", color: null };
  }

  // Entry squares (start positions)
  if ((row === 1 && col === 6) || (row === 6 && col === 13)) return { type: "start", color: "yellow" };
  if ((row === 6 && col === 1) || (row === 13 && col === 8)) return { type: "start", color: "blue" };
  if ((row === 8 && col === 13) || (row === 13 && col === 8)) return { type: "start", color: "red" };
  if ((row === 8 && col === 1) || (row === 1 && col === 8)) return { type: "start", color: "green" };

  // Default
  return { type: "blank", color: null };
}

// Initial positions for each player's 4 pieces (in their home area)
const initialPieces = {
  red: [196, 196 + 2, 196 + BOARD_SIZE * 2, 196 + BOARD_SIZE * 2 + 2],
  green: [2, 4, BOARD_SIZE * 2 + 2, BOARD_SIZE * 2 + 4],
  yellow: [0, 2, BOARD_SIZE * 2, BOARD_SIZE * 2 + 2],
  blue: [210, 212, 240, 242],
};

export default function Ludo() {
  // State for all pieces
  const [pieces, setPieces] = useState(initialPieces);
  const [selected, setSelected] = useState(null); // { color, index }

  // Handle piece selection
  const handlePieceClick = (color, idx) => {
    setSelected({ color, idx });
  };

  // Handle cell click for moving
  const handleCellClick = (cellIdx) => {
    if (!selected) return;
    // Move selected piece to new cell
    setPieces((prev) => {
      const newArr = [...prev[selected.color]];
      newArr[selected.idx] = cellIdx;
      return { ...prev, [selected.color]: newArr };
    });
    setSelected(null);
  };

  // Render board
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const idx = row * BOARD_SIZE + col;
      const { type, color } = getCellType(row, col);
      // Find if a piece is here
      let piece = null;
      let pieceColor = null;
      for (const clr of PLAYER_COLORS) {
        const pIdx = pieces[clr].findIndex((p) => p === idx);
        if (pIdx !== -1) {
          piece = pIdx;
          pieceColor = clr;
        }
      }
      // Cell color
      let cellClass = "border w-6 h-6 flex items-center justify-center cursor-pointer ";
      if (type === "home") cellClass += `bg-${color}-200`;
      else if (type === "safe") cellClass += `bg-${color}-400`;
      else if (type === "center") cellClass += "bg-gray-300";
      else if (type === "path") cellClass += "bg-white";
      else if (type === "start") cellClass += `bg-${color}-600`;
      else cellClass += "bg-gray-100";
      // Highlight selected piece
      if (selected && pieceColor === selected.color && piece === selected.idx) cellClass += " ring-4 ring-pink-400";
      board.push(
        <div
          key={idx}
          className={cellClass}
          onClick={() => (pieceColor ? handlePieceClick(pieceColor, piece) : handleCellClick(idx))}
          data-index={idx}
        >
          {pieceColor && (
            <span className={`rounded-full w-4 h-4 flex items-center justify-center bg-${pieceColor}-500 text-white text-xs font-bold`}>
              {pieceColor[0].toUpperCase()}
            </span>
          )}
        </div>
      );
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#181A20] overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Ludo Game</h1>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          width: 420,
          height: 420,
        }}
      >
        {board}
      </div>
      <div className="mt-4 text-gray-700">Click a piece to select, then click a cell to move it.</div>
    </div>
  );
}