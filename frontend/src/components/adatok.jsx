import React, { createContext, useContext, useState } from 'react'

const AdatokContext = createContext(null)

export function AdatokProvider({ children }) {
  const [adatok, setAdatok] = useState({
    score: null,
    suitability: null,
    completedRequirements: [],
  })
  const [fileName, setFileName] = useState('');
  const [how_it_works_visible, set_how_it_works_visible] = useState(false);
  const [appHeight, setAppHeight] = useState('100vh');
  return (
    <AdatokContext.Provider value={{ adatok, setAdatok, fileName, setFileName, how_it_works_visible, set_how_it_works_visible, appHeight, setAppHeight }}>
      {children}
    </AdatokContext.Provider>
  )
}

export function useAdatok() {
  const ctx = useContext(AdatokContext)
  if (!ctx) throw new Error('useAdatok must be used within AdatokProvider')
  return ctx
}
