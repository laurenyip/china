import * as React from "react";

interface TreeCardLayoutProps {
  cards: React.ReactNode[];
}

// Levels: [2, 8, 8, 18, ...] (bottom-up)
function getTreeLevels(cards: React.ReactNode[]): React.ReactNode[][] {
  const levels: number[] = [2, 8, 8, 18];
  let result: React.ReactNode[][] = [];
  let remaining = cards.length;
  let idx = 0;
  let start = 0;
  while (remaining > 0) {
    const count = levels[idx] || 18; // After level 4, keep adding 18 at the top
    const end = start + count;
    result.push(cards.slice(start, end));
    remaining -= (end - start);
    start = end;
    idx = Math.min(idx + 1, levels.length - 1);
  }
  return result.reverse(); // So that smallest row is at the bottom
}

const connectorColor = "#142a63"; // dark blue

export const TreeCardLayout: React.FC<TreeCardLayoutProps> = ({ cards }) => {
  const levels = getTreeLevels(cards);
  // Calculate positions for SVG lines
  const cardWidth = 200; // px (smaller for space efficiency)
  const cardHeight = 240; // px
  const vSpacing = 40; // px vertical space between levels

  // Get card positions for each level (bottom row is smallest, tree grows upward)
  const maxRowLen = Math.max(...levels.map(l => l.length));
  const totalHeight = levels.length * (cardHeight + vSpacing);
  const positions: { x: number; y: number }[][] = levels.map((row, i) => {
    const totalWidth = row.length * cardWidth + (row.length - 1) * 16;
    const x0 = (maxRowLen * cardWidth + (maxRowLen - 1) * 16 - totalWidth) / 2;
    // y = totalHeight - (i+1)*(cardHeight+vSpacing) so bottom row is at bottom
    return row.map((_, j) => ({ x: x0 + j * (cardWidth + 16), y: totalHeight - (i + 1) * (cardHeight + vSpacing) }));
  });

  // Collect SVG paths for connectors
  const connectors: JSX.Element[] = [];
  for (let i = 0; i < positions.length - 1; ++i) {
    const children = positions[i];
    const parents = positions[i + 1];
    // Connect each child to its parent(s) above
    const ratio = parents.length / children.length;
    children.forEach((child, ci) => {
      const parentIdx = Math.floor(ci * ratio);
      if (parents[parentIdx]) {
        // Draw a curved path from parent to child (now parent is above)
        const x1 = parents[parentIdx].x + cardWidth / 2;
        const y1 = parents[parentIdx].y + cardHeight;
        const x2 = child.x + cardWidth / 2;
        const y2 = child.y;
        const mx = (x1 + x2) / 2;
        connectors.push(
          <path
            key={`conn-${i}-${ci}`}
            d={`M${x2},${y2} C${mx},${y2 - 30} ${mx},${y1 + 30} ${x1},${y1}`}
            stroke={connectorColor}
            strokeWidth={1.5}
            fill="none"
          />
        );
      }
    });
  }

  const svgWidth = Math.max(...positions.map(row => row.length * (cardWidth + 40))) + 40;
  const svgHeight = positions.length * (cardHeight + vSpacing);

  return (
    <div style={{ position: "relative", width: svgWidth, height: svgHeight }}>
      <svg
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }}
        width={svgWidth}
        height={svgHeight}
      >
        {connectors}
      </svg>
      {positions.map((row, i) =>
        row.map((pos, j) => (
          <div
            key={`card-${i}-${j}`}
            style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 1 }}
          >
            {levels[i][j]}
          </div>
        ))
      )}
    </div>
  );
};
