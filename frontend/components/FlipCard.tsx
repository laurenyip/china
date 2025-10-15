import * as React from "react";

interface FlipCardProps {
  character: string;
  pinyin?: string;
  definition?: string;
  notes?: string;
  onNoteChange?: (val: string) => void;
  onRemove?: () => void;
  learnedDate?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  character,
  pinyin,
  definition,
  notes,
  onNoteChange,
  onRemove,
  learnedDate
}) => {
  const [flipped, setFlipped] = React.useState(false);

  return (
    <div
      className="card-container"
      style={{
        display: 'inline-block',
        position: 'relative',
        width: '90px',
        height: '90px'
      }}
      onClick={() => setFlipped(f => !f)}
    >
      {/* Card Back (Blue base) */}
      <div
        className="card-back"
        style={{
          background: '#6b7a8f',
          border: '8px solid #5a6a7f',
          borderRadius: '20px',
          padding: '0.75rem',
          width: '80px',
          height: '80px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div
          className="card-label"
          style={{
            position: 'absolute',
            top: '-1.5rem',
            left: '0.75rem',
            fontSize: '0.7rem',
            color: '#b8b8b8',
            background: 'transparent',
            padding: '0.2rem 0',
            whiteSpace: 'nowrap',
            fontWeight: '400'
          }}
        >
          {learnedDate ? new Date(learnedDate).toLocaleDateString() : ''}
        </div>
        <div
          className="character"
          style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#ffffff',
            lineHeight: 1,
            fontFamily: 'MF Yansong, serif'
          }}
        >
          {character}
        </div>
      </div>

      {/* Card Front (White overlay) */}
      <div
        className="card-front"
        style={{
          background: 'white',
          border: '8px solid #6b7a8f',
          borderRadius: '20px',
          padding: '0.75rem',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          position: 'absolute',
          top: '5px',
          left: '5px',
          zIndex: 2,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div
          className="card-label"
          style={{
            position: 'absolute',
            top: '-1.5rem',
            right: '0.5rem',
            fontSize: '0.7rem',
            color: '#b8b8b8',
            background: 'transparent',
            padding: '0.2rem 0',
            whiteSpace: 'nowrap',
            fontWeight: '400'
          }}
        >
          {learnedDate ? new Date(learnedDate).toLocaleDateString() : ''}
        </div>
        <div
          className="character"
          style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#000000',
            lineHeight: 1,
            fontFamily: 'MF Yansong, serif'
          }}
        >
          {character}
        </div>
      </div>
    </div>
  );
};
