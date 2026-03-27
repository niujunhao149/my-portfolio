'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Mail, Github, Phone, Award, Code, Database, BarChart3, Languages, Globe, Download, Menu, X, ChevronDown, Sparkles, Lock, RotateCcw, LogOut, BookOpen, ExternalLink, Plus, Trash2, Pencil, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import ResumeExportModal from '@/components/ResumeExportModal';
import { STAR_DATA } from '@/lib/starData';
import { useAdminContent, useNotesStore, NoteItem, useNowStore, NowItem, useHiddenSections } from '@/lib/adminStore';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// ── Admin context ──────────────────────────────────────────────────────────
type AdminCtx = { isAdmin: boolean; get: (id: string, def: string) => string; save: (id: string, val: string) => void; };
const AdminContext = createContext<AdminCtx>({ isAdmin: false, get: (_, d) => d, save: () => {} });

/**
 * Editable text component — renders contenteditable in admin mode,
 * plain text otherwise. Wraps in the given HTML element (`as` prop).
 * Use `cls` for className.
 */
function E({ id, def, as = 'span', cls, style }: {
  id: string; def: string;
  as?: keyof JSX.IntrinsicElements; cls?: string; style?: React.CSSProperties;
}) {
  const { isAdmin, get, save } = useContext(AdminContext);
  const value = get(id, def);
  const Tag = as as any;
  if (!isAdmin) return <Tag className={cls} style={style}>{value}</Tag>;
  return (
    <Tag
      className={cls} style={style}
      contentEditable suppressContentEditableWarning
      data-admin-field="true"
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const v = e.currentTarget.textContent ?? def;
        if (v !== get(id, def)) save(id, v);
      }}
    >
      {value}
    </Tag>
  );
}

// ============== TRANSLATION OBJECTS ==============
const translations = {
  zh: {
    nav: { about: '关于我', experience: '实习经历', projects: '研究项目', skills: '技能与证书', now: '现在', notes: '学习笔记', contact: '联系方式' },
    hero: { title: '牛俊浩', subtitle: '系统工程 × AI | 自动驾驶 PPM | Vibe Coding', description: '天津大学系统工程硕士在读，Momenta ADAS规划实习生（PPM方向），专注于自动驾驶CP规划功能、AI辅助开发与自动化工具设计。', contact: '联系我', github: 'GitHub' },
    about: { title: '关于我', education: '教育背景', intro: '天津大学（985）系统工程硕士在读，研究方向为强化学习与智能控制系统。本科同样毕业于天津大学工业工程专业。现任职 Momenta ADAS规划方向 PPM实习生，负责 Harz 平台 CP Planning 功能全链路管理，擅长使用 Claude Code 进行 Vibe Coding 和自动化工具设计。', strengths: '核心优势：自动驾驶 ADAS 产品经验 + 强化学习算法背景 + Vibe Coding / Claude Code 熟练使用 + AI 产品设计能力，技术型产品经理复合背景。', degree: '系统工程硕士', university: '天津大学', faculty: '智能与计算学部', facultyEn: 'School of Intelligence and Computing', major: '主修课程：强化学习、系统建模、运筹优化、系统分析、控制理论', period: '2024.09 - 2027.06（预计）', bachelor: '工业工程学士', bachelorUniv: '天津大学（985）', bachelorFaculty: '管理与经济学部', bachelorMajor: '主修课程：工业工程、运筹学、系统工程导论、Python数据分析、数据库技术、生产运营管理、质量管理', bachelorPeriod: '2020.09 - 2024.07', bachelorGpa: '均分 88.66，硕士均分 90.81' },
    experience: { title: '实习经历' },
    projects: { title: '研究项目', tech: '技术栈', objective: '研究目标', methodology: '研究方法', design: '研究设计', status: '状态' },
    skills: { title: '技能与证书', programming: '编程与开发', dataTools: 'AI与工具链', finance: '专业能力', certifications: '认证与项目', languages: '语言能力' },
    now: { title: '最近在…', subtitle: '动态更新，记录当下在做的事' },
    notes: { title: '学习笔记', subtitle: '整理的备考笔记与错题复盘，持续更新中' },
    contact: {
      title: '联系方式', email: '邮箱', github: 'GitHub', phone: '电话', xiaohongshu: '小红书', bilibili: 'B站',
      message: '欢迎联系！对自动驾驶 PPM、AI 产品经理或系统工程相关方向感兴趣，期待交流。',
    },
  },
  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills & Certs', now: 'Now', notes: 'Notes', contact: 'Contact' },
    hero: { title: 'Junhao Niu', subtitle: 'Systems Engineering × AI | ADAS PPM | Vibe Coding', description: "Master's student at Tianjin University (Systems Engineering), ADAS Planning Intern (PPM) at Momenta. Focused on CP Planning features, AI-assisted development (Vibe Coding / Claude Code) and automation tool design.", contact: 'Contact Me', github: 'GitHub' },
    about: { title: 'About Me', education: 'Education', intro: "Master's in Systems Engineering at Tianjin University (985), research in reinforcement learning and intelligent control systems. Bachelor's in Industrial Engineering also from Tianjin University. Currently ADAS Planning Intern (PPM) at Momenta, managing full-lifecycle CP Planning features for the Harz platform. Proficient in Vibe Coding with Claude Code and automation tool design.", strengths: 'Core strengths: ADAS product management experience + RL algorithm background + Vibe Coding / Claude Code proficiency + AI product design capability — technical PM composite profile.', degree: "Master's in Systems Engineering", university: 'Tianjin University', faculty: 'School of Intelligence and Computing', major: 'Core Courses: Reinforcement Learning, System Modeling, Operations Research, Systems Analysis, Control Theory', period: 'Sep 2024 - Jun 2027 (expected)', bachelor: 'Bachelor in Industrial Engineering', bachelorUniv: 'Tianjin University (985)', bachelorFaculty: 'Faculty of Management and Economics', bachelorMajor: 'Core Courses: Industrial Engineering, Operations Research, Systems Engineering, Python Data Analysis, Database Technology, Production & Operations Management, Quality Management', bachelorPeriod: 'Sep 2020 - Jul 2024', bachelorGpa: 'Avg Score: 88.66 (Undergrad), 90.81 (Graduate)' },
    experience: { title: 'Internship Experience' },
    projects: { title: 'Research Projects', tech: 'Tech Stack', objective: 'Objective', methodology: 'Methodology', design: 'Research Design', status: 'Status' },
    skills: { title: 'Skills & Certifications', programming: 'Programming & Dev', dataTools: 'AI & Tools', finance: 'Domain Skills', certifications: 'Certs & Projects', languages: 'Languages' },
    now: { title: 'Now', subtitle: 'What I\'m currently into — updated live' },
    notes: { title: 'Study Notes', subtitle: 'Exam prep notes & mistake reviews — updated regularly' },
    contact: {
      title: 'Get In Touch', email: 'Email', github: 'GitHub', phone: 'Phone', xiaohongshu: 'Xiaohongshu', bilibili: 'Bilibili',
      message: 'Open to ADAS PM, AI Product Manager, or Systems Engineering related opportunities. Feel free to reach out!',
    },
  },
};

