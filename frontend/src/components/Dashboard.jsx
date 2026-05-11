import React, { useState } from 'react';
import Charts from './Charts';
import { Info, LogOut, Sun, Moon } from 'lucide-react';

const Dashboard = ({ data, userResults, userMetrics, onLogout, isLightMode, toggleTheme, activeStandard }) => {
  const [activeTab, setActiveTab] = useState('BMI DISTRIBUTION');
  const { patterns, chart_data } = data;

  const CATEGORY_COLORS = {
    "Underweight": "#378ADD",
    "Normal": "#D9FF00",
    "Overweight": "#BA7517",
    "Obese": "#E24B4A",
  };

  const tabs = [
    "BMI DISTRIBUTION",
    "BAI DISTRIBUTION",
    "AVG BMI BY AGE",
    "AGE VS BMI + TREND",
    "RISK DISPARITY",
  ];

  const categories = ["Underweight", "Normal", "Overweight", "Obese"];

  return (
    <div className="flex-1 p-8 flex flex-col gap-10 overflow-y-auto custom-scrollbar bg-bg-main transition-colors duration-300">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-text-header tracking-tight">Population Patterns Dashboard</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border-dim bg-bg-card text-text-muted hover:text-brand hover:border-brand/30 transition-all active:scale-95"
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {isLightMode ? <Moon size={16} strokeWidth={2.5} /> : <Sun size={16} strokeWidth={2.5} />}
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg border border-border-dim bg-bg-card text-text-muted hover:text-[#E24B4A] hover:border-[#E24B4A]/30 transition-all active:scale-95"
            title="Sign Out"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Users', value: patterns.total_users },
          { label: 'Avg BMI', value: patterns.overall_avg_bmi },
          { label: 'Avg BAI', value: `${patterns.overall_avg_bai}%` },
          { label: 'Std Dev', value: patterns.bmi_std },
          { label: 'BMI=BAI Agree', value: `${Math.round(patterns.agreement_count / patterns.total_users * 100)}%`, brand: true },
        ].map((kpi, i) => (
          <div key={i} className={`metric-card flex flex-col items-center justify-center ${kpi.brand ? 'border-brand/30' : ''} transition-colors duration-300`}>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">{kpi.label}</p>
            <p className={`text-4xl font-bold tracking-tight ${kpi.brand ? 'text-brand' : 'text-text-header'}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-6">Risk Category Breakdown (BMI Standard)</p>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-8">
            {categories.map(cat => {
              const count = patterns.category_counts[cat] || 0;
              const pct = Math.round((count / patterns.total_users) * 100);
              return (
                <div key={cat} className="flex flex-col items-center">
                  <p className="text-[10px] font-bold text-text-dim uppercase mb-2">{cat}</p>
                  <p className="text-3xl font-bold mb-1" style={{ color: CATEGORY_COLORS[cat] }}>{count}</p>
                  <p className="text-[10px] font-bold text-text-dim">{pct}%</p>
                </div>
              );
            })}
          </div>

          {/* Multi-segmented Progress Bar */}
          <div className="h-2 w-full flex rounded-full overflow-hidden bg-bg-input">
            {categories.map(cat => {
              const count = patterns.category_counts[cat] || 0;
              const pct = (count / patterns.total_users) * 100;
              return (
                <div
                  key={cat}
                  style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                  className="h-full"
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs and Charts */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-10 border-b border-border-dim">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] font-bold tracking-widest transition-all relative ${activeTab === tab ? 'text-text-header' : 'text-text-dim hover:text-text-muted'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand shadow-[0_0_8px_rgba(217,255,0,0.5)]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <Charts
            activeTab={activeTab}
            patterns={patterns}
            chartData={chart_data}
            userResults={userResults}
            userMetrics={userMetrics}
            isLightMode={isLightMode}
            activeStandard={activeStandard}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;