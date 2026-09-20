import {t} from "./i18n.mjs";
import {loadJSON,fmt,pct,dateText,esc} from "./common.mjs";
import {calcPnl,calcRigEconomics,calcOreVsMine,calcUpgrade,upgradeRequirements,calcEpochScenario} from "./calcs.mjs";

const [m,epoch]=await Promise.all([
  loadJSON("./data/mechanics.json"),
  loadJSON("./data/epoch.json")
]);

document.querySelector("#tool-source").innerHTML=
  '<span class="badge good">官方配置</span><span>/api/history · '+dateText(m.checkedAt)+'</span><span>可变市场数据由玩家输入</span>';

document.querySelectorAll(".rig-select").forEach(s=>{
  s.innerHTML=m.rigs.map(r=>
    '<option value="'+r.tier+'">T'+r.tier+' · '+r.name+' · '+fmt(r.betDrill,0)+' DRILL / '+fmt(r.durationSeconds/3600,2)+'h</option>'
  ).join("");
});
document.querySelectorAll(".level-select").forEach(s=>{
  const max=s.id==="upgrade-level"?m.plot.maxLevel-1:m.plot.maxLevel;
  s.innerHTML=Array.from({length:max},(_,i)=>'<option value="'+(i+1)+'">L'+(i+1)+'</option>').join("");
  if(s.id!=="upgrade-level")s.value="1";
});
document.querySelectorAll(".ore-select").forEach(s=>{
  s.innerHTML=m.oreLabels.map((x,i)=>'<option value="'+i+'">'+esc(x)+'</option>').join("");
});

function syncOwnership(form){
  const mode=form.querySelector(".ownership-mode")?.value||"own";
  const own=form.querySelector(".own-plot-field");
  const level=form.querySelector('[name="plotLevel"]');
  if(own){
    own.hidden=mode!=="own";
    own.setAttribute("aria-disabled",mode==="own"?"false":"true");
  }
  if(level)level.disabled=mode!=="own";
}
document.querySelectorAll("form").forEach(form=>{
  const mode=form.querySelector(".ownership-mode");
  if(mode){
    mode.addEventListener("change",()=>syncOwnership(form));
    syncOwnership(form);
  }
});

function lowestTierForOres(oreIds){
  const ids=[...new Set(oreIds.map(Number))];
  const rig=m.rigs.find(r=>ids.every(id=>Number((r.expectedOrePerCycle||[])[id]||0)>0));
  return rig?.tier||m.rigs[m.rigs.length-1]?.tier||1;
}
const oreForm=document.querySelector("#ore-form");
const oreTarget=oreForm.querySelector('[name="oreId"]');
const oreTier=oreForm.querySelector('[name="tier"]');
function syncOreTier(){oreTier.value=String(lowestTierForOres([Number(oreTarget.value)]));}
oreTarget.addEventListener("change",syncOreTier);
syncOreTier();

const shareText={};
function wireCopy(key){
  const b=document.querySelector("#"+key+"-copy");
  if(!b)return;
  b.addEventListener("click",async()=>{
    if(!shareText[key])return;
    try{
      await navigator.clipboard.writeText(t(shareText[key]));
      b.textContent="已复制";
      setTimeout(()=>b.textContent=key==="epoch"?"复制分享摘要":"复制结果摘要",1400);
    }catch(e){b.textContent="复制失败";}
  });
}
["pnl","rig","ore","upgrade","epoch"].forEach(wireCopy);
function enableCopy(key,lines){
  shareText[key]=Array.isArray(lines)?lines.join("\n"):String(lines);
  const b=document.querySelector("#"+key+"-copy");
  if(b)b.disabled=false;
}
function grid(items){
  return '<div class="result-grid">'+items.map(x=>
    '<div class="result-item"><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>'
  ).join("")+'</div>';
}
function unitValue(n,unit){return fmt(n)+" "+esc(unit);}

