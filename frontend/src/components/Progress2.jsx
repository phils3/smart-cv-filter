import React from 'react'
import { useAdatok } from './adatok';
export default function Progress() {

     const { fileName } = useAdatok()
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
            {/* fájl "icon */}
            <div style={{width:"5vh",height:"6vh",borderRadius:"3px",background:"#FDF8F8",position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:"3vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"2.6vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"2.1vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"3.2vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"2.6vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"1.6vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"2vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                <div style={{width:"3vw",height:"0.2vh",borderRadius:"2px",background:"#504B4B",margin:"0.5vh 0.5vw 0vh 0.5vw"}}></div>
                                {/* analyzing scan area */}
                                <div className="scanContainer" style={{position:'absolute',bottom:0,left:0,right:0,top:0,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                                    <div style={{position:'relative',width:'5vh',height:'6vh',overflow:'hidden',borderRadius:3}}>
                                        <div className="gradientFill" style={{position:'absolute',left:0,right:0,bottom:0,background:'linear-gradient(to bottom, #28A89D 0%, rgba(8, 29, 54, 0.75) 100%)'}} />
                                        <div className="scanLine" style={{position:'absolute',left:0,right:0,height:'0.2vh',background:'#00FFEA',boxShadow:'0 0 8px #00FFEA',borderRadius:2}} />
                                    </div>
                                </div>
            </div>

            <p>{fileName}</p>
        </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spinIcon { animation: spin 1s linear infinite; display: block; }
                `}</style>

                                <style>{`
                                        /* scan animation: gradient grows from 0% to 100% and back; scanLine moves with it */
                                        .gradientFill { animation: fillAnim 2400ms ease-in-out infinite alternate; }
                                        .scanLine { animation: lineAnim 2400ms ease-in-out infinite alternate; }

                                        @keyframes fillAnim {
                                            0% { height: 0%; }
                                            100% { height: 100%; }
                                        }

                                        @keyframes lineAnim {
                                            0%   { bottom: 0%; }
                                            100% { bottom: calc(100% - 0.2vh); }
}

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
