import React from 'react'
import { useState, useEffect } from 'react';
import "../index.css"
import { useAdatok } from '../components/adatok';
export default function Header() {
  const { set_how_it_works_visible } = useAdatok();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Alapból 35vw, tablet esetén 50vw
  const headerWidth = windowWidth <= 1224 ? "50vw" : "45vw";
  const fontSizeCim = windowWidth <= 1224 ? "1.2rem" : "1.5rem"; // kisebb cím
  const fontSizeMenu = windowWidth <= 1224 ? "0.8rem" : "1rem"; // kisebb menu
  return (
    <div style={{width:"70%",display:"flex",justifyContent:"center",alignItems:"center",position:"fixed",zIndex:"1000",padding:"1vh 1vw",height:"6vh",borderRadius: "32px",background: "radial-gradient(circle, rgba(3,15,15,0.0) 0%, rgba(3,15,15,0.0) 50%, rgba(3,15,15,0.0) 100%)",backdropFilter: "blur(2px)",WebkitBackdropFilter: "blur(2px)"}}>
        <div style={{
          borderRadius: "32px",
          padding: "2px", // border vastagsága
          background: "linear-gradient(to bottom, rgba(155, 155, 155, 0.6), rgba(98, 98, 98, 0.6), rgba(53, 53, 53, 0.6), rgba(155, 155, 155, 0.6))", // színátmenetes border
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: headerWidth,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#CFC6C6",
          position:"fixed",
          zIndex:"100"
        }}>
          <div style={{
            borderRadius: "28px", 
            background: "rgba(3, 15, 15, 0.6)", 
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0vh 2vw",
            height: "4vh"
          }}>
            <p style={{color:"#32FCC0",fontSize:fontSizeCim, cursor: "pointer"}} onClick={() => set_how_it_works_visible(false)}>SkillMatch Ai</p>
            <p onClick={()=>set_how_it_works_visible(true)} style={{cursor:"pointer", fontSize:fontSizeMenu}}>How it works</p>
            <a href="https://github.com/phils3/smart-cv-filter" target='_blank' style={{textDecoration:"none",color:"#CFC6C6",fontSize:fontSizeMenu}} id='github_link' >github repository</a>
          </div>
        </div>
       

    </div>



  )
}
