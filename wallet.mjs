import {loadJSON,fmt,dateText,esc} from "./common.mjs";
import {readWallet,isEvmAddress,shortAddress} from "./wallet-reader.mjs";

const [cfg,mechanics]=await Promise.all([
  loadJSON("./data/wallet-config.json"),
  loadJSON("./data/mechanics.json")
]);
const form=document.querySelector("#wallet-form");
const addressInput=document.querySelector("#wallet-address");
const status=document.querySelector("#wallet-status");
const section=document.querySelector("#wallet-result-section");
const oreBody=document.querySelector("#wallet-ore-body");
const readBtn=document.querySelector("#wallet-read");
const prefillBtn=document.querySelector("#wallet-prefill");
const copyBtn=document.querySelector("#wallet-copy");
let snapshot=null;

function setStatus(kind,text){
  status.innerHTML='<span class="badge '+(kind==="ok"?"good":kind==="error"?"warn":"")+'">'+esc(kind==="ok"?"已读取":kind==="error"?"查询失败":"查询中")+'</span><span>'+esc(text)+'</span>';
}
function render(s){
  document.querySelector("#wallet-native").textContent=s.nativeFormatted==null?"不可读":s.nativeFormatted+" ETH";
  document.querySelector("#wallet-drill").textContent=s.drillFormatted==null?"不可读":s.drillFormatted+" DRILL";
  document.querySelector("#wallet-plots").textContent=s.plotCount==null?"不可读":String(s.plotCount);
  oreBody.innerHTML=Object.entries(s.ores).map(([id,balance])=>{
    const label=(mechanics.oreLabels||[])[Number(id)]||("Ore "+id);
    return '<tr><td>'+esc(label)+'</td><td>'+(balance==null?'不可读':fmt(balance,0))+'</td></tr>';
  }).join("");
  section.hidden=false;
  setStatus("ok",shortAddress(s.address)+" · "+dateText(s.capturedAt)+" · 公共 RPC"+(s.errors.length?" · "+s.errors.length+" 项未读到":""));
}
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const address=addressInput.value.trim();
  if(!isEvmAddress(address)){
    setStatus("error","地址格式不正确。请输入 0x 开头的 40 字节 EVM 地址。");
    return;
  }
  readBtn.disabled=true;
  setStatus("loading","正在读取公开链上余额…");
  try{
    snapshot=await readWallet(address,cfg);
    render(snapshot);
    window.mphTrack?.("tool_calculated",{tool:"wallet"});
  }catch(err){
    console.error(err);
    setStatus("error","公共 RPC 查询失败。稍后重试；没有发生签名或交易。");
  }finally{
    readBtn.disabled=false;
  }
});
prefillBtn.addEventListener("click",()=>{
  if(!snapshot)return;
  const payload={
    schema:"mars-player-hub.wallet-prefill.v1",
    address:snapshot.address,
    capturedAt:snapshot.capturedAt,
    ores:snapshot.ores,
    drillFormatted:snapshot.drillFormatted,
    plotCount:snapshot.plotCount
  };
  sessionStorage.setItem("mph.walletPrefill.v1",JSON.stringify(payload));
  prefillBtn.textContent="已带入，本次会话有效";
  window.mphTrack?.("click",{target:"wallet_prefill",action:"button"});
});
copyBtn.addEventListener("click",async()=>{
  if(!snapshot)return;
  const nonzero=Object.entries(snapshot.ores).filter(([,n])=>n!=null&&Number(n)>0).map(([id,n])=>((mechanics.oreLabels||[])[Number(id)]||("Ore "+id))+": "+n);
  const text=[
    "Project Mars 钱包只读快照",
    "地址: "+shortAddress(snapshot.address),
    "Gas: "+(snapshot.nativeFormatted==null?"不可读":snapshot.nativeFormatted+" ETH"),
    "DRILL: "+(snapshot.drillFormatted==null?"不可读":snapshot.drillFormatted),
    "Plot 数量: "+(snapshot.plotCount==null?"不可读":snapshot.plotCount),
    "非零 Ore: "+(nonzero.length?nonzero.join(" / "):"无"),
    "Mars Player Hub"
  ].join("\n");
  try{
    await navigator.clipboard.writeText(text);
    copyBtn.textContent="已复制";
    setTimeout(()=>copyBtn.textContent="复制库存摘要",1400);
  }catch(e){copyBtn.textContent="复制失败";}
});
