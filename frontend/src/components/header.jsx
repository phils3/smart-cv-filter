import React from 'react'

export default function Header() {
  return (
<div style={{
  borderRadius: "32px",
  padding: "2px", // border vastagsága
  background: "linear-gradient(to bottom, #9B9B9B, rgba(98, 98, 98, 0.6), rgba(53, 53, 53, 0.6), #9B9B9B)", // színátmenetes border
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "35vw",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: "#CFC6C6",
  marginTop: "1vh",
}}>
  <div style={{
    borderRadius: "28px", // padding miatt kisebb, hogy a belső tartalom illeszkedjen
    background: "rgba(3, 15, 15, 0.6)", // belső háttér
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0vh 2vw"
  }}>
    <p style={{color:"#32FCC0",fontSize:"1.5rem"}}>SkillMatch Ai</p>
    <p>How it works</p>
    <p>github repository</p>
  </div>
</div>


  )
}