document.querySelector("#pnl-form").addEventListener("submit",e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.currentTarget));
  const unit=d.unit||"USD";
  const o=document.querySelector("#pnl-result");
  try{
    const x=calcPnl(d);
    o.innerHTML=grid([
      ["保守 NAV",unitValue(x.nav,unit)],
      ["净 P&L",(x.pnl>=0?"+":"")+unitValue(x.pnl,unit)],
      ["已实现回收率",pct(x.realizedRecoveryPct)],
      ["总回收率",pct(x.totalRecoveryPct)],
      ["距离回本",unitValue(x.gapToBreakeven,unit)]
    ])+'<p class="assumption">所有金额都按 '+esc(unit)+' 计算。非流动资产能否按你填的估值兑现，仍是你的假设。</p>';
    window.mphTrack?.("tool_calculated",{tool:"pnl"});
    enableCopy("pnl",[
      "Project Mars 回本计算（"+unit+"）",
      "保守 NAV: "+fmt(x.nav)+" "+unit,
      "净 P&L: "+(x.pnl>=0?"+":"")+fmt(x.pnl)+" "+unit,
      "已实现回收率: "+pct(x.realizedRecoveryPct),
      "总回收率: "+pct(x.totalRecoveryPct),
      "距离保守回本: "+fmt(x.gapToBreakeven)+" "+unit,
      "Mars Player Hub"
    ]);
  }catch(err){
    o.textContent="请输入大于 0 的累计投入，并确保所有金额使用同一种单位。";
  }
});

document.querySelector("#rig-form").addEventListener("submit",e=>{
  e.preventDefault();
  syncOwnership(e.currentTarget);
  const d=Object.fromEntries(new FormData(e.currentTarget));
  d.ownershipMode=e.currentTarget.querySelector(".ownership-mode").value;
  if(d.ownershipMode==="guest")d.plotLevel=1;
  const x=calcRigEconomics(m,d),o=document.querySelector("#rig-result");
  const role=x.ownershipMode==="own"?"自己的地块（Plot）":"别人的开放地块（Open Plot）";
  const ownerLabel=x.ownershipMode==="own"?fmt(x.ownerBonus,2)+" DRILL":"0（访客不计地主 bonus）";
  o.innerHTML=grid([
    ["参与方式",role],
    ["Rig 成本",fmt(x.rig.betDrill,0)+" DRILL"],
    ["期望 Base",fmt(x.rig.expectedBaseDrill,2)+" DRILL"],
    ["Owner bonus",ownerLabel],
    ["其他 Bonus",fmt(x.extraBonusDrill,2)+" DRILL"],
    ["Ore 卖出净值",fmt(x.oreNet,2)+" DRILL"],
    ["OIL",fmt(x.oilUnits,0)+"（单独计）"],
    ["现金 P&L",fmt(x.cashPnl,2)+" DRILL"],
    ["现金 ROI",pct(x.cashRoiPct,2)]
  ])+'<p class="assumption">'+(x.ownershipMode==="guest"
      ?"访客模式不自动估算 open plot 的动态访客 bonus；如果你在当前 UI 已确认额外奖励，可在高级参数手动填。"
      :"Owner bonus 按当前 Plot Level 的 owner cut × 期望 base DRILL 估算。")+' Ore 市场默认卖方净收 95%；OIL 默认价值 0。</p>';
  window.mphTrack?.("tool_calculated",{tool:"rig"});
  enableCopy("rig",[
    "Project Mars Rig 计算",
    "模式: "+role,
    "T"+x.rig.tier+" "+x.rig.name+(x.ownershipMode==="own"?" / L"+d.plotLevel:""),
    "成本: "+fmt(x.rig.betDrill,0)+" DRILL",
    "期望 Base: "+fmt(x.rig.expectedBaseDrill,2),
    "Owner bonus: "+ownerLabel,
    "其他 Bonus: "+fmt(x.extraBonusDrill,2),
    "Ore 净值假设: "+fmt(x.oreNet,2),
    "现金 P&L: "+fmt(x.cashPnl,2)+" DRILL / ROI "+pct(x.cashRoiPct,2),
    "OIL: "+fmt(x.oilUnits,0)+"（默认不计现金）",
    "Mars Player Hub"
  ]);
});

