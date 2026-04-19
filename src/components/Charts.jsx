export const Sparkline = ({ values, color = 'var(--red)', w = 120, h = 32 }) => {
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v,i) => { const x = (i / (values.length - 1)) * w; const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2; return `${x},${y}`; }).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (<svg width={w} height={h} style={{display:'block'}}><polygon points={area} fill={color} opacity="0.1"/><polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>);
};

export const BarChart = ({ data, labels, h = 200 }) => {
  const w = 600, pad = 24, max = Math.max(...data), bw = (w - pad*2) / data.length - 6;
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`}>
      <g className="chart-grid">{[0, 0.25, 0.5, 0.75, 1].map((p,i) => (<line key={i} x1={pad} x2={w-pad} y1={h - 30 - p*(h-50)} y2={h - 30 - p*(h-50)}/>))}</g>
      {data.map((v,i) => { const bh = (v/max) * (h - 50); const x = pad + i * ((w - pad*2) / data.length) + 3; const y = h - 30 - bh;
        return <g key={i}><rect className="chart-bar" x={x} y={y} width={bw} height={bh} rx="3"/><text x={x + bw/2} y={h-10} textAnchor="middle" fontSize="10" fill="var(--text-mute)" fontFamily="var(--font-mono)">{labels[i]}</text></g>;
      })}
    </svg>
  );
};

export const LineChart = ({ data, labels, h = 220 }) => {
  const w = 600, pad = 30, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => { const x = pad + (i/(data.length-1)) * (w - pad*2); const y = h - 30 - ((v-min)/(max-min || 1)) * (h - 60); return [x,y]; });
  const linePts = pts.map(p => p.join(',')).join(' ');
  const areaPts = `${pad},${h-30} ${linePts} ${w-pad},${h-30}`;
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`}>
      <g className="chart-grid">{[0, 0.5, 1].map((p,i) => (<line key={i} x1={pad} x2={w-pad} y1={h - 30 - p*(h-60)} y2={h - 30 - p*(h-60)}/>))}</g>
      <polygon className="chart-area" points={areaPts}/><polyline className="chart-line" points={linePts}/>
      {pts.map((p,i) => <circle key={i} className="chart-dot" cx={p[0]} cy={p[1]} r="3"/>)}
      {labels.map((l,i) => (<text key={i} x={pad + (i/(labels.length-1))*(w-pad*2)} y={h-10} textAnchor="middle" fontSize="10" fill="var(--text-mute)" fontFamily="var(--font-mono)">{l}</text>))}
    </svg>
  );
};
