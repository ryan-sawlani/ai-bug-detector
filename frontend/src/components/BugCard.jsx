import React, { useState } from "react";
const SEV = {
  critical:{ color:"#ff4757", bg:"rgba(255,71,87,0.08)",  border:"rgba(255,71,87,0.25)"  },
  high:    { color:"#ff7f50", bg:"rgba(255,127,80,0.08)", border:"rgba(255,127,80,0.25)" },
  medium:  { color:"#ffd32a", bg:"rgba(255,211,42,0.08)", border:"rgba(255,211,42,0.25)" },
  low:     { color:"#2ed573", bg:"rgba(46,213,115,0.08)", border:"rgba(46,213,115,0.25)" },
};
export default function BugCard({ bug }) {
  const [open, setOpen] = useState(false);
  const sv = SEV[bug.severity] || SEV.low;
  return (
    <div style={{border:"1px solid",borderColor:open?sv.border:"#1c2030",borderRadius:10,overflow:"hidden",cursor:"pointer",transition:"border-color 0.15s, background 0.15s",background:open?sv.bg:"#0e1118"}} onClick={()=>setOpen(o=>!o)}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px"}}>
        <div style={{width:8,height:8,borderRadius:"50%",marginTop:5,flexShrink:0,background:sv.color,boxShadow:`0 0 7px ${sv.color}80`}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:"#dde3ee",lineHeight:1.4}}>{bug.title}</div>
          <div style={{fontSize:11,color:"#4a5570",fontFamily:"JetBrains Mono,monospace",marginTop:3}}><span style={{color:sv.color,marginRight:4,fontWeight:700}}>{bug.severity}</span>{bug.category}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,paddingTop:2}}>
          {bug.line&&<span style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:"#4a5570",background:"#080a0f",border:"1px solid #1c2030",padding:"2px 6px",borderRadius:4}}>L{bug.line}</span>}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5570" strokeWidth="2" style={{transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      {open&&(
        <div style={{padding:"0 14px 14px 32px",borderTop:"1px solid #1c2030"}} onClick={e=>e.stopPropagation()}>
          <p style={{fontSize:12,color:"#7a8aaa",lineHeight:1.65,marginTop:12}}>{bug.description}</p>
          {bug.fix&&(
            <div style={{marginTop:12,background:"#080a0f",border:"1px solid #1c2030",borderRadius:8,overflow:"hidden"}}>
              <div style={{padding:"7px 12px",fontSize:10,fontWeight:600,color:"#2ed573",textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:"1px solid #1c2030",background:"rgba(46,213,115,0.05)"}}>Suggested Fix</div>
              <pre style={{padding:"10px 14px",fontFamily:"JetBrains Mono,monospace",fontSize:12,color:"#8899bb",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.6}}>{bug.fix}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