// ============== DATA ==============
const experiences = [
  {
    company: 'Momenta',
    companyEn: 'Momenta',
    role: 'ADAS规划实习生（PPM方向）',
    roleEn: 'ADAS Planning Intern (PPM)',
    period: '2026年1月 - 至今',
    periodEn: 'Jan 2026 - Present',
    highlights: [
      '负责 Harz 平台 CP Planning 功能全链路 PPM 管理，覆盖 ABSM、ALCA、ALSA、ACC、AES、CMSR 等核心 ADAS 功能的 TLM 建单 → RPA 申请 → PR 评审 → FO 提交全流程，累计跟进 10+ 个功能版本迭代',
      '使用 Claude Code（Vibe Coding）独立设计并开发 ESS 路测数据自动整理 Web 工具，实现路测事件数据一键抓取、飞书文档自动生成，将原本数小时手工整理工作压缩至分钟级',
      '利用 VSim/MViz 对 ACC 越线、ALCA 偏差、急停减速等典型 ADAS 场景进行复现分析，输出场景分析报告；维护 Scenario Set 并参与 AES 数据标注',
      '跟踪维护 Harz CP 版本需求表，每周提取 Release 版本信息更新飞书文档，协调 cp_planning / control / driving_control 多模块版本对齐',
      '深度参与 CMSR 客户群维护，跟踪客户 Jira 缺陷推进方案落地；参与 FO 随车准备，制定路测数据采集方案（hmi_console_event / light_recording / manual_recording）',
    ],
    highlightsEn: [
      'Managed full-lifecycle PPM for CP Planning features on Harz platform (ABSM, ALCA, ALSA, ACC, AES, CMSR), handling TLM → RPA → PR → FO pipeline across 10+ feature iterations',
      'Used Claude Code (Vibe Coding) to design and build an ESS roadtest data automation web tool — one-click event data collection and automated Feishu doc generation, reducing hours of manual work to minutes',
      'Performed scenario reproduction and analysis (ACC crossing, ALCA deviation, emergency braking) via VSim/MViz; maintained Scenario Sets and participated in AES data annotation',
      'Maintained Harz CP version requirements table; extracted weekly Release info and updated Feishu docs; coordinated multi-module version alignment (cp_planning / control / driving_control)',
      'Maintained CMSR client group and tracked client Jira defects; participated in FO vehicle preparation including roadtest data collection planning',
    ],
    highlightsBold: [0, 1, 2],
    logo: '/logos/momenta.svg',
  },
  {
    company: '字节跳动',
    companyEn: 'ByteDance',
    role: '豆包大模型数据项目成员',
    roleEn: 'Doubao LLM Data Project Member',
    period: '2025年10月 - 2025年12月',
    periodEn: 'Oct 2025 - Dec 2025',
    highlights: [
      '构建多跳推理与事实核查高难度查询数据集，优化大模型在长链搜索场景下的逻辑闭合能力，为 SFT/RLHF 训练管道输出高质量评测数据',
      '设计并构建 Pandas/SQL 数据分析能力评测集，验证模型生成代码的可执行性与正确性，定位统计偏差 Bad Case',
      '负责垂直品类数据质检，通过率指标持续位于项目前列，直接支撑豆包模型版本迭代',
    ],
    highlightsEn: [
      'Built multi-hop reasoning and fact-checking query datasets, optimized LLM logical closure in long-chain search; delivered high-quality evaluation data for SFT/RLHF pipelines',
      'Designed and built Pandas/SQL data analysis evaluation sets; verified model-generated code correctness; identified and analyzed statistical bias Bad Cases',
      'Responsible for vertical category data quality control; pass-rate consistently ranked top in project; directly supported Doubao model version iterations',
    ],
    highlightsBold: [0, 1],
    logo: '',
  },
  {
    company: 'Kazama（KusaPics）',
    companyEn: 'Kazama (KusaPics)',
    role: 'AI产品实习生',
    roleEn: 'AI Product Intern',
    period: '2025年7月 - 2025年8月',
    periodEn: 'Jul 2025 - Aug 2025',
    highlights: [
      '设计并验证「每日灵感」新功能：基于用户调研与竞品分析识别 onboarding 痛点，功能上线后新用户转化率提升 22%，DAU 提升 18%',
      '基于 Discord 数据清洗构建用户分群体系（创作者/消费者/商业客户），定位高频使用模式，协助团队进行产品优先级排序',
      '产出 Midjourney 等竞品深度对比报告，分析商业化路径与用户留存策略，输出产品迭代方向建议',
      '期间参与斯坦福硅谷研学项目（全额资助，多轮全英面试录取）：修读 Design Thinking、Business Model Canvas 课程，走访 Google / NVIDIA，与 10+ 家 VC 投资人交流',
    ],
    highlightsEn: [
      'Designed and validated "Daily Inspiration" feature: identified onboarding pain points via user research and competitive analysis; new user conversion rate +22%, DAU +18% after launch',
      'Built user segmentation framework from Discord data (creator / consumer / commercial); identified high-frequency usage patterns to assist feature prioritization',
      'Produced in-depth competitive benchmarking reports on Midjourney and peers; provided product iteration recommendations',
      'Participated in Stanford Silicon Valley Program (fully funded, selected via multi-round English interviews): Design Thinking & Business Model Canvas at Stanford GSB; visited Google/NVIDIA; engaged with 10+ VCs',
    ],
    highlightsBold: [0, 3],
    logo: '',
  },
  {
    company: 'IP知识付费产品（个人项目）',
    companyEn: 'Knowledge IP Product (Personal Project)',
    role: '主理人',
    roleEn: 'Founder',
    period: '2024年1月 - 2025年6月',
    periodEn: 'Jan 2024 - Jun 2025',
    highlights: [
      '主导产品策略转型：将产品从实体书形态转型为"课程式学习产品"（直播+社群订阅模式），转型后实体产品毛收入提升 180%',
      '主导产品落地页 A/B 测试：点击率（CTR）从 1.23% 提升至 1.85%（+50%），客单价（ATV）提升 75%',
      '建立多平台内容矩阵（B站、小红书、公众号、直播），运营账号实现用户留存与复购增长',
      '集成 Kimi、腾讯元宝等 AI 模型强化 IP 品牌价值，探索 AI + 知识付费产品的新商业路径',
    ],
    highlightsEn: [
      'Led product strategy pivot from physical book to "course-style learning product" (live + community subscription); gross revenue +180% after launch',
      'Led A/B testing on product landing page: CTR improved from 1.23% to 1.85% (+50%); average transaction value (ATV) +75%',
      'Built multi-platform content matrix (Bilibili, Xiaohongshu, WeChat, Live streaming); grew user retention and repurchase',
      'Integrated Kimi and Tencent Yuanbao AI models to enhance IP brand value; explored AI + knowledge product business models',
    ],
    highlightsBold: [0, 1],
    logo: '',
  },
];

