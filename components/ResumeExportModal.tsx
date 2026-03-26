'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Printer, Minus, Plus, ChevronDown, Pencil, FileDown, Upload } from 'lucide-react';
import { EXP_CONTENT, PROJ_CONTENT } from '@/lib/resumeContent';
import { exportResumeToPDF } from '@/lib/exportResumePDF';

interface Props {
  isOpen: boolean; onClose: () => void;
  experiences: any[]; projects: any[]; lang: 'zh' | 'en';
}

// ── Font stacks ──────────────────────────────────────────────────────────
const SONG = "'SimSun','STSong','NSimSun','Times New Roman',serif";
const HEI  = "'SimHei','STHeiti','Microsoft YaHei Black',sans-serif";
const TJU_BLUE = '#00518e'; // from tju_logo.svg: rgb(0%, 31.76%, 55.69%)
const SEP_W = '1.5pt';     // shared thickness: section underlines + contact separators

// ── Education data ────────────────────────────────────────────────────────
const EDU = {
  master: {
    school:  { zh: '天津大学（985）',         en: 'Tianjin University (985)' },
    major:   { zh: '金融',                    en: 'Finance' },
    degree:  { zh: '硕士',                    en: 'Master' },
    period:  '2024.09-2027.01',
    gpa:     { zh: 'GPA：92.21（专业前10%），**天津大学二等学业奖学金**', en: 'GPA: 92.21 (Top 10%), **Second-class Academic Scholarship**' },
    courses: { zh: '主修课程：**大数据与金融风险**、金融随机分析、**金融数据分析**、衍生金融工具、公司金融', en: 'Key Courses: **Big Data & Financial Risk**, Financial Stochastic Analysis, **Financial Data Analysis**, Derivatives, Corporate Finance' },
  },
  bachelor: {
    school:  { zh: '中国矿业大学（211）',       en: 'China University of Mining & Technology (211)' },
    major:   { zh: '金融',                    en: 'Finance' },
    degree:  { zh: '本科',                    en: 'Bachelor' },
    period:  '2020.09-2024.06',
    gpa:     { zh: 'GPA：4.15（专业前15%），中国矿业大学二等学业奖学金', en: 'GPA: 4.15 (Top 15%), Second-class Academic Scholarship' },
    courses: { zh: '主修课程：**金融数据分析**、宏观经济学、微观经济学、**Python数据分析**、金融经济学、证券投资', en: 'Key Courses: **Financial Data Analysis**, Macroeconomics, Microeconomics, **Python Data Analysis**, Financial Economics, Securities Investment' },
  },
};

// ── Skills data ─────────────────────────────────────────────────────────
const SKILLS_ZH = [
  { topic: '数据获取与分析能力', body: '熟练掌握Python（Pandas/NumPy/Scikit-learn/BERT）进行数据清洗与机器学习建模；能够通过Wind、Choice等金融终端获取专业数据，具备多源数据整合与清洗能力；可运用MySQL进行数据查询与管理；熟悉使用Scikit-learn进行机器学习建模。' },
  { topic: 'AI应用能力', body: '熟练借助Coze、Claude Code等AI工具搭建智能体与自动化Skill，具备清晰的Prompt设计能力，能高效实现代码生成、流程自动化与金融场景LLM应用。' },
  { topic: '软件技能', body: '精通MS Office（Excel数据透视表/VLOOKUP/图表），掌握Power BI数据可视化，熟练使用Jira/Confluence进行项目管理，掌握SQL与VBA自动化。' },
  { topic: '专业资质', body: 'CPA：通过会计、财管、经济法、战略风管（4科）；CTA：通过财会、税法一、税法二、涉税实务（4科）；初级会计资格证；基金从业资格。' },
  { topic: '语言能力', body: '英语六级（CET-6），能熟练阅读英文行业报告，胜任工作场景下的口语交流。' },
];
const SKILLS_EN = [
  { topic: 'Data Analytics', body: 'Proficient in Python (Pandas/NumPy/Scikit-learn/BERT) for data processing and ML modeling; Wind/Choice financial terminals; MySQL for data management.' },
  { topic: 'AI Applications', body: 'Skilled in building AI agents and automation skills with Coze and Claude Code; clear prompt engineering for LLM applications in financial scenarios.' },
  { topic: 'Software Skills', body: 'Proficient in MS Office (Excel pivot/VLOOKUP/charts), Power BI, Jira/Confluence for project management, SQL and VBA automation.' },
  { topic: 'Certifications', body: 'CPA: 4 subjects (Accounting, Financial Mgmt, Economic Law, Strategy); CTA: 4 subjects; Junior Accounting Certificate; Fund Practitioner Certificate.' },
  { topic: 'Languages', body: 'CET-6 English — proficient reading of industry reports and professional oral communication.' },
];

