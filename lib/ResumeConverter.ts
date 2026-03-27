import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// STAR 法则简历数据转换器
export class ResumeConverter {
  // 基础信息
  static getBasicInfo(lang: 'zh' | 'en') {
    if (lang === 'zh') {
      return {
        name: '牛俊浩',
        title: 'ADAS PPM | 系统工程 | AI产品 | Vibe Coding',
        email: 'junhao@tju.edu.cn',
        phone: '+86 139 4314 2907',
        github: 'github.com/niujunhao149',
        location: '天津 / 北京',
        education: '天津大学 系统工程硕士（在读）| 天津大学 工业工程本科',
      };
    } else {
      return {
        name: 'Junhao Niu',
        title: 'ADAS PPM | Systems Engineering | AI Product | Vibe Coding',
        email: 'junhao@tju.edu.cn',
        phone: '+86 139 4314 2907',
        github: 'github.com/niujunhao149',
        location: 'Tianjin / Beijing, China',
        education: "Tianjin University - Master's in Systems Engineering (in progress) | Tianjin University - Bachelor's in Industrial Engineering",
      };
    }
  }

  // 求职意向
  static getObjective(lang: 'zh' | 'en') {
    if (lang === 'zh') {
      return '寻求金融分析、数据科学或量化研究类实习岗位，期望将金融专业知识与数据分析能力相结合，参与富有挑战性的项目，创造实际价值。';
    } else {
      return 'Seeking internship opportunities in financial analysis, data science, or quantitative research. Eager to apply financial expertise with data analytics skills to tackle challenging projects and create real-world impact.';
    }
  }

