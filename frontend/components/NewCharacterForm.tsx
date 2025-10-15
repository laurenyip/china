import * as React from "react";

interface NewCharacterFormProps {
  character: string;
  initialPinyin?: string;
  initialDefinition?: string;
  onSave: (character: { character: string; pinyin: string; definition: string }) => void;
  onCancel: () => void;
}

export const NewCharacterForm: React.FC<NewCharacterFormProps> = ({
  character,
  initialPinyin = "",
  initialDefinition = "",
  onSave,
  onCancel
}) => {
  const [pinyin, setPinyin] = React.useState(initialPinyin);
  const [definition, setDefinition] = React.useState(initialDefinition);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinyin.trim() && definition.trim()) {
      onSave({ character, pinyin: pinyin.trim(), definition: definition.trim() });
    }
  };

  return (
    <div className="suggestion-card" style={{ cursor: 'default', marginBottom: '1rem', maxWidth: '400px', padding: '1.5rem' }}>
      <div className="suggestion-character">{character}</div>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', color: '#5a6a7f', fontSize: '0.9rem' }}>
            Pinyin:
          </label>
          <input
            type="text"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            placeholder="Enter pinyin..."
            style={{
              width: '100%',
              padding: '0.4rem',
              border: '2px solid #d0d5db',
              borderRadius: '6px',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#5a6a7f'}
            onBlur={(e) => e.target.style.borderColor = '#d0d5db'}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', color: '#5a6a7f', fontSize: '0.9rem' }}>
            English Meaning:
          </label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Enter English meaning..."
            style={{
              width: '100%',
              padding: '0.4rem',
              border: '2px solid #d0d5db',
              borderRadius: '6px',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              minHeight: '60px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#5a6a7f'}
            onBlur={(e) => e.target.style.borderColor = '#d0d5db'}
            required
          />
        </div>

        <div className="suggestion-buttons">
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Save
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
