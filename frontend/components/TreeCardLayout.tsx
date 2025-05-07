import * as React from "react";

interface TreeCardLayoutProps {
  cards: React.ReactNode[];
}

// Levels: [18, 8, 8, 4, 2] (bottom-up, widest at top, root at bottom)
function getTreeLevels(cards: React.ReactNode[]): React.ReactNode[][] {
  const levels = [8, 8, 8, 4, 2]; // bottom-up
  let result: React.ReactNode[][] = [];
  let remaining = cards.length;
  let idx = 0;
  let start = 0;
  while (remaining > 0) {
    // After the first 5 rows, keep adding 18 at the top
    const count = idx < levels.length ? levels[idx] : 18;
    const end = start + count;
    result.push(cards.slice(start, end));
    remaining -= (end - start);
    start = end;
    idx++;
  }
  return result.reverse(); // So that the widest row is at the top
}

const connectorColor = "#142a63"; // dark blue

import { FlipCard } from "./FlipCard";

export const TreeCardLayout: React.FC<TreeCardLayoutProps> = ({ cards }) => {
  const levels = getTreeLevels(cards);
  // Calculate positions for SVG lines
  // Responsive card size and gap based on viewport
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxRowLen = Math.max(...levels.map(l => l.length));
  const maxCardWidth = 110;
  const minCardWidth = 60;
  const maxGap = 40;
  const minGap = 12;
  // Calculate cardWidth and gap so that the widest row fits the viewport
  let cardWidth = Math.min(maxCardWidth, Math.max(minCardWidth, Math.floor((viewportWidth - (maxRowLen - 1) * minGap) / maxRowLen) - minGap));
  let gap = Math.max(minGap, Math.min(maxGap, Math.floor((viewportWidth - maxRowLen * cardWidth) / (maxRowLen - 1))));
  const cardHeight = cardWidth; // keep square
  const vSpacing = cardHeight * 0.4 + 14; // vertical space between levels

  // Get card positions for each level (bottom row is smallest, tree grows upward)
  const totalHeight = levels.length * (cardHeight + vSpacing);
  const positions: { x: number; y: number }[][] = levels.map((row, i) => {
    const totalWidth = row.length * cardWidth + (row.length - 1) * gap;
    const x0 = (viewportWidth - totalWidth) / 2;
    // y = totalHeight - (i+1)*(cardHeight+vSpacing) so bottom row is at bottom
    return row.map((_, j) => ({ x: x0 + j * (cardWidth + gap), y: totalHeight - (i + 1) * (cardHeight + vSpacing) }));
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
        row.map((pos, j) => {
          const card = levels[i][j];
          // Expect card to be an object with character, pinyin, definition, notes
          // If not, just render as is
          if (card && typeof card === "object" && "props" in card && card.props.character) {
            return (
              <div
                key={`card-${i}-${j}`}
                style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 1 }}
              >
                <FlipCard
                  character={card.props.character}
                  pinyin={card.props.pinyin}
                  definition={card.props.definition}
                  notes={card.props.note || card.props.notes}
                  onNoteChange={card.props.onNoteChange}
                />
              </div>
            );
          }
          return (
            <div
              key={`card-${i}-${j}`}
              style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 1 }}
            >
              {card}
            </div>
          );
        })
      )}
    </div>
  );
};