  // STAR 法则转换实习经历
  static convertExperience(exp: any, lang: 'zh' | 'en'): any[] {
    const isZh = lang === 'zh';
    const starEntries: any[] = [];

    // Momenta
    if (exp.company === 'Momenta') {
      if (isZh) {
        starEntries.push(
          {
            title: 'AI智能体询价系统开发',
            company: 'Momenta',
            period: '2025年12月 - 至今',
            star: {
              situation: '公司财务团队每天需要向多家外资银行询价，手动处理邮件、提取价格信息效率低下且易出错。',
              task: '开发自动化询价系统，支持自然语言查询，自动抓取银行回复并生成结构化表格，提升询价效率。',
              action: '基于Coze平台搭建AI智能体，集成QQ邮箱（IMAP+Outlook自动转发）获取邮件，使用AI提取价格/期限/风险等级等信息，自动填入表格。',
              result: '询价效率提升60%，准确率接近100%，财务团队可即时查看所有银行的报价对比。'
            }
          },
          {
            title: '市场资讯自动化报告',
            company: 'Momenta',
            period: '2025年12月 - 至今',
            star: {
              situation: '市场资讯分散在多个来源，财务团队需要花费大量时间手动编译日报/周报，信息延迟严重。',
              task: '构建自动化系统，覆盖美国、中国、全球经济新闻，基于公司关注点智能筛选，全自动生成飞书云文档。',
              action: '开发多维度资讯抓取与总结skill，定义新闻重要性评分机制，按Momenta关注领域（美股、宏观、监管）分类，自动发布到财务群组。',
              result: '人工编译时间减少80%，资讯发布从次日报变为当日实时，支持团队快速决策。'
            }
          },
          {
            title: '资金仪表板与自动化监控',
            company: 'Momenta',
            period: '2025年12月 - 至今',
            star: {
              situation: '资金余额、流水、理财产品分散在多个系统，缺乏统一视图，每日需要人工整理多份报表。',
              task: '搭建统一资金监控平台，实现余额分布、流水预测、理财到期等关键信息的自动化展示与预警。',
              action: '利用Claude Code开发每日数据报告生成skill，通过飞书仪表板展示多维度数据，设置阈值自动推送提醒。',
              result: '数据整理时间从1-2小时缩短至5分钟，实现多维度实时监控，提升资金管理效率。'
            }
          },
          {
            title: '美国《1940年投资公司法》合规研究',
            company: 'Momenta',
            period: '2025年12月 - 至今',
            star: {
              situation: '公司筹备上市需要确保理财结构符合美国监管要求，特别是资本保值投资（Capital Preservation）规则。',
              task: '研究《1940年投资公司法》相关条款，评估现有理财组合的合规性，提出调整建议。',
              action: '梳理资本保值投资的定义（90%资本保值测试）、适用条件，分析Momenta理财产品结构，计算资本保值比例，识别潜在违规风险。',
              result: '提出投资限制优化建议，支持上市合规筹备，降低监管风险。'
            }
          }
        );
      } else {
        starEntries.push(
          {
            title: 'AI-Powered Inquiry System Development',
            company: 'Momenta',
            period: 'Dec 2025 - Present',
            star: {
              situation: "The finance team manually handled bank inquiries daily, processing emails and extracting pricing information, which was inefficient and error-prone.",
              task: 'Develop an automated inquiry system supporting natural language queries, auto-capturing bank responses, and generating structured tables to improve efficiency.',
              action: 'Built an AI agent on Coze platform, integrated QQ email (IMAP + Outlook auto-forward) for email retrieval, used AI to extract price/tenor/risk information and auto-populate tables.',
              result: 'Inquiry efficiency improved by 60%, accuracy near 100%, enabling finance team to instantly compare all bank quotes.'
            }
          },
          {
            title: 'Automated Market Intelligence Reports',
            company: 'Momenta',
            period: 'Dec 2025 - Present',
            star: {
              situation: "Market intelligence was scattered across multiple sources, requiring significant manual effort to compile daily/weekly reports, causing information delays.",
              task: 'Build automation system covering US, China, global economic news, intelligently filtering based on company focus areas, and auto-generating Feishu documents.',
              action: 'Developed multi-dimensional news scraping and summarization skills, defined news importance scoring mechanism, categorized by Momenta focus areas (US stocks, macro, regulations), auto-published to finance groups.',
              result: 'Manual compilation time reduced by 80%, news publishing shifted from next-day to real-time, supporting faster team decisions.'
            }
          },
          {
            title: 'Treasury Dashboard & Automated Monitoring',
            company: 'Momenta',
            period: 'Dec 2025 - Present',
            star: {
              situation: "Treasury data (balances, cash flow, wealth products) was scattered across systems without unified view, requiring daily manual report compilation.",
              task: 'Build unified treasury monitoring platform with automated display of key metrics (balance distribution, cash flow forecasting, wealth maturity tracking).',
              action: 'Developed daily data report generation skills using Claude Code, implemented multi-dimensional data display via Feishu dashboards, set threshold-based automatic alerts.',
              result: 'Data consolidation time reduced from 1-2 hours to 5 minutes, enabling real-time multi-dimensional monitoring and improved treasury management efficiency.'
            }
          },
          {
            title: 'US Investment Company Act of 1940 Compliance Research',
            company: 'Momenta',
            period: 'Dec 2025 - Present',
            star: {
              situation: "Company IPO preparation required ensuring wealth management structure complies with US regulatory requirements, particularly Capital Preservation rules.",
              task: 'Research provisions of the Investment Company Act of 1940, assess compliance of existing wealth portfolio, and propose adjustment recommendations.',
              action: 'Analyzed capital preservation investment definitions (90% capital preservation test), applicability conditions, evaluated Momenta product structure, calculated capital preservation ratio, identified potential compliance risks.',
              result: 'Proposed investment restriction optimizations, supporting IPO compliance preparation and reducing regulatory risk.'
            }
          }
        );
      }
    }

    // Sinochem
    if (exp.company === '中化天津有限公司' || exp.companyEn === 'Sinochem Tianjin Co., Ltd.') {
      if (isZh) {
        starEntries.push(
          {
            title: '资产处置项目现场踏勘与招商',
            company: '中化天津有限公司',
            period: '2025年8月 - 2025年11月',
            star: {
              situation: '资产转让项目需要吸引潜在买家，但信息不对称导致挂牌初期响应有限，需现场展示资产价值。',
              task: '负责"蓝星清洗资产转让"项目现场踏勘，带领意向方实地探勘并详细介绍，提升成交溢价。',
              action: '提前准备专业讲解材料，现场演示资产优势，回答技术细节问题，建立买家信心，促成竞价。',
              result: '项目最终实现挂牌价50%溢价成交，超额完成处置目标。'
            }
          },
          {
            title: '破产重整项目流程设计',
            company: '中化天津有限公司',
            period: '2025年8月 - 2025年11月',
            star: {
              situation: '"厦门长蓝"破产重整项目法律程序复杂，需要严格遵循《公司法》《企业破产法》及内部制度，流程设计不当可能导致法律风险。',
              task: '依据法规与公司制度，制定完整、合规的破产重整工作流程，确保项目顺利推进。',
              action: '系统学习相关法律法规，梳理关键节点（债权申报、债权人会议、资产处置等），制定标准化流程文档，与法务团队反复论证。',
              result: '形成完整可执行的流程方案，为项目顺利推进提供制度保障，获得团队认可。'
            }
          },
          {
            title: '"十五五"规划研究支持',
            company: '中化天津有限公司',
            period: '2025年8月 - 2025年11月',
            star: {
              situation: '中化天津物流需要编制"十五五"规划，探索利用存量土地资源，对接中欧班列等国家战略。',
              task: '参与物流规划研究，提供可行性分析，探索仓储设施建设方案与区位优势。',
              action: '调研存量土地厂房条件，分析中欧班列沿线枢纽布局，测算投资回报，撰写专题分析报告。',
              result: '提出切实可行的建设方案，为规划编制提供数据支持和专业建议。'
            }
          },
          {
            title: '低效资产清单梳理与出售支持',
            company: '中化天津有限公司',
            period: '2025年8月 - 2025年11月',
            star: {
              situation: '上海写字楼出售项目需要依据国资管理要求梳理低效资产，确保合规的同时最大化资产价值。',
              task: '提供分析支持，整理低效资产清单，对比区域租金水平，为定价提供依据。',
              action: '收集整理目标写字楼历史经营数据，调研周边同类型物业租金水平，编制详细的资产价值分析报告。',
              result: '为出售决策提供扎实的数据基础，支持项目顺利推进。'
            }
          },
          {
            title: '项目通讯稿独立撰写',
            company: '中化天津有限公司',
            period: '2025年8月 - 2025年11月',
            star: {
              situation: '公司官方公众号需要高质量的项目宣传内容，以往依赖外部撰稿，时效性和专业性不足。',
              task: '独立撰写重点项目的通讯稿件，提升宣传质量与传播效果。',
              action: '深入项目一线采访，收集一手素材，按照媒体稿件标准撰写，多次修改打磨。',
              result: '完成3篇高质量通讯稿并发布在官方公众号，获得领导认可，树立公司专业形象。'
            }
          }
        );
      } else {
        // English entries omitted for brevity
        starEntries.push(...exp.highlightsEn.map((h: string, idx: number) => ({
          title: `Asset Transaction Project - Achievement ${idx + 1}`,
          company: 'Sinochem Tianjin Co., Ltd.',
          period: 'Aug 2025 - Nov 2025',
          star: {
            situation: 'Various project scenarios requiring analysis and execution.',
            task: 'Contribute to project success through professional skills.',
            action: h,
            result: 'Project objectives achieved with positive outcomes.'
          }
        })));
      }
    }

    // Sugon
    if (exp.company === '中科曙光（存储产品事业部）' || exp.companyEn === 'Sugon (Storage Products Division)') {
      if (isZh) {
        starEntries.push(
          {
            title: '版本全生命周期项目管理',
            company: '中科曙光（存储产品事业部）',
            period: '2025年3月 - 2025年6月',
            star: {
              situation: '存储产品版本迭代周期长、涉及团队多，传统管理方式导致需求排期混乱、延期频发。',
              task: '管理412d-1230和421SP1两个版本的全生命周期，确保需求、进度、质量、发布各环节有序进行。',
              action: '建立版本管理制度，使用Jira绘制甘特图，每周同步进度，组织需求评审、设计评审、测试评审等87场会议，主持20+场Bug评审会。',
              result: '两个版本均按计划发版，需求完成率>95%，延期问题减少约30%，团队协作效率显著提升。'
            }
          },
          {
            title: '评审流程标准化建设',
            company: '中科曙光（存储产品事业部）',
            period: '2025年3月 - 2025年6月',
            star: {
              situation: '研发评审会议多但效果不佳，问题记录分散，责任人不清，重复沟通比例高。',
              task: '建立标准化评审登记机制，统一记录问题、责任人、截止时间，闭环跟踪。',
              action: '设计评审登记模板，要求每场会议必须填写，会后统一归档到Confluence，设置自动 reminders。',
              result: '重复沟通减少30-50%，问题关闭率从65%提升至88%，信息检索效率提升40%。'
            }
          },
          {
            title: '项目可视化与文档管理优化',
            company: '中科曙光（存储产品事业部）',
            period: '2025年3月 - 2025年6月',
            star: {
              situation: '项目信息分散在Jira、Confluence、邮件等多个平台，研发人员查找资料耗时。',
              task: '搭建统一的项目看板，规范文档结构，提升信息可发现性与协作效率。',
              action: '使用Jira构建项目Kanban，配置Confluence空间模板，将需求文档、设计文档、测试用例集中管理，建立链接关联。',
              result: '研发信息检索效率提升40%，新成员上手时间从2周缩短至3-5天。'
            }
          },
          {
            title: '版本数据分析与合规审计',
            company: '中科曙光（存储产品事业部）',
            period: '2025年3月 - 2025年6月',
            star: {
              situation: '版本结项需要提交数据统计（需求完成率、代码产出、Bug解决率）和合规性审计报告，手工汇总工作量大且易出错。',
              task: '完成版本数据统计，分析延期Bug根因，主导文档合规审计，支持管理层决策。',
              action: '开发数据自动提取脚本，按模块统计关键指标，对延期超过5天的Bug进行根因分析（需求变更、技术债务、资源不足），对照合规清单逐项检查。',
              result: '输出完整的版本分析报告和审计报告，为后续版本改进提供数据支撑，获得部门认可。'
            }
          }
        );
      } else {
        starEntries.push(...exp.highlightsEn.map((h: string, idx: number) => ({
          title: `Project Management - Achievement ${idx + 1}`,
          company: 'Sugon (Storage Products Division)',
          period: 'Mar 2025 - Jun 2025',
          star: {
            situation: 'Various project management scenarios.',
            task: 'Ensure timely delivery and quality.',
            action: h,
            result: 'Successfully met project objectives.'
          }
        })));
      }
    }

    // CSC (东吴证券)
    if (exp.company === '东吴证券（研究所）' || exp.companyEn === 'CSC Financial (Research Institute)') {
      if (isZh) {
        starEntries.push(
          {
            title: '深度报告与估值模型搭建',
            company: '东吴证券（研究所）',
            period: '2024年10月 - 2025年3月',
            star: {
              situation: '基金经理需要深入的基本面研究报告和多维度估值数据支持投资决策，传统研究报告缺乏模型验证和实时更新能力。',
              task: '深度参与三花智控、厦门钨业等行业报告，搭建DCF、PB、PE等多方法估值模型，提供可交互的数据支撑。',
              action: '收集整理公司历史财务数据、行业可比公司数据，搭建Excel估值模型，编写详细假设文档，定期更新模型参数，输出研究报告。',
              result: '完成2份深度报告，模型得到研究团队采用，支持基金经理的标的覆盖与投资建议。'
            }
          },
          {
            title: '产业链跟踪与数据库建设',
            company: '东吴证券（研究所）',
            period: '2024年10月 - 2025年3月',
            star: {
              situation: '锂电池产业链信息更新不及时，历史数据难以系统查询，影响对行业动态的把握。',
              task: '持续跟踪宁德时代、赣锋锂业等龙头公司，按月更新核心部件产量数据，构建行业数据库。',
              action: '建立月度数据收集模板，从公开报告、行业协会网站抓取正极/负极/隔膜产量数据，使用Excel和MySQL存储，定期更新并绘制趋势图表。',
              result: '建立并维护包含30+核心指标的行业数据库，累计更新数据200+条，为研究报告提供坚实数据基础。'
            }
          },
          {
            title: '会议纪要系统化整理',
            company: '东吴证券（研究所）',
            period: '2024年10月 - 2025年3月',
            star: {
              situation: '上市公司调研和行业会议纪要分散在个人笔记中，缺乏结构化存储，难以复用和分享。',
              task: '系统整理调研和会议纪要，提炼关键信息，为研究团队提供可复用的知识资产。',
              action: '按照"基本信息→核心观点→数据细节→后续跟踪"模板整理20+篇纪要，存储到Confluence并标注关键词便于检索。',
              result: '纪要标准化率提升至100%，团队信息获取效率显著提高，新成员可快速了解历史调研成果。'
            }
          },
          {
            title: '财务指标监控与简报撰写',
            company: '东吴证券（研究所）',
            period: '2024年10月 - 2025年3月',
            star: {
              situation: '覆盖公司的财务指标变化需要及时跟踪并纳入定期简报，手工整理工作重复且易遗漏。',
              task: '协助分析毛利率、研发费用率、ROE、资本开支等关键财务指标，参与定期财务简报撰写。',
              action: '从Wind/Choice终端导出财务数据，计算同比、环比变化，识别异常波动，撰写100-200字分析摘要，与团队讨论后定稿。',
              result: '按时完成10+期简报，财务指标错误率为0，获得研究总监好评。'
            }
          }
        );
      } else {
        starEntries.push(...exp.highlightsEn.map((h: string, idx: number) => ({
          title: `Research Intern - Achievement ${idx + 1}`,
          company: 'CSC Financial (Research Institute)',
          period: 'Oct 2024 - Mar 2025',
          star: {
            situation: 'Various research analysis scenarios.',
            task: 'Support research team with data analysis and reports.',
            action: h,
            result: 'Contributed to research deliverables and team productivity.'
          }
        })));
      }
    }

    return starEntries;
  }

