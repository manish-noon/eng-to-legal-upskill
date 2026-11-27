// All learning records live in this browser. Public exhibits and the public marking
// key can be served by any static server.
const LS = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key,value) { localStorage.setItem(key,JSON.stringify(value)); }
};
let exhibits;
async function publicExhibits() {
  if (!exhibits) {
    const response = await fetch('data/precedents.json');
    if (!response.ok) throw new Error('The exhibit index could not be loaded.');
    exhibits = await response.json();
  }
  return exhibits;
}
function gradeExtraction(row, answers) {
  const marks = row.fields.map((field,i) => field.value === answers[i]);
  const score = marks.filter(Boolean).length;
  const graded = LS.get('av_graded',{});
  graded[row.id] = Math.max(graded[row.id] || 0, score);
  LS.set('av_graded',graded);
  return marks;
}
function quartile(values,fraction) {
  const sorted = [...values].sort((a,b)=>a-b);
  const index = (sorted.length-1)*fraction;
  const low = Math.floor(index);
  return sorted[low] + (index-low)*(sorted[Math.ceil(index)]-sorted[low]);
}
function priceExposure({price, costs, probability, loss, recovery, ceiling}) {
  const tail = Math.max(0,loss-recovery);
  const kept = tail*probability/100;
  const breakEven = ceiling-costs-kept;
  return {tail,kept,breakEven,headroom:breakEven-price,effective:price+costs+kept};
}
