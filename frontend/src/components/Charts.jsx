import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ReferenceLine, ReferenceArea, LabelList
} from 'recharts';
import { Info } from 'lucide-react';

const CATEGORY_COLORS = {
  "Underweight": "var(--color-underweight)",
  "Normal": "var(--color-normal)",
  "Overweight": "var(--color-overweight)",
  "Obese": "var(--color-obese)",
};

const CustomTooltip = ({ active, payload, label, isLightMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${isLightMode ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#111] border-[#222] shadow-2xl'} border p-3 rounded-lg text-[11px]`}>
        <p className={`font-bold ${isLightMode ? 'text-slate-900' : 'text-white'} mb-2 uppercase tracking-widest`}>{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
            <p className={`${isLightMode ? 'text-slate-500' : 'text-[#888]'}`}>
              {p.name}: <span className={`${isLightMode ? 'text-slate-900' : 'text-white'} font-bold`}>{p.value}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Charts = ({ activeTab, patterns, chartData, userResults, userMetrics, isLightMode, activeStandard }) => {
  if (!chartData || !patterns) return <div className="text-text-dim text-[11px] font-bold uppercase tracking-widest">Loading Analytics...</div>;

  const tickColor = isLightMode ? '#64748b' : '#444';
  const gridColor = isLightMode ? '#e2e8f0' : '#1a1a1a';
  const labelColor = isLightMode ? '#1e293b' : 'white';

  const renderBMIHistogram = () => {
    const bins = Array.from({ length: 18 }, (_, i) => 12 + i * 2);
    const binnedData = bins.map(bin => {
      const count = chartData.filter(d => d.BMI >= bin && d.BMI < bin + 2).length;
      const center = bin + 1;
      let cat = "Normal";
      if (center < 18.5) cat = "Underweight";
      else if (center < 25) cat = "Normal";
      else if (center < 30) cat = "Overweight";
      else cat = "Obese";

      return {
        range: `${bin}-${bin + 2}`,
        count,
        category: cat,
        fill: CATEGORY_COLORS[cat]
      };
    });

    return (
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={binnedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip isLightMode={isLightMode} />} cursor={{ fill: isLightMode ? '#00000005' : '#ffffff05' }} />
            <Bar dataKey="count" name="Users" radius={[2, 2, 0, 0]}>
              {binnedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Bar>
            {userResults && (
              <ReferenceLine
                x={`${Math.floor((userResults.bmi - 12) / 2) * 2 + 12}-${Math.floor((userResults.bmi - 12) / 2) * 2 + 12 + 2}`}
                stroke={labelColor}
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{ position: 'top', value: 'YOU', fill: labelColor, fontSize: 9, fontWeight: 'bold' }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBAIHistogram = () => {
    const bins = Array.from({ length: 19 }, (_, i) => 5 + i * 3);
    const binnedData = bins.map(bin => {
      const count = chartData.filter(d => d.BAI >= bin && d.BAI < bin + 3).length;
      const center = bin + 1.5;
      let cat = "Normal";
      if (center < 8) cat = "Underweight";
      else if (center < 21) cat = "Normal";
      else if (center < 26) cat = "Overweight";
      else cat = "Obese";

      return {
        range: `${bin}-${bin + 3}`,
        count,
        category: cat,
        fill: CATEGORY_COLORS[cat]
      };
    });

    return (
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={binnedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip isLightMode={isLightMode} />} cursor={{ fill: isLightMode ? '#00000005' : '#ffffff05' }} />
            <Bar dataKey="count" name="Users" radius={[2, 2, 0, 0]}>
              {binnedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Bar>
            {userResults && (
              <ReferenceLine
                x={`${Math.floor((userResults.bai - 5) / 3) * 3 + 5}-${Math.floor((userResults.bai - 5) / 3) * 3 + 5 + 3}`}
                stroke={labelColor}
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{ position: 'top', value: 'YOU', fill: labelColor, fontSize: 9, fontWeight: 'bold' }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAvgBMIByAge = () => {
    const data = Object.entries(patterns.avg_bmi_by_age).map(([age, bmi]) => ({
      age,
      bmi,
      fill: bmi < 18.5 ? CATEGORY_COLORS.Underweight : (bmi < 25 ? CATEGORY_COLORS.Normal : (bmi < 30 ? CATEGORY_COLORS.Overweight : CATEGORY_COLORS.Obese))
    }));

    return (
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
            <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }} domain={[0, 'dataMax + 5']} />
            <Tooltip content={<CustomTooltip isLightMode={isLightMode} />} cursor={{ fill: isLightMode ? '#00000005' : '#ffffff05' }} />
            <Bar dataKey="bmi" name="Avg BMI" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
              ))}
              <LabelList dataKey="bmi" position="top" fill={isLightMode ? '#475569' : '#666'} fontSize={9} fontWeight="bold" />
            </Bar>
            <ReferenceArea y1={18.5} y2={25} fill="#d4f01e" fillOpacity={isLightMode ? 0.1 : 0.03} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAgeVSBMI = () => {
    const data = chartData.map(d => ({
      age: d.Age,
      bmi: d.BMI,
      category: d.Risk_Category,
      fill: CATEGORY_COLORS[d.Risk_Category] || '#fff'
    }));

    return (
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="0" stroke={gridColor} />
            <XAxis type="number" dataKey="age" name="Age" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }} domain={[18, 70]} />
            <YAxis type="number" dataKey="bmi" name="BMI" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }} />
            <Tooltip content={<CustomTooltip isLightMode={isLightMode} />} />
            <Scatter name="Users" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.6} />
              ))}
            </Scatter>
            {userResults && (
              <ReferenceLine y={userResults.bmi} stroke={labelColor} strokeDasharray="3 3" label={{ value: 'YOU', fill: labelColor, fontSize: 9, fontWeight: 'bold', position: 'right' }} />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRiskDisparity = () => {
    const raceColors = {
      "White": "#7ec8e3",
      "Southeast Asian (Filipino)": "#f4a261",
    };

    const data = patterns.disparity_by_race.map(d => ({
      race: d.Race,
      count: d.Reclassified_Count,
      fill: raceColors[d.Race] || "#aaa"
    }));

    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="p-5 rounded-xl bg-brand/5 border border-brand/15 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-[#a78bfa22]">
            <Info size={18} className="text-[#a78bfa]" />
          </div>
          <p className="text-[13px] leading-relaxed text-text-muted">
            <b className="text-[#a78bfa]">Risk Disparity Insight: </b>
            {activeStandard === 'Global WHO Standard' ? (
              <>
                <b className="text-text-header mx-1">{patterns.disparity_count} out of {patterns.category_counts?.Normal || 0} users</b>
                classified as <b className="text-text-header">'Normal'</b> under WHO standard are reclassified as
                <b className="text-orange-400 mx-1">'Overweight'</b> under Asian clinical thresholds.
              </>
            ) : (
              <>
                <b className="text-text-header mx-1">{patterns.disparity_count} out of {patterns.category_counts?.Overweight || 0} users</b>
                classified as <b className="text-orange-400">'Overweight'</b> under Asian clinical thresholds would be
                <b className="text-text-header mx-1">'Normal'</b> under WHO standard.
              </>
            )}
            <span className="mx-2 text-text-dim">|</span>
            <b className="text-brand">{patterns.agreement_count} users</b> get the same category from both BMI and BAI.
          </p>
        </div>
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="race" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: tickColor, fontWeight: 'bold' }} domain={[0, 'dataMax + 3']} />
              <Tooltip content={<CustomTooltip isLightMode={isLightMode} />} cursor={{ fill: isLightMode ? '#00000005' : '#ffffff05' }} />
              <Bar dataKey="count" name="Reclassified Users" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                ))}
                <LabelList dataKey="count" position="top" fill={isLightMode ? '#475569' : '#666'} fontSize={10} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  switch (activeTab) {
    case 'BMI DISTRIBUTION': return renderBMIHistogram();
    case 'BAI DISTRIBUTION': return renderBAIHistogram();
    case 'AVG BMI BY AGE': return renderAvgBMIByAge();
    case 'AGE VS BMI + TREND': return renderAgeVSBMI();
    case 'RISK DISPARITY': return renderRiskDisparity();
    default: return null;
  }
};

export default Charts;