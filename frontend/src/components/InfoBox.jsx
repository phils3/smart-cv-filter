export default function InfoBox({ result }) {
  const score = result?.score ?? '-';
  const category = result?.category ?? '-';
  const completedRequirements = Array.isArray(result?.completedRequirements) ? result.completedRequirements : [];
  const explanation = result?.explanation ?? '';

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "1vh"}}>
        <div style={{ width: "63vw", display: "flex", justifyContent: "center", alignItems: "center", color: "#CFC6C6", fontSize: "14px", marginTop: "2vh", textAlign: "center", padding: "0px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{
            padding: "1vh 0.4vw",
            fontSize: "1rem",
            background: "rgba(54, 66, 66, 0.4)",
            borderRadius: "10px",
            border: "2px solid #757979",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)"
          }}>
            Score: <span style={{ color: "#32FCC0", fontSize: "1.3rem" }}>{score}</span>
          </p>
          <p style={{
            padding: "1vh 0.4vw",
            fontSize: "1rem",
            background: "rgba(54, 66, 66, 0.4)",
            borderRadius: "10px",
            border: "2px solid #757979",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)"
          }}>
            <span style={{ color: "#32FCC0", fontSize: "1.3rem" }}>{category}</span>
          </p>
        </div>

        <div style={{
          background: "rgba(54, 66, 66, 0.7)",
          borderRadius: "10px",
          border: "2px solid #757979",
          width: "50vw",
          minHeight: "10vh",
          padding: "1vh 1vw",
          marginLeft: "1vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          fontSize: "1.2rem"
        }}>
          <div style={{ marginBottom: 8 }}>Teljesített követelmények:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, width: "100%" }}>
            {completedRequirements.length === 0 && (
              <div style={{ color: '#CFC6C6', opacity: 0.7 }}>Nincsenek teljesített követelmények</div>
            )}
            {completedRequirements.map((s, idx) => (
              <div key={idx} style={{
                padding: '6px 8px',
                background: 'rgba(50,252,192,0.08)',
                border: '1px solid rgba(50,252,192,0.18)',
                borderRadius: 8,
                color: "#32FCC0",
                fontSize: '0.95rem',
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
          width:"35vw",
          height:"100%",
          borderRadius:"10px",
          border:"2px solid #757979",
          textAlign:"center",
          background: "rgba(54, 66, 66, 0.7)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          color: '#ffffffff',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1vh 1vw",
          lineHeight: "2rem",
          fontSize: "1.3rem",
          position:"relative",
        }}>
          <p style={{
            color: "#32FCC0",
            position:"absolute",
            top:-10,
            left:15,
            
          }}>Indoklás:</p>
          <p style={{marginTop:"3vh"}}>{explanation}</p>
        </div>
    </div>
   
  )
}