document.querySelector("#ore-form").addEventListener("submit",e=>{
  e.preventDefault();
  syncOwnership(e.currentTarget);
  const d=Object.fromEntries(new FormData(e.currentTarget));
  d.ownershipMode=e.currentTarget.querySelector(".ownership-mode").value;
  if(d.ownershipMode==="guest")d.plotLevel=1;
  const o=document.querySelector("#ore-result");
  if(d.missingQty===""||d.askPerOre===""){
    o.textContent="请填写“还缺多少”和当前 Ask，才能比较买入与自然挖矿。";
    return;
  }
  const x=calcOreVsMine(m,d);
  const role=d.ownershipMode==="own"?"自己的地块（Plot）":"别人的开放地块（Open Plot）";
  if(!Number.isFinite(x.cycles)){
    o.innerHTML='<strong>所选 Rig 无法自然产出这个 Ore。</strong><p class="assumption">换更合适的 Tier，或直接比较市场购买。当前模式：'+esc(role)+'。</p>';
    window.mphTrack?.("tool_calculated",{tool:"ore"});
    enableCopy("ore",[
      "Project Mars Ore 比较",
      "目标: "+m.oreLabels[Number(d.oreId)]+" / 缺 "+fmt(Number(d.missingQty||0),2),
      "T"+d.tier+" 无法自然产出该 Ore",
      "Mars Player Hub"
    ]);
    return;
  }
  const cheaper=x.buyCost<x.mineCashCost?"买入的现金成本更低":"自然挖的现金成本更低";
  o.innerHTML='<strong>'+cheaper+'</strong>'+grid([
    ["参与方式",role],
    ["期望产量 / 轮",fmt(x.yieldPerCycle,3)],
    ["预计需要",fmt(x.cycles,2)+" 轮"],
    ["时间",fmt(x.hours,1)+"h"],
    ["直接买入",fmt(x.buyCost,2)+" DRILL"],
    ["自然挖现金成本",fmt(x.mineCashCost,2)+" DRILL"],
    ["每轮净现金成本",fmt(x.netCostPerCycle,2)+" DRILL"]
  ])+'<p class="assumption">自然挖成本用官方期望 base、与你角色匹配的 bonus 口径，再减你填写的其他产出价值；不包含机会成本和价格波动。</p>';
  window.mphTrack?.("tool_calculated",{tool:"ore"});
  enableCopy("ore",[
    "Project Mars Ore 比较",
    "模式: "+role,
    "目标: "+m.oreLabels[Number(d.oreId)]+" / 缺 "+fmt(Number(d.missingQty||0),2),
    "T"+d.tier+" 期望 "+fmt(x.yieldPerCycle,3)+"/轮",
    "预计 "+fmt(x.cycles,2)+" 轮 / "+fmt(x.hours,1)+"h",
    "直接买: "+fmt(x.buyCost,2)+" DRILL",
    "自然挖现金成本: "+fmt(x.mineCashCost,2)+" DRILL",
    "结论: "+cheaper,
    "Mars Player Hub"
  ]);
});

const level=document.querySelector("#upgrade-level");
const rig=document.querySelector("#upgrade-rig");
const reqBox=document.querySelector("#requirements");
const next=document.querySelector("#next-level");
const walletPrefillStatus=document.querySelector("#wallet-prefill-status");

function loadWalletPrefill(){
  try{
    const raw=sessionStorage.getItem("mph.walletPrefill.v1");
    if(!raw)return null;
    const x=JSON.parse(raw);
    if(!x||x.schema!=="mars-player-hub.wallet-prefill.v1"||!x.ores)return null;
    return x;
  }catch(e){return null;}
}
function applyWalletPrefill(){
  const snap=loadWalletPrefill();
  if(!snap){
    walletPrefillStatus.innerHTML='<a href="./wallet.html">不想手填矿石库存？用只读钱包助手 →</a>';
    return;
  }
  reqBox.querySelectorAll(".req-row").forEach(row=>{
    const id=row.dataset.ore;
    const input=row.querySelector(".held");
    if(input&&Object.prototype.hasOwnProperty.call(snap.ores,id))input.value=String(snap.ores[id]);
  });
  const a=String(snap.address||"");
  const short=a.length===42?a.slice(0,6)+"…"+a.slice(-4):"本次会话";
  walletPrefillStatus.innerHTML='<strong>已带入钱包库存</strong> · '+esc(short)+' · DRILL '+esc(snap.drillFormatted||"—")+' · Plot '+fmt(Number(snap.plotCount||0),0)+' <button id="wallet-prefill-clear" class="link-button" type="button">清除</button>';
  document.querySelector("#wallet-prefill-clear")?.addEventListener("click",()=>{
    sessionStorage.removeItem("mph.walletPrefill.v1");
    renderReq();
  });
}
function renderReq(){
  const u=upgradeRequirements(m,level.value);
  next.textContent="L"+u.next;
  rig.value=String(lowestTierForOres(u.requirements.map(x=>x.id)));
  reqBox.innerHTML=u.requirements.map(x=>
    '<div class="req-row" data-ore="'+x.id+'">'+
    '<div><strong>'+esc(m.oreLabels[x.id])+'</strong><div class="muted">需要 '+fmt(x.amount,0)+'</div></div>'+
    '<label>你持有<input class="held" inputmode="decimal" type="number" min="0" step="0.01" value="0"></label>'+
    '<label>Ask / 个（可留空）<input class="ask" inputmode="decimal" type="number" min="0" step="0.01" placeholder="未报价"></label>'+
    '<div class="muted">缺口稍后计算</div></div>'
  ).join("");
  applyWalletPrefill();
}
level.addEventListener("change",renderReq);
renderReq();

