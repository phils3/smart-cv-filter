import React, { useRef, useState } from 'react';
import "../index.css";
import { useAdatok } from './adatok';

export default function UploadCvButton({ onFileSelected }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  
  
  const { setFileName } = useAdatok()
 
  function handleClick() {
    setError('');
    inputRef.current?.click();
  }

  async function handleChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      setError('Kérlek csak PDF fájlt tölts fel.');
      e.target.value = '';
      setFileName('');
      return;
    }

    setError('');
    setFileName(file.name);
    // notify parent about selected file so PdfViewer can show it
    if (onFileSelected) onFileSelected(file);

    // notify parent about selected file so PdfViewer can show it
    if (onFileSelected) onFileSelected(file);
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"center", padding:"3px", borderRadius:"30px" }} className='border_div'>
        <button
          type="button"
          onClick={handleClick}
          style={{
            background: '#1E9C78',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            padding: '10px 18px',
            borderRadius: "30px",
            border: "3px solid #32FCC0",
            boxShadow: 'inset 0 -8px 6px rgba(4, 19, 19, 0.25)'
          }}
          className="no-scale"
        >
          Upload CV (PDF)
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      
      {error && <div style={{ color: '#ff6b6b', marginTop: 6, fontSize: 13 }}>{error}</div>}

     
    </div>
  );
}
