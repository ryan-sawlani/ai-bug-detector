import React from "react";
const getColor = s => s>=80?"#2ed573":s>=60?"#ffd32a":s>=40?"#ff7f50":"#ff4757";
const getLabel = s => s>=80?"Clean":s>=60?"Fair":s>=40?"Risky":"Critical";
const cxColor  = l => l==="low"?"#2ed573":l==="moderate"?"#ffd32a":l==="high"?"#ff7f50":"#ff4757";
export default function ScoreRing({ score, summary, language, complexity }) {
  const c = getColor(score), r = 36, circ = 2*Math.PI*r;
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:20,padding:"18px 20px",background:"#0e1118",borderBottom:"1px solid #1c2030"}}>
      <div style={{position:"relative",flexShrink:0}}>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{transform:"rotate(-90deg)"}}>
          <circle cx="45" cy="45" r={r} fill="none" stroke="#1c2030" strokeWidth="6"/>
          <circle cx="45" cy="45" r={r} fill="none" stroke={c} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ-(score/100)*circ}
            strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1}}>
          <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:22,fontWeight:700,lineHeight:1,color:c}}>{score}</span>
          <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",opacity:0.8,color:c}}>{getLabel(score)}</span>
        </div>
      </div>
      <div style={{flex:1,paddingTop:6}}>
        <p style={{fontSize:13,lineHeight:1.55,color:"#c9d3e8"}}>{summary}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
          {language&&language!=="auto"&&<span style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:"#5a6fff",background:"rgba(90,111,255,0.1)",border:"1px solid rgba(90,111,255,0.2)",padding:"2px 8px",borderRadius:4}}>{language}</span>}
          {complexity&&<span style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:cxColor(complexity.level),background:cxColor(complexity.level)+"18",border:`1px solid ${cxColor(complexity.level)}40`,padding:"2px 8px",borderRadius:4}}>{complexity.level} complexity</span>}
        </div>
        {complexity?.reason&&<p style={{fontSize:11,color:"#4a5570",marginTop:6,lineHeight:1.5}}>{complexity.reason}</p>}
      </div>
    </div>
  );
}
