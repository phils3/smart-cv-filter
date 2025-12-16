import React, { useState, useEffect } from 'react'
import Header from '../components/header';
import UploadCvButton from '../components/UploadCvButton';
import PdfViewer from '../components/PdfViewer';
import UploadRequirments from '../components/UploadRequirments';
import InfoBox from '../components/InfoBox';
import JsonViewer from '../components/JsonViewer';
import Progress2 from './Progress2';
import { useAdatok } from './adatok';

export default function Content() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [requirementsFile, setRequirementsFile] = useState(null)
  const [resultData, setResultData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setAdatok, setAppHeight } = useAdatok()
  const [viewMode, setViewMode] = useState('pdf') // 'pdf' vagy 'json'
  const [heightOption, setHeightOption] = useState('both') 

  const hasPdf = Boolean(selectedFile)
  const hasJson = Boolean(requirementsFile)
  const activeHasFile = viewMode === 'pdf' ? hasPdf : hasJson
  const containerHeight = activeHasFile ? '100%' : '100vh'
  

  // analizálás elinditása, mikor mind2 fájl fel lett töltve
  useEffect(() => {
    let cancelled = false;

    const analyze = async () => {
      if (!selectedFile || !requirementsFile) return;

      setIsLoading(true);
      setResultData(null);
      setAdatok({ score: null, suitability: null, completedRequirements: [] });

      try {
        const formData = new FormData();
        formData.append('cv_file', selectedFile);
        formData.append('skills_file', requirementsFile);

        const res = await fetch('http://127.0.0.1:8000/analyze-cv', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Hiba a backendről');
        const data = await res.json();

        if (cancelled) return;

        setResultData(data);

        
        console.log('--- Analízis eredmények ---');
        console.log('Extracted skills:', data.extracted_skills);
        console.log('Required done:', data.required_done);
        console.log('Optional done:', data.optional_done);
        console.log('Required progress:', data.required_progress);
        console.log('Optional progress:', data.optional_progress);
        console.log('Score:', data.score);
        console.log('Category:', data.category);
        console.log('Explanation:', data.explanation);

       
      const score = data.score ?? null;
      const suitability = data.category ?? null;
      const explanation = data.hr_summary  ?? ''; 
      const completedRequirements = [
        ...(Array.isArray(data.required_done) ? data.required_done : []),
        ...(Array.isArray(data.optional_done) ? data.optional_done : [])
      ];

      setAdatok({ score, suitability, completedRequirements, explanation });

      } catch (err) {
        console.error('Analízis hiba:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    analyze();

    return () => { cancelled = true; };
  }, [selectedFile, requirementsFile]);

  useEffect(() => {
    
    setAppHeight(containerHeight);
  }, [containerHeight, setAppHeight]);

  return (
    <div style={{ height: containerHeight, margin: 'none', padding: 'none', display: 'flex', gap: 24, flexDirection:"column", alignItems:"center", zIndex:"1", position:"relative"}}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <Header />
        <div style={{display:"flex",justifyContent:"space-evenly",width:"50vw",margin:"10vh 5vw 1vh 5vw",alignItems:"center",gap:"10px",color:"#CFC6C6",fontWeight:"600"}}>
          <UploadCvButton onFileSelected={setSelectedFile} />
           <span>and</span>
          <UploadRequirments onFileSelected={setRequirementsFile} />
        </div>

        {/* Status message */}
        <div style={{ width: '50vw', marginTop: 0, color: '#ffffffff', textAlign: 'center', fontSize: 18 }}>
          {!selectedFile && !requirementsFile && <div>Kérlek tölts fel egy CV (PDF) és egy Requirements (JSON) fájlt a folytatáshoz.</div>}
          {selectedFile && !requirementsFile && <div>Várja: Requirements (JSON) fájl feltöltését.</div>}
          {!selectedFile && requirementsFile && <div>Várja: CV (PDF) fájl feltöltését.</div>}
          {selectedFile && requirementsFile && !isLoading && !resultData && <div>Mindkét fájl feltöltve — az analízis elindul.</div>}
          {isLoading && <div>Analízis folyamatban... Kérlek várj.</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 ,marginTop:"-0vh"}}>
          <p style={{ margin: 0, color: '#ffffffff', fontWeight: 700 }}>{viewMode === 'json' ? 'JSON view' : 'PDF view'}</p>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <button
              onClick={() => setViewMode(prev => prev === 'pdf' ? 'json' : 'pdf')}
              style={{
                width: '105px',
                height: '2.6vh',
                borderRadius: '20px',
                background: 'rgba(54, 66, 66, 0.7)',
                backdropFilter:"blur(40px)",
                WebkitBackdropFilter:"blur(40px)",
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#CFC6C6',
                position: 'relative',
                padding: '4px',
                boxShadow:"inset -3px -8px 6px rgba(4, 19, 19, 0.25)",
                border:"1px solid rgba(102, 102, 102, 1)"
              }}
            >
              <span
                style={{
                  marginLeft: viewMode === 'pdf' ? "0vw" : '70px',
                  width: '25px',
                  height: '25px',
                  borderRadius: '50%',
                  background: '#1E9C78',
                  display: 'block',
                  transition: '180ms ease'
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, display:"flex", flexDirection:"column", alignItems:"center", gap:"2vh"}}>
         {isLoading && <Progress2 />}  
        
      {!isLoading && resultData && <InfoBox result={{
        score: resultData.score,
        category: resultData.category,
        completedRequirements: [
          ...(Array.isArray(resultData.required_done) ? resultData.required_done : []),
          ...(Array.isArray(resultData.optional_done) ? resultData.optional_done : [])
        ],
        explanation: resultData.hr_summary 
      }} />}

        <div style={{borderRadius:"15px",background: "linear-gradient(to bottom, rgba(156, 155, 155, 1) , rgba(102, 102, 102, 1) )",padding:"1px", overflow: 'visible'}}>
          <div style={{background:"rgba(54, 66, 66, 1)",borderRadius:"15px",padding:"0.6vh 0.6vw",boxShadow:"0 4px 30px rgba(0, 0, 0, 0.1)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",display:"flex",justifyContent:"center",alignItems:"center",width:"62vw",maxHeight:"82vh", overflow: 'visible'}}>
            {viewMode === 'pdf' ? (
              <PdfViewer file={selectedFile} />
            ) : (
              <JsonViewer file={requirementsFile} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
