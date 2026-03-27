// @ts-nocheck
import { saveAs } from 'file-saver';

// 从网站数据转换为PDF所需格式
export function prepareResumeData(selectedExperiences: any[], selectedProjects: any[]): any {
  return {
    basic: {
      name: '牛俊浩',
      jobTitle: 'ADAS PPM | AI产品经理 | 系统工程',
      phone: '(+86)13943142907',
      email: 'junhao@tju.edu.cn',
      age: '24',
      location: '天津',
      // 使用本地图片路径
      logoUrl: undefined, // SVG暂不支持，需要转换为PNG
      photoUrl: '/images/profile.jpg', // 证件照
    },

    education: [
      {
        school: '天津大学（985）',
        major: '金融',
        degree: '硕士',
        duration: '2024.09-2027.01',
        gpa: 'GPA：92.21(专业前10%)，天津大学二等学业奖学金',
        courses: '大数据与金融风险、金融随机分析、金融数据分析、衍生金融工具、公司金融',
      },
      {
        school: '中国矿业大学（211）',
        major: '金融',
        degree: '本科',
        duration: '2020.09-2024.06',
        gpa: 'GPA：4.15（专业前15%)，中国矿业大学二等学业奖学金',
        courses: '金融数据分析、宏观经济学、微观经济学、Python数据分析、金融经济学、证券投资',
      },
    ],

    experiences: selectedExperiences.map((exp) => {
      // 根据公司名映射为参考简历格式
      if (exp.company === 'Momenta') {
        return {
          position: '财务分析实习生',
          company: 'Momenta',
          duration: '2025.12-至今',
          highlights: [
            {
              title: 'AI智能体询价系统',
              content: '基于Coze平台搭建AI智能体，集成QQ邮箱自动抓取外资银行报价，使用AI提取价格/期限/风险等级信息并自动填表，询价效率提升60%，准确率接近100%。',
            },
            {
              title: '资金仪表板与自动化监控',
              content: '利用Claude Code开发每日数据报告生成工具，通过飞书仪表板展示多维度资金数据（余额分布、流水预测、理财到期），数据整理时间从1-2小时缩短至5分钟。',
            },
          ],
        };
      }

      if (exp.company === '中化天津有限公司') {
        return {
          position: '产权交易实习生',
          company: '中化天津有限公司',
          duration: '2025.08-2025.11',
          highlights: [
            {
              title: '资产处置与破产合规',
              content: '参与多项资产处置与破产规划项目，具备扎实的理论与法规应用能力。协助"蓝星清洗资产转让"项目的现场踏勘、资料审核，最终实现资产超50%溢价成交；参与"厦门长蓝"破产计划制定，结合《破产法》《公司法》及内部条例完成破产方案制定。',
            },
            {
              title: '行业研究与专业写作',
              content: '独立承担多项行业研究、报告撰写与项目通讯稿的撰写工作，具备优秀的信息整合与文字输出能力。完成中化天津物流"十五五"规划、上海写字楼出售等项目的行业分析与汇报材料撰写；负责"福建华橡"等重点项目的通讯稿件。',
            },
          ],
        };
      }

      if (exp.company === '东吴证券（研究所）') {
        return {
          position: '行业研究实习生',
          company: '东吴证券（电子设备与新能源）',
          duration: '2024.10-2025.03',
          highlights: [
            {
              title: '深度研究',
              content: '参与三花智控、厦门钨业深度研究报告撰写，负责三花智控热管理阀件在家电领域应用的数据搜集，分析厦门钨业产业布局、钨钼行业价格走势及行业地位，建立财务估值模型辅助研究；同步跟踪宁德时代等多家锂电池产业链核心标的，整理各类会议纪要20余篇。',
            },
            {
              title: '数据整理',
              content: '针对谐波减速器领域，对比绿的谐波等国产厂商与哈默纳科的产品参数、成本优势及国产替代进展。按月更新锂电池正极/负极/隔膜等核心部件的产量数据，协助团队分析覆盖企业财务数据，聚焦毛利率、研发投入等关键指标，支持行业研究与投资判断。',
            },
          ],
        };
      }

      return {
        position: exp.position || '实习生',
        company: exp.company,
        duration: exp.period || '',
        highlights: exp.highlights?.map((h: string) => ({
          title: '项目经历',
          content: h,
        })) || [],
      };
    }),

    projects: selectedProjects.map((proj) => {
      if (proj.title?.includes('投资者情绪') || proj.title?.includes('股指期货')) {
        return {
          role: '核心参与者',
          name: '江苏省大学生创新创业训练项目',
          duration: '2022.04-2024.04',
          details: [
            {
              title: '项目名称',
              content: '《投资者情绪指数的构建及其对我国股指期货市场功能影响的实证研究》，成功结项。',
            },
            {
              title: '数据获取与文本分析',
              content: '主导项目核心数据工作，通过Python编写网络爬虫，系统采集东方财富股吧的海量文本数据，并利用情感词典与文本分析方法，构建出初步的投资者情绪指数。',
            },
            {
              title: '数据处理与指数优化',
              content: '为克服数据频率差异，引入函数化数据分析方法（FDA）进行混频数据融合，将文本情绪指数由低频转化为高频序列，提升了指数与市场的同步性。',
            },
          ],
        };
      }

      return {
        role: '核心参与者',
        name: proj.title || proj.titleEn || '',
        duration: '2022-2024',
        details: proj.highlights?.map((h: string) => ({
          title: '研究内容',
          content: h,
        })) || [],
      };
    }),

    skills: [
      {
        category: '数据获取与分析能力',
        content: '熟练掌握八爪鱼采集器及Python（Requests/BeautifulSoup）进行网络数据采集，能够通过Wind、Choice等金融终端获取专业数据，并具备多源数据整合与清洗能力（Pandas）。熟悉使用Scikit-learn进行机器学习建模，可运用MySQL进行数据查询与管理。',
      },
      {
        category: 'AI应用能力',
        content: '熟练借助AI工具（如Trae）辅助编程，具备清晰的Prompt设计能力，能够高效实现代码生成与调试任务。',
      },
      {
        category: '软件技能',
        content: '精通MS Office办公软件，擅长Excel数据透视表、VLOOKUP及图表制作，可熟练完成Word文档处理与PPT设计，掌握Project甘特图与Visio流程图的绘制。掌握Axure原型开发能力。',
      },
      {
        category: '专业资质',
        content: '持有初级会计职称、基金从业资格，已通过注册会计师（CPA）会计科目、税务师（财务与会计、税法一）相关科目。',
      },
      {
        category: '语言能力',
        content: '英语六级（CET-6），能熟练阅读英文行业报告，并胜任工作场景下的口语交流。',
      },
    ],
  };
}