document.querySelector("#upgrade-calc").addEventListener("click",()=>{
  const held={},asks={};
  reqBox.querySelectorAll(".req-row").forEach(row=>{
    const id=row.dataset.ore;
    held[id]=row.querySelector(".held").value;
    asks[id]=row.querySelector(".ask").value;
  });
  const x=calcUpgrade(m,{currentLevel:level.value,tier:rig.value,held,asks});
  const rows=x.rows.map(r=>
    '<tr><td>'+esc(m.oreLabels[r.id])+'</td><td>'+fmt(r.amount,0)+'</td><td>'+fmt(r.have,0)+'</td><td>'+fmt(r.missing,0)+'</td><td>'+fmt(r.yieldPerCycle,3)+'</td><td>'+(Number.isFinite(r.cycles)?fmt(r.cycles,2):"该 Tier 不产出")+'</td><td>'+(r.missing>0&&r.ask<=0?"未报价":fmt(r.buyCost,2))+'</td></tr>'
  ).join("");
  const pricedCost=x.unpricedMissing>0?fmt(x.buyCost,2)+" DRILL（仅已报价）":fmt(x.buyCost,2)+" DRILL";
  document.querySelector("#upgrade-result").innerHTML=
    grid([
      ["权重（Weight）",fmt(x.weightBefore,0)+" → "+fmt(x.weightAfter,0)],
      ["权重提升",pct(x.weightUpliftPct,1)],
      ["地块主分成（Owner Cut）",fmt(x.cutBeforeBps/100,2)+"% → "+fmt(x.cutAfterBps/100,2)+"%"],
      ["缺口买入成本",pricedCost],
      ["未报价矿石",x.unpricedMissing>0?String(x.unpricedMissing)+" 种":"0"],
      ["自然补料瓶颈",x.unmineable?"所选钻机无法补齐":fmt(x.bottleneckCycles,2)+" 轮"],
      ["预计瓶颈时间",x.unmineable?"—":fmt(x.bottleneckHours,1)+"h"]
    ])+
    '<div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>Ore</th><th>需要</th><th>持有</th><th>缺</th><th>期望/轮</th><th>轮数</th><th>买入成本</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<p class="assumption">Ask 留空时不会把成本当 0；“自然补料瓶颈”仍按缺口 / 所选 Rig 的期望产量计算。</p>';
  window.mphTrack?.("tool_calculated",{tool:"upgrade"});
  enableCopy("upgrade",[
    "Project Mars 升级规划",
    "L"+x.level+" → L"+x.next,
    "权重（Weight）: "+fmt(x.weightBefore,0)+" → "+fmt(x.weightAfter,0)+" ("+pct(x.weightUpliftPct,1)+")",
    "地块主分成（Owner Cut）: "+fmt(x.cutBeforeBps/100,2)+"% → "+fmt(x.cutAfterBps/100,2)+"%",
    "已报价缺口成本: "+fmt(x.buyCost,2)+" DRILL"+(x.unpricedMissing>0?"；另有 "+x.unpricedMissing+" 种矿石未报价":""),
    "自然补料瓶颈: "+(x.unmineable?"所选钻机无法补齐":fmt(x.bottleneckCycles,2)+" 轮 / "+fmt(x.bottleneckHours,1)+"h"),
    "Mars Player Hub"
  ]);
});

