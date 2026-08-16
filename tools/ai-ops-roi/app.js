const fields = [
  ['hardwareCost','Hardware purchase cost',18000,'$'],
  ['resaleValue','Expected resale value',5000,'$'],
  ['depreciationMonths','Depreciation period',36,'months'],
  ['powerWatts','Average power under AI load',1200,'W'],
  ['electricityKwh','Electricity cost',0.18,'$/kWh'],
  ['utilizationHours','Utilization',8,'hours/day'],
  ['maintenanceHours','Maintenance/operator time',4,'hours/month'],
  ['operatorRate','Operator hourly cost',75,'$/hour'],
  ['monthlyTokens','Monthly token volume',900,'million tokens'],
  ['apiCostPerM','API blended cost',1.6,'$/M tokens'],
  ['cloudGpuMonthly','Cloud GPU fallback',250,'$/month'],
  ['productivityMultiplier','Local productivity multiplier',1.15,'x']
];
const presets = {
  conservative: { hardwareCost:22000,resaleValue:4500,depreciationMonths:30,powerWatts:1500,electricityKwh:0.22,utilizationHours:4,maintenanceHours:7,operatorRate:95,monthlyTokens:350,apiCostPerM:1.4,cloudGpuMonthly:150,productivityMultiplier:1.05 },
  balanced: { hardwareCost:18000,resaleValue:5000,depreciationMonths:36,powerWatts:1200,electricityKwh:0.18,utilizationHours:8,maintenanceHours:4,operatorRate:75,monthlyTokens:900,apiCostPerM:1.6,cloudGpuMonthly:250,productivityMultiplier:1.15 },
  aggressive: { hardwareCost:24000,resaleValue:6500,depreciationMonths:36,powerWatts:1400,electricityKwh:0.18,utilizationHours:18,maintenanceHours:6,operatorRate:90,monthlyTokens:2600,apiCostPerM:1.8,cloudGpuMonthly:600,productivityMultiplier:1.25 }
};
let values = { ...presets.balanced };
function money(n){ return `$${Math.round(n).toLocaleString()}`; }
function num(id){ return Number(values[id]) || 0; }
function calculate(){
  const depreciation = Math.max(0, num('hardwareCost') - num('resaleValue')) / Math.max(1, num('depreciationMonths'));
  const power = (num('powerWatts') / 1000) * num('utilizationHours') * 30 * num('electricityKwh');
  const maintenance = num('maintenanceHours') * num('operatorRate');
  const localMonthly = depreciation + power + maintenance;
  const apiMonthly = (num('monthlyTokens') * num('apiCostPerM') + num('cloudGpuMonthly')) / Math.max(0.25, num('productivityMultiplier'));
  const delta = apiMonthly - localMonthly;
  const upfront = Math.max(0, num('hardwareCost') - num('resaleValue'));
  const breakEven = delta > 0 ? upfront / delta : Infinity;
  let mode = 'api', title = 'API/cloud remains safer';
  if (delta > 800 && breakEven <= 24) { mode = 'local'; title = 'Local-first looks justified'; }
  else if (delta > 0 || num('utilizationHours') >= 10) { mode = 'hybrid'; title = 'Hybrid path is likely best'; }
  return { depreciation, power, maintenance, localMonthly, apiMonthly, delta, breakEven, mode, title };
}
function renderInputs(){
  inputGrid.innerHTML = fields.map(([id,label,,unit]) => `<label>${label}<input id="${id}" type="number" step="0.01" value="${values[id]}"><span>${unit}</span></label>`).join('');
  fields.forEach(([id]) => document.getElementById(id).addEventListener('input', e => { values[id] = e.target.value; render(); }));
}
function riskNotes(r){
  const notes = [];
  if (num('utilizationHours') < 6) notes.push('Low utilization makes local hardware harder to justify. Rent or API-first may preserve cash.');
  if (num('maintenanceHours') > 6) notes.push('Maintenance assumptions are high. Standardize deployment and monitoring before buying more hardware.');
  if (r.breakEven > 30 || !Number.isFinite(r.breakEven)) notes.push('Break-even is slow or absent under current assumptions. Avoid capex unless strategic control matters.');
  if (num('monthlyTokens') > 1500) notes.push('High token volume makes local inference worth deeper benchmarking and model quality testing.');
  notes.push('Validate model quality, latency, and operator time with a two-week workload sample before purchase decisions.');
  return notes;
}
function render(){
  const r = calculate();
  metrics.innerHTML = [
    ['Local monthly', money(r.localMonthly)],
    ['API/cloud monthly', money(r.apiMonthly)],
    ['Monthly delta', money(r.delta)],
    ['Break-even', Number.isFinite(r.breakEven) ? `${r.breakEven.toFixed(1)} mo` : 'none']
  ].map(([k,v]) => `<div class="metric"><span>${k}</span><strong>${v}</strong></div>`).join('');
  recommendation.className = `panel recommendation ${r.mode}`;
  recommendation.innerHTML = `<h2>${r.title}</h2><p>${r.delta >= 0 ? 'Local saves against the modeled API/cloud baseline.' : 'API/cloud is cheaper under current assumptions.'}</p><p><span class="status">${r.mode.toUpperCase()}</span></p>`;
  breakdown.innerHTML = [
    ['Hardware depreciation', r.depreciation], ['Power', r.power], ['Maintenance time', r.maintenance], ['Local total', r.localMonthly], ['API/cloud baseline', r.apiMonthly], ['Delta', r.delta]
  ].map(([k,v]) => `<tr><td>${k}</td><td>${money(v)}</td></tr>`).join('');
  risks.innerHTML = riskNotes(r).map(x => `<li>${x}</li>`).join('');
  report.value = `Local AI Ops ROI Decision Report\n\nRecommendation: ${r.title}\nLocal monthly: ${money(r.localMonthly)}\nAPI/cloud monthly: ${money(r.apiMonthly)}\nMonthly delta: ${money(r.delta)}\nBreak-even: ${Number.isFinite(r.breakEven) ? r.breakEven.toFixed(1) + ' months' : 'none'}\n\nAssumptions:\n${fields.map(([id,label,,unit]) => `- ${label}: ${values[id]} ${unit}`).join('\n')}\n\nRisk notes:\n${riskNotes(r).map(x => '- ' + x).join('\n')}\n`;
}
document.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  values = { ...presets[btn.dataset.preset] };
  renderInputs(); render();
}));
download.addEventListener('click', () => {
  const blob = new Blob([report.value], { type:'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ai_ops_roi_decision_report.txt';
  a.click();
  URL.revokeObjectURL(a.href);
});
renderInputs();
render();