// 导出PDF函数（使用html2canvas + jsPDF）
export async function exportResumeToPDF(
  selectedExperiences: any[],
  selectedProjects: any[],
  filename: string = '姓名-学校-学历-专业-求职意向.pdf'
): Promise<void> {
  try {
    // 动态导入html2pdf以避免SSR问题
    const { generateResumePDF } = await import('./html2pdfResume');

    // 准备数据
    const resumeData = prepareResumeData(selectedExperiences, selectedProjects);

    // 添加完整的图片URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    resumeData.basic.photoUrl = `${origin}/images/profile.jpg`;

    // 生成并下载PDF
    await generateResumePDF(resumeData);
  } catch (error) {
    console.error('PDF导出失败:', error);
    throw error;
  }
}

// 旧版导出函数（使用@react-pdf/renderer，备用）
export async function exportResumeToPDFOld(
  selectedExperiences: any[],
  selectedProjects: any[],
  filename: string = '姓名-学校-学历-专业-求职意向.pdf'
): Promise<void> {
  try {
    // 动态导入 @react-pdf/renderer 以避免 SSR 问题
    const { pdf } = await import('@react-pdf/renderer');
    const { ResumePDF } = await import('./ResumePDFGenerator');
    const React = await import('react');

    // 准备数据
    const resumeData = prepareResumeData(selectedExperiences, selectedProjects);

    // 添加完整的图片URL
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    resumeData.basic.photoUrl = `${origin}/images/profile.jpg`;
    // resumeData.basic.logoUrl = `${origin}/logos/tju_logo.png`; // 需要PNG格式

    // 生成PDF
    const blob = await pdf(React.createElement(ResumePDF, { data: resumeData })).toBlob();

    // 下载
    saveAs(blob, filename);
  } catch (error) {
    console.error('PDF导出失败:', error);
    throw error;
  }
}
