import * as React from "react";
import { JSX } from "react";

interface TreeCardLayoutProps {
  cards: React.ReactNode[];
}

// Custom tree logic: bottom is narrower (4 words), top has more capacity (8 words per row)
// New words are added to the top of the tree
function getTreeLevels(cards: React.ReactNode[]): React.ReactNode[][] {
  // Reverse the cards array so newest words appear at the top
  const reversedCards = [...cards].reverse();
  
  if (reversedCards.length <= 4) {
    return [reversedCards];
  } else {
    // Bottom layer: 4 cards (root, horizontal)
    const bottomLayer = reversedCards.slice(reversedCards.length - 4);
    
    // Remaining cards go to upper layers, 8 per row
    const remainingCards = reversedCards.slice(0, reversedCards.length - 4);
    const upperLayers: React.ReactNode[][] = [];
    
    // Create layers of 8 cards each for the remaining cards
    for (let i = 0; i < remainingCards.length; i += 8) {
      upperLayers.push(remainingCards.slice(i, i + 8));
    }
    
    // Return with bottom layer at the end (bottom of the tree)
    return [...upperLayers, bottomLayer];
  }
}

const connectorColor = "#5a6a7f"; // new theme color

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
    <div className="tree-container" style={{ position: "relative", width: svgWidth, height: svgHeight }}>
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
          // Expect card to be an object with character, pinyin, definition, notes, created_at
          if (card && typeof card === "object" && "props" in card && (card as any).props.character) {
            const props = (card as any).props;
            return (
              <div
                key={`card-${i}-${j}`}
                className={`char-node level-${Math.min(i + 1, 4)}`}
                style={{ 
                  position: "absolute", 
                  left: pos.x, 
                  top: pos.y, 
                  zIndex: 1, 
                  textAlign: "center",
                  animationDelay: `${j * 0.1}s`
                }}
              >
                <FlipCard
                  character={props.character}
                  pinyin={props.pinyin}
                  definition={props.definition}
                  notes={props.note || props.notes}
                  onNoteChange={props.onNoteChange}
                  onRemove={props.onRemove}
                  learnedDate={props.learnedDate}
                />
              </div>
            );
          }
          return (
            <div
              key={`card-${i}-${j}`}
              className={`char-node level-${Math.min(i + 1, 4)}`}
              style={{ 
                position: "absolute", 
                left: pos.x, 
                top: pos.y, 
                zIndex: 1, 
                textAlign: "center",
                animationDelay: `${j * 0.1}s`
              }}
            >
              {card}
            </div>
          );
        })
      )}
    </div>
  );
};