const projects = [
  {
    title: '城市交通智能控制系统',
    titleEn: 'Adaptive Urban Traffic Signal Control System',
    subtitle: '基于动态多目标强化学习的自适应交通信号控制（硕士核心科研）',
    subtitleEn: 'Dynamic Multi-Objective RL-based Adaptive Traffic Signal Control (Master\'s Thesis)',
    tech: ['Python', 'PyTorch', 'SUMO', 'PPO', 'Actor-Critic', 'Pareto优化', 'CRITIC权重'],
    objective: '设计面向复杂城市交通场景的自适应信号控制系统，解决传统固定时长方案在动态交通流下效率低、公平性差的问题，实现多目标（通行效率 + 排队公平性）的动态权衡。',
    objectiveEn: 'Design an adaptive traffic signal control system for complex urban scenarios, addressing inefficiency and fairness issues of fixed-timing approaches under dynamic traffic flow; achieve dynamic multi-objective (efficiency + fairness) trade-off.',
    methodology: '提出 CDT-PPO 框架（双塔 Actor-Critic，连续状态空间决策），融合前景理论构建 SUDI（时空紧迫性离散指数），并引入 CRITIC 动态权衡机制实时调整目标权重，赋予系统元认知能力。',
    methodologyEn: 'Proposed CDT-PPO framework (dual-tower Actor-Critic, continuous state-space decision); combined Prospect Theory to construct SUDI (Spatio-temporal Urgency Discrete Index); introduced CRITIC dynamic trade-off mechanism for real-time weight adjustment, enabling metacognitive capability.',
    design: '在 SUMO 仿真环境搭建 5 类高压场景（动态潮汐流、冲击波等）进行消融实验。评估指标：平均等待时间、P95 尾延迟、公平性指数。目标期刊：IEEE T-ITS（顶刊）。',
    designEn: 'Built simulation environment in SUMO with 5 high-stress scenarios (dynamic tidal flow, shock waves, etc.) for ablation experiments. Metrics: average wait time, P95 tail latency, fairness index. Target journal: IEEE T-ITS.',
    status: '进行中，投稿准备中 (2025.01 - 至今)',
    statusEn: 'Ongoing, preparing for submission (Jan 2025 - Present)',
  },
  {
    title: '交通AI大模型与平台',
    titleEn: 'Urban Traffic AI Big Model & Platform',
    subtitle: '城市交通 AI 应用场景规划与平台架构设计',
    subtitleEn: 'Urban Traffic AI Application Planning & Platform Architecture Design',
    tech: ['Python', 'AI Agent', 'SaaS设计', '强化学习', '商业化路径'],
    objective: '基于自动驾驶与城市交通的行业经验，规划城市级交通 AI 应用场景，设计 1+N+X 平台架构（基础设施→应用层→上层业务）。',
    objectiveEn: 'Leveraging domain knowledge in autonomous driving and urban traffic, plan city-level AI traffic application scenarios and design 1+N+X platform architecture (infrastructure → application layer → business layer).',
    methodology: '识别 25 个城市交通片区 AI 应用场景，从交通片区使用量映射 AI 落地方案；结合 AI Agent、SaaS 商业模式与知识 IP 产品的运营经验进行商业化路径设计。',
    methodologyEn: 'Identified 25 city-level traffic AI application scenarios, mapped AI deployment solutions from traffic zone usage data; combined AI Agent, SaaS business model, and knowledge IP operation experience for commercialization path design.',
    design: '完成平台商业化路径设计，涵盖 AI 大模型赋能的交通管控、调度优化、事故预测等核心场景，输出产品规划文档与架构方案。',
    designEn: 'Completed platform commercialization path design covering AI-enabled traffic control, scheduling optimization, and accident prediction; produced product planning documents and architecture proposals.',
    status: '进行中 (2025.12 - 至今)',
    statusEn: 'Ongoing (Dec 2025 - Present)',
  },
  {
    title: 'IP知识付费产品 — 0到1增长',
    titleEn: 'Knowledge IP Product — 0-to-1 Growth',
    subtitle: '全流程产品策略转型与数据驱动增长',
    subtitleEn: 'Full Product Strategy Transformation & Data-Driven Growth',
    tech: ['A/B Testing', 'Google Analytics', 'Funnel Analysis', 'AI Integration', 'Kimi', '用户调研'],
    objective: '从 0 到 1 构建知识付费产品，完成从实体书向数字化课程产品的商业转型，通过数据驱动持续优化转化与增长。',
    objectiveEn: 'Build a knowledge-paid product from 0 to 1; complete commercial transformation from physical book to digital course product; continuously optimize conversion and growth through data-driven methods.',
    methodology: '用户分层与需求调研 → 产品形态转型设计 → 多平台矩阵运营 → A/B 测试落地页优化 → AI 模型（Kimi / 腾讯元宝）集成增强产品体验。',
    methodologyEn: 'User segmentation & needs research → product format transformation → multi-platform matrix operations → A/B testing landing page optimization → AI model (Kimi / Tencent Yuanbao) integration for enhanced user experience.',
    design: '核心指标：转型后实体产品毛收入 +180%；落地页 CTR 从 1.23% → 1.85%（+50%）；ATV +75%。覆盖 B站/小红书/公众号/直播全平台矩阵。',
    designEn: 'Key metrics: physical product gross revenue +180% after transformation; landing page CTR 1.23% → 1.85% (+50%); ATV +75%. Coverage: Bilibili / Xiaohongshu / WeChat / Live streaming full-platform matrix.',
    status: '已结项 (2024.01 - 2025.06)',
    statusEn: 'Completed (Jan 2024 - Jun 2025)',
  },
];