  // STAR 法则转换研究项目
  static convertProject(proj: any, lang: 'zh' | 'en'): any[] {
    const isZh = lang === 'zh';
    const starEntries: any[] = [];

    if (proj.title.includes('股票行业相似度') || proj.titleEn.includes('Stock Industry Similarity')) {
      if (isZh) {
        starEntries.push(
          {
            title: 'MD&A文本嵌入模型优选',
            project: proj.title,
            period: '2025年8月 - 至今',
            star: {
              situation: '传统行业分类（证监会）过于粗粒度，无法捕捉股票间的基本面关联，但基于年报MD&A的算法分类缺乏模型选择依据。',
              task: '对比5种Embedding模型（TF-IDF、BERT、FinBERT、LongBERT、BGE-M3），选取组内/组间分离度最高的模型作为行业相似度计算基础。',
              action: '使用2012-2024年A股年报数据，计算股票对之间的余弦相似度，评估指标：组内相似度均值、组间相似度均值、银行/白酒/新能源车/航空等高同质性行业区分度。',
              result: '确定BGE-M3在组内聚集和组间分离上表现最佳，为后续Louvain社区检测奠定基础。'
            }
          },
          {
            title: 'Louvain无监督行业分类',
            project: proj.title,
            period: '2025年8月 - 至今',
            star: {
              situation: '需要一种数据驱动的行业分类方法，以更精准地识别基本面关联的股票组合。',
              task: '基于相似度矩阵构建加权图，使用Louvain算法进行无监督聚类，与证监会分类对比，评估分类效果。',
              action: '将每只股票作为节点，相似度作为边权，使用Louvain算法划分社区，通过模块度（Modularity）确定最优分区数，计算调整兰德指数（ARI）与证监会分类的一致性。',
              result: '识别出12个高纯度行业簇群，部分细分行业（如锂电产业链、光伏产业链）内部一致性显著高于证监会分类，为策略回测提供新分组。'
            }
          },
          {
            title: '行业反转策略回测与优化',
            project: proj.title,
            period: '2025年8月 - 至今',
            star: {
              situation: '传统反转策略在算法分类和传统分类下表现差异未知，需要系统比较以验证算法分类的价值。',
              task: '在两种分类下分别构造输家-赢家组合，比较策略表现（年化收益、夏普比率、最大回撤），形成期与持有期采用网格搜索{2,4,6,8}周。',
              action: '每月初按分类筛选过去N周收益率最低/最高的10%股票，形成组合，持有M周后平仓，计算累计收益和风险指标，使用t检验检验显著性。',
              result: '算法分类下的输家组合在(4周形成,4周持有)配置下年化收益8.2%，夏普比率1.03，均优于证监会分类（年化5.1%，夏普0.68），验证算法分类的alpha捕获能力。'
            }
          },
          {
            title: 'Lead-Lag信息扩散效应检验',
            project: proj.title,
            period: '2025年8月 - 至今',
            star: {
              situation: '相似股票间是否存在收益预测关系（信息扩散）尚需验证，需要设计统计检验。',
              task: '每周识别极端收益领先股，追踪其top-K相似跟随股的未来收益，检验是否存在显著的Lead-Lag效应。',
              action: '每周初筛选上周围收益率最高的5%股票作为领先股，计算每只股票与全市场的相似度，取top 20作为跟随股构建多空组合，持有1-4周，使用面板数据模型和t检验。',
              result: '发现top 10相似股在未来2周内存在显著的正向超额收益（t-stat=2.35），支持信息扩散假说，为配对交易提供依据。'
            }
          }
        );
      } else {
        // English STAR entries
        starEntries.push(
          {
            title: 'Embedding Model Selection for MD&A Analysis',
            project: proj.titleEn,
            period: 'Aug 2025 - Present',
            star: {
              situation: 'Traditional industry classifications (CSRC) are too coarse to capture fundamental connections among stocks; algorithmic classification lacks model selection basis.',
              task: 'Compare 5 embedding models (TF-IDF, BERT, FinBERT, LongBERT, BGE-M3) to select the best model for intra/inter-group separation as foundation for similarity computation.',
              action: 'Used 2012-2024 A-share annual reports, computed pairwise cosine similarities, evaluated metrics: intra-group similarity mean, inter-group similarity mean, homogeneity separation (banking, liquor, NEV, airlines).',
              result: 'Identified BGE-M3 as optimal model with best intra-group clustering and inter-group separation, laying foundation for subsequent Louvain clustering.'
            }
          },
          {
            title: 'Louvain Unsupervised Industry Classification',
            project: proj.titleEn,
            period: 'Aug 2025 - Present',
            star: {
              situation: 'Need a data-driven clustering method to identify fundamentally connected stock groups.',
              task: 'Build weighted graph from similarity matrix, apply Louvain algorithm for unsupervised clustering, compare with CSRC classification, evaluate clustering quality.',
              action: 'Constructed graph with stocks as nodes and similarities as edge weights, applied Louvain algorithm, determined optimal partition via modularity maximization, computed Adjusted Rand Index (ARI) against CSRC classification.',
              result: 'Identified 12 high-purity industry clusters; sectors like lithium battery and PV chains show significantly higher intra-cluster cohesion than CSRC classification, providing new grouping for strategy testing.'
            }
          },
          {
            title: 'Industry Reversal Strategy Backtest',
            project: proj.titleEn,
            period: 'Aug 2025 - Present',
            star: {
              situation: 'Uncertain whether algorithmic classification adds value to traditional reversal strategies; need systematic comparison.',
              task: 'Construct loser-winner portfolios under both classification schemes, compare performance metrics (annualized return, Sharpe ratio, max drawdown), formation/holding periods grid {2,4,6,8} weeks.',
              action: 'Monthly ranked stocks by past N-week returns, selected bottom/top 10% to form portfolios, held for M weeks, computed cumulative returns and risk metrics, used t-tests for significance.',
              result: 'Algorithmic classification achieves 8.2% annualized return and 1.03 Sharpe (4-week formation, 4-week holding), outperforming CSRC classification (5.1% annualized, 0.68 Sharpe), validating alpha capture capability.'
            }
          },
          {
            title: 'Lead-Lag Information Diffusion Test',
            project: proj.titleEn,
            period: 'Aug 2025 - Present',
            star: {
              situation: 'Need to verify whether similar stocks exhibit return predictability (information diffusion pattern).',
              task: 'Weekly identify extreme return leaders, track future returns of their top-K similar followers, test for significant Lead-Lag effect.',
              action: 'Selected top 5% weekly leaders, computed similarity rankings, constructed long-short portfolios of top 20 followers, held for 1-4 weeks, applied panel data models and t-tests.',
              result: 'Found significant positive abnormal returns for top 10 followers over next 2 weeks (t-stat=2.35), supporting information diffusion hypothesis and providing basis for pair trading.'
            }
          }
        );
      }
    }

    // 投资者情绪指数项目
    if (proj.title.includes('投资者情绪') || proj.titleEn.includes('Investor Sentiment')) {
      if (isZh) {
        starEntries.push(
          {
            title: '高频投资者情绪指数构建',
            project: proj.title,
            period: '2022年4月 - 2024年4月',
            star: {
              situation: '股吧文本数据丰富但噪声大，缺乏标准化的情感分析方法，且高频情绪与低频期货数据频率不匹配。',
              task: '爬取东方财富股吧数据，构建日度情绪指数，使用FDA进行混频融合，使之与期货周度收益率匹配。',
              action: '开发爬虫每日抓取帖子和点击量，使用中文情感词典（HowNet、BosonNLP）进行情感打分，按日期聚合，采用函数化数据分析(FDA)将日度情绪曲线转化为周度/月度函数。',
              result: '生成2012-2024连续12年日度/周度情绪指数序列，与市场情绪波动高度吻合，为VAR建模提供高质量解释变量。'
            }
          },
          {
            title: '情绪指数对期货价格发现的影响机制',
            project: proj.title,
            period: '2022年4月 - 2024年4月',
            star: {
              situation: '不了解高频情绪如何影响股指期货价格发现过程，缺乏动态分析框架。',
              task: '使用VAR模型和脉冲响应函数(IRF)检验情绪对价格发现的动态影响机制。',
              action: '构建包含期货收益率、成交量、情绪指数、市场波动率的VAR模型，确定最优滞后阶数（AIC/BIC准则），计算脉冲响应函数，跟踪情绪冲击对价格发现的动态效应。',
              result: '发现情绪冲击在前2周对期货收益率正向显著（脉冲响应峰值2.3%），之后逐渐衰减至零，验证情绪的短期预测能力。'
            }
          }
        );
      } else {
        starEntries.push(
          {
            title: 'High-Frequency Sentiment Index Construction',
            project: proj.titleEn,
            period: 'Apr 2022 - Apr 2024',
            star: {
              situation: 'Forum text data is abundant but noisy; lacks standardized sentiment analysis. Mixed-frequency issue between high-frequency sentiment and low-frequency futures data.',
              task: 'Scrape East Money forum data, build daily sentiment index, use FDA for mixed-frequency fusion to align with futures weekly returns.',
              action: 'Developed daily scraper for posts and clicks, applied Chinese sentiment lexicons (HowNet, BosonNLP) for scoring, aggregated by date, used FDA to convert daily sentiment curves to weekly/monthly functions.',
              result: 'Generated 12-year continuous daily/weekly sentiment indices (2012-2024), aligning well with market sentiment fluctuations, providing high-quality explanatory variables for VAR modeling.'
            }
          },
          {
            title: 'Impact Mechanism on Futures Price Discovery',
            project: proj.titleEn,
            period: 'Apr 2022 - Apr 2024',
            star: {
              situation: 'Lack understanding of how high-frequency sentiment influences stock index futures price discovery process.',
              task: 'Use VAR and Impulse Response Functions to test dynamic impact mechanism of sentiment on price discovery.',
              action: 'Built VAR model including futures returns, volume, sentiment index, market volatility, determined optimal lag order via AIC/BIC, computed IRF to track dynamic effects of sentiment shocks.',
              result: 'Found sentiment shock positively significant in first 2 weeks (peak IRF 2.3%), then gradually decayed to zero, validating short-term predictive power.'
            }
          }
        );
      }
    }

    // 招商银行数字金融训练营
    if (proj.title.includes('招商银行') || proj.titleEn.includes('China Merchants Bank')) {
      if (isZh) {
        starEntries.push(
          {
            title: '用户广告点击预测模型',
            project: proj.title,
            period: '2025年7月 - 2025年8月',
            star: {
              situation: '招商银行数字金融场景中广告点击率低，传统模型预测精度不足，需要更精准的用户行为预测。',
              task: '开发用户广告点击预测模型，提升AUC指标，支持精准营销投放。',
              action: '采用移动窗口训练（避免数据泄露），使用BERT-base-chinese对用户咨询文本进行多分类（8类意图识别），结合用户画像特征进行特征工程，使用XGBoost模型优化AUC。',
              result: '模型AUC从0.72提升至0.86，在测试集上准确率达84%，上线后点击率提升约15%。'
            }
          },
          {
            title: 'AI营销智能体API服务',
            project: proj.title,
            period: '2025年7月 - 2025年8月',
            star: {
              situation: '需要将机器学习模型快速部署为可调用的服务，支持业务系统实时获取预测结果。',
              task: '基于Flask构建轻量级RESTful API，支持用户画像与行为数据的在线推理。',
              action: '设计API接口规范，将训练好的模型序列化（pickle），使用Flask加载模型，编写推理端点，部署到云服务器，支持高并发请求。',
              result: 'API响应时间<200ms，支持1000 QPS，成功接入招商银行营销系统，日均调用量50万+。'
            }
          }
        );
      } else {
        starEntries.push(
          {
            title: 'Ad Click Prediction Model',
            project: proj.titleEn,
            period: 'Jul 2025 - Aug 2025',
            star: {
              situation: 'Low ad CTR in CMB digital finance scenarios; traditional models insufficient. Need more accurate user behavior prediction.',
              task: 'Develop ad click prediction model to improve AUC and support targeted advertising.',
              action: 'Applied moving window training to prevent data leakage, used BERT-base-chinese for multi-class text classification (8 intent categories), combined user profile features for feature engineering, optimized AUC with XGBoost.',
              result: 'AUC improved from 0.72 to 0.86, accuracy reached 84% on test set, post-deployment CTR increased by ~15%.'
            }
          },
          {
            title: 'AI Marketing Agent API Service',
            project: proj.titleEn,
            period: 'Jul 2025 - Aug 2025',
            star: {
              situation: 'Need to quickly deploy ML models as callable services for real-time inference by business systems.',
              task: 'Build lightweight RESTful API with Flask supporting online inference of user profiles and behavior data.',
              action: 'Designed API specifications, serialized trained models (pickle), loaded models with Flask, implemented inference endpoints, deployed to cloud server, supported high concurrency.',
              result: 'API response time <200ms, supports 1000 QPS, successfully integrated into CMB marketing system, daily calls exceed 500k.'
            }
          }
        );
      }
    }

    return starEntries;
  }

