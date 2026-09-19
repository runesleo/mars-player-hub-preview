export function calcPnl({invested=0,realized=0,liquid=0,illiquid=0}){
  invested=Number(invested);realized=Number(realized);liquid=Number(liquid);illiquid=Number(illiquid);
  if(!(invested>0))throw new Error("INVESTED_REQUIRED");
  const nav=liquid+illiquid,totalRecovery=realized+nav,pnl=totalRecovery-invested;
  return {nav,totalRecovery,pnl,realizedRecoveryPct:realized/invested*100,totalRecoveryPct:totalRecovery/invested*100,gapToBreakeven:Math.max(0,-pnl)};
}
export function rigByTier(mechanics,tier){const r=mechanics.rigs.find(x=>x.tier===Number(tier));if(!r)throw new Error("RIG_NOT_FOUND");return r;}
export function calcRigEconomics(mechanics,{tier=1,plotLevel=1,ownershipMode="own",oreGrossValue=0,gasDrill=0,oilValuePerUnit=0,extraBonusDrill=0}={}){
  const r=rigByTier(mechanics,tier),level=Number(plotLevel);
  const cut=Number(mechanics.plot.cutsBps[level]||0);
  const ownerBonus=ownershipMode==="own"?r.expectedBaseDrill*cut/10000:0;
  const extraBonus=Number(extraBonusDrill||0);
  const oreNet=Number(oreGrossValue||0)*(Number(mechanics.fees.oreMarketSellerReceivesBps||9500)/10000);
  const oilRate=Number((mechanics.runtime.oilRatesBps||[])[r.tier-1]||0),oilUnits=Math.floor(r.betDrill*oilRate/10000);
  const gas=Number(gasDrill||0),oilValue=oilUnits*Number(oilValuePerUnit||0);
  const cashPnl=r.expectedBaseDrill+ownerBonus+extraBonus+oreNet-r.betDrill-gas;
  const modeledPnl=cashPnl+oilValue,cyclesPerDay=86400/r.durationSeconds;
  return {rig:r,ownershipMode,cutBps:cut,ownerBonus,extraBonusDrill:extraBonus,oreNet,oilUnits,oilRateBps:oilRate,cashPnl,modeledPnl,cashRoiPct:cashPnl/r.betDrill*100,modeledRoiPct:modeledPnl/r.betDrill*100,cashDaily:cashPnl*cyclesPerDay,modeledDaily:modeledPnl*cyclesPerDay};
}
export function calcOreVsMine(mechanics,{tier=1,plotLevel=1,ownershipMode="own",oreId=0,missingQty=0,askPerOre=0,otherOutputNet=0,gasDrill=0,extraBonusDrill=0}={}){
  const r=rigByTier(mechanics,tier),oid=Number(oreId),missing=Number(missingQty||0);
  const y=Number((r.expectedOrePerCycle||[])[oid]||0);
  const base=calcRigEconomics(mechanics,{tier,plotLevel,ownershipMode,oreGrossValue:0,gasDrill,oilValuePerUnit:0,extraBonusDrill});
  const netCostPerCycle=r.betDrill+Number(gasDrill||0)-r.expectedBaseDrill-base.ownerBonus-base.extraBonusDrill-Number(otherOutputNet||0);
  const buyCost=missing*Number(askPerOre||0);
  if(missing<=0)return {yieldPerCycle:y,cycles:0,hours:0,buyCost,mineCashCost:0,netCostPerCycle};
  if(y<=0)return {yieldPerCycle:0,cycles:Infinity,hours:Infinity,buyCost,mineCashCost:Infinity,netCostPerCycle};
  const cycles=missing/y,hours=cycles*r.durationSeconds/3600,mineCashCost=cycles*netCostPerCycle;
  return {yieldPerCycle:y,cycles,hours,buyCost,mineCashCost,netCostPerCycle};
}
export function upgradeRequirements(mechanics,currentLevel){
  const level=Number(currentLevel),next=level+1;
  if(next>Number(mechanics.plot.maxLevel||20))return {level,next,requirements:[]};
  return {level,next,requirements:(mechanics.plot.costs[next]||[]).map(x=>({id:Number(x.id),amount:Number(x.amount)}))};
}
export function calcUpgrade(mechanics,{currentLevel=1,tier=1,held={},asks={}}={}){
  const {level,next,requirements}=upgradeRequirements(mechanics,currentLevel);
  const r=rigByTier(mechanics,tier);
  let buyCost=0,bottleneck=0,unmineable=false,unpricedMissing=0;
  const rows=requirements.map(req=>{
    const have=Number(held[req.id]||0),missing=Math.max(0,req.amount-have),ask=Number(asks[req.id]||0);
    buyCost+=missing*ask;
    if(missing>0&&ask<=0)unpricedMissing+=1;
    const y=Number((r.expectedOrePerCycle||[])[req.id]||0);
    let cycles=0;
    if(missing>0&&y<=0){cycles=Infinity;unmineable=true}else if(missing>0){cycles=missing/y;bottleneck=Math.max(bottleneck,cycles)}
    return {...req,have,missing,ask,buyCost:missing*ask,yieldPerCycle:y,cycles};
  });
  const w0=Number(mechanics.plot.weights[level]||0),w1=Number(mechanics.plot.weights[next]||0);
  const c0=Number(mechanics.plot.cutsBps[level]||0),c1=Number(mechanics.plot.cutsBps[next]||0);
  return {level,next,rows,buyCost,unpricedMissing,weightBefore:w0,weightAfter:w1,weightUpliftPct:w0>0?(w1/w0-1)*100:Infinity,cutBeforeBps:c0,cutAfterBps:c1,cutDeltaBps:c1-c0,bottleneckCycles:unmineable?Infinity:bottleneck,bottleneckHours:unmineable?Infinity:bottleneck*r.durationSeconds/3600,unmineable};
}


