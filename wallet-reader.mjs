export function isEvmAddress(value){
  return /^0x[0-9a-fA-F]{40}$/.test(String(value||"").trim());
}
export function normalizeAddress(value){
  const a=String(value||"").trim();
  if(!isEvmAddress(a))throw new Error("INVALID_ADDRESS");
  return a.toLowerCase();
}
export function addressWord(address){
  return normalizeAddress(address).slice(2).padStart(64,"0");
}
export function uintWord(value){
  return BigInt(value).toString(16).padStart(64,"0");
}
export function formatUnits(value,decimals=18,maxFraction=6){
  const n=BigInt(value);
  const base=10n**BigInt(decimals);
  const whole=n/base;
  if(decimals===0)return whole.toString();
  const rem=(n%base).toString().padStart(decimals,"0").replace(/0+$/,"");
  if(!rem)return whole.toString();
  return whole.toString()+"."+rem.slice(0,maxFraction);
}
export function buildWalletBatch(address,cfg){
  const a=normalizeAddress(address);
  const aw=addressWord(a);
  const batch=[
    {jsonrpc:"2.0",id:1,method:"eth_getBalance",params:[a,"latest"]},
    {jsonrpc:"2.0",id:2,method:"eth_call",params:[{to:cfg.contracts.drill,data:"0x70a08231"+aw},"latest"]},
    {jsonrpc:"2.0",id:3,method:"eth_call",params:[{to:cfg.contracts.plot,data:"0x70a08231"+aw},"latest"]}
  ];
  for(let i=0;i<Number(cfg.oreCount||12);i++){
    batch.push({
      jsonrpc:"2.0",id:100+i,method:"eth_call",
      params:[{to:cfg.contracts.stones,data:"0x00fdd58e"+aw+uintWord(i)},"latest"]
    });
  }
  return batch;
}
function rowById(rows,id){
  return (rows||[]).find(x=>Number(x.id)===Number(id))||null;
}
function valueOrNull(rows,id){
  const row=rowById(rows,id);
  if(!row||row.error||row.result==null)return null;
  try{return BigInt(row.result||"0x0");}catch(e){return null;}
}
function errorFor(rows,id){
  const row=rowById(rows,id);
  if(!row)return "missing result";
  if(row.error)return row.error.message||"rpc error";
  return null;
}
export function decodeWalletBatch(rows,cfg,address){
  const required=[1,2,3,...Array.from({length:Number(cfg.oreCount||12)},(_,i)=>100+i)];
  for(const id of required){
    const row=rowById(rows,id);
    if(!row)throw new Error("RPC_RESULT_MISSING_"+id);
    if(row.error)throw new Error("RPC_ERROR_"+id);
  }
  const ores={};
  for(let i=0;i<Number(cfg.oreCount||12);i++)ores[i]=Number(valueOrNull(rows,100+i));
  const native=valueOrNull(rows,1),drill=valueOrNull(rows,2),plots=valueOrNull(rows,3);
  return {
    schema:"mars-player-hub.wallet-snapshot.v1",
    address:normalizeAddress(address),
    chainId:Number(cfg.chainId),
    capturedAt:Date.now(),
    nativeWei:native.toString(),
    nativeFormatted:formatUnits(native,Number(cfg.decimals.native||18),6),
    drillWei:drill.toString(),
    drillFormatted:formatUnits(drill,Number(cfg.decimals.drill||18),6),
    plotCount:Number(plots),
    ores,
    errors:[]
  };
}
export function decodeWalletPartial(rows,cfg,address){
  const native=valueOrNull(rows,1),drill=valueOrNull(rows,2),plots=valueOrNull(rows,3);
  const ores={},errors=[];
  if(native==null)errors.push({field:"native",message:errorFor(rows,1)});
  if(drill==null)errors.push({field:"drill",message:errorFor(rows,2)});
  if(plots==null)errors.push({field:"plot",message:errorFor(rows,3)});
  for(let i=0;i<Number(cfg.oreCount||12);i++){
    const v=valueOrNull(rows,100+i);
    ores[i]=v==null?null:Number(v);
    if(v==null)errors.push({field:"ore:"+i,message:errorFor(rows,100+i)});
  }
  return {
    schema:"mars-player-hub.wallet-snapshot.v1",
    address:normalizeAddress(address),
    chainId:Number(cfg.chainId),
    capturedAt:Date.now(),
    nativeWei:native==null?null:native.toString(),
    nativeFormatted:native==null?null:formatUnits(native,Number(cfg.decimals.native||18),6),
    drillWei:drill==null?null:drill.toString(),
    drillFormatted:drill==null?null:formatUnits(drill,Number(cfg.decimals.drill||18),6),
    plotCount:plots==null?null:Number(plots),
    ores,
    errors
  };
}
async function rpcSingle(req,cfg,fetchImpl){
  try{
    const res=await fetchImpl(cfg.rpc,{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify(req)
    });
    if(!res.ok)return {jsonrpc:"2.0",id:req.id,error:{message:"HTTP "+res.status}};
    const data=await res.json();
    if(Array.isArray(data))return data[0]||{jsonrpc:"2.0",id:req.id,error:{message:"empty response"}};
    return data;
  }catch(err){
    return {jsonrpc:"2.0",id:req.id,error:{message:String(err?.message||err)}};
  }
}
async function mapLimit(items,limit,fn){
  const out=new Array(items.length);
  let cursor=0;
  async function worker(){
    while(true){
      const i=cursor++;
      if(i>=items.length)return;
      out[i]=await fn(items[i],i);
    }
  }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));
  return out;
}
export async function readWallet(address,cfg,fetchImpl=fetch){
  const requests=buildWalletBatch(address,cfg);
  // SolidRPC public endpoint explicitly disallows JSON-RPC batching.
  // Keep a small concurrency cap so the page stays responsive without burst-spamming the endpoint.
  const rows=await mapLimit(requests,4,req=>rpcSingle(req,cfg,fetchImpl));
  return decodeWalletPartial(rows,cfg,address);
}
export function shortAddress(address){
  const a=normalizeAddress(address);
  return a.slice(0,6)+"…"+a.slice(-4);
}
