import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, LayoutGrid, Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const CATEGORY_COLORS = {
  "Underweight": "var(--color-underweight)",
  "Normal":      "var(--color-normal)",
  "Overweight":  "var(--color-overweight)",
  "Obese":       "var(--color-obese)",
};

const NumberInput = ({ label, value, onChange, min, max, step = 1, unit = "", decimals = 0 }) => {
  const increment = () => onChange(Math.min(max, value + step));
  const decrement = () => onChange(Math.max(min, value - step));
  return (
    <div className="mb-5">
      <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.15em] mb-2">{label}{unit && ` (${unit})`}</div>
      <div className="flex items-center gap-1">
        <button onClick={decrement} className="w-10 h-10 flex items-center justify-center bg-bg-card text-text-header rounded-md border border-border-dim hover:bg-bg-main active:scale-95 transition-all"><Minus size={13} strokeWidth={3} /></button>
        <div className="flex-1 bg-bg-card border border-border-dim rounded-md h-10 flex items-center justify-center">
          <input type="number" value={decimals > 0 ? value.toFixed(decimals) : value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full bg-transparent text-center text-text-main text-[14px] font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <button onClick={increment} className="w-10 h-10 flex items-center justify-center bg-bg-card text-text-header rounded-md border border-border-dim hover:bg-bg-main active:scale-95 transition-all"><Plus size={13} strokeWidth={3} /></button>
      </div>
    </div>
  );
};