export function epochBandForRank(epochData,rank){
  rank=Number(rank);
  if(!Number.isFinite(rank)||rank<1)return null;
  return (epochData.bands||[]).find(b=>rank>=Number(b.startRank)&&rank<=Number(b.endRank))||null;
}
export function epochPlacement(epochData,spentDrill){
  const spent=Number(spentDrill||0),rows=epochData.rows||[];
  const eps=1e-9;
  const greater=rows.filter(r=>Number(r.spentDrill)>spent+eps).length;
  const equal=rows.filter(r=>Math.abs(Number(r.spentDrill)-spent)<=eps).length;
  const bestRank=greater+1;
  const worstRank=equal>0?greater+equal:bestRank;
  const topN=Number((epochData.epoch||{}).topN||rows.length||100);
  const bestBand=bestRank<=topN?epochBandForRank(epochData,bestRank):null;
  const worstBand=worstRank<=topN?epochBandForRank(epochData,worstRank):null;
  return {
    spentDrill:spent,greater,equal,bestRank,worstRank,topN,
    bestBand,worstBand,
    tied:equal>0,
    outsideTopN:bestRank>topN,
  };
}
export function calcEpochScenario(epochData,mechanics,{spentDrill=0,plannedTier=0,extraSpend=0}={}){
  const spent=Number(spentDrill||0);
  let add=Number(extraSpend||0);
  let rig=null;
  if(Number(plannedTier)>0){
    rig=rigByTier(mechanics,Number(plannedTier));
    add+=Number(rig.betDrill||0);
  }
  const now=epochPlacement(epochData,spent);
  const after=epochPlacement(epochData,spent+add);
  const currentBand=now.worstBand||now.bestBand;
  let nextBetter=null;
  if(currentBand){
    const bands=epochData.bands||[];
    const idx=bands.findIndex(b=>Number(b.startRank)===Number(currentBand.startRank));
    if(idx>0)nextBetter=bands[idx-1];
  }else{
    const bands=epochData.bands||[];
    nextBetter=bands.length?bands[bands.length-1]:null;
  }
  const threshold=nextBetter?Number(nextBetter.entrySpentDrill):null;
  return {
    current:now,after,plannedRig:rig,additionalSpend:add,
    scoreAfter:spent+add,nextBetterBand:nextBetter,
    gapToNextBand:threshold==null?null:Math.max(0,threshold-spent),
    strictlyAboveGap:threshold==null?null:Math.max(0,threshold-spent)+((threshold>=spent)?0.000001:0),
  };
}