const skillsData = {
  programming: ['Python', 'SQL', 'TypeScript', 'Next.js', 'Bash'],
  dataTools: ['Pandas', 'PyTorch', 'SUMO仿真', 'Claude Code', 'VSim/MViz', 'ESS', 'Feishu API', 'Google Analytics'],
  finance: ['ADAS PPM流程（TLM/RPA/PR/FO）', '强化学习（PPO/D3QN）', 'Vibe Coding / AI辅助开发', 'A/B测试', '数据标注与评测集构建', '用户调研与竞品分析'],
  certifications: [
    'CET-4（大学英语四级）：593分',
    'CET-6（大学英语六级）：529分',
    'Momenta ADAS PPM实习（Harz平台 CP Planning方向）',
    '斯坦福硅谷研学项目（全额资助）',
  ],
  certificationsEn: [
    'CET-4 (College English Test Band 4): 593',
    'CET-6 (College English Test Band 6): 529',
    'Momenta ADAS PPM Internship (Harz Platform, CP Planning)',
    'Stanford Silicon Valley Program (Fully Funded)',
  ],
  languages: ['中文（母语）', 'English（CET-6，可进行学术和商务交流）'],
};

const skillCategories = [
  { key: 'programming', icon: Code, label: '编程与开发' },
  { key: 'dataTools', icon: Database, label: 'AI与工具链' },
  { key: 'finance', icon: BarChart3, label: '专业能力' },
];

// ── Study notes default data ──────────────────────────────────────────────
const defaultNotes: NoteItem[] = [
  {
    id: 'default-1',
    title: 'PPM工作流梳理：TLM → RPA → PR → FO 全流程笔记',
    tag: 'ADAS PPM',
    href: '#',
  },
  {
    id: 'default-2',
    title: 'Vibe Coding 实践：Claude Code 开发 ESS 路测工具总结',
    tag: 'Claude Code',
    href: '#',
  },
];

// ── Xiaohongshu icon (inline SVG) ────────────────────────────────────────
function XhsIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#FF2442" />
      <path d="M11 5h2v6h3l-4 4-4-4h3V5z" fill="white" />
      <rect x="5" y="17" width="14" height="2" rx="1" fill="white" />
    </svg>
  );
}

// ── Bilibili icon (inline SVG) ───────────────────────────────────────────
function BiliIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#00AEEC" />
      <path d="M7.5 7.5h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" fill="white" />
      <circle cx="9.5" cy="11" r="1" fill="#00AEEC" />
      <circle cx="14.5" cy="11" r="1" fill="#00AEEC" />
      <path d="M9 7.5 7.5 6M15 7.5 16.5 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ============== HELPER COMPONENTS ==============
function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="w-1 h-7 bg-primary-600 rounded-full" />
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{label}</h2>
    </div>
  );
}

/** Counts from 0 → target when scrolled into view. */
function AnimatedStat({ target, decimals = 0, suffix = '', prefix = '', label }: {
  target: number; decimals?: number; suffix?: string; prefix?: string; label: string;
}) {
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const val = eased * target;
      setDisplay(decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString());
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, decimals]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-3xl md:text-4xl font-bold text-primary-600 tabular-nums leading-none">
        {prefix}{display}{suffix}
      </span>
      <span className="text-xs md:text-sm text-gray-500 font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

const METRICS_ZH = [
  { target: 4,     decimals: 0, suffix: '',   prefix: '',  label: '段实习经历' },
  { target: 22,    decimals: 0, suffix: '%',  prefix: '+', label: '新用户转化率提升' },
  { target: 180,   decimals: 0, suffix: '%',  prefix: '+', label: '产品毛收入提升' },
  { target: 10,    decimals: 0, suffix: '+',  prefix: '',  label: '功能版本迭代' },
  { target: 90.81, decimals: 2, suffix: '',   prefix: '',  label: '硕士均分' },
];
const METRICS_EN = [
  { target: 4,     decimals: 0, suffix: '',   prefix: '',  label: 'Internships' },
  { target: 22,    decimals: 0, suffix: '%',  prefix: '+', label: 'User Conversion Lift' },
  { target: 180,   decimals: 0, suffix: '%',  prefix: '+', label: 'Revenue Growth' },
  { target: 10,    decimals: 0, suffix: '+',  prefix: '',  label: 'Feature Iterations' },
  { target: 90.81, decimals: 2, suffix: '',   prefix: '',  label: "Master's Avg Score" },
];

// ── "Now" default items ───────────────────────────────────────────────────
const defaultNow: NowItem[] = [
  { emoji: '🚗', category: '在做', categoryEn: 'Working',  content: 'Momenta ADAS PPM实习 — Harz CP Planning 功能版本管理与场景分析' },
  { emoji: '⌨️', category: '在学', categoryEn: 'Learning', content: 'Vibe Coding 深度实践：用 Claude Code 构建交通 AI 平台，探索 AI 辅助全栈开发' },
  { emoji: '💬', category: '在想', categoryEn: 'Thinking', content: '技术型 PM 的壁垒在哪里？如何把强化学习背景和 AI 工具链融合成真正的差异化能力' },
];