const Sidebar = ({ metrics, setMetrics, activeStandard, setActiveStandard, results }) => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const lastAdviceRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (results) {
      if (messages.length === 0) {
        setMessages([{ role: 'assistant', content: `Hello! I'm your AI Health Coach. Based on your data (BMI: ${results.bmi}, BAI: ${results.bai}%, Age: ${metrics.age}, Gender: ${metrics.gender}), I'm here to help you understand your metrics and provide guidance. How can I help you today?` }]);
        lastAdviceRef.current = results.coach_advice;
      } else if (results.coach_advice !== lastAdviceRef.current) {
        setMessages(prev => [...prev, { role: 'assistant', content: `📊 I've updated my assessment: ${results.coach_advice}` }]);
        lastAdviceRef.current = results.coach_advice;
      }
    }
  }, [results]);

  const handleMetricChange = (name, value) => setMetrics(prev => ({ ...prev, [name]: value }));

  const standards = [
    { id: 'Global WHO Standard', label: 'Global WHO Standard' },
    { id: 'Asian Clinical Standard', label: 'Asian Clinical Standard' },
  ];

  return (
    <aside className="w-[320px] h-screen bg-bg-sidebar border-r border-border-sidebar flex flex-col shrink-0 transition-colors duration-300">
      <div className="px-5 py-4 border-b border-border-sidebar flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(217,255,0,0.25)]"><LayoutGrid size={16} className="text-black" strokeWidth={3} /></div>
        <h1 className="text-[17px] font-black text-text-header tracking-tight leading-none">HealthAnalytics</h1>
        <div className="h-5 w-[1px] bg-border-dim" />
        <span className="text-[12px] font-black text-text-header tracking-tight leading-tight">BMI Health<br/>Classifier</span>
      </div>

      <div className="px-5 pt-4 pb-3 border-b border-border-sidebar shrink-0">
        <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.15em] mb-2">BMI Standard</div>
        <div className="flex flex-col gap-1.5">
          {standards.map(std => {
            const active = activeStandard === std.id;
            return (
              <button key={std.id} onClick={() => setActiveStandard(std.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${active ? 'border-border-dim bg-bg-card' : 'border-border-sidebar bg-bg-input'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-[#378ADD]' : 'border-text-dim'}`}>{active && <div className="w-2 h-2 rounded-full bg-[#378ADD]" />}</div>
                <span className={`text-[11px] font-bold tracking-wide ${active ? 'text-text-header' : 'text-text-dim'}`}>{std.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex border-b border-border-sidebar shrink-0">
        {[{ id: 'inputs', label: 'Inputs' }, { id: 'results', label: 'Results' }, { id: 'coach', label: 'AI Coach' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-text-header' : 'text-text-dim hover:text-text-muted'}`}>
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 custom-scrollbar min-h-0">

        {activeTab === 'inputs' && (
          <>
            <div className="mb-5">
              <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.15em] mb-2">Gender</div>
              <div className="flex gap-1.5">
                {['Male', 'Female'].map(g => {
                  const active = metrics.gender === g;
                  return <button key={g} onClick={() => handleMetricChange('gender', g)} className={`flex-1 py-2.5 rounded-lg border text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1.5 ${active ? 'border-brand bg-brand text-black' : 'border-border-sidebar bg-bg-input text-text-dim'}`}>{g === 'Male' ? '♂ Male' : '♀ Female'}</button>;
                })}
              </div>
            </div>
            <NumberInput label="Age" value={metrics.age} onChange={(v) => handleMetricChange('age', v)} min={10} max={100} />
            <NumberInput label="Weight" unit="KG" value={metrics.weight} onChange={(v) => handleMetricChange('weight', v)} min={30} max={200} step={0.5} decimals={2} />
            <NumberInput label="Height" unit="CM" value={metrics.height} onChange={(v) => handleMetricChange('height', v)} min={100} max={220} />
            <NumberInput label="Hip" unit="CM" value={metrics.hip_cm} onChange={(v) => handleMetricChange('hip_cm', v)} min={60} max={160} />
          </>
        )}

        {activeTab === 'coach' && (
          <div className="flex flex-col h-full -mt-5 -mx-5">
            {results?.coach_advice && (
              <div className="mx-5 mt-5 p-3 rounded-xl bg-brand/10 border border-brand/20 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-md bg-brand text-black"><Sparkles size={10} strokeWidth={3} /></div>
                  <p className="text-[9px] font-black text-text-header uppercase tracking-wider">Live Assessment</p>
                </div>
                <p className="text-[11px] leading-relaxed text-text-main font-medium italic">"{results.coach_advice}"</p>
              </div>
            )}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 480px)' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-brand text-black font-bold rounded-tr-none' : 'bg-bg-card border border-border-dim text-text-main font-medium rounded-tl-none'}`}>
                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                      {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                      <span className="text-[9px] uppercase tracking-wider font-black">{msg.role === 'user' ? 'You' : 'AI Coach'}</span>
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-card border border-border-dim text-text-main rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm"><Loader2 size={14} className="animate-spin text-brand" /></div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border-sidebar bg-bg-sidebar mt-auto">
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!input.trim() || isLoading) return;
                const userMsg = input.trim();
                setInput('');
                setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const response = await axios.post(`${API_BASE}/chat`, { message: userMsg, metrics, results }, { headers: { Authorization: `Bearer ${token}` } });
                  setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
                } catch (err) {
                  setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my knowledge base right now." }]);
                } finally {
                  setIsLoading(false);
                }
              }} className="relative">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your health coach..." className="w-full bg-bg-input border border-border-dim rounded-xl py-3 pl-4 pr-12 text-[12px] font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-text-muted" />
                <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-brand text-black rounded-lg disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/20"><Send size={14} strokeWidth={3} /></button>
              </form>
              <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest">AI Core Online</span>
                </div>
                <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter">v2.5 Hybrid Model</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <>
            {results && (
              <div className="mb-3 rounded-lg bg-bg-input border border-border-sidebar">
                <div className="px-3 pt-3 pb-2 border-b border-border-dim"><p className="text-[9px] font-black text-brand uppercase tracking-[0.2em] text-center">Live Calculation Results</p></div>
                <div className="flex items-stretch px-3 py-2 gap-2">
                  <div className="flex-1 text-center">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] mb-0.5">Your BMI</p>
                    <p className="text-[24px] font-black text-text-header tracking-tighter leading-none">{results.bmi}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-0.5" style={{ color: CATEGORY_COLORS[results.bmi_category] || 'var(--color-brand)' }}>{results.bmi_category}</p>
                  </div>
                  <div className="w-[1px] bg-border-sidebar" />
                  <div className="flex-1 text-center">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] mb-0.5">Your BAI</p>
                    <p className="text-[24px] font-black text-[var(--color-bai-healthy)] tracking-tighter leading-none">{results.bai}%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-0.5" style={{ color: results.bai_category === 'Normal' ? 'var(--color-bai-healthy)' : (CATEGORY_COLORS[results.bai_category] || 'var(--color-brand)') }}>{results.bai_category === 'Normal' ? 'Healthy' : results.bai_category}</p>
                  </div>
                </div>
              </div>
            )}
            {results && (
              <div className="mb-3 rounded-xl bg-bg-input border border-border-sidebar p-3">
                <p className="text-[11px] font-black text-text-header uppercase tracking-wide mb-2 text-center">BMI {results.bmi} — Comparison</p>
                <div className="flex text-[9px] font-bold text-text-muted uppercase tracking-tighter mb-1 px-1">
                  <div className="w-[30%]">Standard</div><div className="w-[23%] text-center">Overwt</div><div className="w-[18%] text-center">Obese</div><div className="w-[29%] text-right">Category</div>
                </div>
                <div className="space-y-0.5">
                  {[
                    { name: 'Global WHO', over: '25.0–29.9', obese: '30.0+', cat: results.global_bmi_category, id: 'Global WHO Standard' },
                    { name: 'Asian (PH)', over: '23.0–24.9', obese: '25.0+', cat: results.asian_bmi_category, id: 'Asian Clinical Standard' },
                  ].map(s => (
                    <div key={s.name} className={`flex items-center px-2 py-2 rounded-lg transition-all ${activeStandard === s.id ? 'bg-brand/5 ring-1 ring-brand/15' : ''}`}>
                      <div className={`w-[30%] text-[10px] font-black ${activeStandard === s.id ? 'text-brand' : 'text-text-header'}`}>{s.name}</div>
                      <div className="w-[23%] text-[9px] text-text-muted font-bold text-center">{s.over}</div>
                      <div className="w-[18%] text-[9px] text-text-muted font-bold text-center">{s.obese}</div>
                      <div className="w-[29%] text-[10px] font-black text-right uppercase italic" style={{ color: CATEGORY_COLORS[s.cat] || 'var(--color-brand)' }}>{s.cat}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-3 rounded-xl bg-bg-input border border-border-sidebar p-3">
              <p className="text-[10px] font-black text-brand uppercase tracking-wide mb-2">Healthy Body Metric Targets</p>
              <div className="mb-3">
                <div className="flex text-[11px] text-text-muted font-black uppercase tracking-tighter border-b border-border-dim pb-1.5 mb-1.5 leading-tight">
                  <div className="w-[16%]">Metric</div><div className="w-[18%] text-center">WHO</div><div className="w-[18%] text-center">SEA PH</div><div className="w-[14%] text-center">Result</div><div className="w-[34%] text-right">Status</div>
                </div>
                {[{ label: 'Male' }, { label: 'Female' }].map((row, i) => {
                  const isMatch = results && metrics.gender === row.label;
                  const bmiCat = isMatch ? (activeStandard === 'Global WHO Standard' ? results.global_bmi_category : results.asian_bmi_category) : null;
                  const riskLevel = isMatch ? results.risk_data?.level : null;
                  return (
                    <div key={row.label} className={`flex items-center ${i > 0 ? 'border-t border-border-dim mt-1.5 pt-1.5' : ''}`}>
                      <div className="w-[16%] text-[10px] font-black text-text-header">{row.label}</div>
                      <div className="w-[18%] text-[10px] font-bold text-center text-text-muted">18.5–24.9</div>
                      <div className="w-[18%] text-[10px] font-bold text-center text-text-muted">18.5–22.9</div>
                      <div className="w-[14%] text-[10px] font-bold text-center text-text-muted">{isMatch ? results.bmi : '——'}</div>
                      <div className="w-[34%] text-[10px] font-black text-right" style={{ color: bmiCat ? (CATEGORY_COLORS[bmiCat] || 'var(--color-brand)') : '#666' }}>{isMatch ? `${bmiCat} (${riskLevel})` : '——'}</div>
                    </div>
                  );
                })}
              </div>
              <div>
                <div className="flex text-[11px] text-text-muted font-black uppercase tracking-tighter border-b border-border-dim pb-1.5 mb-1.5 leading-tight">
                  <div className="w-[13%]">BAI</div><div className="w-[16%] text-center">18–39</div><div className="w-[16%] text-center">40–59</div><div className="w-[16%] text-center">60–79</div><div className="w-[13%] text-center">Result</div><div className="w-[26%] text-right">Status</div>
                </div>
                {[
                  { label: 'Male', b1: '8–21%', b2: '11–23%', b3: '13–25%' },
                  { label: 'Female', b1: '21–33%', b2: '23–35%', b3: '25–38%' },
                ].map((row, i) => {
                  const isMatch = results && metrics.gender === row.label;
                  const baiCat = isMatch ? results.bai_category : null;
                  const baiDisplay = baiCat === 'Normal' ? 'Healthy' : baiCat;
                  return (
                    <div key={row.label} className={`flex items-center ${i > 0 ? 'border-t border-border-dim mt-1.5 pt-1.5' : ''}`}>
                      <div className="w-[13%] text-[10px] font-black text-text-header">{row.label}</div>
                      <div className="w-[16%] text-[10px] font-bold text-center text-text-muted">{row.b1}</div>
                      <div className="w-[16%] text-[10px] font-bold text-center text-text-muted">{row.b2}</div>
                      <div className="w-[16%] text-[10px] font-bold text-center text-text-muted">{row.b3}</div>
                      <div className="w-[13%] text-[10px] font-bold text-center text-text-muted">{isMatch ? `${results.bai}%` : '——'}</div>
                      <div className="w-[26%] text-[10px] font-black text-right" style={{ color: baiCat === 'Normal' ? 'var(--color-bai-healthy)' : (baiCat ? (CATEGORY_COLORS[baiCat] || 'var(--color-brand)') : '#666') }}>{isMatch ? baiDisplay : '——'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;