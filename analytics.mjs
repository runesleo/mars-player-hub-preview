/**
 * Mars Player Hub analytics interface.
 * v0.3: NO NETWORK SINK. Emits local CustomEvent only.
 * Never include wallet addresses, spend amounts, P&L, calculator inputs or free text.
 */
const SAFE_KEYS=new Set(["page","tool","target","action"]);
export function track(name,meta={}){
  const detail={name:String(name),meta:{}};
  for(const [k,v] of Object.entries(meta||{})){
    if(SAFE_KEYS.has(k))detail.meta[k]=String(v);
  }
  window.dispatchEvent(new CustomEvent("mph:analytics",{detail}));
}
window.mphTrack=track;
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-track]");
  if(!el)return;
  track("click",{target:el.dataset.track,action:el.tagName.toLowerCase()});
});
