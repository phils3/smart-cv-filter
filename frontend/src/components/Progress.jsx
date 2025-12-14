import React from 'react'

export default function Progress() {
  return (
    <div style={{
        border:"1px solid #33FFC2",
        borderRadius:"20px",
        color:"white",
        background:"rgba(88, 86, 86, 0.6)",
        backdropFilter:"blur(40px)",
        WebkitBackdropFilter:"blur(40px)",
        width:"25vw",
        height:"10vh",
        display:"flex",
        flexDirection:"column",
        padding:"1vh 2vw",
        boxShadow:"inset 0 -10px 30px rgba(50, 252, 192, 0.4), inset 0 10px 30px rgba(50, 252, 192, 0.4)",
        
    }}>
        <div style={{display:"flex",padding:"1vh 2vw",alignItems:"center",gap:"2vw",fontSize:"1rem",position:"relative"}}> 
            <svg width="72" height="60" viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_33_76" fill="white">
                <path d="M28.1536 0C29.3452 0 30.4976 0.425568 31.4033 1.20003L38.5967 7.35173C39.5024 8.12619 40.6548 8.55176 41.8464 8.55176H67C69.7614 8.55176 72 10.7903 72 13.5518V21.5117C72 24.2731 69.7614 26.5117 67 26.5117H5C2.23857 26.5117 0 24.2731 0 21.5117V5C0 2.23858 2.23858 0 5 0H28.1536Z"/>
                </mask>
                <path d="M28.1536 0C29.3452 0 30.4976 0.425568 31.4033 1.20003L38.5967 7.35173C39.5024 8.12619 40.6548 8.55176 41.8464 8.55176H67C69.7614 8.55176 72 10.7903 72 13.5518V21.5117C72 24.2731 69.7614 26.5117 67 26.5117H5C2.23857 26.5117 0 24.2731 0 21.5117V5C0 2.23858 2.23858 0 5 0H28.1536Z" fill="url(#paint0_linear_33_76)"/>
                <path d="M31.4033 1.20003L31.1433 1.50402L31.4033 1.20003ZM31.4033 1.20003L31.1433 1.50402L38.3368 7.65573L38.5967 7.35173L38.8567 7.04773L31.6632 0.896028L31.4033 1.20003ZM41.8464 8.55176V8.95176H67V8.55176V8.15176H41.8464V8.55176ZM72 13.5518H71.6V21.5117H72H72.4V13.5518H72ZM67 26.5117V26.1117H5V26.5117V26.9117H67V26.5117ZM0 21.5117H0.4V5H0H-0.4V21.5117H0ZM5 0V0.4H28.1536V0V-0.4H5V0ZM0 5H0.4C0.4 2.45949 2.45949 0.4 5 0.4V0V-0.4C2.01766 -0.4 -0.4 2.01766 -0.4 5H0ZM5 26.5117V26.1117C2.45949 26.1117 0.4 24.0522 0.4 21.5117H0H-0.4C-0.4 24.4941 2.01766 26.9117 5 26.9117V26.5117ZM72 21.5117H71.6C71.6 24.0522 69.5405 26.1117 67 26.1117V26.5117V26.9117C69.9823 26.9117 72.4 24.4941 72.4 21.5117H72ZM67 8.55176V8.95176C69.5405 8.95176 71.6 11.0112 71.6 13.5518H72H72.4C72.4 10.5694 69.9823 8.15176 67 8.15176V8.55176ZM38.5967 7.35173L38.3368 7.65573C39.3148 8.49214 40.5595 8.95176 41.8464 8.95176V8.55176V8.15176C40.7501 8.15176 39.6899 7.76024 38.8567 7.04773L38.5967 7.35173ZM31.4033 1.20003L31.6632 0.896028C30.6852 0.0596131 29.4405 -0.4 28.1536 -0.4V0V0.4C29.2499 0.4 30.3101 0.791522 31.1433 1.50402L31.4033 1.20003Z" fill="#31D09E" mask="url(#path-1-inside-1_33_76)"/>
                <rect x="0.25" y="16.25" width="71.5" height="43.5" rx="9.75" fill="url(#paint1_linear_33_76)" stroke="url(#paint2_linear_33_76)" stroke-width="0.5"/>
                <defs>
                <linearGradient id="paint0_linear_33_76" x1="36" y1="0" x2="36" y2="24.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0E5B47"/>
                <stop offset="1" stop-color="#0C2720"/>
                </linearGradient>
                <linearGradient id="paint1_linear_33_76" x1="8" y1="22" x2="62" y2="60" gradientUnits="userSpaceOnUse">
                <stop stop-color="#2D9C7E"/>
                <stop offset="1" stop-color="#0C2720"/>
                </linearGradient>
                <linearGradient id="paint2_linear_33_76" x1="36" y1="16" x2="36" y2="60" gradientUnits="userSpaceOnUse">
                <stop stop-color="#33FFC2"/>
                <stop offset="1" stop-color="#2E9974"/>
                </linearGradient>
                </defs>
            </svg>
            <span style={{borderRadius:"5px",background:"rgba(48,48,48,0.6)",backdropFilter:"blur(40px)",
        WebkitBackdropFilter:"blur(40px)",padding:"0.1rem 0.4rem",fontSize:"0.8rem",textAlign:"center",left:"1.4vh",position:"absolute",top:"3vh"}}>PDF</span>
            <p>Fájl neve</p>
        </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spinIcon { animation: spin 1s linear infinite; display: block; }
                `}</style>

                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes dot { 0% { opacity: 0; } 30% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
                    @keyframes fadeOut { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }
                    .spinIcon { animation: spin 1s linear infinite; display: block; }
                    .dots span { opacity: 0; animation: dot 1.2s linear infinite; }
                    .dots span:nth-child(1) { animation-delay: 0s;margin-left:10px; }
                    .dots span:nth-child(2) { animation-delay: 0.3s; }
                    .dots span:nth-child(3) { animation-delay: 0.6s; }
                    
                `}</style>

                <div style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center',width:'100%'}}>
                    <svg className="spinIcon" width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
                        <defs>
                            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1E9C78" />
                                <stop offset="50%" stopColor="#32FFC0" />
                                <stop offset="100%" stopColor="#0E5B47" />
                            </linearGradient>
                        </defs>
                        <circle cx="18" cy="18" r="15" fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" />
                    </svg>

                    <div className="textWrap" style={{fontSize:"1.6rem",textAlign:'center',marginTop:0,marginBottom:0}}>
                        <span>Analyzing</span>
                        <span className="dots" aria-hidden="true" style={{display:'inline-flex',gap:4,fontWeight:700}}>
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </div>
                </div>
    </div>
  )
}
