import * as React from "react";
import styles from "./FlipCard.module.css";

interface FlipCardProps {
  character: string;
  pinyin?: string;
  definition?: string;
  notes?: string;
  onNoteChange?: (val: string) => void;
  onRemove?: () => void;
  learnedDate?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ character, pinyin, definition, notes, onNoteChange, onRemove, learnedDate }) => {
  const [flipped, setFlipped] = React.useState(false);

  return (
    <div
      className={flipped ? `${styles.flipCard} ${styles.flipped}` : styles.flipCard}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <span className="char-node">{character}</span>
        </div>
        <div className={styles.flipCardBack}>
          {/* Delete X button in top-right */}
          {onRemove && (
            <button
              type="button"
              aria-label="Delete"
              onClick={e => { e.stopPropagation(); onRemove(); }}
              style={{ 
                position: 'absolute', 
                top: 8, 
                right: 12, 
                background: 'rgba(90, 106, 127, 0.1)', 
                border: 'none', 
                color: '#5a6a7f', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                zIndex: 2, 
                lineHeight: 1,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(90, 106, 127, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(90, 106, 127, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          )}
          <div className={styles.flipCardInfo}>
            {/* Character */}
            <div style={{ 
              fontSize: '26px', 
              fontFamily: 'MF Yansong, serif', 
              fontWeight: 'bold', 
              color: '#5a6a7f', 
              lineHeight: 1
            }}>
              {character}
            </div>
            
            {/* Definition (larger font) */}
            <div style={{ 
              fontSize: '12px', 
              fontFamily: 'Roboto Mono, monospace',
              color: '#333', 
              lineHeight: '1.2',
              textAlign: 'center',
              wordBreak: 'break-word'
            }}>
              {definition}
            </div>
            
            {/* Pinyin with speaker icon on the right */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '14px',
              fontFamily: 'Roboto Mono, monospace',
              color: '#5a6a7f'
            }}>
              <span>{pinyin}</span>
              <button
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(90, 106, 127, 0.1)',
                  border: '1px solid rgba(90, 106, 127, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Add audio functionality
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
            </div>
            
            {/* Notes textarea */}
            <textarea
              value={notes || ''}
              placeholder="Note..."
              style={{ 
                width: '100%', 
                height: '20px', 
                fontSize: '8px', 
                borderRadius: 4, 
                border: '1px solid rgba(90, 106, 127, 0.2)', 
                padding: '2px', 
                resize: 'none', 
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                fontFamily: 'Roboto Mono, monospace',
                lineHeight: '1.2'
              }}
              onClick={e => e.stopPropagation()}
              onChange={e => onNoteChange && onNoteChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