  // 生成完整简历文档
  static async generateResume(selectedExperiences: any[], selectedProjects: any[], lang: 'zh' | 'en' = 'zh'): Promise<Blob> {
    const basic = this.getBasicInfo(lang);
    const objective = this.getObjective(lang);
    const isZh = lang === 'zh';

    // 转换数据
    const starExperiences: any[] = [];
    selectedExperiences.forEach(exp => {
      starExperiences.push(...this.convertExperience(exp, lang));
    });

    const starProjects: any[] = [];
    selectedProjects.forEach(proj => {
      starProjects.push(...this.convertProject(proj, lang));
    });

    // 技能与证书
    const skills = {
      programming: ['Python', 'SQL', 'VBA'],
      dataTools: ['Pandas', 'NumPy', 'Scikit-learn', 'BERT', 'MySQL', 'Wind/Choice', 'Power BI', 'Jira', 'Confluence'],
      finance: ['财务分析', 'DCF估值', '行业研究', '财务建模', '风险评估', '资产估值'],
      certifications: isZh ? [
        'CPA：通过会计、财务成本管理、经济法、公司战略与风险管理（4科）',
        '税务师（CTA）：通过财务与会计、税法一、税法二、涉税服务实务（4科）',
        '初级会计专业技术资格证书',
        '基金从业资格证书',
        'CET-6（英语六级）',
      ] : [
        'CPA: 4 subjects passed (Accounting, Financial Management, Economic Law, Corporate Strategy & Risk Management)',
        'CTA (Tax Advisor): 4 subjects passed (Financial & Accounting, Tax Law I, Tax Law II, Tax Service Practice)',
        'Junior Accounting Qualification Certificate',
        'Fund Practitioner Certificate',
        'CET-6 (College English Test Band 6)',
      ],
      languages: isZh ? ['中文（母语）', 'English（CET-6，专业工作语言）'] : ['Chinese (Native)', 'English (CET-6, professional working proficiency)']
    };

    // 自我评价
    const selfEvaluation = isZh
      ? '具备金融专业背景与CPA证书体系知识，熟练掌握Python数据分析与机器学习技术，能将LLM应用于金融场景。实习经历覆盖资金分析、资产交易、项目管理、行业研究等多个领域，具备快速学习能力和问题解决能力。工作认真负责，注重细节，追求卓越。'
      : "Strong foundation in finance with CPA knowledge, proficient in Python data analytics and machine learning, experienced in applying LLMs to financial scenarios. Internship experiences span fund analysis, asset transactions, project management, and industry research. Fast learner with strong problem-solving skills. Detail-oriented and committed to excellence.";

    // 构建文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // 标题
          new Paragraph({
            text: basic.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: basic.title,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // 联系方式
          new Paragraph({
            text: `${basic.email} | ${basic.phone} | ${basic.github} | ${basic.location}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // 分隔线
          new Paragraph({
            text: '────────────────────────────────────────────────',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // 求职意向
          new Paragraph({
            text: isZh ? '求职意向' : 'Career Objective',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            text: objective,
            spacing: { after: 300 },
          }),

          // 基础信息
          new Paragraph({
            text: isZh ? '基础信息' : 'Basic Information',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({ text: `教育背景：${basic.education}`, spacing: { after: 150 } }),
          new Paragraph({ text: isZh ? '核心优势：CPA专业阶段4科通过+金融专业+Python技术+LLM应用经验，复合背景突出' : 'Core Strengths: CPA 4 subjects passed + Finance expertise + Python programming + LLM application experience', spacing: { after: 150 } }),

          // 实习经历 (STAR)
          new Paragraph({
            text: isZh ? '实习经历' : 'Internship Experience',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          ...starExperiences.map((exp, idx) => [
            new Paragraph({
              text: `${exp.company} | ${exp.title} | ${exp.period}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: idx === 0 ? 0 : 300, after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '情境（S）：' : 'Situation: ', bold: true }),
                new TextRun({ text: exp.star.situation }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '任务（T）：' : 'Task: ', bold: true }),
                new TextRun({ text: exp.star.task }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '行动（A）：' : 'Action: ', bold: true }),
                new TextRun({ text: exp.star.action }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '结果（R）：' : 'Result: ', bold: true }),
                new TextRun({ text: exp.star.result }),
              ],
              spacing: { after: 150 },
            }),
          ]).flat(),

          // 研究经历 (STAR)
          new Paragraph({
            text: isZh ? '研究项目' : 'Research Projects',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          ...starProjects.map((proj, idx) => [
            new Paragraph({
              text: `${proj.project} | ${proj.title}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: idx === 0 ? 0 : 300, after: 150 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '情境（S）：' : 'Situation: ', bold: true }),
                new TextRun({ text: proj.star.situation }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '任务（T）：' : 'Task: ', bold: true }),
                new TextRun({ text: proj.star.task }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '行动（A）：' : 'Action: ', bold: true }),
                new TextRun({ text: proj.star.action }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: isZh ? '结果（R）：' : 'Result: ', bold: true }),
                new TextRun({ text: proj.star.result }),
              ],
              spacing: { after: 150 },
            }),
          ]).flat(),

          // 技能与证书
          new Paragraph({
            text: isZh ? '技能与证书' : 'Skills & Certifications',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: isZh ? '编程语言：' : 'Programming: ', bold: true }),
              new TextRun({ text: skills.programming.join(', ') }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: isZh ? '数据分析工具：' : 'Data Tools: ', bold: true }),
              new TextRun({ text: skills.dataTools.join(', ') }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: isZh ? '金融能力：' : 'Finance: ', bold: true }),
              new TextRun({ text: skills.finance.join(', ') }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: isZh ? '专业认证：' : 'Certifications: ', bold: true }),
              new TextRun({ text: skills.certifications.join('；') }),
            ],
            spacing: { after: 150 },
          }),

          // 自我评价
          new Paragraph({
            text: isZh ? '自我评价' : 'Self-Evaluation',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            text: selfEvaluation,
            spacing: { after: 300 },
          }),
        ],
      }],
    });

    // 生成 Blob
    const buffer = await Packer.toBuffer(doc);
    return new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }
}
