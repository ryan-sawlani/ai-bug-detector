import React from "react";
import ScoreRing from "./ScoreRing";
import BugCard from "./BugCard";
export default function ResultsPanel({ result, loading, error }) {
  if (loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:10}}>
      <div style={{width:36,height:36,border:"3px solid #1c2030",borderTopColor:"#5a6fff",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <span style={{fontSize:13,color:"#4a5570"}}>Scanning for bugs...</span>
      <span style={{fontSize:11,color:"#2a3348",fontFamily:"JetBrains Mono,monospace"}}>Analyzing your code</span>
    </div>
  );
  if (error) return (
    <div style={{margin:16,padding:16,background:"rgba(255,71,87,0.06)",border:"1px solid rgba(255,71,87,0.2)",borderRadius:10}}>
      <div style={{fontSize:14,fontWeight:600,color:"#ff4757",marginBottom:8}}>Error</div>
      <p style={{fontSize:13,color:"#c9d3e8",lineHeight:1.5,marginBottom:10}}>{error}</p>
      <p style={{fontSize:12,color:"#4a5570"}}>Make sure Flask is running: <code style={{fontFamily:"JetBrains Mono,monospace",color:"#5a6fff"}}>python app.py</code></p>
    </div>
  );
  if (!result) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:10}}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{opacity:0.2}}><path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="#5a6fff" strokeWidth="2"/><circle cx="24" cy="24" r="6" stroke="#5a6fff" strokeWidth="1.5"/></svg>
      <strong style={{fontSize:14,color:"#3a4560"}}>Awaiting Analysis</strong>
      <p style={{fontSize:12,color:"#2a3348",textAlign:"center",maxWidth:200,lineHeight:1.6}}>Paste code and click Analyze or press Ctrl+Enter</p>
    </div>
  );
  const order = { critical:0, high:1, medium:2, low:3 };
  const sorted = [...(result.bugs||[])].sort((a,b)=>(order[a.severity]??4)-(order[b.severity]??4));
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <ScoreRing score={result.score} summary={result.summary} language={result.language} complexity={result.complexity}/>
      <div style={{flex:1,overflowY:"auto",padding:"12px 0 24px"}}>
        {sorted.length>0&&(
          <div style={{padding:"0 16px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"10px 0 8px"}}>
              <span style={{color:"#5a6fff",fontWeight:700}}>{">"}</span>
              <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"#4a5570"}}>{sorted.length} Issue{sorted.length!==1?"s":""} Detected</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>{sorted.map(b=><BugCard key={b.id} bug={b}/>)}</div>
          </div>
        )}
        {sorted.length===0&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 20px",gap:8,textAlign:"center"}}><span style={{fontSize:32}}>✓</span><strong>No bugs detected</strong><p style={{fontSize:12,color:"#4a5570",maxWidth:200,lineHeight:1.6}}>Your code looks clean!</p></div>}
        {(result.suggestions||[]).length>0&&(
          <div style={{padding:"0 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"10px 0 8px"}}>
              <span style={{color:"#5a6fff",fontWeight:700}}>*</span>
              <span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"#4a5570"}}>Suggestions</span>
            </div>
            <div style={{background:"#0e1118",border:"1px solid #1c2030",borderRadius:10,overflow:"hidden"}}>
              {result.suggestions.map((sg,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",borderBottom:"1px solid #1c2030",fontSize:12,color:"#6b7a99",lineHeight:1.55}}>
                  <span style={{color:"#5a6fff",flexShrink:0}}>→</span><span>{sg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
