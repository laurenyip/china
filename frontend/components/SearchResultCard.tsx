import * as React from "react";
import styles from "./FlipCard.module.css";

interface SearchResultCardProps {
  character: string;
  pinyin?: string;
  definition?: string;
  onAdd: () => void;
  onView?: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  character,
  pinyin,
  definition,
  onAdd,
  onView
}) => {
  return (
    <div className="suggestion-card" style={{ cursor: 'default', marginBottom: '1rem' }}>
      <div className="suggestion-character">{character}</div>
      <div className="suggestion-pinyin">{pinyin}</div>
      <div className="suggestion-definition">{definition}</div>
      <div className="suggestion-buttons">
        <button className="btn btn-primary" onClick={onAdd}>
          Add to Learned
        </button>
        {onView && (
          <button className="btn btn-secondary" onClick={onView}>
            View Details
          </button>
        )}
      </div>
    </div>
  );
};
