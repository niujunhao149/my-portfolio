// STAR data for each experience — shared by website cards and resume modal

export interface StarEntry {
  title: string;
  titleEn: string;
  s: string; sEn: string;
  t: string; tEn: string;
  a: string; aEn: string;
  r: string; rEn: string;
}

/** Map keyed by exp.company (Chinese name) */
export const STAR_DATA: Record<string, StarEntry[]> = {
  Momenta: [
    {
      title: 'ESS路测数据自动整理工具（Vibe Coding）',
      titleEn: 'ESS Roadtest Data Automation Tool (Vibe Coding)',
      s: '路测结束后需从 ESS 网站手动筛选事件、复制链接、整理到飞书文档，每次耗时数小时且容易遗漏。',
      sEn: 'After roadtest, engineers manually filtered ESS events, copied links and formatted Feishu docs — hours of work with frequent omissions.',
      t: '用 Claude Code 独立设计并开发一个 Web 工具，实现路测事件数据一键抓取和飞书文档自动生成。',
      tEn: 'Independently design and build a web tool using Claude Code for one-click ESS event scraping and automated Feishu doc generation.',
      a: '通过 Vibe Coding 与 Claude Code 协作完成全栈开发（Python 后端抓取 ESS 数据 + Next.js 前端交互界面）；自动清洗事件描述中的语气词；自动创建格式化飞书文档并含 MViz 回放链接。',
      aEn: 'Full-stack Vibe Coding with Claude Code (Python backend for ESS scraping + Next.js frontend); auto-clean filler words; auto-create formatted Feishu docs with MViz links.',
      r: '将原本数小时的手工整理工作压缩至分钟级，工具已在团队实际路测场景中使用，验证了 Vibe Coding 在业务工具开发中的效率提升。',
      rEn: 'Reduced hours of manual work to minutes; tool used in real roadtest scenarios, validating Vibe Coding efficiency for internal tooling.',
    },
    {
      title: 'Harz CP Planning 功能全链路 PPM 管理',
      titleEn: 'Harz CP Planning Full-Lifecycle PPM',
      s: 'ADAS 功能从开发到客户交付涉及多个系统（TLM / RPA / PR / FO），新人需快速掌握全流程并独立跟进多个并行功能版本。',
      sEn: 'ADAS features require coordinating across TLM / RPA / PR / FO systems; new interns must quickly master the full pipeline and track multiple parallel feature versions.',
      t: '独立负责 ABSM、ALCA、ALSA、ACC、AES、CMSR 等核心功能的全链路 PPM 跟进，从 TLM 建单到 FO 提交全程闭环。',
      tEn: 'Independently manage full-lifecycle PPM for ABSM, ALCA, ALSA, ACC, AES, CMSR features — from TLM creation to FO submission.',
      a: '快速上手 TLM → RPA → RPA PR → FO 完整工作流；同步维护 Harz CP 版本需求表；协调 cp_planning / control / driving_control 三个模块的版本对齐；参与 CMSR 客户缺陷跟踪与推进。',
      aEn: 'Mastered TLM → RPA → RPA PR → FO workflow; maintained Harz CP version table; coordinated 3-module version alignment; tracked CMSR client defects.',
      r: '累计跟进 10+ 个功能版本迭代，实现全流程独立闭环，获得 mentor 认可并承担更多主导责任。',
      rEn: 'Tracked 10+ feature version iterations end-to-end independently; recognized by mentor with expanded ownership.',
    },
    {
      title: 'ADAS 场景复现分析与数据标注',
      titleEn: 'ADAS Scenario Reproduction & Data Annotation',
      s: 'ADAS 功能缺陷需通过真实路测数据复现并分析根因，才能推动工程师针对性修复；数据标注质量直接影响模型训练效果。',
      sEn: 'ADAS defects require reproducing from real roadtest data and root-cause analysis before engineers can fix; annotation quality directly impacts model training.',
      t: '使用 VSim/MViz 对 ACC 越线、ALCA 偏差、急停减速等典型场景进行复现，输出分析报告；同步参与 AES 数据标注（ABSM / CUTIN 类别）。',
      tEn: 'Use VSim/MViz to reproduce ACC crossing, ALCA deviation, emergency braking scenarios; author analysis reports; participate in AES data annotation (ABSM / CUTIN).',
      a: '从 ESS 筛选目标事件，在 VSim 中搭建对比版本仿真，结合 MViz 可视化定位问题帧，撰写包含现象 / 根因 / 改进建议的场景分析报告；同步维护 Scenario Set 并完成 AES 数据集构建。',
      aEn: 'Filtered ESS events, set up VSim comparisons, located issue frames via MViz, authored scenario reports with root-cause and recommendations; maintained Scenario Sets and built AES datasets.',
      r: '分析报告直接支撑工程师定位并修复多处 ADAS 功能异常；AES 数据集按时交付，满足模型训练需求。',
      rEn: 'Reports directly helped engineers locate and fix multiple ADAS anomalies; AES datasets delivered on schedule for model training.',
    },
  ],

  '字节跳动': [
    {
      title: '多跳推理评测数据构建',
      titleEn: 'Multi-hop Reasoning Evaluation Data',
      s: '豆包大模型在长链多跳搜索场景下存在逻辑断链问题，需要高质量的 SFT/RLHF 训练数据来提升模型推理能力。',
      sEn: 'Doubao LLM had logical gap issues in long-chain multi-hop search; high-quality SFT/RLHF data was needed to improve reasoning.',
      t: '构建多跳推理与事实核查高难度查询数据集，优化模型长链搜索场景下的逻辑闭合能力。',
      tEn: 'Build multi-hop reasoning and fact-checking high-difficulty query datasets to optimize LLM logical closure in long-chain search.',
      a: '设计包含多层依赖关系的复杂查询；人工核查事实一致性；针对逻辑断链的 Bad Case 进行根因分析，调整数据分布。',
      aEn: 'Designed complex multi-dependency queries; manually verified factual consistency; root-cause analysis of logical-gap Bad Cases to adjust data distribution.',
      r: '输出高质量评测数据，垂直品类通过率持续位于项目前列，直接支撑豆包模型版本迭代。',
      rEn: 'Delivered high-quality evaluation data; vertical category pass-rate consistently ranked top; directly supported Doubao model iterations.',
    },
    {
      title: 'Pandas/SQL 数据分析能力评测集',
      titleEn: 'Pandas/SQL Data Analysis Evaluation Set',
      s: '大模型在数据分析代码生成场景下存在执行错误和统计偏差，需要专门的评测集来量化并改进模型能力。',
      sEn: 'LLM had execution errors and statistical bias in data analysis code generation; specialized eval sets were needed to quantify and improve capability.',
      t: '设计并构建 Pandas/SQL 数据分析能力评测集，验证模型生成代码的可执行性与正确性。',
      tEn: 'Design and build Pandas/SQL data analysis evaluation sets to verify model code executability and correctness.',
      a: '构造覆盖数据清洗、聚合、统计分析等典型任务的测试用例；设计执行验证框架；识别并分类统计偏差 Bad Case 类型。',
      aEn: 'Constructed test cases covering data cleaning, aggregation, statistical analysis; designed execution validation framework; classified statistical bias Bad Case types.',
      r: '评测集成为模型数据分析能力的标准衡量工具，Bad Case 分类直接指导后续训练数据改进方向。',
      rEn: 'Eval set became standard benchmark for model data analysis capability; Bad Case classification directly guided training data improvements.',
    },
  ],

  'Kazama（KusaPics）': [
    {
      title: '「每日灵感」功能设计与验证',
      titleEn: '"Daily Inspiration" Feature Design & Validation',
      s: '新用户 onboarding 流失率高，与竞品 Midjourney 相比，平台缺少引导用户产生首次创作行为的触发机制。',
      sEn: 'High new user onboarding churn; compared to Midjourney, platform lacked a trigger mechanism to guide users to first creation.',
      t: '识别 onboarding 关键流失节点，设计并验证「每日灵感」功能降低用户入门门槛，提升首次创作转化。',
      tEn: 'Identify key onboarding churn points; design and validate "Daily Inspiration" feature to lower entry barrier and improve first-creation conversion.',
      a: '开展用户访谈与竞品对比（Midjourney / Adobe Firefly / Stable Diffusion）；定位 onboarding 第3步流失集中点；设计「每日灵感」：每日推送精选提示词，一键生成降低门槛；制定 A/B 测试方案并追踪 Google Analytics 数据。',
      aEn: 'User interviews + competitive analysis (Midjourney / Adobe Firefly); located onboarding step-3 churn cluster; designed "Daily Inspiration" (curated daily prompts, one-click generation); designed A/B test plan and tracked Google Analytics.',
      r: '功能上线后新用户转化率提升 22%，DAU 提升 18%，成为当季最高 ROI 产品迭代。',
      rEn: 'After launch: new user conversion rate +22%, DAU +18% — highest ROI product iteration of the quarter.',
    },
    {
      title: '用户分群与优先级排序',
      titleEn: 'User Segmentation & Prioritization',
      s: '产品团队缺乏对用户行为的结构化理解，功能优先级依赖主观判断，导致开发资源分配不够精准。',
      sEn: 'Product team lacked structured understanding of user behavior; feature prioritization was subjective, leading to suboptimal resource allocation.',
      t: '基于 Discord 数据构建用户分群框架，为功能优先级决策提供数据支撑。',
      tEn: 'Build user segmentation framework from Discord data to provide data-driven support for feature prioritization.',
      a: '清洗 Discord 用户行为数据；按使用频率、内容类型、商业意图将用户分为创作者/消费者/商业客户三类；识别各类用户的高频痛点；输出优先级矩阵报告。',
      aEn: 'Cleaned Discord user behavior data; segmented into creator/consumer/commercial by frequency, content type, and intent; identified high-frequency pain points per segment; delivered prioritization matrix report.',
      r: '分群框架被产品团队采纳为常规分析工具，直接影响后续2个季度的功能路线图规划。',
      rEn: 'Segmentation framework adopted as standard analysis tool by product team, directly influenced 2-quarter feature roadmap.',
    },
  ],

  'IP知识付费产品（个人项目）': [
    {
      title: '产品形态转型：实体书→数字课程',
      titleEn: 'Product Pivot: Physical Book → Digital Course',
      s: '知识付费产品以实体书为主，但用户留存低、复购率差，难以建立持续性收入模型；竞品已转向更高粘性的课程+社群模式。',
      sEn: 'Knowledge product relied on physical books — low retention, poor repurchase, no recurring revenue; competitors had shifted to higher-stickiness course+community models.',
      t: '主导产品形态转型，从一次性实体书转向"课程式学习产品"（直播+社群订阅），建立可持续收入模式。',
      tEn: 'Lead product format transformation from one-time physical books to "course-style learning product" (live + community subscription) for sustainable revenue.',
      a: '调研 50+ 目标用户了解学习痛点；对标知识星球、得到等竞品商业模式；设计直播+社群+定期更新的订阅体系；分阶段上线并收集反馈迭代。',
      aEn: 'Interviewed 50+ target users for learning pain points; benchmarked Zhishi Xingqiu and Dedao; designed live+community+update subscription system; phased launch with feedback iteration.',
      r: '转型后实体产品毛收入提升 180%，用户留存周期从单次购买延长至月度订阅，建立了可持续的用户关系。',
      rEn: 'Physical product gross revenue +180% after transformation; user retention extended from one-time purchase to monthly subscription.',
    },
    {
      title: '落地页 A/B 测试优化',
      titleEn: 'Landing Page A/B Test Optimization',
      s: '产品落地页转化率低（CTR 1.23%），用户从广告点击到付费的漏斗损耗严重，影响整体 ROI。',
      sEn: 'Product landing page had low CTR (1.23%); high funnel drop-off from ad click to payment severely impacted ROI.',
      t: '通过系统性 A/B 测试提升落地页转化率，优化用户从点击到付费的全链路体验。',
      tEn: 'Systematically improve landing page conversion via A/B testing, optimizing full user journey from click to payment.',
      a: '分析 Google Analytics 漏斗数据定位流失节点；设计标题文案/视觉设计/CTA按钮/社会证明等多变量测试；用统计显著性检验筛选方案；分阶段上线最优组合。',
      aEn: 'Analyzed Google Analytics funnel to locate drop-off points; designed multi-variant tests (copy/visual/CTA/social proof); statistical significance testing to filter solutions; phased rollout of best combination.',
      r: 'CTR 从 1.23% 提升至 1.85%（+50%），客单价（ATV）提升 75%，整体 GMV 显著提升。',
      rEn: 'CTR improved 1.23% → 1.85% (+50%); average transaction value (ATV) +75%; overall GMV significantly increased.',
    },
  ],
};
