export async function loadJSON(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw new Error("LOAD_FAILED_"+path);return r.json();}
export function fmt(n,d=2){if(!Number.isFinite(Number(n)))return "—";return new Intl.NumberFormat("zh-CN",{maximumFractionDigits:d}).format(Number(n));}
export function pct(n,d=1){return Number.isFinite(Number(n))?Number(n).toFixed(d)+"%":"—";}
export function dateText(ms){if(!ms)return "未知";return new Date(ms).toLocaleString("zh-CN",{hour12:false});}
export function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
