const query=new URLSearchParams(location.search);
const q=query.get("lang");
if(q==="en"||q==="zh")localStorage.setItem("mph.lang",q);
export const lang=(q==="en"||q==="zh")?q:(localStorage.getItem("mph.lang")||"en");
export const isZh=lang==="zh";
export const locale=isZh?"zh-CN":"en-US";
window.MPH_LANG=lang;
document.documentElement.lang=isZh?"zh-CN":"en";

const P=[
["Project Mars 中文玩家中心","Community tools for Project Mars players"],["主导航","Main navigation"],
["新手入门","Start Here"],["工具","Tools"],["钱包助手","Wallet Helper"],["问答","FAQ"],["更新","Updates"],["社区","Community"],
["看懂 Mars。","Understand Mars."],["算清楚。再开始玩。","Run the numbers. Then play."],
["给 Project Mars 新玩家和活跃玩家的中文上手中心：官方机制快照、自己的回本计算、Rig / Ore / 升级工具、FAQ 和更新解读。默认不展示任何人的实时仓位。","A player-built hub for Project Mars: first-party mechanics snapshots, breakeven math, Rig / Ore / upgrade tools, FAQ, and update analysis. No live private positions by default."],
["5–10 分钟入门","Start in 5–10 minutes"],["打开玩家工具","Open player tools"],["官方入口","Official site"],
["你现在是哪种情况？","Where are you starting?"],["第一次来","New player"],["已经在玩","Active player"],["碰到问题","Need an answer"],
["我还没搞懂怎么玩","I need to understand the game"],["先花 5–10 分钟看懂 Driller / Plot Owner、Rig、DRILL、Ore 和一轮完整流程。","Spend 5–10 minutes on Driller vs Plot Owner, Rigs, DRILL, Ore, and one full cycle."],["从 Start Here 开始 →","Start here →"],
["我想算自己的账","I want to run my own numbers"],["回本、Rig、Ore 买 vs 挖、升级、Epoch 五个工具直接用自己的数据计算。","Use your own inputs for breakeven, Rig economics, buy-vs-mine Ore, upgrades, and Epoch scenarios."],["打开 Tools →","Open tools →"],
["我只想找一个答案","I just need one answer"],["直接搜索 FAQ，不需要从教程第一页重新看。","Search the FAQ directly instead of rereading the guide."],["搜索 FAQ →","Search FAQ →"],
["把群里重复解释的东西，做成所有人都能用的产品。","Turn repeated community questions into reusable tools."],["新人","New players"],["玩家","Players"],
["不用先买 Plot","You do not need a Plot first"],["先理解 Driller / Plot Owner 两条路径。官方允许在 open plot 上先当 Driller，降低第一次参与门槛。","Understand the Driller and Plot Owner paths first. You can start on an Open Plot without buying land."],
["每个人算自己的账","Everyone runs their own numbers"],["不看 Leo 仓位。输入自己的投入、Rig、Ore、库存和等级，得到自己的现金账和成长账。","No copy-trading. Enter your own capital, Rig, Ore, inventory and level to separate cash economics from progression."],
["问题沉淀成 FAQ","Turn questions into documentation"],["群里出现的新问题进入知识库，更新后统一修正，不让答案散落在聊天记录里。","New community questions become maintained documentation instead of disappearing into chat history."],
["最常问的问题，先搞定。","Solve the questions players ask most."],["我回本了吗？","Am I breakeven?"],["保守 NAV、净 P&L、已实现回收率、距离回本。","Conservative NAV, net P&L, realized recovery, and gap to breakeven."],
["这档钻机（Rig）值不值？","Is this Rig worth it?"],["官方期望 Base DRILL + 地块主奖励 + 矿石价值 + Gas + 可选 OIL 假设。","First-party expected Base DRILL + owner bonus + Ore value + gas + optional OIL assumptions."],
["矿石（Ore）买还是自己挖？","Buy Ore or mine it?"],["购买成本 vs 自然挖矿的现金成本和时间成本。","Compare purchase cost with the cash and time cost of mining."],
["升级还差多少？","What is missing for the next upgrade?"],["下一等级缺口、买齐成本、权重/分成提升、自然补料周期。","Material gaps, buy cost, Weight/Cut uplift, and expected mining cycles."],
["我现在在哪个赛季（Epoch）档？","Which Epoch reward band am I in?"],["匿名公共榜单快照 + 你的累计支出，计算静态名次区间和下一轮是否跨奖励档。","Use the public leaderboard snapshot plus your own spend to estimate the current rank band and next-cycle scenario."],
["我不想手填库存","I do not want to enter inventory manually"],["只贴公开地址，读取 Gas、DRILL、矿石（Ore）和地块（Plot）数量，再带入升级工具。","Paste a public address to read Gas, DRILL, Ore and Plot count, then prefill the upgrade tool."],
["免费工具解决共性问题，社区解决持续变化。","Free tools solve repeatable problems. Community handles what keeps changing."],
["公开群适合新人和日常交流；Insider 适合更深的机制、策略、工具和早期变化。入口与 referral 均已接入，并明确披露推荐关系。","The public community is for onboarding and daily discussion; Insider is for deeper mechanics, strategy, tooling and early changes. Referral relationships are disclosed."],
["加入 TG 大群","Join Telegram group"],["订阅 TG 频道","Follow Telegram channel"],["社群总入口 / Insider","Community / Insider"],["关注 @runes_leo","Follow @runes_leo"],
["推荐入口包含 Leo 的 referral 关系。是否使用完全可选，不影响免费教程、FAQ 和计算器；使用推荐入口可以支持工具与社区持续维护。","Some outbound links use Leo's referral. It is optional and does not affect access to free guides, FAQ or calculators; using it helps fund maintenance."],
["Project Mars，第一次只需要看懂这一页。","Project Mars: understand this page before doing anything else."],
["目标不是让你马上放大仓位，而是让你知道自己在花什么、等什么、收什么，以及下一步为什么这样做。","The goal is not to size up immediately. Know what you spend, what you wait for, what you collect, and why the next action makes sense."],
["官方规则优先","First-party rules first"],["如果页面参数与游戏当前 UI 不一致，以官方当前 UI 为准。","If this page disagrees with the live game UI, trust the live game UI."],
["先选角色：钻工（Driller）不等于地块主（Plot Owner）。","Choose your role first: Driller is not the same as Plot Owner."],["轻入口","Lower-capital path"],["重资本","Capital-heavy path"],
["钻工（Driller）","Driller"],["地块主（Plot Owner）","Plot Owner"],
["花 DRILL 部署钻机（Rig），等待后收矿（Collect），拿 Base DRILL、矿石（Ore）和其他当前启用的材料/奖励。你可以在别人的开放地块（Open Plot）上开始，不必先买地。","Spend DRILL to deploy a Rig, wait, then Collect Base DRILL, Ore and other enabled materials/rewards. You can start on another player's Open Plot without owning land."],
["持有地块（Plot）、用矿石（Ore）升级，提高权重（Weight）和地块主分成（Owner Cut），并管理是否开放给其他钻工。买地块不是新人的强制第一步。","Own a Plot, upgrade it with Ore, increase Weight and Owner Cut, and decide whether other Drillers can use it. Buying a Plot is not mandatory for beginners."],
["六个核心词先搞懂。","Six core concepts first."],["中文术语","Terminology"],["群里怎么说，官方页面怎么写。","Community language vs official UI."],
["本站不做整页中英双语。第一次出现用“中文（官方英文）”，后面优先中文。这样聊天顺口，回官方 UI 也能对得上。","The Hub keeps official game terms in English so community discussion stays aligned with the live UI."],
["当前五档付费钻机（Paid Rig）。","Current five paid Rig tiers."],["名称","Name"],["成本 DRILL","Cost (DRILL)"],["时长","Duration"],["期望 Base DRILL","Expected Base DRILL"],["用途提示","Use case"],
["新人第一轮照这个顺序。","Run your first cycle in this order."],["确认唯一入口","Confirm the official entry point"],["从 project-mars.app 进入，钱包切到 Robinhood Chain，保留网络 gas。","Enter through project-mars.app, use Robinhood Chain, and keep enough native gas."],
["先决定“练手”还是“放大”","Decide whether you are learning or scaling"],["第一次更适合用低档钻机（Rig）理解完整流程，而不是直接用最大 Tier 学习。","A lower Rig tier is usually better for learning the full flow than starting with the largest tier."],
["找空闲地块（Plot）","Find an available Plot"],["有自己的地块（Plot）可以自挖；没有地块，可以找允许访客的开放地块（Open Plot）。","Use your own Plot or find an Open Plot that accepts guest Drillers."],
["部署钻机（Plant）后记录成本","Record the cost after Plant"],["记录花掉多少 DRILL、Rig Tier、开始时间。付费钻机（Paid Rig）成本是你后面算现金账的基准。","Record DRILL spent, Rig tier, and start time. Paid-Rig cost is the basis for your cash accounting."],
["到点收矿（Collect）","Collect when ready"],["记录收到的 base DRILL、Ore、Slush/OIL 等，不要只盯账户总余额。","Record Base DRILL, Ore, Slush/OIL and other outputs instead of watching only total wallet balance."],
["再决定下一轮","Decide the next cycle"],["先看工作资金是否够、Ore 是否要留给升级，再决定继续部署（Replant）、买矿、卖矿或停。","Check working capital and upgrade reserves before deciding to Replant, buy Ore, sell Ore, or stop."],
["一定要分“两本账”。","Keep two separate ledgers."],["现金账","Cash ledger"],["成长账","Progression ledger"],
["本轮可兑现价值：base DRILL + 可执行 Ore 价值 + 已验证 bonus − Rig 成本 − gas。未兑现积分、未知用途奖励不硬算现金。","Realizable value: Base DRILL + executable Ore value + verified bonuses − Rig cost − gas. Do not force unredeemed points or unknown rewards into cash P&L."],
["Ore 是否帮助你升级、减少未来购买成本、解锁更高 weight/cut。成长价值可能解释为什么某轮现金账不漂亮但仍有进度。","Track whether Ore advances upgrades, reduces future purchase cost, or unlocks higher Weight/Cut. Progression can matter even when one cycle's cash P&L is weak."],
["Rig 计算器","Rig calculator"],["升级计算器","Upgrade calculator"],["为了榜单纯烧 DRILL；把太空积分（Space Credits）当 $SPCX 计价；把 OIL/未流动资产当现金回本；复制别人仓位大小；给未知合约无限授权。","Burning DRILL only for leaderboard rank; pricing Space Credits as $SPCX without official redemption rules; treating OIL/illiquid assets as cash recovery; copying someone else's position size; granting unlimited approvals to unknown contracts."],
["下一步：算自己的账","Next: run your own numbers"],["我还有问题","I have a question"],["打开官方站","Open official site"],["使用 Leo 邀请入口","Use Leo referral"],
["Referral 可选；不用 referral 也能完整使用本 Hub。推荐关系用于支持工具、研究和社区维护。","Referral is optional. The Hub works without it; referral support helps fund tooling, research and community maintenance."],
["算你自己的 Mars。","Run your own Mars numbers."],
["不看别人的仓位。先选你想解决的问题。基础参数就能开始算；Gas、OIL、额外 bonus 等放在“高级参数”里。所有计算都在浏览器本地完成，不连接钱包、不签名。","Do not copy someone else's position. Pick the problem you want to solve, enter basic inputs, and expand advanced assumptions only when needed. Calculations run locally in your browser with no wallet connection or signature."],
["工具快速导航","Tool navigation"],["回本","Breakeven"],["计算单位","Unit"],["累计投入","Total invested"],["已回收 / 已卖出","Realized / sold"],["当前流动资产价值","Current liquid value"],["非流动资产保守估值","Conservative illiquid value"],["计算回本","Calculate breakeven"],
["例：如果选择 USD，四个金额都用 USD；不要把 DRILL 数量和美元价值混在一起。","Example: if you choose USD, all four values must be in USD. Do not mix DRILL units with dollar values."],
["输入累计投入后即可计算。","Enter total invested to calculate."],["复制结果摘要","Copy result"],["复制分享摘要","Copy share summary"],
["钻机档位（Rig Tier）","Rig Tier"],["参与方式","Mode"],["我在自己的地块（Plot）上挖","Mine on my own Plot"],["我在别人的开放地块（Open Plot）上挖","Mine on someone else's Open Plot"],["自己的地块等级（Plot Level）","My Plot Level"],["矿石（Ore）预计税前可卖总价（DRILL）","Estimated gross Ore value (DRILL)"],
["不知道 Ore 值多少先填 0，先看纯 DRILL 现金账。访客模式不会自动把地主 owner bonus 算到你头上。","If you do not know Ore value, start with 0 and inspect the DRILL-only cash economics. Guest mode does not assign the Plot owner's bonus to you."],
["高级参数（可选）","Advanced assumptions (optional)"],["Gas 折算 DRILL","Gas in DRILL"],["每 OIL 自定义估值","Custom value per OIL"],["其他已确认 Bonus（DRILL）","Other verified bonus (DRILL)"],["每轮其他产出的净价值（DRILL）","Net value of other outputs per cycle (DRILL)"],["每轮 Gas 折算 DRILL","Gas per cycle in DRILL"],
["OIL 默认按 0 计价。只有你有明确估值依据时才填写。","OIL defaults to zero value. Only add a value when you have a clear basis."],["算这轮","Calculate cycle"],
["默认从最保守口径开始。","Starts from the conservative case."],["矿石（Ore）买还是自己挖？","Buy Ore or mine it?"],["同时比较直接买入的 DRILL 成本和自然挖矿所需的现金/时间成本。","Compare the DRILL purchase cost with the cash and time required to mine it."],
["目标矿石（Ore）","Target Ore"],["还缺多少","Missing quantity"],["当前 Ask（DRILL / 个）","Current ask (DRILL each)"],["用于补料的钻机（Rig）","Rig used to mine the gap"],["选择目标矿石（Ore） 后，会自动跳到能产出的最低 Tier。","Selecting an Ore automatically chooses the lowest Rig tier that can produce it."],
["比较买 vs 挖","Compare buy vs mine"],["填“缺多少”和当前 Ask 后比较。","Enter the missing quantity and current ask to compare."],
["下一等级还缺多少？","What is missing for the next level?"],["官方升级表自动带出需求。你只填自己的库存；有市场 Ask 再填，没有就留空。","Upgrade requirements come from the current mechanics snapshot. Enter your inventory and optional market asks."],
["当前等级","Current level"],["用于自然补料的 Rig","Rig for mining gaps"],["默认选能覆盖本级所需 Ore 的最低 Tier；这不代表经济最优。","Defaults to the lowest tier that can produce all required Ore; this is not necessarily the economic optimum."],["下一等级","Next level"],
["不想手填矿石库存？用只读钱包助手 →","Prefer not to type inventory? Use the read-only wallet helper →"],["计算升级路径","Calculate upgrade path"],["填写持有量即可看材料缺口；Ask 不填就不假装有买入价格。","Enter held quantities to see material gaps. Missing market asks are never treated as zero."],
["我现在在哪个奖励档？","Which reward band am I in?"],["只输入自己的累计 paid-rig spend，不需要钱包地址。工具用匿名公共榜单快照显示静态名次区间和下一轮情景。","Enter only your own cumulative paid-rig spend. The tool uses an anonymous public leaderboard snapshot for rank-band scenarios."],
["当前累计付费钻机支出（Paid-Rig Spend，DRILL）","Current cumulative Paid-Rig Spend (DRILL)"],["下一轮钻机（Rig）","Next Rig"],["不加 Rig","No additional Rig"],["额外情景 Spend（可选）","Extra scenario spend"],["看当前 / 下一轮","Compare current / next"],
["输入你自己的累计 paid-rig spend。","Enter your own cumulative paid-rig spend."],["奖励档","Reward band"],["名次","Rank"],["当前快照入档线","Current snapshot threshold"],
["这是静态快照，不是排名预测。其他玩家会继续增加 spend；同分按","This is a static snapshot, not a rank prediction. Other players will keep increasing spend; ties use"],["决定先后，因此工具显示区间而不是伪精确名次。","for ordering, so the tool shows a range rather than false precision."],
["计算器不是收益承诺。","Calculators are not return promises."],["官方概率和 Plot 参数来自当前公开配置；市场 Ask、Gas、估值等由你输入。游戏更新后参数可能变化。","First-party probabilities and Plot parameters come from the current public config. Market asks, gas and valuation assumptions are your inputs and can change."],
["读取钱包公开数据","Read public wallet data"],["Robinhood Chain 钱包地址","Robinhood Chain wallet address"],["只读查询","Read only"],
["隐私说明：","Privacy:"],["地址不会发送给 Leo / Mars Player Hub 后端，也不会进入 analytics。为了读取公开链上余额，浏览器会把查询直接发送到公共 Robinhood Chain RPC；RPC 服务因此会看到被查询的地址。","The address is not sent to Leo / Mars Player Hub or analytics. Your browser queries public Robinhood Chain RPC directly, so the RPC provider can see the queried address."],
["未查询","Not queried"],["无需连接钱包","No wallet connection"],["你的公开链上快照","Your public on-chain snapshot"],["网络 Gas","Network gas"],["Robinhood Chain 原生 Gas 余额。","Robinhood Chain native gas balance."],["钱包当前 DRILL 余额。","Current DRILL balance."],["地块（Plot）","Plot"],["只读 ERC-721 持有数量；暂不自动枚举 Plot ID / 等级。","Read-only ERC-721 balance; Plot IDs and levels are not enumerated automatically yet."],
["矿石（Ore）库存","Ore inventory"],["只显示链上 ERC-1155 余额。没有可靠中文专名的矿石继续保留 Ore 编号；Core Blue 保留官方英文。","Shows on-chain ERC-1155 balances. Official material names stay in English."],["材料","Material"],["余额","Balance"],
["带入升级工具（本次会话）","Prefill upgrade tool (this session)"],["复制库存摘要","Copy inventory summary"],["打开升级工具","Open upgrade tool"],
["“带入升级工具”只写入当前浏览器标签页的 sessionStorage。关闭标签页后自然失效；不会写入 analytics，也不会发送到 Hub 后端。","Prefill uses only this tab's sessionStorage and expires when the tab closes. It is not sent to analytics or the Hub backend."],
["当前自动读取范围：","Current read-only scope:"],["Gas / DRILL / Ore / Plot 数量。Plot ID、Plot Level、当前 Rig、Epoch 自己的名次仍不自动读取；Project Mars 一手 API 不允许独立站跨域直连，我们不绕过它。","Gas / DRILL / Ore / Plot count. Plot IDs, Plot levels, active Rigs, and your personal Epoch rank are not read automatically. The Hub does not bypass Project Mars cross-origin API restrictions."],
["群里问过的问题，不应该第二天再从头解释。","Community questions should not be re-explained from scratch every day."],["搜索 Project Mars 的常见问题。答案会随着官方机制更新，不把聊天里旧口径当永久真理。","Search common Project Mars questions. Answers are maintained against current mechanics rather than treating old chat messages as permanent truth."],["搜索：回本 / T5 / OIL / Plot / Epoch…","Search: breakeven / T5 / OIL / Plot / Epoch…"],
["不搬运公告。只解释：变了什么，对你有什么影响。","Not an announcement mirror. We explain what changed and why it matters."],["每条更新按 What changed → So what → What to check 组织，并标记是一手确认还是 teaser。","Each update follows What changed → So what → What to check, with first-party verification status."],
["全部","All"],["入门","Getting started"],["挖矿","Mining"],["收益/回本","Economics"],["市场","Market"],["材料","Materials"],["信任/隐私","Trust / privacy"],["已读取","Loaded"],["查询失败","Read failed"],["查询中","Reading"],["不可读","Unavailable"],["正在读取公开链上余额…","Reading public on-chain balances…"],["公共 RPC","Public RPC"],["已带入，本次会话有效","Prefilled for this session"],["已复制","Copied"],["复制失败","Copy failed"],
["公开配置快照","Public config snapshot"],["官方 /api/history","Official /api/history"],["不含任何 Leo 仓位数据","No Leo position data"],["配置快照暂不可用","Config snapshot unavailable"],
["官方配置","First-party config"],["一手公开数据","First-party public data"],["可变市场数据由玩家输入","Market-dependent values are player inputs"],["概率为期望值，不是单轮保证","Probabilities are expectations, not per-cycle guarantees"],
["练手 / 低资金","Learning / low capital"],["短周期","Short cycle"],["中档","Mid tier"],["常规吞吐","General throughput"],["高级矿石路径","Rare-Ore path"],
["保守 NAV","Conservative NAV"],["净 P&L","Net P&L"],["已实现回收率","Realized recovery"],["总回收率","Total recovery"],["距离回本","Gap to breakeven"],["Rig 成本","Rig cost"],["期望 Base","Expected Base"],["其他 Bonus","Other bonus"],["Ore 卖出净值","Net Ore sale value"],["现金 P&L","Cash P&L"],["现金 ROI","Cash ROI"],["期望产量 / 轮","Expected / cycle"],["预计需要","Estimated cycles"],["时间","Time"],["直接买入","Buy directly"],["自然挖现金成本","Mining cash cost"],["每轮净现金成本","Net cash cost / cycle"],["权重（Weight）","Weight"],["权重提升","Weight uplift"],["地块主分成（Owner Cut）","Owner Cut"],["缺口买入成本","Gap buy cost"],["未报价矿石","Unpriced Ore"],["自然补料瓶颈","Mining bottleneck"],["预计瓶颈时间","Estimated bottleneck time"],["需要","Required"],["持有","Held"],["缺","Missing"],["期望/轮","Expected/cycle"],["轮数","Cycles"],["买入成本","Buy cost"],["现在静态名次","Current snapshot rank"],["现在 Credits","Current Credits"],["下一情景","Next scenario"],["Spend 后","After spend"],["Spend 后静态名次","Rank after spend"],["Spend 后 Credits","Credits after spend"],["没有匹配问题。","No matching questions."],["答案来自当前社区文档；机制变化后会更新。","Answers come from maintained community documentation and change when mechanics change."],
["Leo Labs · Project Mars 专页","Leo Labs · Project Mars hub"],
["Paid Rig 的主要工作资金，也用于部分建筑/市场。不要把全部 DRILL 都当“利润”。","Primary working capital for Paid Rigs and some game systems. Do not treat every DRILL balance as profit."],
["钻机（Rig）","Rig"],["你选择的作业档位。成本、持续时间和矿石（Ore）概率不同。","Your mining tier. Cost, duration, and Ore probabilities differ by Rig."],
["矿石（Ore）","Ore"],["升级材料，也可以在市场交易。升级储备和可出售库存要分开。","Upgrade materials that can also trade in the market. Keep upgrade reserves separate from sellable inventory."],
["L1–L20 的土地资产。升级会提高权重（Weight）与地块主分成（Owner Cut）。","L1–L20 land assets. Upgrades increase Weight and Owner Cut."],
["赛季（Epoch）","Epoch"],["排行榜奖励周期。当前奖励可能是积分/材料，不应自动折算成未来代币现金价值。","Leaderboard reward periods. Points or materials should not be automatically priced as future token cash value."],
["OIL / 矿浆（Slush）","OIL / Slush"],["独立材料/奖励层。OIL 保留官方英文；Slush 可在中文群里辅助称为“矿浆”。不要直接按现金利润记账。","Separate materials/reward layers. Keep OIL and Slush separate from realized cash profit."],
["专有资产名如 DRILL / OIL / Core Blue / New Horizons 保留英文，不为了中文化而硬翻译。","Official asset names such as DRILL / OIL / Core Blue / New Horizons stay in English."],
["新人先别做：","Avoid as a beginner:"],["升级","Upgrade"],
["把已回收现金和当前资产保守估值分开。所有输入必须使用同一种单位。","Separate realized recovery from conservative current asset value. Use the same unit for every input."],
["官方概率计算期望 Base DRILL。先告诉工具你是在自己的 Plot，还是别人的 open plot。","Expected Base DRILL uses first-party probabilities. Tell the tool whether you mine on your own Plot or someone else's Open Plot."],
["缺口稍后计算","Gap calculated below"],["下一轮 ","Next cycle "],["参与者 ","Players "],["奖励 ","Reward "],["同分 ","Tie-break "],["快照 ","Snapshot "],
["贴地址，少手填一点。","Paste an address. Type less."],["只读 Robinhood Chain 公开链上数据：网络 Gas、DRILL、矿石（Ore）库存和持有地块（Plot）数量。不连接钱包，不签名，不授权，不发交易。","Read public Robinhood Chain data only: network gas, DRILL, Ore inventory, and Plot count. No wallet connection, signature, approval, or transaction."],
["你持有","Held"],["Ask / 个（可留空）","Ask / unit (optional)"],["在 Epoch / Leaderboard 页面看到的累计数","Cumulative value shown on the Epoch / Leaderboard page"],["例如 1000","e.g. 1000"],["例如 10","e.g. 10"],["例如 12.5","e.g. 12.5"],
["所有金额都按 ","All amounts use "],[" 计算。非流动资产能否按你填的估值兑现，仍是你的假设。",". Whether illiquid assets realize at your entered value remains an assumption."],
["Project Mars 回本计算（","Project Mars breakeven ("],["距离保守回本: ","Gap to conservative breakeven: "],["请输入大于 0 的累计投入，并确保所有金额使用同一种单位。","Enter total invested above 0 and use the same unit for all amounts."],
["自己的地块（Plot）","Own Plot"],["别人的开放地块（Open Plot）","Someone else's Open Plot"],["0（访客不计地主 bonus）","0 (guest excludes owner bonus)"],["（单独计）"," (tracked separately)"],
["访客模式不自动估算 open plot 的动态访客 bonus；如果你在当前 UI 已确认额外奖励，可在高级参数手动填。","Guest mode does not estimate dynamic Open Plot visitor bonuses. Add a verified bonus manually under advanced assumptions if the live UI shows one."],
["Owner bonus 按当前 Plot Level 的 owner cut × 期望 base DRILL 估算。","Owner Bonus is estimated as current Plot-level Owner Cut × expected Base DRILL."],
[" Ore 市场默认卖方净收 95%；OIL 默认价值 0。"," Ore market assumes sellers receive 95% net; OIL defaults to zero value."],
["Project Mars Rig 计算","Project Mars Rig calculation"],["模式: ","Mode: "],["成本: ","Cost: "],["期望 Base: ","Expected Base: "],["其他 Bonus: ","Other bonus: "],["Ore 净值假设: ","Net Ore value assumption: "],["现金 P&L: ","Cash P&L: "],["（默认不计现金）"," (not counted as cash by default)"],
["请填写“还缺多少”和当前 Ask，才能比较买入与自然挖矿。","Enter the missing quantity and current ask to compare buying with mining."],
["所选 Rig 无法自然产出这个 Ore。","The selected Rig cannot naturally produce this Ore."],["换更合适的 Tier，或直接比较市场购买。当前模式：","Choose a suitable tier or compare direct market purchase. Current mode: "],
["Project Mars Ore 比较","Project Mars Ore comparison"],["目标: ","Target: "],[" / 缺 "," / missing "],[" 无法自然产出该 Ore"," cannot naturally produce this Ore"],
["买入的现金成本更低","Buying has the lower cash cost"],["自然挖的现金成本更低","Mining has the lower cash cost"],
["自然挖成本用官方期望 base、与你角色匹配的 bonus 口径，再减你填写的其他产出价值；不包含机会成本和价格波动。","Mining cash cost uses first-party expected Base, role-appropriate bonuses, and your other-output assumptions. It excludes opportunity cost and price volatility."],
[" 期望 "," expected "],["/轮","/cycle"],["预计 ","Estimated "],["直接买: ","Buy directly: "],["自然挖现金成本: ","Mining cash cost: "],["结论: ","Conclusion: "],
["本次会话","this session"],["已带入钱包库存","Wallet inventory prefilled"],["清除","Clear"],["需要 ","Required "],
["DRILL（仅已报价）","DRILL (priced gaps only)"],[" 种"," types"],["Ask 留空时不会把成本当 0；“自然补料瓶颈”仍按缺口 / 所选 Rig 的期望产量计算。","Blank asks are not treated as zero cost. The mining bottleneck is still calculated from the gap divided by the selected Rig's expected output."],
["Project Mars 升级规划","Project Mars upgrade plan"],["已报价缺口成本: ","Priced gap cost: "],["；另有 ","; plus "],[" 种矿石未报价"," Ore types unpriced"],["自然补料瓶颈: ","Mining bottleneck: "],
["请先填写你自己的累计 Paid-Rig Spend。","Enter your own cumulative Paid-Rig Spend first."],["无","None"],
["按当前静态快照：下一情景会改变奖励档","Current static snapshot: the next scenario changes reward band"],["按当前静态快照：奖励档不变","Current static snapshot: reward band unchanged"],
["下一更高档：","Next higher band: "],["；当前快照档尾分数约 ","; current snapshot threshold is about "],["。打到同分仍受 first-reached-score 影响，严格高于阈值才不受同分顺序影响。",". A tie still follows first-reached-score; only strictly exceeding the threshold avoids tie ordering."],
["Project Mars Epoch ","Project Mars Epoch "],[" 静态快照"," static snapshot"],["当前 spend: ","Current spend: "],["情景: ","Scenario: "],["注意：榜单动态变化；同分按 first-reached-score。","Note: leaderboard positions change dynamically; ties use first-reached-score."],
["地址格式不正确。请输入 0x 开头的 40 字节 EVM 地址。","Invalid address format. Enter a 40-byte EVM address starting with 0x."],
["公共 RPC 查询失败。稍后重试；没有发生签名或交易。","Public RPC query failed. Retry later; no signature or transaction occurred."],
["Project Mars 钱包只读快照","Project Mars read-only wallet snapshot"],["地址: ","Address: "],["Plot 数量: ","Plot count: "],["非零 Ore: ","Non-zero Ore: "],["无","None"],
["第一方数据","First-party data"],["当前已在最高奖励档。","Already in the highest reward band."],["未报价","Unpriced"],["该 Tier 不产出","Not produced by this Tier"],["所选钻机无法补齐","Selected Rig cannot fill the gap"]
];
const SORTED=[...P].sort((x,y)=>y[0].length-x[0].length);
export function t(value){
  if(isZh||value==null)return String(value??"");
  let out=String(value);
  for(const [a,b] of SORTED)if(out.includes(a))out=out.split(a).join(b);
  out=out.replace(/Top (\d+) 之外/g,"Outside Top $1")
    .replace(/(\d+) 种矿石未报价/g,"$1 Ore types unpriced")
    .replace(/(\d+) 项未读到/g,"$1 fields unavailable")
    .replace(/(\d+(?:\.\d+)?) 轮/g,"$1 cycles")
    .replace(/距离保守回本还差：/g,"Gap to conservative breakeven: ")
    .replace(/超过保守回本线：/g,"Above conservative breakeven: ");
  return out;
}
function translateElement(el){
  if(isZh||!(el instanceof Element))return;
  for(const attr of ["placeholder","aria-label","title"]){const v=el.getAttribute(attr);if(v)el.setAttribute(attr,t(v))}
}
function translateTree(root){
  if(isZh)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let n=root;
  while(n){
    if(n.nodeType===Node.TEXT_NODE){const tag=n.parentElement?.tagName;if(tag!=="SCRIPT"&&tag!=="STYLE")n.nodeValue=t(n.nodeValue)}
    else translateElement(n);
    n=w.nextNode();
  }
}
function addSwitcher(){
  const nav=document.querySelector(".nav"); if(!nav||nav.querySelector(".lang-switch"))return;
  const page=location.pathname.split("/").pop()||"index.html", hash=location.hash||"";
  const box=document.createElement("div"); box.className="lang-switch";
  box.innerHTML='<a class="'+(!isZh?"active":"")+'" href="./'+page+'?lang=en'+hash+'">EN</a><span>/</span><a class="'+(isZh?"active":"")+'" href="./'+page+'?lang=zh'+hash+'">中文</a>';
  nav.appendChild(box);
}
if(!isZh){
  if(document.title.includes("钱包助手"))document.title=document.title.replace("钱包助手","Wallet Helper");
  translateTree(document.body);
}
addSwitcher();
new MutationObserver(ms=>{if(isZh)return;for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===Node.TEXT_NODE)n.nodeValue=t(n.nodeValue);else if(n.nodeType===Node.ELEMENT_NODE)translateTree(n)}}).observe(document.body,{subtree:true,childList:true});