const epochRig=document.querySelector("#epoch-rig");
epochRig.innerHTML='<option value="0">不加 Rig</option>'+m.rigs.map(r=>
  '<option value="'+r.tier+'">下一轮 T'+r.tier+' · +'+fmt(r.betDrill,0)+' DRILL</option>'
).join("");
document.querySelector("#epoch-meta").innerHTML=
  '<span class="badge good">Epoch '+epoch.epoch.number+' · '+esc(epoch.epoch.status)+'</span>'+
  '<span>参与者 '+fmt(epoch.epoch.participants,0)+'</span>'+
  '<span>奖励 '+esc(epoch.epoch.reward)+'</span>'+
  '<span>同分 '+esc(epoch.epoch.tieBreak)+'</span>'+
  '<span>快照 '+dateText(epoch.generatedAt)+'</span>';
document.querySelector("#epoch-bands").innerHTML=epoch.bands.map(b=>
  '<tr><td>'+fmt(b.shareBps/100,2)+'%</td><td>#'+b.startRank+(b.endRank!==b.startRank?'–'+b.endRank:'')+'</td><td>'+esc(b.credits)+'</td><td>'+fmt(b.entrySpentDrill,0)+' DRILL</td></tr>'
).join("");

function rankLabel(p){
  if(p.outsideTopN)return 'Top '+p.topN+' 之外';
  return p.bestRank===p.worstRank?'#'+p.bestRank:'#'+p.bestRank+'–#'+p.worstRank;
}
function rewardLabel(p){
  const a=p.bestBand?.credits,b=p.worstBand?.credits;
  if(a==null&&b==null)return '0';
  return a===b?String(a):String(b)+'–'+String(a);
}
function bandRankLabel(b){
  return b?'#'+b.startRank+(b.endRank!==b.startRank?'–'+b.endRank:''):'—';
}
document.querySelector("#epoch-form").addEventListener("submit",e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.currentTarget));
  if(d.spentDrill===""){
    document.querySelector("#epoch-result").textContent="请先填写你自己的累计 Paid-Rig Spend。";
    return;
  }
  const x=calcEpochScenario(epoch,m,d),o=document.querySelector("#epoch-result");
  const tier=x.plannedRig?'T'+x.plannedRig.tier:'无';
  const nextBand=x.nextBetterBand;
  const crossing=rewardLabel(x.current)!==rewardLabel(x.after);
  o.innerHTML=
    '<strong>'+(crossing?'按当前静态快照：下一情景会改变奖励档':'按当前静态快照：奖励档不变')+'</strong>'+
    grid([
      ["现在静态名次",rankLabel(x.current)],
      ["现在 Credits",rewardLabel(x.current)],
      ["下一情景",tier+' / +'+fmt(x.additionalSpend,0)],
      ["Spend 后",fmt(x.scoreAfter,0)+' DRILL'],
      ["Spend 后静态名次",rankLabel(x.after)],
      ["Spend 后 Credits",rewardLabel(x.after)]
    ])+
    (nextBand
      ?'<p class="assumption">下一更高档：'+bandRankLabel(nextBand)+' / '+esc(nextBand.credits)+' credits；当前快照档尾分数约 '+fmt(nextBand.entrySpentDrill,0)+' DRILL。打到同分仍受 first-reached-score 影响，严格高于阈值才不受同分顺序影响。</p>'
      :'<p class="assumption">当前已在最高奖励档。</p>');
  window.mphTrack?.("tool_calculated",{tool:"epoch"});
  enableCopy("epoch",[
    "Project Mars Epoch "+epoch.epoch.number+" 静态快照",
    "当前 spend: "+fmt(x.current.spentDrill,0)+" DRILL → "+rankLabel(x.current)+" / "+rewardLabel(x.current)+" credits",
    "情景: "+tier+" + extra "+fmt(Number(d.extraSpend||0),0)+" → "+fmt(x.scoreAfter,0)+" DRILL → "+rankLabel(x.after)+" / "+rewardLabel(x.after)+" credits",
    "注意：榜单动态变化；同分按 first-reached-score。",
    "Mars Player Hub"
  ]);
});
