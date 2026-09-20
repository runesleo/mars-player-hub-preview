export async function loadJSON(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw new Error("LOAD_FAILED_"+path);return r.json();}
const q=new URLSearchParams(location.search).get("lang");const l=(q==="en"||q==="zh")?q:(window.MPH_LANG||localStorage.getItem("mph.lang")||"en");const loc=l==="zh"?"zh-CN":"en-US";
export function fmt(n,d=2){if(!Number.isFinite(Number(n)))return "—";return new Intl.NumberFormat(loc,{maximumFractionDigits:d}).format(Number(n));}
export function pct(n,d=1){return Number.isFinite(Number(n))?Number(n).toFixed(d)+"%":"—";}
export function dateText(ms){if(!ms)return l==="zh"?"未知":"Unknown";return new Date(ms).toLocaleString(loc,{hour12:false});}
export function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
