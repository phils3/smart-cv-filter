import React, { useRef, useState } from 'react'

export default function UploadRequirments({ onFileSelected }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  function handleClick() {
    setError('')
    inputRef.current?.click()
  }

  function handleChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const isJson = file.type === 'application/json' || /\.json$/i.test(file.name)
    if (!isJson) {
      setError('Kérlek csak JSON fájlt tölts fel.')
      e.target.value = ''
      setFileName('')
      return
    }
    setError('')
    setFileName(file.name)
    if (onFileSelected) onFileSelected(file)
  }

  return (
    <div style={{zIndex:"1"}}>

      {/* Színátmenetes keret */}
      <div
        style={{
          width: "max-content",
          padding: "2px",
          borderRadius: "30px",
          cursor: "pointer",
          background: "linear-gradient(135deg, #989999 0%, #364242 25%, #364242 75%, #989999 100%)"
        }}
      >
        {/* A valódi button */}
        <button
          type="button"
          onClick={handleClick}
          style={{
            background: '#364242',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: "27px",
            boxShadow: 'inset 0 -8px 6px rgba(4, 19, 19, 0.25)',
            fontSize: "0.9rem",
            width: "100%",
          }}
        >
          Requirements (JSON)
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      
      {error && <div style={{ color: '#ff6b6b', marginTop: 6, fontSize: 13 }}>{error}</div>}
    </div>
  )
}
