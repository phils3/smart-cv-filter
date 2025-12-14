import React, { useEffect, useState } from 'react'

export default function JsonViewer({ file, parsedJson, options = {} }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setError('')
    setData(null)

    const load = async () => {
      try {
        if (parsedJson) {
          setData(parsedJson)
          return
        }
        if (!file) return
        const text = await file.text()
        if (cancelled) return
        const parsed = JSON.parse(text)
        setData(parsed)
      } catch (err) {
        console.error('JsonViewer parse error:', err)
        setError('Érvénytelen JSON fájl vagy parse hiba.')
      }
    }

    load()
    return () => { cancelled = true }
  }, [file, parsedJson])

  if (error) return <div style={{ color: '#ff6b6b' }}>{error}</div>
  if (!data) return <div style={{ color: '#CFC6C6' }}>Nincs megjelenítendő JSON.</div>

  const pretty = JSON.stringify(data, null, options.space ?? 2)

  return (
    <div style={{
      background: '#111615',
      color: '#E6E6E6',
      padding: 16,
      borderRadius: 12,
      width: '60vw',
      maxHeight: '70vh',
      overflow: 'auto',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono", monospace',
      fontSize: 13,
      boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
    }}>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{pretty}</pre>
    </div>
  )
}
