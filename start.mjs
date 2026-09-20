import{lang}from"./i18n.mjs";import{loadJSON,fmt,dateText,esc}from"./common.mjs";
const [m,terms]=await Promise.all([loadJSON("./data/mechanics.json"),loadJSON(lang==="zh"?"./data/terms.json":"./data/terms.en.json")]);
const tbody=document.querySelector("#rig-table");
const note=lang==="zh"?{1:"练手 / 低资金",2:"短周期",3:"中档",4:"常规吞吐",5:"高级矿石路径"}:{1:"Learning / low capital",2:"Short cycle",3:"Mid tier",4:"General throughput",5:"Rare-Ore path"};
tbody.innerHTML=m.rigs.map(r=>'<tr><td>T'+r.tier+'</td><td>'+r.name+'</td><td>'+fmt(r.betDrill,0)+'</td><td>'+fmt(r.durationSeconds/3600,2)+'h</td><td>'+fmt(r.expectedBaseDrill,2)+'</td><td>'+note[r.tier]+'</td></tr>').join("");
document.querySelector("#config-source").innerHTML='<span class="badge good">一手公开数据</span><span>/api/history · '+dateText(m.checkedAt)+'</span><span>概率为期望值，不是单轮保证</span>';
const termGrid=document.querySelector("#terms-grid");
termGrid.innerHTML=terms.map(x=>'<article class="term-card"><strong>'+esc(lang==="zh"?x.zh:x.en)+'</strong><span>'+esc(lang==="zh"?x.en:x.community)+'</span><p>'+esc(x.note)+'</p></article>').join("");
