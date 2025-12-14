import React, { createContext, useContext, useState } from 'react'

const AdatokContext = createContext(null)

export function AdatokProvider({ children }) {
  const [adatok, setAdatok] = useState({
    score: null,
    suitability: null,
    completedRequirements: [],
  })
  const [fileName, setFileName] = useState('');
  return (
    <AdatokContext.Provider value={{ adatok, setAdatok, fileName, setFileName }}>
      {children}
    </AdatokContext.Provider>
  )
}

export function useAdatok() {
  const ctx = useContext(AdatokContext)
  if (!ctx) throw new Error('useAdatok must be used within AdatokProvider')
  return ctx
}
