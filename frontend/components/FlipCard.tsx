import * as React from "react";
import styles from "./FlipCard.module.css";

interface FlipCardProps {
  character: string;
  pinyin?: string;
  definition?: string;
  notes?: string;
  onNoteChange?: (val: string) => void;
  onRemove?: () => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ character, pinyin, definition, notes, onNoteChange, onRemove }) => {
  const [flipped, setFlipped] = React.useState(false);

  return (
    <div
      className={flipped ? `${styles.flipCard} ${styles.flipped}` : styles.flipCard}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <span>{character}</span>
        </div>
        <div className={styles.flipCardBack}>
          <div className={styles.flipCardInfo}>
            <div>{pinyin}</div>
            <div>{definition}</div>
            <div style={{ width: '100%' }}>
              <textarea
                value={notes || ''}
                placeholder="Add a note..."
                style={{ width: '100%', minHeight: 30, marginTop: 4, fontSize: '0.85rem', borderRadius: 4, border: '1px solid #b0b8d1', padding: 4, resize: 'none' }}
                onClick={e => e.stopPropagation()}
                onChange={e => onNoteChange && onNoteChange(e.target.value)}
              />
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onRemove(); }}
                style={{ marginTop: 8, background: '#fff', color: '#c00', border: '1px solid #c00', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
