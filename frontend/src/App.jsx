import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import ResultsPanel from "./components/ResultsPanel";
import { useAnalyzer } from "./hooks/useAnalyzer";
import "./styles/globals.css";
export default function App() {
  const [code, setCode]         = useState("");
  const [language, setLanguage] = useState("auto");
  const { result, loading, error, analyze } = useAnalyzer();
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>
      <Navbar result={result} loading={loading}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",flex:1,overflow:"hidden"}}>
        <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} onAnalyze={()=>analyze(code,language)} loading={loading}/>
        <ResultsPanel result={result} loading={loading} error={error}/>
      </div>
    </div>
  );
}