// ============== MAIN COMPONENT ==============
export default function Home() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [mounted, setMounted] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(0);
  const [expandedStarExp, setExpandedStarExp] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const t = translations[lang];

  // Admin mode
  const { isAdmin, get, save, reset, login, logout } = useAdminContent();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState('');
  const [adminPwError, setAdminPwError] = useState(false);
  const adminCtx: AdminCtx = { isAdmin, get, save };

  // Dark mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_dark') === '1';
    setIsDark(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('portfolio_dark', isDark ? '1' : '0');
  }, [isDark]);

  // Notes store (localStorage-backed)
  const { notes, addNote, removeNote, updateNote } = useNotesStore(defaultNotes);

  // "Now" store
  const { items: nowItems, updateItem: updateNowItem } = useNowStore(defaultNow);

  // Section visibility (admin can hide sections from visitors)
  const { isHidden: secHidden, toggle: toggleSec } = useHiddenSections();
  // Returns null for non-admin when section is hidden; dims content for admin
  const Veil = ({ id }: { id: string }) => !isAdmin ? null : (
    <button
      onClick={() => toggleSec(id)}
      title={secHidden(id) ? '点击恢复显示' : '点击隐藏此区块'}
      className={`absolute top-5 right-6 z-20 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border shadow-sm transition
        ${secHidden(id) ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' : 'bg-white/80 border-gray-200 text-gray-400 hover:bg-gray-50'}`}
    >
      {secHidden(id) ? <><EyeOff size={10} /><span>已隐藏</span></> : <><Eye size={10} /><span>隐藏</span></>}
    </button>
  );
  const dim = (id: string) => isAdmin && secHidden(id) ? 'opacity-40 pointer-events-none select-none' : '';

  // 每日一言 (Hitokoto)
  const [hitokoto, setHitokoto] = useState<{ hitokoto: string; from: string; from_who: string } | null>(null);
  useEffect(() => {
    fetch('https://v1.hitokoto.cn/')
      .then(r => r.json())
      .then(setHitokoto)
      .catch(() => {});
  }, []);
  type NoteForm = { mode: 'add' | 'edit'; id?: string; title: string; tag: string; href: string };
  const [noteForm, setNoteForm] = useState<NoteForm | null>(null);
  const openAddNote  = () => setNoteForm({ mode: 'add',  title: '', tag: '', href: '' });
  const openEditNote = (n: NoteItem) => setNoteForm({ mode: 'edit', id: n.id, title: n.title, tag: n.tag, href: n.href });
  const submitNoteForm = () => {
    if (!noteForm || !noteForm.title.trim() || !noteForm.href.trim()) return;
    if (noteForm.mode === 'add') addNote({ title: noteForm.title.trim(), tag: noteForm.tag.trim(), href: noteForm.href.trim() });
    else if (noteForm.id) updateNote(noteForm.id, { title: noteForm.title.trim(), tag: noteForm.tag.trim(), href: noteForm.href.trim() });
    setNoteForm(null);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).dataset.visible = '1'; }),
      { threshold: 0.07 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const sectionObs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.25, rootMargin: '-64px 0px -40% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(el => sectionObs.observe(el));
    return () => sectionObs.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const subtitle = t.hero.subtitle;
    setTypedSubtitle('');
    setIsTypingDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedSubtitle(subtitle.slice(0, i));
      if (i >= subtitle.length) { clearInterval(id); setIsTypingDone(true); }
    }, 55);
    return () => clearInterval(id);
  }, [mounted, lang]);

  const toggleLanguage = () => setLang(lang === 'zh' ? 'en' : 'zh');

  return (
    <AdminContext.Provider value={adminCtx}>
    <div className={`min-h-screen bg-white selection:bg-primary-200 selection:text-primary-900${isAdmin ? ' admin-mode' : ''}`} style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ── Scroll progress bar ── */}
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center gap-2.5 hover:opacity-80 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">JN</div>
              <span className="font-semibold text-gray-900 tracking-tight">Junhao Niu</span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-7">
              {(['about', 'experience', 'projects', 'skills', 'now', 'notes', 'contact'] as const).map(item => (
                <a key={item} href={`#${item}`} className={`text-sm font-medium transition-colors relative group ${activeSection === item ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  {t.nav[item]}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              ))}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 px-4 py-2 rounded-full text-sm font-medium transition hover:shadow-sm"
              >
                <Download size={15} />
                <span>{lang === 'zh' ? '导出简历' : 'Resume'}</span>
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium transition hover:border-primary-400"
              >
                <Globe size={13} />
                <span>{lang === 'en' ? '中文' : 'EN'}</span>
              </button>
              <button
                onClick={() => setIsDark(d => !d)}
                title={isDark ? '切换浅色' : '切换深色'}
                className="p-1.5 rounded-full text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={() => isAdmin ? logout() : setShowAdminLogin(true)}
                title={isAdmin ? '退出管理模式' : '管理员登录'}
                className={`p-1.5 rounded-full transition ${isAdmin ? 'text-amber-600 bg-amber-100 hover:bg-amber-200' : 'text-gray-300 hover:text-gray-500'}`}
              >
                <Lock size={13} />
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-full text-xs font-medium"
              >
                <Globe size={12} />
                {lang === 'en' ? '中文' : 'EN'}
              </button>
              <button
                onClick={() => setIsDark(d => !d)}
                className="p-1.5 text-gray-400 hover:text-primary-600 transition"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-600 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 pt-4 pb-5">
            <div className="space-y-1 mb-4">
              {(['about', 'experience', 'projects', 'skills', 'now', 'notes', 'contact'] as const).map(item => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors"
                >
                  {t.nav[item]}
                </a>
              ))}
            </div>
            <button
              onClick={() => { setIsExportModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition"
            >
              <Download size={16} />
              {lang === 'zh' ? '导出简历' : 'Export Resume'}
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-20 px-6 relative bg-white">
        {/* Background decorations — overflow-hidden scoped here so content isn't clipped */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dot-grid background decoration */}
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Fade to white at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
          {/* Soft radial glow top-left */}
          <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-gradient-to-br from-primary-50/70 to-transparent rounded-full blur-3xl" />
          {/* Soft radial glow bottom-right */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-gradient-to-tl from-violet-50/60 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row gap-14 items-center">
            {/* Left content */}
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-100">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                {lang === 'zh' ? '欢迎访问我的个人主页' : 'Welcome to my portfolio'}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                <E id={`hero.${lang}.title`} def={t.hero.title} />
              </h1>
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
                {isAdmin ? (
                  <E id={`hero.${lang}.subtitle`} def={t.hero.subtitle} cls="text-primary-600" />
                ) : (
                  <span className={`gradient-text-animated${!isTypingDone ? ' typing-cursor' : ''}`}>
                    {typedSubtitle}
                  </span>
                )}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                <E id={`hero.${lang}.description`} def={t.hero.description} />
              </p>

              {/* Quick-stat chips */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  lang === 'zh' ? '4段实习经历' : '4 Internships',
                  lang === 'zh' ? 'Vibe Coding 实践者' : 'Vibe Coding Practitioner',
                  lang === 'zh' ? '3个研究项目' : '3 Projects',
                ].map((chip, i) => (
                  <span key={i} className="stat-chip text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg font-medium cursor-default">
                    {chip}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200 font-medium"
                >
                  <Mail size={18} />
                  {t.hero.contact}
                </a>
                <a
                  href="https://github.com/niujunhao149"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-primary-400 hover:text-primary-600 transition font-medium"
                >
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </div>

            {/* Right: profile photo */}
            <div className="flex-shrink-0">
              <div className="relative float-animate">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-primary-100 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(59,130,246,0.15), 0 25px 50px rgba(0,0,0,0.12)' }}>
                  <img src={`${BASE}/images/profile.jpg`} alt="牛俊浩" className="w-full h-full object-cover" />
                </div>
                {/* Status badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {lang === 'zh' ? '开放工作机会' : 'Open to opportunities'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics strip ── */}
      {(!secHidden('metrics') || isAdmin) && (
        <div className="bg-white border-y border-gray-100 py-10 px-6 relative">
          <Veil id="metrics" />
          <div className={`max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-5 gap-8 ${dim('metrics')}`}>
            {(lang === 'zh' ? METRICS_ZH : METRICS_EN).map((m, i) => (
              <AnimatedStat key={i} {...m} />
            ))}
          </div>
        </div>
      )}

      {/* ── About & Education ── */}
      {(!secHidden('about') || isAdmin) && (
      <section id="about" className="py-20 px-6 scroll-mt-24 bg-gray-50/50 relative">
        <Veil id="about" />
        <div className={dim('about')}><div className="max-w-4xl mx-auto">
          <SectionHeading label={t.about.title} />
          <div className="space-y-6">
            {/* Intro card */}
            <div className="card-glow bg-white rounded-2xl p-7 border border-gray-100 shadow-sm animate-on-scroll">
              <E id={`about.${lang}.intro`} def={t.about.intro} as="p" cls="text-gray-700 leading-relaxed mb-4" />
              <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500" />
                <E id={`about.${lang}.strengths`} def={t.about.strengths} as="p" cls="text-primary-800 text-sm font-medium leading-relaxed" />
              </div>
            </div>

            {/* Education cards */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">{t.about.education}</p>
              <div className="grid md:grid-cols-2 gap-5">
                {/* Master's */}
                <div className="card-glow bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-on-scroll" style={{ transitionDelay: '60ms' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center border border-primary-100 p-1.5">
                      <img
                        src={`${BASE}/logos/tju_logo.svg`}
                        alt="TJU"
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)!.style.display = 'flex'; }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-primary-700 font-bold text-xs">TJU</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{t.about.university}</h3>
                      <p className="text-xs text-primary-600 mt-0.5">{t.about.faculty}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-gray-900">{t.about.degree}</p>
                    <p className="text-gray-500 leading-relaxed">{t.about.major}</p>
                    <p className="text-gray-400 text-xs">{t.about.period}</p>
                  </div>
                </div>

                {/* Bachelor's */}
                <div className="card-glow bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-on-scroll" style={{ transitionDelay: '120ms' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center border border-primary-100 p-1.5">
                      <img
                        src={`${BASE}/logos/tju_logo.svg`}
                        alt="TJU"
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)!.style.display = 'flex'; }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-primary-700 font-bold text-xs">TJU</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{t.about.bachelorUniv}</h3>
                      <p className="text-xs text-primary-600 mt-0.5">{t.about.bachelorFaculty}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-gray-900">{t.about.bachelor}</p>
                    <p className="text-gray-500 leading-relaxed">{t.about.bachelorMajor}</p>
                    <p className="text-gray-400 text-xs">{t.about.bachelorPeriod}</p>
                    <p className="text-gray-400 text-xs">{t.about.bachelorGpa}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div>
      </section>
      )}

      {/* ── Experience — Timeline ── */}
      {(!secHidden('experience') || isAdmin) && (
      <section id="experience" className="py-20 px-6 scroll-mt-24 relative">
        <Veil id="experience" />
        <div className={dim('experience')}><div className="max-w-4xl mx-auto">
          <SectionHeading label={t.experience.title} />

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary-400 via-primary-200 to-primary-50 hidden md:block" />

            <div className="space-y-5">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 animate-on-scroll"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  {/* Timeline node — logo circle on the line */}
                  <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-xl bg-white border-2 border-primary-200 shadow-sm items-center justify-center p-1.5 relative z-10 mt-4">
                    {exp.logo && (
                      <img
                        src={`${BASE}${exp.logo}`}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                        onError={e => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>

                  {/* Card */}
                  <div className="card-glow flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        {/* Mobile logo */}
                        <div className="flex md:hidden w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm items-center justify-center p-1.5 flex-shrink-0">
                          {exp.logo && (
                            <img
                              src={`${BASE}${exp.logo}`}
                              alt={exp.company}
                              className="w-full h-full object-contain"
                              onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            <E id={`exp.${idx}.${lang === 'en' ? 'companyEn' : 'company'}`} def={lang === 'en' ? exp.companyEn : exp.company} />
                          </h3>
                          <p className="text-primary-600 font-medium text-sm mt-0.5">
                            <E id={`exp.${idx}.${lang === 'en' ? 'roleEn' : 'role'}`} def={lang === 'en' ? exp.roleEn : exp.role} />
                          </p>
                        </div>
                      </div>
                      <span className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 whitespace-nowrap self-start">
                        <E id={`exp.${idx}.${lang === 'en' ? 'periodEn' : 'period'}`} def={lang === 'en' ? exp.periodEn : exp.period} />
                      </span>
                    </div>

                    <ul className="space-y-2.5">
                      {(lang === 'en' ? exp.highlightsEn : exp.highlights).map((highlight, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                            exp.highlightsBold?.includes(i) ? 'font-medium text-gray-800' : 'text-gray-600'
                          }`}
                        >
                          <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400" />
                          <E id={`exp.${idx}.h.${lang}.${i}`} def={highlight} />
                        </li>
                      ))}
                    </ul>

                    {/* STAR detail toggle */}
                    {STAR_DATA[exp.company] && (
                      <div className="mt-4">
                        <button
                          onClick={() => setExpandedStarExp(expandedStarExp === idx ? null : idx)}
                          className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-all"
                        >
                          <Sparkles size={12} />
                          {expandedStarExp === idx
                            ? (lang === 'zh' ? '收起 STAR 详情' : 'Hide STAR Details')
                            : (lang === 'zh' ? '查看 STAR 详情' : 'View STAR Details')}
                          <ChevronDown size={12} className={`transition-transform duration-200 ${expandedStarExp === idx ? 'rotate-180' : ''}`} />
                        </button>

                        {expandedStarExp === idx && (
                          <div className="mt-3 space-y-4 border-t border-primary-100 pt-4 accordion-body">
                            {STAR_DATA[exp.company].map((entry, ei) => (
                              <div key={ei} className="bg-primary-50/50 rounded-xl p-4 border border-primary-100">
                                <p className="text-sm font-semibold text-primary-800 mb-3">
                                  {lang === 'zh' ? entry.title : entry.titleEn}
                                </p>
                                <div className="space-y-2">
                                  {[
                                    { label: 'S', labelFull: lang === 'zh' ? '情境' : 'Situation', content: lang === 'zh' ? entry.s : entry.sEn, color: 'bg-blue-100 text-blue-700' },
                                    { label: 'T', labelFull: lang === 'zh' ? '任务' : 'Task', content: lang === 'zh' ? entry.t : entry.tEn, color: 'bg-purple-100 text-purple-700' },
                                    { label: 'A', labelFull: lang === 'zh' ? '行动' : 'Action', content: lang === 'zh' ? entry.a : entry.aEn, color: 'bg-amber-100 text-amber-700' },
                                    { label: 'R', labelFull: lang === 'zh' ? '结果' : 'Result', content: lang === 'zh' ? entry.r : entry.rEn, color: 'bg-green-100 text-green-700' },
                                  ].map(({ label, labelFull, content, color }) => (
                                    <div key={label} className="flex items-start gap-2.5">
                                      <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${color}`}>
                                        {label}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-xs font-semibold text-gray-500 mr-1.5">{labelFull}</span>
                                        <span className="text-sm text-gray-700 leading-relaxed">{content}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div></div>
      </section>
      )}

      {/* ── Projects — Accordion ── */}
      {(!secHidden('projects') || isAdmin) && (
      <section id="projects" className="py-20 px-6 scroll-mt-24 bg-gray-50/50 relative">
        <Veil id="projects" />
        <div className={dim('projects')}><div className="max-w-4xl mx-auto">
          <SectionHeading label={t.projects.title} />
          <div className="space-y-3">
            {projects.map((project, idx) => {
              const isExpanded = expandedProject === idx;
              const title = lang === 'en' ? project.titleEn : project.title;
              const subtitle = lang === 'en' ? project.subtitleEn : project.subtitle;
              const status = lang === 'en' ? project.statusEn : project.status;
              const isOngoing = status.includes('进行') || status.includes('Ongoing');

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 animate-on-scroll ${
                    isExpanded ? 'border-primary-200 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                  style={{ transitionDelay: `${idx * 70}ms` }}
                >
                  {/* Header — always visible, click to expand */}
                  <button
                    className="w-full text-left p-6 flex items-start gap-4 hover:bg-gray-50/60 transition-colors"
                    onClick={() => setExpandedProject(isExpanded ? null : idx)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                          isOngoing
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {status}
                        </span>
                        <span className="text-xs text-gray-300 font-mono tracking-wider">0{idx + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                        <E id={`proj.${idx}.${lang === 'en' ? 'titleEn' : 'title'}`} def={title} />
                      </h3>
                      <p className="text-primary-600/80 text-sm mb-3">
                        <E id={`proj.${idx}.${lang === 'en' ? 'subtitleEn' : 'subtitle'}`} def={subtitle} />
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="skill-tag-hover text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium border border-primary-100 cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 mt-1 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 pb-6 pt-5 accordion-body">
                      <div className="grid md:grid-cols-3 gap-5">
                        {[
                          { label: t.projects.objective, key: lang === 'en' ? 'objectiveEn' : 'objective', content: lang === 'en' ? project.objectiveEn : project.objective },
                          { label: t.projects.methodology, key: lang === 'en' ? 'methodologyEn' : 'methodology', content: lang === 'en' ? project.methodologyEn : project.methodology },
                          { label: t.projects.design, key: lang === 'en' ? 'designEn' : 'design', content: lang === 'en' ? project.designEn : project.design },
                        ].map(({ label, content, key: contentKey }) => (
                          <div key={label}>
                            <h4 className="font-semibold text-gray-800 text-sm mb-2.5 flex items-center gap-1.5">
                              <span className="w-1 h-3.5 bg-primary-500 rounded-full flex-shrink-0" />
                              {label}
                            </h4>
                            <E id={`proj.${idx}.${contentKey}`} def={content} as="p" cls="text-gray-600 text-sm leading-relaxed" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div></div>
      </section>
      )}

      {/* ── Skills ── */}
      {(!secHidden('skills') || isAdmin) && (
      <section id="skills" className="py-20 px-6 scroll-mt-24 relative">
        <Veil id="skills" />
        <div className={dim('skills')}><div className="max-w-6xl mx-auto">
          <SectionHeading label={t.skills.title} />

          {/* 3-column skill categories */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {skillCategories.map((cat, i) => (
              <div
                key={cat.key}
                className="card-glow bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-on-scroll"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <cat.icon className="text-primary-600" size={20} />
                  <h3 className="font-semibold text-gray-900 text-sm">{t.skills[cat.key as keyof typeof t.skills]}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(skillsData[cat.key as keyof typeof skillsData] as string[]).map((skill, j) => (
                    <span
                      key={j}
                      className="skill-tag-hover bg-gray-50 px-3 py-1.5 rounded-lg text-gray-700 text-xs font-medium border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-default"
                    >
                      <E id={`skill.${cat.key}.${j}`} def={skill} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="card-glow bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5 animate-on-scroll">
            <div className="flex items-center gap-2.5 mb-4">
              <Award className="text-primary-600" size={20} />
              <h3 className="font-semibold text-gray-900 text-sm">{t.skills.certifications}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {(lang === 'zh' ? skillsData.certifications : skillsData.certificationsEn).map((cert, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400" />
                  <E id={`cert.${lang}.${i}`} def={cert} cls="text-gray-700 text-sm leading-relaxed" />
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="card-glow bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-on-scroll">
            <div className="flex items-center gap-2.5 mb-4">
              <Languages className="text-primary-600" size={20} />
              <h3 className="font-semibold text-gray-900 text-sm">{t.skills.languages}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {skillsData.languages.map((langItem, i) => (
                <span key={i} className="bg-gray-50 px-4 py-2.5 rounded-xl text-gray-700 text-sm border border-gray-200 font-medium">
                  <E id={`lang.item.${i}`} def={langItem} />
                </span>
              ))}
            </div>
          </div>
        </div></div>
      </section>
      )}

      {/* ── Now ── */}
      {(!secHidden('now') || isAdmin) && (
      <section id="now" className="py-20 px-6 scroll-mt-24 relative">
        <Veil id="now" />
        <div className={dim('now')}><div className="max-w-6xl mx-auto">
          <SectionHeading label={t.now.title} />
          <p className="text-gray-500 text-sm mb-8 -mt-6">{t.now.subtitle}</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {nowItems.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-lg">
                    {lang === 'zh' ? item.category : item.categoryEn}
                  </span>
                </div>
                {isAdmin ? (
                  <textarea
                    value={item.content}
                    onChange={e => updateNowItem(i, e.target.value)}
                    rows={3}
                    className="text-sm text-gray-700 border border-dashed border-primary-300 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-primary-500 bg-primary-50/30 leading-relaxed"
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div></div>
      </section>
      )}

      {/* ── Notes ── */}
      {(!secHidden('notes') || isAdmin) && (
      <section id="notes" className="py-20 px-6 bg-gray-50 scroll-mt-24 relative">
        <Veil id="notes" />
        <div className={dim('notes')}><div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-2">
            <SectionHeading label={t.notes.title} />
            {isAdmin && (
              <button
                onClick={openAddNote}
                className="flex items-center gap-1.5 text-sm bg-primary-600 text-white px-3 py-2 rounded-xl hover:bg-primary-700 transition font-medium mt-1"
              >
                <Plus size={15} /> 添加笔记
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-8 -mt-6">{t.notes.subtitle}</p>

          {/* Add / Edit form */}
          {noteForm && (
            <div className="bg-white border border-primary-200 rounded-2xl p-5 mb-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {noteForm.mode === 'add' ? '添加笔记' : '编辑笔记'}
              </p>
              <div className="flex flex-col gap-2.5">
                <input
                  value={noteForm.title}
                  onChange={e => setNoteForm(f => f && { ...f, title: e.target.value })}
                  placeholder="笔记标题 *"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
                />
                <input
                  value={noteForm.tag}
                  onChange={e => setNoteForm(f => f && { ...f, tag: e.target.value })}
                  placeholder="分类标签（如：CTA 税法二）"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
                />
                <input
                  value={noteForm.href}
                  onChange={e => setNoteForm(f => f && { ...f, href: e.target.value })}
                  placeholder="文档链接 * （https://...）"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={submitNoteForm}
                  disabled={!noteForm.title.trim() || !noteForm.href.trim()}
                  className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  保存
                </button>
                <button
                  onClick={() => setNoteForm(null)}
                  className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm transition"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map(note => (
              <div key={note.id} className="relative group">
                <a
                  href={note.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-primary-600" />
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="flex-1 text-gray-800 font-medium text-sm leading-snug">{note.title}</p>
                  {note.tag && (
                    <span className="self-start text-xs font-medium bg-primary-50 text-primary-600 border border-primary-100 px-2.5 py-1 rounded-lg">
                      {note.tag}
                    </span>
                  )}
                </a>
                {/* Admin controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.preventDefault(); openEditNote(note); }}
                      className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-primary-50 hover:border-primary-300 shadow-sm transition"
                      title="编辑"
                    >
                      <Pencil size={11} className="text-gray-500" />
                    </button>
                    <button
                      onClick={e => { e.preventDefault(); if (confirm('删除这条笔记？')) removeNote(note.id); }}
                      className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-red-50 hover:border-red-300 shadow-sm transition"
                      title="删除"
                    >
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div></div>
      </section>
      )}

      {/* ── Contact ── */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white scroll-mt-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t.contact.title}</h2>
          <p className="text-primary-100 mb-12 max-w-xl mx-auto leading-relaxed">
            <E id={`contact.${lang}.message`} def={t.contact.message} />
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <a
              href="mailto:junhao@tju.edu.cn"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <Mail className="mx-auto mb-3" size={26} />
              <h3 className="font-semibold mb-1 text-sm">{t.contact.email}</h3>
              <p className="text-primary-100 text-xs">junhao@tju.edu.cn</p>
            </a>
            <a
              href="https://github.com/niujunhao149"
              target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <Github className="mx-auto mb-3" size={26} />
              <h3 className="font-semibold mb-1 text-sm">{t.contact.github}</h3>
              <p className="text-primary-100 text-xs">niujunhao149</p>
            </a>
            <a
              href="tel:+8613943142907"
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-[1.03] transition-all duration-200"
            >
              <Phone className="mx-auto mb-3" size={26} />
              <h3 className="font-semibold mb-1 text-sm">{t.contact.phone}</h3>
              <p className="text-primary-100 text-xs">+86 139 4314 2907</p>
            </a>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
          {/* 每日一言 */}
          {hitokoto && (
            <div className="text-center max-w-lg">
              <p className="text-gray-300 text-sm italic leading-relaxed">&ldquo;{hitokoto.hitokoto}&rdquo;</p>
              <p className="text-gray-600 text-xs mt-1.5">
                — {hitokoto.from_who ? `${hitokoto.from_who}，` : ''}{hitokoto.from}
              </p>
            </div>
          )}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 border-t border-gray-800 pt-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">JN</div>
              <span className="font-medium">Junhao Niu</span>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} · Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>

      <ResumeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        experiences={experiences}
        projects={projects}
        lang={lang}
      />

      {/* Admin login dialog */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Lock size={16} /> 管理员登录</h3>
            <input
              type="password" value={adminPwInput}
              onChange={e => { setAdminPwInput(e.target.value); setAdminPwError(false); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (login(adminPwInput)) { setShowAdminLogin(false); setAdminPwInput(''); }
                  else { setAdminPwError(true); setAdminPwInput(''); }
                }
              }}
              autoFocus placeholder="密码"
              className={`w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none ${adminPwError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
            />
            {adminPwError && <p className="text-xs text-red-500 mb-2">密码错误</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { if (login(adminPwInput)) { setShowAdminLogin(false); setAdminPwInput(''); } else { setAdminPwError(true); setAdminPwInput(''); } }}
                className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition"
              >进入</button>
              <button onClick={() => { setShowAdminLogin(false); setAdminPwInput(''); setAdminPwError(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin mode banner */}
      {isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 z-[150] bg-amber-400 text-amber-900 px-6 py-2.5 flex items-center justify-between shadow-xl">
          <span className="text-sm font-semibold">⚙ 管理员编辑模式 — 点击任意高亮文字即可编辑，失焦自动保存到 localStorage</span>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="flex items-center gap-1 text-xs font-medium underline hover:no-underline">
              <RotateCcw size={12} /> 重置所有修改
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 bg-amber-900 text-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-800 transition">
              <LogOut size={12} /> 退出
            </button>
          </div>
        </div>
      )}
    </div>
    </AdminContext.Provider>
  );
}
