import React from "react";
const SEV_COLORS = { critical:"#ff4757", high:"#ff7f50", medium:"#ffd32a", low:"#2ed573" };
export default function Navbar({ result, loading }) {
  return (
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",height:56,borderBottom:"1px solid #1c2030",background:"#0e1118",position:"sticky",top:0,zIndex:100,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:34,height:34,background:"rgba(90,111,255,0.1)",border:"1px solid rgba(90,111,255,0.25)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L16.5 5.5V12.5L9 17L1.5 12.5V5.5L9 1Z" stroke="#5a6fff" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" fill="#5a6fff"/></svg>
        </div>
        <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:17}}>BugDetect<span style={{color:"#5a6fff"}}>.ai</span></span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {result && <div style={{display:"flex",gap:6}}>{["critical","high","medium","low"].map(sv=>result.stats?.[sv]>0&&(<span key={sv} style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",fontWeight:600,padding:"2px 7px",borderRadius:4,border:"1px solid",color:SEV_COLORS[sv],borderColor:SEV_COLORS[sv]+"40",background:SEV_COLORS[sv]+"12"}}>{result.stats[sv]} {sv}</span>))}</div>}
        <div style={{width:7,height:7,borderRadius:"50%",background:loading?"#ffd32a":"#2ed573",boxShadow:`0 0 6px ${loading?"#ffd32a":"#2ed573"}`,transition:"all 0.3s"}}/>
        <span style={{fontSize:11,color:"#4a5570",fontFamily:"JetBrains Mono,monospace"}}>{loading?"analyzing":"ready"}</span>
      </div>
    </nav>
  );
}
