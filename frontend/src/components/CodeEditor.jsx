import React, { useRef, useEffect } from "react";
const LANGS = ["auto","python","javascript","typescript","java","c++","c","go","rust","php","ruby","kotlin"];
const SAMPLE = "";

export default function CodeEditor({ code, setCode, language, setLanguage, onAnalyze, loading }) {
  const taRef = useRef(null);
  const lineRef = useRef(null);
  useEffect(() => { if (!code) setCode(SAMPLE); }, []);
  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current, s = ta.selectionStart;
      const v = ta.value.substring(0,s) + "  " + ta.value.substring(ta.selectionEnd);
      setCode(v);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s+2; });
    }
    if ((e.ctrlKey||e.metaKey) && e.key==="Enter") { e.preventDefault(); onAnalyze(); }
  };
  const lines = (code||"").split("\n");
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",borderRight:"1px solid #1c2030"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:42,background:"#0c0e15",borderBottom:"1px solid #1c2030",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",gap:6}}>{["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:11,height:11,borderRadius:"50%",background:c,display:"inline-block"}}/>)}</div>
          <span style={{fontSize:12,color:"#4a5570",fontFamily:"JetBrains Mono,monospace"}}>main.js</span>
        </div>
        <span style={{fontSize:11,color:"#2a3348",fontFamily:"JetBrains Mono,monospace"}}>{lines.length} lines</span>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div ref={lineRef} style={{padding:"16px 0",minWidth:44,textAlign:"right",background:"#080a0f",borderRight:"1px solid #1a1e2a",userSelect:"none",overflowY:"hidden",flexShrink:0,pointerEvents:"none"}}>
          {lines.map((_,i)=><div key={i} style={{padding:"0 10px 0 6px",fontSize:12,lineHeight:"22.1px",color:"#2a3348",fontFamily:"JetBrains Mono,monospace"}}>{i+1}</div>)}
        </div>
        <textarea ref={taRef} style={{flex:1,background:"#080a0f",color:"#c9d3e8",fontFamily:"JetBrains Mono,monospace",fontSize:13,lineHeight:"22.1px",padding:"16px 20px",border:"none",outline:"none",resize:"none",overflowY:"auto"}}
          value={code} onChange={e=>setCode(e.target.value)} onKeyDown={onKeyDown}
          onScroll={e => { if(lineRef.current) lineRef.current.scrollTop = e.target.scrollTop; }}
          placeholder="// Paste your code here..." spellCheck={false} autoComplete="off"/>

      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"#0c0e15",borderTop:"1px solid #1c2030",flexShrink:0,gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:"#4a5570",fontFamily:"JetBrains Mono,monospace"}}>Language</span>
          <select style={{background:"#080a0f",color:"#c9d3e8",border:"1px solid #1c2030",borderRadius:6,padding:"5px 10px",fontFamily:"JetBrains Mono,monospace",fontSize:12,cursor:"pointer",outline:"none"}}
            value={language} onChange={e=>setLanguage(e.target.value)}>
            {LANGS.map(l=><option key={l} value={l}>{l==="auto"?"Auto-detect":l}</option>)}
          </select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:10,color:"#2a3348",fontFamily:"JetBrains Mono,monospace",background:"#0e1118",border:"1px solid #1c2030",padding:"3px 7px",borderRadius:4}}>Ctrl+Enter</span>
          <button style={{display:"flex",alignItems:"center",gap:7,background:"#5a6fff",color:"#fff",border:"none",borderRadius:7,padding:"7px 18px",fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",opacity:loading?0.5:1,boxShadow:"0 0 18px rgba(90,111,255,0.3)"}}
            onClick={onAnalyze} disabled={loading}>
            {loading?<><span style={{display:"inline-block",width:12,height:12,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.6s linear infinite"}}/>Analyzing...</>:<>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>Analyze</>}
          </button>
        </div>
      </div>
    </div>
  );
}
