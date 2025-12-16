import React, { useEffect, useState } from "react";
import Header from "./header";
const CARD_COUNT = 3;
const POINTS_PER_GAP = 5; // pontok a kártyák között
const ANIMATION_INTERVAL = 300; // ms

export default function How_it_work() {
  const [activePoint, setActivePoint] = useState(0);

  const totalPoints = (CARD_COUNT - 1) * POINTS_PER_GAP;

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePoint((prev) => (prev + 1) % (totalPoints + 1));
    }, ANIMATION_INTERVAL);
    return () => clearInterval(interval);
  }, [totalPoints]);

  const cardStyle = {
    width: "60%",
    background: "rgba(20, 20, 20, 0.9)",
    padding: "2rem",
    borderRadius: "16px",
    margin: "1rem 0",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    color: "#fff",
  };

  const pointsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0.5rem 0",
  };

  const pointStyle = (active) => ({
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: active ? "#32fc8dff" : "#7a7979ff",
    margin: "6px 0",
    transition: "background 0.3s ease",
  });

  const containerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem 0",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    zIndex: "1",
    position: "relative",
  };

  const renderCard = (title, isFirst=false, index) => (
  <div 
    key={index} 
    style={{
      ...cardStyle,
      ...(isFirst ? { marginTop: "12vh" } : {})
    }}
  >
    <h2>{title}</h2>
  </div>
);


  const renderPoints = (startIndex) => {
    const points = [];
    for (let i = 0; i < POINTS_PER_GAP; i++) {
      const pointIndex = startIndex + i;
      const active = pointIndex < activePoint;
      points.push(<div key={pointIndex} style={pointStyle(active)}></div>);
    }
    return <div style={pointsContainerStyle}>{points}</div>;
  };

  return (
    <div style={containerStyle}>
     <Header />
      {renderCard("1. lépés: CV feltöltés + követelmények",true)}
      {renderPoints(0)}
      {renderCard("2. lépés: AI elemzés")}
      {renderPoints(POINTS_PER_GAP)}
      {renderCard("3. lépés: Eredmények")}
    </div>
  );
}