// ── Bold parser: **text** → <strong> with 黑体 font ────────────────────
function Bold({ text, bodySize }: { text: string; bodySize: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((p, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ fontFamily: HEI, fontWeight: 700 }}>{p}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ── Section title: blue 黑体, blue thick rule below ─────────────────────
function Sec({ label, fs }: { label: string; fs: string }) {
  return (
    <div style={{ marginBottom: '4pt', marginTop: '0' }}>
      <div style={{ fontFamily: HEI, fontWeight: 700, fontSize: fs, letterSpacing: '0.5px', lineHeight: 1.25, marginBottom: '2pt', color: TJU_BLUE }}>
        {label}
      </div>
      <div style={{ width: '100%', height: 0, borderTop: SEP_W + ' solid ' + TJU_BLUE }} />
    </div>
  );
}

// ── Vertical contact separator (same thickness as section underline) ──────
function VSep() {
  return (
    <span style={{
      display: 'inline-block', width: 0, height: '1em',
      borderLeft: SEP_W + ' solid ' + TJU_BLUE,
      verticalAlign: 'middle', margin: '0 5pt',
    }} />
  );
}

// ── Per-section font size stepper ─────────────────────────────────────────
function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', padding: '2px 0' }}>
      <span style={{ color: '#6b7280', flex: 1 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
        <button onClick={() => onChange(Math.max(-3, value - 1))} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"><Minus size={8} /></button>
        <span style={{ width: '28px', textAlign: 'center', fontFamily: 'monospace', color: '#374151' }}>{value > 0 ? '+' : ''}{value}</span>
        <button onClick={() => onChange(Math.min(3, value + 1))} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"><Plus size={8} /></button>
      </div>
    </div>
  );
}

type SectionFs = { name: number; contact: number; edu: number; exp: number; proj: number; skills: number };

// ── Resume Preview ────────────────────────────────────────────────────────
function ResumePreview({
  experiences, projects, selectedExps, selectedProjects,
  includeSkills, includeSelfEval, fontSize, lang,
  objective, includePhoto, expBullets, projBullets, age, location,
  phone, email, logoUrl, sectionFs,
}: {
  experiences: any[]; projects: any[]; selectedExps: Set<number>; selectedProjects: Set<number>;
  includeSkills: boolean; includeSelfEval: boolean; fontSize: number;
  lang: 'zh' | 'en'; objective: string; includePhoto: boolean;
  expBullets: Record<string, [string, string]>; projBullets: Record<string, [string, string]>;
  age: string; location: string;
  phone: string; email: string; logoUrl: string;
  sectionFs: SectionFs;
}) {
  const isZh = lang === 'zh';
  const expList = experiences.filter((_, i) => selectedExps.has(i));
  const projList = projects.filter((_, i) => selectedProjects.has(i));
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const sf = (section: keyof SectionFs, delta = 0) => `${fontSize + sectionFs[section] + delta}pt`;
  const effectiveLogoUrl = logoUrl || `${origin}/logos/tju_logo.svg`;

  // ── Preload images as base64 data URLs ────────────────────────────────
  // Fixes: (1) browser print skips network images on some PCs
  //        (2) html2canvas cannot render SVG <img> reliably
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [logoDataUrl,  setLogoDataUrl]  = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    /** Fetch any URL and return a base64 data URL. Skips already-base64 URLs. */
    async function toDataUrl(url: string): Promise<string> {
      if (!url || url.startsWith('data:')) return url;
      const res  = await fetch(url, { cache: 'force-cache' });
      const blob = await res.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    /** Convert an SVG data URL → PNG data URL via an offscreen canvas.
     *  html2canvas cannot render SVG <img> on many browsers. */
    function svgToPng(svgDataUrl: string, px: number): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = px * 2; // 2× for crisp rendering
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('no ctx')); return; }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = svgDataUrl;
      });
    }

    // Load profile photo
    if (includePhoto && origin) {
      toDataUrl(`${origin}/images/profile.jpg`)
        .then(url => { if (!cancelled) setPhotoDataUrl(url); })
        .catch(() => {/* fallback to URL */});
    } else {
      setPhotoDataUrl('');
    }

    // Load logo — convert SVG to PNG for html2canvas compatibility
    const logoSrc = logoUrl || (origin ? `${origin}/logos/tju_logo.svg` : '');
    if (logoSrc) {
      toDataUrl(logoSrc)
        .then(dataUrl => {
          const isSvg = dataUrl.startsWith('data:image/svg') || logoSrc.endsWith('.svg');
          return isSvg ? svgToPng(dataUrl, 88) : dataUrl;
        })
        .then(url => { if (!cancelled) setLogoDataUrl(url); })
        .catch(() => {/* fallback to URL */});
    }

    return () => { cancelled = true; };
  }, [includePhoto, logoUrl, origin]);

  const selfEval = isZh
    ? '具备金融专业背景与CPA/CTA证书体系知识，熟练掌握Python数据分析与机器学习，能将LLM应用于金融实际场景。实习经历覆盖资金分析、资产交易、项目管理、行业研究等多个领域，学习迅速、注重量化成果、善于跨部门协作。'
    : 'Strong finance foundation with CPA/CTA credentials, proficient in Python analytics and ML, experienced in applying LLMs to financial scenarios. Fast learner, results-driven, skilled in cross-functional collaboration.';

  const bulletRow = (b: string, bi: number, bodyFs: string) => (
    <div key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: '4pt', marginBottom: '2pt', paddingLeft: '2pt' }}>
      <span style={{ flexShrink: 0, fontFamily: SONG, fontSize: bodyFs, lineHeight: 1.4, marginTop: '1pt' }}>•</span>
      <span style={{ fontFamily: SONG, fontSize: bodyFs, lineHeight: 1.35 }}>
        <Bold text={b} bodySize={bodyFs} />
      </span>
    </div>
  );

  return (
    <div id="resume-preview-content" style={{
      width: '794px', minHeight: '1123px', background: '#fff',
      fontFamily: SONG, fontSize: `${fontSize}pt`, lineHeight: 1.4, color: '#000',
      padding: '20pt 28pt 16pt', boxSizing: 'border-box',
    }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8pt', marginBottom: '6pt' }}>

        {/* Logo (supports custom upload) */}
        <img src={logoDataUrl || effectiveLogoUrl} alt="logo"
          style={{ width: '44pt', height: '44pt', objectFit: 'contain', flexShrink: 0, marginTop: '2pt' }} />

        {/* Center: name + objective + contact */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: HEI, fontWeight: 900, fontSize: sf('name', 19), letterSpacing: '8px', lineHeight: 1.1, marginBottom: '3pt' }}>
            {isZh ? '你的名字' : 'Your Name'}
          </div>
          {objective.trim() && (
            <div style={{ fontFamily: SONG, fontWeight: 700, fontSize: sf('contact', 1.5), marginBottom: '4pt' }}>
              {isZh ? '求职意向：' : 'Objective: '}{objective.trim()}
            </div>
          )}
          {/* Contact row: flex separators with same style as section underlines */}
          <div style={{ fontFamily: SONG, fontSize: sf('contact', -0.5), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <strong style={{ fontFamily: HEI }}>{phone}</strong>
            <VSep />
            <a href={`mailto:${email}`} style={{ color: '#000', textDecoration: 'none' }}>{email}</a>
            <VSep />
            <strong style={{ fontFamily: HEI }}>{isZh ? `年龄：${age}` : `Age: ${age}`}</strong>
            <VSep />
            <strong style={{ fontFamily: HEI }}>{isZh ? `现居地：${location}` : `Location: ${location}`}</strong>
          </div>
        </div>

        {/* Photo — no border */}
        {includePhoto && (
          <img src={photoDataUrl || `${origin}/images/profile.jpg`} alt="photo"
            style={{ width: '52pt', height: '66pt', objectFit: 'cover', flexShrink: 0, marginTop: '2pt' }} />
        )}
      </div>

      {/* ── Education ── */}
      <div style={{ marginBottom: '6pt' }}>
        <Sec label={isZh ? '教育背景' : 'Education'} fs={sf('edu', 1.5)} />
        {[EDU.master, EDU.bachelor].map((edu, i) => (
          <div key={i} style={{ marginBottom: i === 0 ? '4pt' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1.35 }}>
              <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('edu', 0.5), flex: '0 0 36%' }}>{edu.school[isZh ? 'zh' : 'en']}</span>
              <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('edu', 0.5), flex: '0 0 14%', textAlign: 'center' }}>{edu.major[isZh ? 'zh' : 'en']}</span>
              <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('edu', 0.5), flex: '0 0 14%', textAlign: 'center' }}>{edu.degree[isZh ? 'zh' : 'en']}</span>
              <span style={{ fontFamily: SONG, fontSize: sf('edu', -0.5), flex: 1, textAlign: 'right', color: '#222' }}>{edu.period}</span>
            </div>
            <div style={{ fontFamily: SONG, fontSize: sf('edu', -0.5), lineHeight: 1.35, paddingLeft: '1pt' }}>
              <Bold text={edu.gpa[isZh ? 'zh' : 'en']} bodySize={sf('edu', -0.5)} />
            </div>
            <div style={{ fontFamily: SONG, fontSize: sf('edu', -0.5), lineHeight: 1.35, paddingLeft: '1pt' }}>
              <Bold text={edu.courses[isZh ? 'zh' : 'en']} bodySize={sf('edu', -0.5)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Experience ── */}
      {expList.length > 0 && (
        <div style={{ marginBottom: '6pt' }}>
          <Sec label={isZh ? '实习经历' : 'Internship Experience'} fs={sf('exp', 1.5)} />
          {expList.map((exp, i) => {
            const role    = isZh ? exp.role    : exp.roleEn;
            const company = isZh ? exp.company : exp.companyEn;
            const period  = (isZh ? exp.period : exp.periodEn).replace(/[年月\s]/g, '.').replace(/\.\./g, '.').replace(/\.$/,'');
            const bullets = expBullets[exp.company] || ['', ''];
            return (
              <div key={i} style={{ marginBottom: i < expList.length - 1 ? '5pt' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2pt' }}>
                  <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('exp', 0.5), flex: '0 0 28%' }}>{role}</span>
                  <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('exp', 0.5), flex: '0 0 44%', textAlign: 'center' }}>{company}</span>
                  <span style={{ fontFamily: SONG, fontSize: sf('exp', -0.5), flex: 1, textAlign: 'right', color: '#222' }}>{period}</span>
                </div>
                {bullets.filter(Boolean).map((b, bi) => bulletRow(b, bi, sf('exp')))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Projects ── */}
      {projList.length > 0 && (
        <div style={{ marginBottom: '6pt' }}>
          <Sec label={isZh ? '项目经历' : 'Research Projects'} fs={sf('proj', 1.5)} />
          {projList.map((proj, i) => {
            const role   = isZh ? '核心参与者' : 'Core Participant';
            const title  = isZh ? proj.title   : proj.titleEn;
            const status = isZh ? proj.status  : proj.statusEn;
            const bullets = projBullets[proj.title] || ['', ''];
            const dateMatch = status.match(/\d{4}[\.\-]\d{2}.*\d{4}[\.\-]\d{2}|进行中|Ongoing/);
            const periodStr = dateMatch ? dateMatch[0] : status;
            return (
              <div key={i} style={{ marginBottom: i < projList.length - 1 ? '5pt' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2pt' }}>
                  <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('proj', 0.5), flex: '0 0 20%' }}>{role}</span>
                  <span style={{ fontFamily: HEI, fontWeight: 700, fontSize: sf('proj', 0.5), flex: '0 0 52%', textAlign: 'center' }}>{title}</span>
                  <span style={{ fontFamily: SONG, fontSize: sf('proj', -0.5), flex: 1, textAlign: 'right', color: '#222' }}>{periodStr}</span>
                </div>
                {bullets.filter(Boolean).map((b, bi) => bulletRow(b, bi, sf('proj')))}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Skills ── */}
      {includeSkills && (
        <div style={{ marginBottom: '6pt' }}>
          <Sec label={isZh ? '技能＆证书' : 'Skills & Certifications'} fs={sf('skills', 1.5)} />
          {(isZh ? SKILLS_ZH : SKILLS_EN).map(({ topic, body }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '4pt', marginBottom: '2pt', paddingLeft: '2pt' }}>
              <span style={{ flexShrink: 0, fontFamily: SONG, fontSize: sf('skills'), lineHeight: 1.4, marginTop: '1pt' }}>•</span>
              <span style={{ fontFamily: SONG, fontSize: sf('skills'), lineHeight: 1.35 }}>
                <strong style={{ fontFamily: HEI, fontWeight: 700 }}>{topic}：</strong>{body}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Self-eval ── */}
      {includeSelfEval && (
        <div>
          <Sec label={isZh ? '自我评价' : 'Self-Evaluation'} fs={`${fontSize + 1.5}pt`} />
          <div style={{ fontFamily: SONG, fontSize: `${fontSize}pt`, lineHeight: 1.35, paddingLeft: '3pt' }}>{selfEval}</div>
        </div>
      )}
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────
export default function ResumeExportModal({ isOpen, onClose, experiences, projects, lang }: Props) {
  const isZh = lang === 'zh';

  const [selectedExps,     setSelectedExps]     = useState<Set<number>>(new Set([0, 1]));
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set([0, 1]));
  const [includeSkills,    setIncludeSkills]    = useState(true);
  const [includeSelfEval,  setIncludeSelfEval]  = useState(false);
  const [includePhoto,     setIncludePhoto]     = useState(true);
  const [fontSize,         setFontSize]         = useState(9);
  const [objective,        setObjective]        = useState(isZh ? '财务BP实习生' : 'Finance / Data Analytics Intern');
  const [age,              setAge]              = useState('22');
  const [location,         setLocation]         = useState(isZh ? '天津' : 'Tianjin');
  const [phone,            setPhone]            = useState('(+86)XXXXXXXXXXX');
  const [email,            setEmail]            = useState('your_email@example.com');
  const [logoUrl,          setLogoUrl]          = useState('');
  const [sectionFs,        setSectionFs]        = useState<SectionFs>({ name: 0, contact: 0, edu: 0, exp: 0, proj: 0, skills: 0 });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Editable bullets
  const [expBullets, setExpBullets] = useState<Record<string, [string, string]>>(() => {
    const out: Record<string, [string, string]> = {};
    experiences.forEach(exp => {
      const c = EXP_CONTENT[exp.company];
      if (c) out[exp.company] = isZh ? [c.zh[0], c.zh[1]] : [c.en[0], c.en[1]];
    });
    return out;
  });
  const [projBullets, setProjBullets] = useState<Record<string, [string, string]>>(() => {
    const out: Record<string, [string, string]> = {};
    projects.forEach(proj => {
      const c = PROJ_CONTENT[proj.title];
      if (c) out[proj.title] = isZh ? [c.zh[0], c.zh[1]] : [c.en[0], c.en[1]];
    });
    return out;
  });

  const [editOpen, setEditOpen] = useState<Set<string>>(new Set());
  const [pwVisible, setPwVisible] = useState(false);
  const [pwInput,   setPwInput]   = useState('');
  const [pwError,   setPwError]   = useState(false);

  if (!isOpen) return null;

  const toggleSel  = (set: Set<number>, idx: number) => { const s = new Set(set); s.has(idx) ? s.delete(idx) : s.add(idx); return s; };
  const toggleEdit = (key: string) => { const s = new Set(editOpen); s.has(key) ? s.delete(key) : s.add(key); setEditOpen(s); };
  const setSf = (k: keyof SectionFs, v: number) => setSectionFs(prev => ({ ...prev, [k]: v }));

  const doPrint = () => {
    const el = document.getElementById('resume-preview-content');
    if (!el) return;

    // Use a DOM-based print approach — works on mobile (no window.open needed)
    let root = document.getElementById('resume-print-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'resume-print-root';
      document.body.appendChild(root);
    }
    // Inject resume HTML into the print root
    root.innerHTML = el.outerHTML;

    // Trigger the browser's native print dialog
    window.print();

    // Clean up after print dialog closes
    setTimeout(() => { if (root) root.innerHTML = ''; }, 3000);
  };

  const handlePrintClick = () => { setPwInput(''); setPwError(false); setPwVisible(true); };
  const handlePwSubmit   = () => {
    if (pwInput === '1209') { setPwVisible(false); setPwInput(''); setPwError(false); doPrint(); }
    else { setPwError(true); setPwInput(''); }
  };

  const SCALE = 0.62;

  // ── Left panel: section card with optional expand-to-edit ──────────────
  const SectionCard = ({ id, label, sub, bullets, onChange }: {
    id: string; label: string; sub?: string;
    bullets: [string, string]; onChange: (b: [string, string]) => void;
  }) => {
    const open = editOpen.has(id);
    return (
      <div className={`rounded-xl border transition-colors ${editOpen.has(id) || true ? 'border-primary-200 bg-primary-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="flex items-start gap-2 px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-tight truncate">{label}</p>
            {sub && <p className="text-xs text-gray-400 truncate">{sub}</p>}
          </div>
          <button onClick={() => toggleEdit(id)} className="flex-shrink-0 p-1 hover:bg-primary-100 rounded-lg transition" title="编辑要点">
            {open
              ? <ChevronDown size={14} className="text-primary-600 rotate-180 transition-transform" />
              : <Pencil size={13} className="text-primary-500" />}
          </button>
        </div>
        {open && (
          <div className="px-3 pb-3 space-y-2 border-t border-primary-100 pt-2">
            {(['• 要点一', '• 要点二'] as const).map((ph, bi) => (
              <textarea key={bi} value={bullets[bi]}
                onChange={e => { const u: [string, string] = [bullets[0], bullets[1]]; u[bi] = e.target.value; onChange(u); }}
                rows={4}
                className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:border-primary-400 leading-relaxed font-mono"
                placeholder={ph}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-3">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '96vw', maxWidth: '1280px', height: '94vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isZh ? '简历预览与导出' : 'Resume Preview & Export'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{isZh ? '选择内容 · 编辑要点 · 实时预览 A4' : 'Select · edit bullets · live A4 preview'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Left panel ── */}
          <div className="w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto px-4 py-4 space-y-4">

            {/* Personal info */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isZh ? '个人信息' : 'Personal Info'}</p>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-400"
                placeholder={isZh ? '电话' : 'Phone'} />
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-400"
                placeholder={isZh ? '邮箱' : 'Email'} />
              <input value={objective} onChange={e => setObjective(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-400"
                placeholder={isZh ? '求职意向' : 'Objective'} />
              <div className="flex gap-2">
                <input value={age} onChange={e => setAge(e.target.value)}
                  className="w-20 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-400"
                  placeholder={isZh ? '年龄' : 'Age'} />
                <input value={location} onChange={e => setLocation(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-400"
                  placeholder={isZh ? '现居地' : 'Location'} />
              </div>
            </div>

            {/* Logo upload + photo toggle */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isZh ? '校徽与照片' : 'Logo & Photo'}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 transition">
                  <Upload size={12} />
                  {logoUrl ? (isZh ? '已上传校徽' : 'Logo uploaded') : (isZh ? '上传校徽' : 'Upload logo')}
                </button>
                {logoUrl && (
                  <button onClick={() => setLogoUrl('')} className="text-xs text-red-400 hover:text-red-600 transition">
                    {isZh ? '恢复默认' : 'Reset'}
                  </button>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" checked={includePhoto} onChange={e => setIncludePhoto(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                {isZh ? '显示证件照' : 'Show photo'}
              </label>
            </div>

            {/* Font sizes: global base + per-section */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{isZh ? '字体大小' : 'Font Sizes'}</p>
              <div className="flex items-center justify-between text-xs py-0.5">
                <span className="text-gray-700 font-medium">{isZh ? '全局基准' : 'Base'}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setFontSize(s => Math.max(7, s - 1))} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"><Minus size={8} /></button>
                  <span className="w-8 text-center font-mono text-gray-700">{fontSize}pt</span>
                  <button onClick={() => setFontSize(s => Math.min(11, s + 1))} className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500"><Plus size={8} /></button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-1 space-y-0.5">
                <Stepper label={isZh ? '姓名' : 'Name'}        value={sectionFs.name}    onChange={v => setSf('name', v)} />
                <Stepper label={isZh ? '联系信息' : 'Contact'}  value={sectionFs.contact} onChange={v => setSf('contact', v)} />
                <Stepper label={isZh ? '教育背景' : 'Education'} value={sectionFs.edu}    onChange={v => setSf('edu', v)} />
                <Stepper label={isZh ? '实习经历' : 'Experience'} value={sectionFs.exp}   onChange={v => setSf('exp', v)} />
                <Stepper label={isZh ? '项目经历' : 'Projects'}  value={sectionFs.proj}   onChange={v => setSf('proj', v)} />
                <Stepper label={isZh ? '技能证书' : 'Skills'}    value={sectionFs.skills} onChange={v => setSf('skills', v)} />
              </div>
            </div>

            {/* Experiences */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{isZh ? '实习经历' : 'Experience'}</p>
              <div className="space-y-2">
                {experiences.map((exp, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input type="checkbox" checked={selectedExps.has(i)} onChange={() => setSelectedExps(toggleSel(selectedExps, i))}
                      className="mt-2.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <SectionCard
                        id={`exp-${i}`}
                        label={isZh ? exp.company : exp.companyEn}
                        sub={isZh ? exp.period : exp.periodEn}
                        bullets={expBullets[exp.company] || ['', '']}
                        onChange={b => setExpBullets(prev => ({ ...prev, [exp.company]: b }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{isZh ? '项目经历' : 'Projects'}</p>
              <div className="space-y-2">
                {projects.map((proj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input type="checkbox" checked={selectedProjects.has(i)} onChange={() => setSelectedProjects(toggleSel(selectedProjects, i))}
                      className="mt-2.5 w-4 h-4 accent-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <SectionCard
                        id={`proj-${i}`}
                        label={isZh ? proj.title : proj.titleEn}
                        bullets={projBullets[proj.title] || ['', '']}
                        onChange={b => setProjBullets(prev => ({ ...prev, [proj.title]: b }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{isZh ? '其他' : 'Other'}</p>
              {[
                { label: isZh ? '技能＆证书' : 'Skills & Certs', v: includeSkills, set: setIncludeSkills },
                { label: isZh ? '自我评价' : 'Self-Eval', v: includeSelfEval, set: setIncludeSelfEval },
              ].map(({ label, v, set }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={v} onChange={e => set(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
              {isZh
                ? '💡 点击铅笔图标编辑每段的要点文字。打印时选"另存为 PDF"，A4，关闭页眉页脚，缩放"适合页面"。'
                : '💡 Click pencil to edit bullet text. Print → "Save as PDF", A4, no headers/footers, "Fit to page".'}
            </div>
          </div>

          {/* ── Right: A4 preview ── */}
          <div className="flex-1 bg-gray-100 overflow-auto flex flex-col items-center py-5 px-4">
            <p className="text-xs text-gray-400 mb-3 flex-shrink-0">
              {isZh ? 'A4 预览（62%）· 内容过多时减少选项或调小字号' : 'A4 preview (62%) · reduce items or font size if overflowing'}
            </p>
            <div className="flex-shrink-0 shadow-2xl ring-1 ring-gray-300 overflow-hidden"
              style={{ width: `${Math.round(794 * SCALE)}px`, height: `${Math.round(1123 * SCALE)}px`, position: 'relative' }}>
              <div style={{
                width: '794px', height: '1123px',
                transform: `scale(${SCALE})`, transformOrigin: 'top left',
                position: 'absolute', top: 0, left: 0, overflow: 'hidden',
              }}>
                <ResumePreview
                  experiences={experiences} projects={projects}
                  selectedExps={selectedExps} selectedProjects={selectedProjects}
                  includeSkills={includeSkills} includeSelfEval={includeSelfEval}
                  fontSize={fontSize} lang={lang} objective={objective}
                  includePhoto={includePhoto} expBullets={expBullets} projBullets={projBullets}
                  age={age} location={location}
                  phone={phone} email={email} logoUrl={logoUrl} sectionFs={sectionFs}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-3.5 flex-shrink-0 bg-gray-50/50">
          {pwVisible && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600 flex-shrink-0">{isZh ? '请输入密码：' : 'Enter password:'}</span>
              <input type="password" value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={e => e.key === 'Enter' && handlePwSubmit()} autoFocus
                className={`w-28 text-sm border rounded-lg px-2.5 py-1.5 focus:outline-none ${pwError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary-400'}`}
                placeholder="••••" />
              <button onClick={handlePwSubmit} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">{isZh ? '确认' : 'OK'}</button>
              <button onClick={() => { setPwVisible(false); setPwError(false); }} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm transition">{isZh ? '取消' : 'Cancel'}</button>
              {pwError && <span className="text-xs text-red-500 font-medium">{isZh ? '密码错误' : 'Wrong password'}</span>}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm">{isZh ? '关闭' : 'Close'}</button>
            <button
              onClick={async () => {
                try {
                  const selectedExpList = experiences.filter((_, i) => selectedExps.has(i));
                  const selectedProjList = projects.filter((_, i) => selectedProjects.has(i));
                  await exportResumeToPDF(selectedExpList, selectedProjList);
                } catch (error) {
                  alert(isZh ? 'PDF导出失败，请重试' : 'PDF export failed, please try again');
                }
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition font-medium text-sm shadow-sm"
            >
              <FileDown size={16} />
              {isZh ? '导出标准PDF' : 'Export Standard PDF'}
            </button>
            <button onClick={handlePrintClick} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium text-sm shadow-sm">
              <Printer size={16} />
              {isZh ? '浏览器打印' : 'Browser Print'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
