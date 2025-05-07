import React from 'react';

interface TiltCardProps {
  character: string;
  pinyin?: string;
  definition?: string;
  created_at?: string;
  note: string;
  onNoteChange: (value: string) => void;
  onRemove?: () => void;
  editable?: boolean;
  onPinyinChange?: (value: string) => void;
  onDefinitionChange?: (value: string) => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({ character, pinyin, definition, created_at, note, onNoteChange, onRemove, editable, onPinyinChange, onDefinitionChange }) => {
  return (
    <div
      className="tilt-card w-80 h-96 bg-gradient-to-br from-purple-700 to-pink-500 rounded-2xl shadow-2xl border-2 border-black relative transition-transform duration-200 ease-out hover:scale-105"
    >
      {onRemove && (
        <button
          className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-7 h-7 flex items-center justify-center z-20 hover:bg-opacity-90 transition"
          onClick={onRemove}
          title="Remove"
        >
          &times;
        </button>
      )}
      <div className="p-6 flex flex-col h-full justify-between relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 text-center">{character}</h2>
          {editable ? (
            <input
              type="text"
              value={pinyin || ''}
              onChange={e => onPinyinChange && onPinyinChange(e.target.value)}
              className="w-full text-sm text-gray-900 bg-white bg-opacity-80 rounded px-2 py-1 mb-1 text-center border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pinyin"
              spellCheck={false}
            />
          ) : (
            <div className="text-sm text-gray-200 text-center mb-1">{pinyin}</div>
          )}
          {editable ? (
            <input
              type="text"
              value={definition || ''}
              onChange={e => onDefinitionChange && onDefinitionChange(e.target.value)}
              className="w-full text-xs text-gray-900 bg-white bg-opacity-80 rounded px-2 py-1 mb-2 text-center border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Definition"
              spellCheck={false}
            />
          ) : (
            <div className="text-xs text-gray-100 text-center mb-2">{definition}</div>
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs text-gray-300 uppercase">Added</div>
            <div className="text-xs font-bold text-white">{created_at ? new Date(created_at).toLocaleDateString() : 'Unknown'}</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3 flex flex-col">
            <textarea
              value={note}
              onChange={e => onNoteChange(e.target.value)}
              className="w-full bg-transparent text-xs text-white border-none outline-none resize-none placeholder-gray-400"
              placeholder="Write your notes here..."
              rows={2}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
