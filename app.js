const form=document.querySelector('#calc');
const result=document.querySelector('#result');
const money=n=>new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2}).format(n||0);
form.addEventListener('submit',e=>{
  e.preventDefault();
  const invested=Number(document.querySelector('#invested').value||0);
  const realized=Number(document.querySelector('#realized').value||0);
  const liquid=Number(document.querySelector('#liquid').value||0);
  const illiquid=Number(document.querySelector('#illiquid').value||0);
  if(invested<=0){result.className='result';result.textContent='累计投入必须大于 0。';return;}
  const nav=liquid+illiquid;
  const totalRecovery=realized+nav;
  const pnl=totalRecovery-invested;
  const realizedRecovery=realized/invested*100;
  const recovery=totalRecovery/invested*100;
  const gap=Math.max(0,invested-totalRecovery);
  result.className='result';
  result.innerHTML=`<div><strong>${pnl>=0?'已达到保守回本线':'尚未达到保守回本线'}</strong></div><p>保守当前 NAV：${money(nav)}</p><p>净 P&L：${pnl>=0?'+':''}${money(pnl)}</p><p>已实现回收率：${realizedRecovery.toFixed(1)}%</p><p>总回收率（含保守 NAV）：${recovery.toFixed(1)}%</p><p>${gap>0?'距离保守回本还差：'+money(gap):'超过保守回本线：'+money(Math.abs(pnl))}</p><small class="muted">这只是按你输入的保守估值计算，不代表资产一定能按该价格兑现。</small>`;
});
