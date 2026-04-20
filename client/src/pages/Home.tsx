/**
 * Design Philosophy: Outdoor Tracking Command Center
 * Colors: Deep Night Black (#0D1117) + GPS Green + Alert Orange + Data Blue
 * Typography: Barlow Condensed (headings) + Inter (body)
 * Layout: Full-width hero + card grid + asymmetric sections
 * Animations: GPS pulse, count-up numbers, scan lines, tracking paths
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MapPin, Shield, Zap, Globe, Star, ChevronRight, TrendingUp,
  Award, Users, Package, Layers, Settings, CheckCircle2,
  BarChart3, Target, Cpu, Eye, ArrowRight, ExternalLink,
  Dog, Beef, Compass, Quote, AlertTriangle, Lightbulb, BookOpen
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";

// ─── Data ───────────────────────────────────────────────────────────────────

const industryData = [
  {
    id: 1, industry: "汽摩配", shop: "RACEORLY (imale)",
    url: "https://imale.en.alibaba.com/",
    positioning: "贸易公司组货库存快速发货，数字化表达实力，全球布局经销商代理商",
    bannerStyle: "黑红工业风", colorScheme: "#CC0000",
    bannerText: "TRUSTED ENGINE PARTS SUPPLIER",
    keyFeatures: ["库存快速发货", "数字化实力展示", "全球经销商网络", "贸易品牌建设"],
    certifications: ["SGS", "CE", "ISO9001"],
    designScore: { banner: 88, product: 85, factory: 82, trust: 90 },
    highlight: "以'帮买家降本增效'为核心文案，直击B端痛点"
  },
  {
    id: 2, industry: "杯具", shop: "Everich",
    url: "https://everich4.en.alibaba.com/",
    positioning: "服务OEM/ODM/OBM买家，聚焦线上L1+轻定制买家群体，一站式解决方案",
    bannerStyle: "深色自然感", colorScheme: "#2E7D32",
    bannerText: "FROM IDEA TO DESIGN TO FINAL PRODUCT",
    keyFeatures: ["OEM/ODM/OBM全链路", "轻定制低门槛", "户外场景化展示", "可持续认证"],
    certifications: ["ISCC", "SEDEX", "BSCI", "SGS"],
    designScore: { banner: 92, product: 90, factory: 85, trust: 88 },
    highlight: "场景化Banner将产品置于真实户外使用环境，大幅提升代入感"
  },
  {
    id: 3, industry: "小家电", shop: "Airdog",
    url: "https://airdog.en.alibaba.com",
    positioning: "独家核心技术实力，透传'贵'的差异化标准，打造全球独家代理模式",
    bannerStyle: "深蓝科技感", colorScheme: "#1565C0",
    bannerText: "AIRDOG'S STRENGTHS AND STANDARDS",
    keyFeatures: ["210项专利", "3大工厂基地", "96国销售覆盖", "独家代理模式"],
    certifications: ["SGS", "ETL", "FCC", "CE", "KC", "ISO9001"],
    designScore: { banner: 95, product: 92, factory: 96, trust: 94 },
    highlight: "用210项专利数字化展示技术壁垒，认证标志月桂叶框架设计极具视觉冲击"
  },
  {
    id: 4, industry: "运动健身", shop: "Deep Fitness",
    url: "https://deepfitness.en.alibaba.com/",
    positioning: "OEM工厂通过服务背书和大牌合作，打造代工品牌",
    bannerStyle: "黑白工业感", colorScheme: "#212121",
    bannerText: "HELP OUR CUSTOMERS OCCUPY A LARGER GLOBAL MARKET",
    keyFeatures: ["大牌OEM背书", "Fortune 500供应商", "工厂实景展示", "全球市场扩张"],
    certifications: ["Intertek", "BSCI", "CE", "ISO9001"],
    designScore: { banner: 89, product: 87, factory: 91, trust: 92 },
    highlight: "以'帮助买家占领更大全球市场'为使命宣言，与买家利益高度绑定"
  },
  {
    id: 5, industry: "车衣原材料", shop: "ISF Film (nkoda)",
    url: "https://nkoda.en.alibaba.com/",
    positioning: "找差异化定位，打造应用车衣行业场景化表达top品牌",
    bannerStyle: "黑色高端感", colorScheme: "#1A1A1A",
    bannerText: "WE LEAD PPF - HIGH-END BRAND VISUAL IDENTITY",
    keyFeatures: ["行业领导者定位", "超跑场景化", "高端品牌形象", "垂直细分赛道"],
    certifications: ["PRO认证", "SGS", "ISO"],
    designScore: { banner: 96, product: 88, factory: 80, trust: 85 },
    highlight: "'WE LEAD PPF'直接宣示行业领导地位，超跑+产品组合视觉极具震撼"
  },
  {
    id: 6, industry: "3C数码", shop: "ATB Design (atouchbo)",
    url: "https://atouchbo.en.alibaba.com/",
    positioning: "专注手机配件，多语言全球布局，VR展厅创新展示",
    bannerStyle: "黑底黄字科技感", colorScheme: "#FF8F00",
    bannerText: "ATB SCREEN PROTECTOR - OEM AND ODM CUSTOMIZATION",
    keyFeatures: ["VR虚拟展厅", "12个产品系列", "多语言站点", "TüVRheinland认证"],
    certifications: ["TüVRheinland", "CE", "FCC", "RoHS"],
    designScore: { banner: 87, product: 93, factory: 82, trust: 89 },
    highlight: "VR展厅是行业创新亮点，12个产品系列图标导航清晰直观"
  },
  {
    id: 7, industry: "宠物", shop: "Haisenpet",
    url: "https://hshcjck.en.alibaba.com/",
    positioning: "突出供应链服务优势，满足B端买家热销款选品&轻定制需求",
    bannerStyle: "橙色活泼风", colorScheme: "#FF6D00",
    bannerText: "HAISENPET GLOBAL EXHIBITION 2026",
    keyFeatures: ["全球展会计划", "热销款选品", "轻定制服务", "#1行业排名"],
    certifications: ["TüVRheinland", "BSCI", "ISO9001"],
    designScore: { banner: 85, product: 88, factory: 80, trust: 91 },
    highlight: "全球展会计划表格Banner独特，直接展示国际化布局实力"
  },
  {
    id: 8, industry: "线缆数码", shop: "UNIEAN (ulinkcable)",
    url: "https://ulinkcable.en.alibaba.com/",
    positioning: "专注线缆和连接配件的垂直领域，具备研发设计能力的中高端数码配件供应商",
    bannerStyle: "橙黑工业风", colorScheme: "#E65100",
    bannerText: "OWN YOUR OWN CABLE FACTORY",
    keyFeatures: ["Fortune 500供应商", "设计定制能力", "垂直领域深耕", "工厂实景展示"],
    certifications: ["TüVRheinland", "CE", "FCC", "RoHS", "MFi"],
    designScore: { banner: 91, product: 89, factory: 88, trust: 93 },
    highlight: "'OWN YOUR OWN CABLE FACTORY'文案极具煽动性，激发买家自建品牌欲望"
  },
  {
    id: 9, industry: "袜类", shop: "ZONGKY (zjuron)",
    url: "https://zjuron.en.alibaba.com/",
    positioning: "专业袜类产品供应商，助力买家打造自有品牌，小单快反，柔性供应链",
    bannerStyle: "黑白时尚风", colorScheme: "#424242",
    bannerText: "SOCKS CUSTOMIZATION - YOUR BUSINESS PARTNER",
    keyFeatures: ["小单快反", "柔性供应链", "自有品牌助力", "多市场旗帜展示"],
    certifications: ["SGS", "OEKO-TEX", "BSCI"],
    designScore: { banner: 84, product: 86, factory: 82, trust: 87 },
    highlight: "多国旗帜展示全球市场覆盖，'YOUR BUSINESS PARTNER'定位精准"
  },
  {
    id: 10, industry: "运动场地", shop: "Fortune Group (fxflooring)",
    url: "https://fxflooring.en.alibaba.com/",
    positioning: "运动场地材料与设备供应商，多样化产品线，满足场馆个性化定制需求",
    bannerStyle: "绿色专业运动风", colorScheme: "#1B5E20",
    bannerText: "PREMIUM SPORTS COURT SOLUTION",
    keyFeatures: ["多品牌矩阵", "场地航拍展示", "工程级解决方案", "全球标准认证"],
    certifications: ["FIFA", "ITF", "ISO", "CE"],
    designScore: { banner: 90, product: 87, factory: 85, trust: 88 },
    highlight: "多品牌矩阵（Fortune Grass/FX-Flooring/Fortune Padel）展示集团实力"
  },
  {
    id: 11, industry: "门窗", shop: "DJMI (dajimen)",
    url: "https://dajimen.en.alibaba.com/",
    positioning: "高端门窗定制制造商，全品类门窗解决方案，覆盖民用、商用、工程类",
    bannerStyle: "红蓝商务风", colorScheme: "#B71C1C",
    bannerText: "28+ YEARS HIGH-END PRODUCTION EXPERIENCE",
    keyFeatures: ["28年行业经验", "全品类覆盖", "工程级资质", "认证墙展示"],
    certifications: ["TüVRheinland", "UL", "CE", "ISO", "ANAB"],
    designScore: { banner: 86, product: 84, factory: 89, trust: 92 },
    highlight: "'28+ YEARS'时间沉淀是最强信任背书，认证墙密集展示专业度"
  },
  {
    id: 12, industry: "灌装机械", shop: "Mingstar (bottlefilling)",
    url: "https://bottlefilling.en.alibaba.com/",
    positioning: "强化定制化服务能力，明确整线案例和优势，做全球项目和解决方案",
    bannerStyle: "蓝色工业风", colorScheme: "#0D47A1",
    bannerText: "COMPLETE FILLING LINE SOLUTIONS",
    keyFeatures: ["整线解决方案", "全球项目案例", "定制化服务", "工厂航拍展示"],
    certifications: ["SGS", "CE", "ISO9001"],
    designScore: { banner: 83, product: 85, factory: 87, trust: 86 },
    highlight: "整线案例展示是差异化优势，从单机到整厂的完整解决方案"
  },
  {
    id: 13, industry: "男装", shop: "Pujiang Shengwending",
    url: "https://pjswd.en.alibaba.com/",
    positioning: "设计创新能力强，建立'时尚'、'前沿'的渠道形象",
    bannerStyle: "黑色街头风", colorScheme: "#0A0A0A",
    bannerText: "STREETWEAR DREAM FACTORY",
    keyFeatures: ["街头文化定位", "SGS认证", "#1行业排名", "全品类服装"],
    certifications: ["SGS", "BSCI", "ISO9001"],
    designScore: { banner: 94, product: 88, factory: 82, trust: 87 },
    highlight: "'STREETWEAR DREAM FACTORY'文案极具品牌感，黑色街头风格独树一帜"
  },
  {
    id: 14, industry: "商用设备", shop: "Highbright",
    url: "https://highbrightcn.en.alibaba.com/",
    positioning: "贸易公司，打造服务和供应链优势，从货架到整合超市组货整体解决方案",
    bannerStyle: "橙色商业风", colorScheme: "#E65100",
    bannerText: "WELCOME TO HIGHBRIGHT - FITTING & STORE FIXTURES",
    keyFeatures: ["14年金品诚企", "整体解决方案", "超市场景俯视图", "一站式供应链"],
    certifications: ["TüVRheinland", "CE", "ETL", "ISO"],
    designScore: { banner: 87, product: 86, factory: 83, trust: 90 },
    highlight: "超市场景俯视图Banner独特，直观展示整体解决方案能力"
  }
];

const moduleRules = [
  {
    module: "店招（Shop Header）",
    icon: <Award size={24} />,
    color: "#00C853",
    rules: [
      { rule: "行业排名背书", desc: "展示'#X leading factory/best seller'排名，快速建立权威感", importance: 95 },
      { rule: "第三方权威认证", desc: "SGS/TüVRheinland/Intertek等认证标志置于最显眼位置", importance: 92 },
      { rule: "核心数字化指标", desc: "专利数量/工厂面积/员工规模等量化实力数据", importance: 88 },
      { rule: "独立品牌LOGO", desc: "非公司名，打造独立品牌认知，提升溢价空间", importance: 85 }
    ]
  },
  {
    module: "Banner区域",
    icon: <Eye size={24} />,
    color: "#FF6D00",
    rules: [
      { rule: "场景化产品展示", desc: "产品在真实使用场景中呈现，而非白底图，大幅提升代入感", importance: 96 },
      { rule: "价值主张文案", desc: "大字体展示核心价值，直击买家痛点（降本/增效/占领市场）", importance: 94 },
      { rule: "数字化实力背书", desc: "年限/面积/产能等具体数字，将抽象实力转化为具象数据", importance: 90 },
      { rule: "明确行动号召CTA", desc: "Get Pricing/Send Inquiry等按钮，引导买家进行下一步转化", importance: 87 }
    ]
  },
  {
    module: "核心产品线",
    icon: <Package size={24} />,
    color: "#1565C0",
    rules: [
      { rule: "解决方案式分类", desc: "按应用场景分类而非外观，便于买家快速定位需求", importance: 91 },
      { rule: "认证标签突出", desc: "certified标签在产品卡片中显眼展示，提升信任度", importance: 89 },
      { rule: "历史销量背书", desc: "sold数量展示（如162,476 sold），用销量证明产品受欢迎程度", importance: 86 },
      { rule: "价格区间+MOQ", desc: "FOB价格+最小起订量，帮助买家快速判断合作可行性", importance: 83 }
    ]
  },
  {
    module: "工厂实力展示",
    icon: <Cpu size={24} />,
    color: "#7B1FA2",
    rules: [
      { rule: "工厂航拍/外观", desc: "展示规模感，让买家直观感受工厂体量", importance: 93 },
      { rule: "生产线实景", desc: "设备先进性展示，证明制造能力", importance: 90 },
      { rule: "检测实验室", desc: "品质管控能力展示，降低买家对质量的顾虑", importance: 88 },
      { rule: "数字化指标", desc: "面积/产能/员工数量等硬核数据，建立制造壁垒印象", importance: 85 }
    ]
  },
  {
    module: "定制服务流程",
    icon: <Settings size={24} />,
    color: "#00838F",
    rules: [
      { rule: "流程可视化", desc: "将复杂定制过程简化为3-6步可视化流程图", importance: 88 },
      { rule: "轻定制低门槛", desc: "明确区分轻定制（Logo丝印）与深定制（开模），降低合作门槛", importance: 85 },
      { rule: "交付周期承诺", desc: "明确从样品到批量的时间节点，降低买家不确定性", importance: 83 },
      { rule: "沟通渠道多元化", desc: "WhatsApp/WeChat/Email等多渠道联系方式", importance: 80 }
    ]
  },
  {
    module: "客户案例与认证",
    icon: <Shield size={24} />,
    color: "#C62828",
    rules: [
      { rule: "知名品牌背书", desc: "Fortune 500/大牌OEM合作案例，完成最终信任闭环", importance: 94 },
      { rule: "认证标志墙", desc: "多项认证密集展示，用权威机构背书产品合规性", importance: 91 },
      { rule: "全球客户地图", desc: "点亮主要市场的世界地图，直观展示国际化程度", importance: 87 },
      { rule: "买家真实评价", desc: "精选真实好评截图，增强说服力", importance: 84 }
    ]
  }
];

const trackerDesignPlan = {
  shopHeader: {
    brandName: "TrackPro / HerdGuard",
    tagline: "#1 GPS Tracker for Hunting Dogs & Livestock",
    certifications: ["CE", "FCC", "RoHS", "IP68"],
    metrics: ["10+ Years R&D", "100+ Countries", "IP68 Standard", "30-Day Battery"],
    colorScheme: "深夜黑 + 追踪绿 + 警示橙"
  },
  banners: [
    {
      target: "猎人/猎狗买家",
      headline: "NEVER LOSE YOUR HUNTING DOG AGAIN",
      subline: "Real-Time GPS Tracking with 1-Meter Accuracy",
      visual: "茂密森林 + 猎狗奔跑 + 手机APP实时追踪界面",
      tags: ["IP68 Waterproof", "30-Day Battery Life", "4G/LTE Coverage"],
      cta: "Get Wholesale Catalog",
      color: "#2E7D32"
    },
    {
      target: "牧场主/农场主买家",
      headline: "SMART LIVESTOCK MANAGEMENT",
      subline: "Monitor Your Herd Anytime, Anywhere",
      visual: "广阔牧场俯视图 + 牛羊群高亮标记 + 管理后台数据看板",
      tags: ["Solar Powered Option", "Geo-Fence Alerts", "Herd Health Monitoring"],
      cta: "Explore Farm Solutions",
      color: "#1B5E20"
    },
    {
      target: "OEM/ODM分销商买家",
      headline: "YOUR RELIABLE OEM/ODM PARTNER",
      subline: "From Concept to Final Product in 30 Days",
      visual: "现代化无尘装配车间 + 工程师防水测试场景",
      tags: ["Custom Logo & Packaging", "MOQ 100pcs", "30-Day Delivery"],
      cta: "Start Customization",
      color: "#0D47A1"
    }
  ],
  productLines: [
    { name: "Hunting Dog Trackers", icon: "🐕", desc: "高频更新，恶劣环境适用", moq: "50pcs", price: "$25-45" },
    { name: "Livestock GPS Collars", icon: "🐄", desc: "超长续航，太阳能充电选项", moq: "100pcs", price: "$18-35" },
    { name: "Solar-Powered Trackers", icon: "☀️", desc: "无电源环境长期监控", moq: "50pcs", price: "$30-55" },
    { name: "Accessories & Parts", icon: "🔧", desc: "充电底座、替换项圈带", moq: "200pcs", price: "$3-15" }
  ],
  factoryStrengths: [
    { item: "射频（RF）实验室", desc: "信号接收稳定性测试" },
    { item: "IP68防水测试", desc: "水下浸泡测试视频展示" },
    { item: "极端温度测试", desc: "-40°C至+85°C环境测试" },
    { item: "跌落测试", desc: "2米高度跌落测试认证" },
    { item: "SMT贴片生产线", desc: "5条全自动生产线" },
    { item: "月产能100,000台", desc: "不良率<0.1%" }
  ]
};

const designScoreData = industryData.map(d => ({
  name: d.shop.split(" ")[0],
  banner: d.designScore.banner,
  product: d.designScore.product,
  factory: d.designScore.factory,
  trust: d.designScore.trust,
  avg: Math.round((d.designScore.banner + d.designScore.product + d.designScore.factory + d.designScore.trust) / 4)
}));

const colorTrendData = [
  { name: "黑色高端系", count: 4, desc: "高端品牌/时尚品类", color: "#424242" },
  { name: "橙色活力系", count: 3, desc: "贸易/供应链/快消品", color: "#FF6D00" },
  { name: "蓝色专业系", count: 3, desc: "科技/工业/制造业", color: "#1565C0" },
  { name: "绿色自然系", count: 2, desc: "运动/环保/健康品类", color: "#2E7D32" },
  { name: "红色权威系", count: 2, desc: "传统制造/老牌企业", color: "#C62828" }
];

// ─── Components ─────────────────────────────────────────────────────────────

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function GlowDot({ color = "#00C853" }: { color?: string }) {
  return (
    <span className="relative inline-flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: color }} />
    </span>
  );
}

function SectionTitle({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <GlowDot />
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "#00C853" }}>{tag}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base" style={{ color: "#9E9E9E" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [globalTab, setGlobalTab] = useState(0);
  const [activeModule, setActiveModule] = useState(0);
  const [activeBanner, setActiveBanner] = useState(0);

  const bgColor = "#0D1117";
  const cardBg = "#161B22";
  const borderColor = "rgba(255,255,255,0.08)";
  const green = "#00C853";
  const orange = "#FF6D00";
  const blue = "#1565C0";

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", color: "#F5F5F5" }}>

      {/* ── NAV ── */}
      <nav style={{ backgroundColor: "rgba(13,17,23,0.95)", borderBottom: `1px solid ${borderColor}`, backdropFilter: "blur(12px)" }}
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: green }}>
            <MapPin size={16} color="#0D1117" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
              TrackPro Research
            </div>
            <div className="text-xs" style={{ color: "#9E9E9E" }}>行业头部设计研究报告</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wider uppercase" style={{ color: "#9E9E9E" }}>
          <a href="#overview" className="hover:text-white transition-colors">概览</a>
          <a href="#industry" className="hover:text-white transition-colors">行业案例</a>
          <a href="#modules" className="hover:text-white transition-colors">模块规律</a>
          <a href="#design" className="hover:text-white transition-colors">设计方案</a>
          <a href="#competitor" className="hover:text-white transition-colors">竞品分析</a>
          <a href="#global" className="hover:text-white transition-colors">全球独立站</a>
          <a href="#oursite" className="hover:text-white transition-colors" style={{ color: orange }}>我们的站</a>
          <a href="#blueprint" className="hover:text-white transition-colors" style={{ color: "#FFD700", fontWeight: 700 }}>🎯 基调定义</a>
          <a href="#guide" className="hover:text-white transition-colors" style={{ color: "#FFD700", fontWeight: 700 }}>🏗 施工指南</a>
          <a href="#mockup" className="hover:text-white transition-colors" style={{ color: "#FF6B35", fontWeight: 700 }}>🖼 可视化蓝图</a>
          <a href="#conclusion" className="hover:text-white transition-colors">结论</a>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded" style={{ backgroundColor: green + "20", color: green, border: `1px solid ${green}40` }}>
          <GlowDot color={green} />
          <span>29 店铺已分析 · 13模块可视化蓝图</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663564882217/2UvQCbDLiuHNdnkW8pvZmy/hero_bg-JJ9GvUopV8bMuNJWogUZYj.webp"
            alt="GPS Tracking Command Center"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}80 50%, transparent 100%)` }} />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>

        <div className="relative container mx-auto px-6 pt-24 pb-16 flex flex-col justify-center" style={{ minHeight: "90vh" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-6">
              <GlowDot color={green} />
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: green }}>
                ALIBABA INTERNATIONAL STATION · INDUSTRY RESEARCH
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFFFFF" }}>
              行业头部店铺<br />
              <span style={{ color: green }}>视觉设计</span>研究报告
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl" style={{ color: "#B0BEC5" }}>
              深度分析15个阿里巴巴国际站行业头部店铺，提炼顶级视觉设计规律，
              为<strong style={{ color: orange }}>猎狗定位器 & 牛羊马定位器</strong>产品制定专业设计方案
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl">
              {[
                { label: "分析店铺", value: 15, suffix: "个" },
                { label: "覆盖行业", value: 14, suffix: "个" },
                { label: "设计模块", value: 6, suffix: "个" },
                { label: "设计规律", value: 24, suffix: "条" }
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-lg p-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="text-3xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: green }}>
                    <CountUp end={stat.value} />{stat.suffix}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#9E9E9E" }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#industry" className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: green, color: "#0D1117" }}>
                查看行业案例 <ArrowRight size={16} />
              </a>
              <a href="#design" className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: "transparent", color: orange, border: `1px solid ${orange}` }}>
                查看定位器设计方案 <ChevronRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OVERVIEW STATS ── */}
      <section id="overview" className="py-16" style={{ backgroundColor: cardBg }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Research Overview" title="研究概览" subtitle="从15个行业头部店铺中提炼的核心设计趋势与规律" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Color Trend Chart */}
            <div className="rounded-xl p-6" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                行业头部色彩趋势分布
              </h3>
              <div className="space-y-3">
                {colorTrendData.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: "#F5F5F5" }}>{item.name}</span>
                        <span className="text-xs" style={{ color: "#9E9E9E" }}>{item.count} 家</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: borderColor }}>
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }} whileInView={{ width: `${(item.count / 14) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }} />
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#616161" }}>{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Design Score Radar */}
            <div className="rounded-xl p-6" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                Top 5 店铺综合设计评分
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={[
                  { module: "Banner", airdog: 95, everich: 92, isf: 96, pjswd: 94, uniean: 91 },
                  { module: "产品线", airdog: 92, everich: 90, isf: 88, pjswd: 88, uniean: 89 },
                  { module: "工厂实力", airdog: 96, everich: 85, isf: 80, pjswd: 82, uniean: 88 },
                  { module: "信任背书", airdog: 94, everich: 88, isf: 85, pjswd: 87, uniean: 93 },
                ]}>
                  <PolarGrid stroke={borderColor} />
                  <PolarAngleAxis dataKey="module" tick={{ fill: "#9E9E9E", fontSize: 12 }} />
                  <Radar name="Airdog" dataKey="airdog" stroke={green} fill={green} fillOpacity={0.15} />
                  <Radar name="ISF Film" dataKey="isf" stroke={orange} fill={orange} fillOpacity={0.1} />
                  <Radar name="Pujiang" dataKey="pjswd" stroke="#7B1FA2" fill="#7B1FA2" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ color: "#9E9E9E", fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: <TrendingUp size={20} />, color: green, title: "场景化Banner是最大差异点", desc: "头部店铺100%使用场景化Banner，产品置于真实使用环境，而非白底图" },
              { icon: <Star size={20} />, color: orange, title: "行业排名背书是标配", desc: "93%的头部店铺在店招区域展示行业排名，快速建立买家信任" },
              { icon: <Globe size={20} />, color: blue, title: "认证标志密集展示", desc: "平均每家店铺展示3-6个第三方认证，认证墙设计成为行业标准" }
            ].map((insight, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: insight.color + "20", color: insight.color }}>
                    {insight.icon}
                  </div>
                  <h4 className="font-bold text-sm" style={{ color: "#F5F5F5" }}>{insight.title}</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#9E9E9E" }}>{insight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY CASES ── */}
      <section id="industry" className="py-16" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Industry Cases" title="15个行业头部店铺案例分析"
            subtitle="点击各店铺卡片查看详细设计分析，了解各行业顶级视觉表达策略" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {industryData.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setActiveIndustry(i)}
                className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: activeIndustry === i ? item.colorScheme + "20" : cardBg,
                  border: `1px solid ${activeIndustry === i ? item.colorScheme : borderColor}`,
                  boxShadow: activeIndustry === i ? `0 0 20px ${item.colorScheme}30` : "none"
                }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: item.colorScheme + "30", color: item.colorScheme }}>
                    {item.industry}
                  </span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1 rounded hover:opacity-70 transition-opacity" style={{ color: "#616161" }}>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {item.shop.split(" ")[0]}
                </h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#9E9E9E" }}>
                  {item.positioning.slice(0, 40)}...
                </p>
                <div className="flex items-center gap-1">
                  {item.certifications.slice(0, 3).map((cert, ci) => (
                    <span key={ci} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: borderColor, color: "#9E9E9E" }}>
                      {cert}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          <AnimatePresence mode="wait">
            <motion.div key={activeIndustry}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono px-3 py-1 rounded-full"
                      style={{ backgroundColor: industryData[activeIndustry].colorScheme + "30", color: industryData[activeIndustry].colorScheme }}>
                      {industryData[activeIndustry].industry}行业
                    </span>
                    <a href={industryData[activeIndustry].url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity" style={{ color: "#9E9E9E" }}>
                      访问店铺 <ExternalLink size={10} />
                    </a>
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                    {industryData[activeIndustry].shop}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#B0BEC5" }}>
                    {industryData[activeIndustry].positioning}
                  </p>

                  <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: bgColor, border: `1px solid ${industryData[activeIndustry].colorScheme}40` }}>
                    <div className="text-xs font-mono mb-2" style={{ color: industryData[activeIndustry].colorScheme }}>BANNER 核心文案</div>
                    <div className="text-xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                      "{industryData[activeIndustry].bannerText}"
                    </div>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: green + "10", border: `1px solid ${green}30` }}>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} style={{ color: green, marginTop: 2 }} />
                      <div>
                        <div className="text-xs font-mono mb-1" style={{ color: green }}>设计亮点分析</div>
                        <p className="text-sm" style={{ color: "#B0BEC5" }}>{industryData[activeIndustry].highlight}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#9E9E9E" }}>核心特征</h4>
                  <div className="space-y-2 mb-6">
                    {industryData[activeIndustry].keyFeatures.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-sm" style={{ color: "#F5F5F5" }}>
                        <ChevronRight size={14} style={{ color: industryData[activeIndustry].colorScheme }} />
                        {feat}
                      </div>
                    ))}
                  </div>

                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#9E9E9E" }}>认证体系</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {industryData[activeIndustry].certifications.map((cert, ci) => (
                      <span key={ci} className="text-xs px-2 py-1 rounded font-mono"
                        style={{ backgroundColor: industryData[activeIndustry].colorScheme + "20", color: industryData[activeIndustry].colorScheme, border: `1px solid ${industryData[activeIndustry].colorScheme}40` }}>
                        {cert}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#9E9E9E" }}>设计评分</h4>
                  {Object.entries(industryData[activeIndustry].designScore).map(([key, val]) => (
                    <div key={key} className="mb-2">
                      <div className="flex justify-between text-xs mb-1" style={{ color: "#9E9E9E" }}>
                        <span>{{ banner: "Banner", product: "产品线", factory: "工厂实力", trust: "信任背书" }[key]}</span>
                        <span style={{ color: "#F5F5F5" }}>{val}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: borderColor }}>
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: industryData[activeIndustry].colorScheme }}
                          initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── MODULE RULES ── */}
      <section id="modules" className="py-16" style={{ backgroundColor: cardBg }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Design Rules" title="6大模块设计规律"
            subtitle="从行业头部店铺中提炼的核心设计法则，每条规律均有数据支撑" />

          <div className="flex flex-wrap gap-2 mb-8">
            {moduleRules.map((m, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeModule === i ? m.color + "20" : "transparent",
                  color: activeModule === i ? m.color : "#9E9E9E",
                  border: `1px solid ${activeModule === i ? m.color : borderColor}`
                }}>
                <span style={{ color: activeModule === i ? m.color : "#9E9E9E" }}>{m.icon}</span>
                {m.module}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeModule}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleRules[activeModule].rules.map((rule, ri) => (
                <motion.div key={ri} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ri * 0.1 }}
                  className="rounded-xl p-6" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-base" style={{ color: "#F5F5F5" }}>{rule.rule}</h4>
                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                      style={{ backgroundColor: moduleRules[activeModule].color + "20", color: moduleRules[activeModule].color }}>
                      <Target size={10} />
                      {rule.importance}分
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#9E9E9E" }}>{rule.desc}</p>
                  <div className="mt-3 h-1 rounded-full" style={{ backgroundColor: borderColor }}>
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: moduleRules[activeModule].color }}
                      initial={{ width: 0 }} animate={{ width: `${rule.importance}%` }} transition={{ duration: 1, delay: ri * 0.1 }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── DESIGN PLAN ── */}
      <section id="design" className="py-16" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Design Proposal" title="猎狗/牛羊马定位器设计方案"
            subtitle="基于行业头部规律，结合产品特性，制定的系统性店铺视觉设计方案" />

          {/* Product Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663564882217/2UvQCbDLiuHNdnkW8pvZmy/tracker_product-iZWHEKqXsfA6xDvq57BxTC.webp"
                alt="GPS Tracker Product"
                className="w-full h-64 object-cover"
              />
              <div className="p-6" style={{ backgroundColor: cardBg }}>
                <div className="text-xs font-mono mb-2" style={{ color: green }}>PRODUCT VISUAL CONCEPT</div>
                <h3 className="text-2xl font-black uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  TrackPro GPS Tracker
                </h3>
                <p className="text-sm" style={{ color: "#9E9E9E" }}>
                  IP68防水 · 30天超长续航 · 全球4G/LTE覆盖 · 1米精准定位
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663564882217/2UvQCbDLiuHNdnkW8pvZmy/shop_banner_concept-N382ZoAcVjKvbWSmVK2JTu.webp"
                alt="Shop Banner Concept"
                className="w-full h-64 object-cover"
              />
              <div className="p-6" style={{ backgroundColor: cardBg }}>
                <div className="text-xs font-mono mb-2" style={{ color: orange }}>BANNER VISUAL CONCEPT</div>
                <h3 className="text-2xl font-black uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  猎狗追踪器 Banner 方案
                </h3>
                <p className="text-sm" style={{ color: "#9E9E9E" }}>
                  森林场景 + 猎狗奔跑 + 手机APP实时追踪界面，场景化表达产品价值
                </p>
              </div>
            </div>
          </div>

          {/* Shop Header Plan */}
          <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: green + "20", color: green }}><Award size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                第一部分：店招设计方案
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-2" style={{ color: green }}>品牌名称</div>
                <div className="text-lg font-black" style={{ color: "#F5F5F5" }}>TrackPro / HerdGuard</div>
                <div className="text-xs mt-1" style={{ color: "#9E9E9E" }}>独立英文品牌，建立国际认知</div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-2" style={{ color: orange }}>行业排名标签</div>
                <div className="text-sm font-bold" style={{ color: "#F5F5F5" }}>#1 GPS Tracker for Hunting Dogs & Livestock</div>
                <div className="text-xs mt-1" style={{ color: "#9E9E9E" }}>参考：Airdog #1行业排名策略</div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-2" style={{ color: blue }}>认证体系</div>
                <div className="flex flex-wrap gap-1">
                  {trackerDesignPlan.shopHeader.certifications.map((cert, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: blue + "20", color: blue }}>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-2" style={{ color: "#7B1FA2" }}>实力数据矩阵</div>
                <div className="space-y-1">
                  {trackerDesignPlan.shopHeader.metrics.map((m, i) => (
                    <div key={i} className="text-xs flex items-center gap-1" style={{ color: "#F5F5F5" }}>
                      <CheckCircle2 size={10} style={{ color: "#7B1FA2" }} /> {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Plans */}
          <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: orange + "20", color: orange }}><Eye size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                第二部分：Banner矩阵设计方案
              </h3>
            </div>

            <div className="flex gap-2 mb-6">
              {trackerDesignPlan.banners.map((b, i) => (
                <button key={i} onClick={() => setActiveBanner(i)}
                  className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: activeBanner === i ? b.color + "30" : "transparent",
                    color: activeBanner === i ? "#F5F5F5" : "#9E9E9E",
                    border: `1px solid ${activeBanner === i ? b.color : borderColor}`
                  }}>
                  {b.target}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeBanner}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-xl p-6" style={{ backgroundColor: bgColor, border: `1px solid ${trackerDesignPlan.banners[activeBanner].color}40` }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-mono mb-3" style={{ color: trackerDesignPlan.banners[activeBanner].color }}>
                      TARGET: {trackerDesignPlan.banners[activeBanner].target}
                    </div>
                    <div className="text-3xl font-black uppercase leading-tight mb-2"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFFFFF" }}>
                      {trackerDesignPlan.banners[activeBanner].headline}
                    </div>
                    <div className="text-base mb-4" style={{ color: "#B0BEC5" }}>
                      {trackerDesignPlan.banners[activeBanner].subline}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trackerDesignPlan.banners[activeBanner].tags.map((tag, ti) => (
                        <span key={ti} className="text-xs px-3 py-1 rounded-full"
                          style={{ backgroundColor: trackerDesignPlan.banners[activeBanner].color + "20", color: trackerDesignPlan.banners[activeBanner].color }}>
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded font-bold text-sm"
                      style={{ backgroundColor: trackerDesignPlan.banners[activeBanner].color, color: "#FFFFFF" }}>
                      {trackerDesignPlan.banners[activeBanner].cta} <ArrowRight size={14} />
                    </div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="text-xs font-mono mb-3" style={{ color: "#9E9E9E" }}>视觉画面方案</div>
                    <p className="text-sm leading-relaxed" style={{ color: "#B0BEC5" }}>
                      {trackerDesignPlan.banners[activeBanner].visual}
                    </p>
                    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                      <div className="text-xs font-mono mb-2" style={{ color: "#9E9E9E" }}>设计来源参考</div>
                      <div className="text-xs" style={{ color: "#616161" }}>
                        参考：{activeBanner === 0 ? "ISF Film超跑场景化 + Everich户外场景化" :
                          activeBanner === 1 ? "Highbright超市俯视图 + Deep Fitness工厂使命宣言" :
                            "Airdog工厂实景 + UNIEAN工厂定制化"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product Lines & Factory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg" style={{ backgroundColor: blue + "20", color: blue }}><Package size={20} /></div>
                <h3 className="text-xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  第三部分：产品线展示方案
                </h3>
              </div>
              <div className="space-y-3">
                {trackerDesignPlan.productLines.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm" style={{ color: "#F5F5F5" }}>{p.name}</div>
                      <div className="text-xs" style={{ color: "#9E9E9E" }}>{p.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono" style={{ color: green }}>{p.price}</div>
                      <div className="text-xs" style={{ color: "#616161" }}>MOQ: {p.moq}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#7B1FA2" + "20", color: "#7B1FA2" }}><Cpu size={20} /></div>
                <h3 className="text-xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  第四部分：工厂实力展示方案
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {trackerDesignPlan.factoryStrengths.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                    className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="text-xs font-bold mb-1" style={{ color: "#F5F5F5" }}>{f.item}</div>
                    <div className="text-xs" style={{ color: "#9E9E9E" }}>{f.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Customization Flow */}
          <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: "#00838F" + "20", color: "#00838F" }}><Settings size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                第五部分：定制服务流程
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { step: "01", label: "需求咨询", desc: "了解应用场景与功能需求" },
                { step: "02", label: "方案设计", desc: "硬件选型 + 外观设计" },
                { step: "03", label: "3D打样", desc: "快速打印样品确认" },
                { step: "04", label: "软件联调", desc: "APP + 平台功能测试" },
                { step: "05", label: "批量生产", desc: "5条SMT线全速生产" },
                { step: "06", label: "品质检测", desc: "IP68 + 跌落 + 温度测试" }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="rounded-xl p-4 text-center min-w-[100px]" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                    <div className="text-xs font-mono mb-1" style={{ color: "#00838F" }}>STEP {s.step}</div>
                    <div className="font-bold text-sm" style={{ color: "#F5F5F5" }}>{s.label}</div>
                    <div className="text-xs mt-1" style={{ color: "#9E9E9E" }}>{s.desc}</div>
                  </div>
                  {i < 5 && <ArrowRight size={16} style={{ color: "#616161" }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Trust & Certifications */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: "#C62828" + "20", color: "#C62828" }}><Shield size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                第六部分：客户案例与认证区
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-3" style={{ color: "#C62828" }}>认证标志墙</div>
                <div className="flex flex-wrap gap-2">
                  {["CE", "FCC", "RoHS", "IP68", "IP67", "ISO9001", "REACH", "UN38.3"].map((cert, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded font-mono"
                      style={{ backgroundColor: "#C62828" + "20", color: "#C62828", border: `1px solid #C6282840` }}>
                      {cert}
                    </span>
                  ))}
                </div>
                <div className="text-xs mt-3" style={{ color: "#9E9E9E" }}>参考：Airdog认证月桂叶框架设计</div>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-3" style={{ color: green }}>全球客户地图</div>
                <div className="text-2xl font-black mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: green }}>
                  <CountUp end={100} />+ Countries
                </div>
                <div className="text-sm mb-3" style={{ color: "#9E9E9E" }}>Trusted by 500+ Distributors Worldwide</div>
                <div className="text-xs" style={{ color: "#616161" }}>参考：Airdog 96国销售覆盖地图可视化</div>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                <div className="text-xs font-mono mb-3" style={{ color: orange }}>买家背书策略</div>
                <div className="space-y-2">
                  {[
                    "美国猎人协会成员真实评价",
                    "澳洲大型牧场主合作案例",
                    "欧洲宠物经销商品牌案例",
                    "Fortune 500供应链合作背书"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "#B0BEC5" }}>
                      <Star size={10} style={{ color: orange }} /> {item}
                    </div>
                  ))}
                </div>
                <div className="text-xs mt-3" style={{ color: "#616161" }}>参考：UNIEAN Fortune 500背书策略</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPETITOR ANALYSIS ── */}
      <section id="competitor" className="py-16" style={{ backgroundColor: cardBg }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Competitor Analysis" title="5大同行竞品深度对比"
            subtitle="深度分析定位器行业直接竞品店铺，提炼差异化突破机会" />

          {/* Competitor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                rank: "#1", name: "WanWayTech", company: "上海万维数字科技",
                url: "https://wanwaytech.en.alibaba.com/",
                years: "7年", staff: "未公开",
                positioning: "车辆GPS追踪器为主，覆盖宠物/车队/工程机械",
                rankTag: "#1 Navigation & GPS行业排名",
                bannerText: "PREVENT THEFT · HIGH-PRECISION POSITIONING",
                bannerScene: "深蓝渐变 + 产品矩阵排列（2G/4G/Wireless/OBD）",
                strengths: ["行业排名#1权威背书", "TüVRheinland现场认证", "多语言站点（16国语言）", "GPS Business Starter专属频道"],
                weaknesses: ["宠物/猎犬定位器不是主打", "Banner以产品图为主，场景化不足", "工厂实力展示较弱"],
                color: "#1565C0",
                opportunity: "其车辆GPS强势，猎犬/牲畜GPS是其弱项，可针对性突破"
              },
              {
                rank: "#2", name: "PATPET", company: "深圳帕特宠物科技",
                url: "https://patpet.en.alibaba.com/",
                years: "12年", staff: "138人",
                positioning: "智能宠物产品研发制造，训练项圈/自动喟食器/饮水机",
                rankTag: "SGS认证供应商",
                bannerText: "SMALL DOGS ELECTRONIC BARK COLLAR",
                bannerScene: "蓝色背景 + 真实大型犬 + 产品特写 + 参数对比",
                strengths: ["SGS现场认证背书", "12年行业经验", "产品线极宽（训练/喟食/饮水）", "CE/BSCI/ISO/FCC多认证"],
                weaknesses: ["主打训练项圈，GPS定位不是核心", "Banner文案聚焦单品，整体定位模糊", "OEM能力展示不突出"],
                color: "#2E7D32",
                opportunity: "其宠物品类广但GPS定位专业度不足，可以GPS专业度建立壁垒"
              },
              {
                rank: "#3", name: "Wellturn", company: "深圳威尔腾科技",
                url: "https://cnwellturn.en.alibaba.com/",
                years: "12年", staff: "未公开",
                positioning: "宠物训练项圈/电子围栏/猫砂盆，多品类宠物电子产品",
                rankTag: "#1 Cat Litter Box行业排名",
                bannerText: "CONNECT AND SHARE INTELLIGENCE WITH YOUR DOG",
                bannerScene: "户外草坪场景 + 女主人与金毛 + 产品功能列表",
                strengths: ["SGS认证", "12年制造经验", "户外真实场景 Banner", "产品功能可视化清单"],
                weaknesses: ["猫砂盆是排名品类，GPS非核心", "T800PLUS主打训练，非 GPS追踪", "国际化表达相对普通"],
                color: "#FF6D00",
                opportunity: "其GPS能力隐藏在训练产品中，专注GPS追踪可建立更清晰的差异化"
              },
              {
                rank: "#4", name: "eSEEK (Yixie)", company: "深圳易系电子",
                url: "https://heseek.en.alibaba.com/",
                years: "11年", staff: "50+人",
                positioning: "猎犬GPS追踪器专业制造商，VHF+4G双网络，最强直接竞品",
                rankTag: "#3 Pet Products行业排名",
                bannerText: "GPS HOUND TRACKER · GLOBAL UNIVERSAL · WELCOME TO CUSTOMIZE",
                bannerScene: "森林野猪追猎场景 + 猎犬奔跑 + 4G标识 + 产品展示",
                strengths: ["猎犬GPS专业定位最清晰", "Intertek认证", "VHF+4G双网络技术壁垒", "15KM超远距离追踪", "最高销量128 sold/套"],
                weaknesses: ["工厂规模较小（2000平方米）", "产品价格高（$699-899）MOQ门槛高", "OEM/ODM展示不突出", "牲畜GPS产品线缺失"],
                color: "#C62828",
                opportunity: "最直接竞品，需在牲畜GPS、OEM服务、价格梯度上形成差异化"
              },
              {
                rank: "#5", name: "金品排名综合", company: "阿里国际站宠物类金品",
                url: "https://sale.alibaba.com/p/daea2uwqe/index.html",
                years: "综合", staff: "综合",
                positioning: "金品工厂排名TOP5综合分析，行业整体定位趋势",
                rankTag: "金品工厂排名 Pet Products类",
                bannerText: "LEADING FACTORIES - Top factories ranked by GMV",
                bannerScene: "金品排名页面：强调GMV/评价数/超越同行比例",
                strengths: ["低 MOQ定制能力（Haisen #1）", "大牌OEM背书（Rena #2）", "出口年限（10+ years）", "超越99%供应商的平台数据"],
                weaknesses: ["GPS专业定位器排名靠后", "宠物类以训练/喟食为主流", "专业猎犬/牲畜GPS仍是蓝海"],
                color: "#7B1FA2",
                opportunity: "金品排名中GPS定位器专业供应商极少，进入金品是建立权威的关键路径"
              }
            ].map((comp, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: bgColor, border: `1px solid ${comp.color}40` }}>
                <div className="p-5" style={{ borderBottom: `1px solid ${comp.color}30`, background: `linear-gradient(135deg, ${comp.color}15, transparent)` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: comp.color + "30", color: comp.color }}>竞品{comp.rank}</span>
                        <span className="text-xs" style={{ color: "#9E9E9E" }}>{comp.years} · {comp.staff}</span>
                      </div>
                      <h3 className="text-xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>{comp.name}</h3>
                      <div className="text-xs" style={{ color: "#9E9E9E" }}>{comp.company}</div>
                    </div>
                    <a href={comp.url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded" style={{ backgroundColor: comp.color + "20", color: comp.color }}>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="text-xs px-2 py-1 rounded inline-block" style={{ backgroundColor: comp.color + "20", color: comp.color }}>
                    {comp.rankTag}
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-xs font-mono mb-1" style={{ color: "#616161" }}>BANNER文案</div>
                    <div className="text-sm font-bold" style={{ color: "#F5F5F5" }}>"{comp.bannerText}"</div>
                    <div className="text-xs mt-1" style={{ color: "#9E9E9E" }}>{comp.bannerScene}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-mono mb-2" style={{ color: green }}>优势</div>
                      <div className="space-y-1">
                        {comp.strengths.slice(0,3).map((s, j) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <CheckCircle2 size={10} className="mt-0.5 flex-shrink-0" style={{ color: green }} />
                            <span className="text-xs" style={{ color: "#9E9E9E" }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-mono mb-2" style={{ color: orange }}>弱项</div>
                      <div className="space-y-1">
                        {comp.weaknesses.slice(0,3).map((w, j) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: orange }} />
                            <span className="text-xs" style={{ color: "#9E9E9E" }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: cardBg, border: `1px solid ${comp.color}30` }}>
                    <div className="text-xs font-mono mb-1" style={{ color: comp.color }}>差异化机会</div>
                    <div className="text-xs leading-relaxed" style={{ color: "#F5F5F5" }}>{comp.opportunity}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Competitive Positioning Matrix */}
          <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
              竞品对比矩阵 — 我们的差异化突破点
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    {["维度", "WanWayTech", "PATPET", "Wellturn", "eSEEK", "我们的机会"].map((h, i) => (
                      <th key={i} className="text-left py-3 px-4 text-xs font-mono uppercase"
                        style={{ color: i === 5 ? green : "#9E9E9E" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dim: "猎犬GPS专业度", wanway: "★★☆", patpet: "★☆☆", wellturn: "★★☆", eseek: "★★★", us: "★★★ 专注猎犬+牲畜双赛道" },
                    { dim: "牲畜GPS覆盖", wanway: "★☆☆", patpet: "★☆☆", wellturn: "★☆☆", eseek: "★☆☆", us: "★★★ 独特蓝海赛道" },
                    { dim: "OEM/ODM服务", wanway: "★★★", patpet: "★★★", wellturn: "★★☆", eseek: "★★☆", us: "★★★ 30天交付承诺" },
                    { dim: "场景化Banner", wanway: "★★☆", patpet: "★★★", wellturn: "★★★", eseek: "★★★", us: "★★★ 猎场+牧场双场景" },
                    { dim: "价格竞争力", wanway: "★★★", patpet: "★★★", wellturn: "★★★", eseek: "★☆☆", us: "★★★ 多价格梯度" },
                    { dim: "认证体系", wanway: "★★★", patpet: "★★★", wellturn: "★★★", eseek: "★★☆", us: "★★★ CE+FCC+IP68+RoHS" },
                    { dim: "金品排名", wanway: "★★★", patpet: "★★☆", wellturn: "★★☆", eseek: "★★★", us: "目标进入金品TOP3" }
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: i % 2 === 0 ? "transparent" : cardBg + "80" }}>
                      <td className="py-3 px-4 font-medium" style={{ color: "#F5F5F5" }}>{row.dim}</td>
                      <td className="py-3 px-4" style={{ color: "#1565C0" }}>{row.wanway}</td>
                      <td className="py-3 px-4" style={{ color: "#2E7D32" }}>{row.patpet}</td>
                      <td className="py-3 px-4" style={{ color: "#FF6D00" }}>{row.wellturn}</td>
                      <td className="py-3 px-4" style={{ color: "#C62828" }}>{row.eseek}</td>
                      <td className="py-3 px-4 font-bold" style={{ color: green }}>{row.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Target size={20} />, color: green,
                title: "核心差异化：牲畜GPS蓝海",
                desc: "所有竞品在牲畜GPS（牛羊马）方向均为★☆☆，这是最大的差异化空间。建立‘猎犬+牲畜’双赛道定位，成为行业唯一双赛道专家。"
              },
              {
                icon: <TrendingUp size={20} />, color: orange,
                title: "eSEEK是最强对手，需差异化",
                desc: "eSEEK在猎犬GPS最专业，但价格高（$699-899）且牲畜GPS缺失。我们可以在价格梯度（$200-500入门款）和牲畜GPS上形成差异。"
              },
              {
                icon: <Globe size={20} />, color: blue,
                title: "金品排名是权威路径",
                desc: "WanWayTech的#1排名是其最大信任背书。进入金品TOP3是建立权威的关键，需要强化评价数量、成交额和认证体系。"
              }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${item.color}40` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: item.color + "20", color: item.color }}>{item.icon}</div>
                  <h4 className="font-bold text-sm" style={{ color: "#F5F5F5" }}>{item.title}</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#9E9E9E" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL SITES RESEARCH ── */}
      <section id="global" className="py-16" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Global Independent Sites" title="全球独立站叙事深度研究"
            subtitle="研究Garmin/Dogtra/Halter/CowManager等全球头部品牌如何打动客户，提炼可复用的叙事公式" />

          {/* Two Track Tabs */}
          <div className="flex gap-3 mb-8">
            {["🐕 猎狗GPS独立站", "🐄 牛羊马GPS独立站"].map((tab, i) => (
              <button key={i}
                onClick={() => setGlobalTab(i)}
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
                style={{
                  backgroundColor: globalTab === i ? (i === 0 ? orange : green) : cardBg,
                  color: globalTab === i ? "#0D1117" : "#9E9E9E",
                  border: `1px solid ${globalTab === i ? "transparent" : borderColor}`
                }}>
                {tab}
              </button>
            ))}
          </div>

          {globalTab === 0 && (
            <div className="space-y-6">
              {/* Hunting Dog GPS Sites */}
              {[
                {
                  brand: "Garmin", country: "🇺🇸 美国", type: "行业权威标杆",
                  color: "#1565C0",
                  heroText: "\"Build a better sporting dog\" — 不卖产品，卖更好的猎犬关系",
                  heroScene: "猎人+猎犬在金色草地，暖色调（金/橙），全幅情感场景",
                  narrativeFlow: ["品类权威", "场景分类", "产品矩阵", "技术参数"],
                  emotionalHooks: [
                    { hook: "情感先行", detail: "Hero区必须有真实猎犬/猎人场景，情感连接优先于产品展示" },
                    { hook: "场景化分类", detail: "按狩猎类型（禽类/浣熊/野猪）分类，而非按产品型号" },
                    { hook: "品牌权威", detail: "30年GPS历史 + 多价格段产品矩阵建立信任" }
                  ],
                  keyFormula: "情感共鸣 → 场景匹配 → 技术验证 → 购买决策",
                  applyToUs: "我们的Banner应该是：猎犬奔跑在山林中，GPS信号圈叠加，文案'Never Lose Your Hound'"
                },
                {
                  brand: "Dogtra PATHFINDER2", country: "🇺🇸 美国", type: "专业猎手首选",
                  color: "#FF6D00",
                  heroText: "\"9 Mile Range · 2 Second Refresh · Offline Maps\" — 数字化技术参数直击专业买家",
                  heroScene: "产品包装盒+项圈特写，293条评价突出显示，专业感强",
                  narrativeFlow: ["产品特性", "评价背书", "功能详解", "FAQ解疑", "配件扩展"],
                  emotionalHooks: [
                    { hook: "评价数量背书", detail: "293条评价 + 'Highly rated for: Collar Quality, App Usability' — 社会证明" },
                    { hook: "无月费差异化", detail: "'No Subscription Required' — 免费APP是最强转化钩子" },
                    { hook: "扩展性卖点", detail: "'Expandable Up To 21 Dogs' — 专业猎手需要多犬追踪" }
                  ],
                  keyFormula: "技术参数 → 社会证明 → 无隐性费用 → 扩展性 → 立即购买",
                  applyToUs: "我们需要：真实买家评价数量展示 + 明确的'No Monthly Fee'标签 + 多犬/多牲畜扩展能力"
                },
                {
                  brand: "SportDOG TEK Series", country: "🇺🇸 美国", type: "情感化场景",
                  color: "#C62828",
                  heroText: "\"ALL-BREED TRACKING COLLAR\" — 通用性强，满足所有猎犬品种",
                  heroScene: "猎犬特写（满身泥土/雨水），极强户外感，暗色调增加专业感",
                  narrativeFlow: ["情感场景图", "产品系列", "功能对比"],
                  emotionalHooks: [
                    { hook: "真实感场景", detail: "满身泥土的猎犬特写 — 这就是真实的打猎，不是摆拍" },
                    { hook: "即时客服", detail: "FREE SHIPPING + Live Chat + 800电话 — 降低购买风险" },
                    { hook: "通用性承诺", detail: "'ALL-BREED' — 不需要担心品种兼容问题" }
                  ],
                  keyFormula: "真实场景情感 → 通用性承诺 → 即时支持 → 免费送货",
                  applyToUs: "我们的产品图需要真实户外场景，不能是白底图。猎犬奔跑、牛羊在牧场的真实照片"
                },
                {
                  brand: "TR-Dog（深圳）", country: "🇨🇳 中国", type: "B端制造商定位",
                  color: "#7B1FA2",
                  heroText: "\"The Next Evolution of GPS Dog Tracking — TRON7 Coming Soon\" — 新品预热制造期待",
                  heroScene: "产品矩阵排列（蓝色科技背景），强调新品发布，IWA展会参展",
                  narrativeFlow: ["产品矩阵", "公司实力", "工厂展示", "R&D能力", "经销商招募"],
                  emotionalHooks: [
                    { hook: "IWA展会背书", detail: "参加纽伦堡IWA展会 — 国际专业展会是最强B端信任背书" },
                    { hook: "防诈骗声明", detail: "'We only supply through authorized distributors' — 建立独家代理体系" },
                    { hook: "Distributor专页", detail: "导航中有独立'Distributor'页面 — 明确B端定位" }
                  ],
                  keyFormula: "新品发布制造期待 → 工厂实力背书 → 经销商体系 → 成为授权合作伙伴",
                  applyToUs: "我们需要：独立的'Become a Distributor'页面/模块 + 展会参展记录 + 防伪声明"
                }
              ].map((site, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: cardBg, border: `1px solid ${site.color}30` }}>
                  <div className="p-6" style={{ borderBottom: `1px solid ${site.color}20`, background: `linear-gradient(135deg, ${site.color}10, transparent)` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: site.color + "30", color: site.color }}>{site.country}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#616161" + "30", color: "#9E9E9E" }}>{site.type}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>{site.brand}</h3>
                      </div>
                      <Dog size={28} style={{ color: site.color + "80" }} />
                    </div>
                    <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: bgColor, border: `1px solid ${site.color}20` }}>
                      <div className="text-xs font-mono mb-1" style={{ color: site.color }}>HERO ZONE 叙事</div>
                      <p className="text-sm leading-relaxed" style={{ color: "#F5F5F5" }}>{site.heroText}</p>
                      <p className="text-xs mt-1" style={{ color: "#9E9E9E" }}>{site.heroScene}</p>
                    </div>
                    {/* Narrative Flow */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: "#616161" }}>叙事流：</span>
                      {site.narrativeFlow.map((step, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: site.color + "20", color: site.color }}>{step}</span>
                          {j < site.narrativeFlow.length - 1 && <ArrowRight size={10} style={{ color: "#616161" }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-mono mb-3" style={{ color: "#9E9E9E" }}>情感触点分析</div>
                      <div className="space-y-3">
                        {site.emotionalHooks.map((h, j) => (
                          <div key={j} className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: site.color }} />
                              <span className="text-xs font-bold" style={{ color: "#F5F5F5" }}>{h.hook}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "#9E9E9E" }}>{h.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${site.color}30` }}>
                        <div className="text-xs font-mono mb-2" style={{ color: site.color }}>核心叙事公式</div>
                        <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>{site.keyFormula}</p>
                      </div>
                      <div className="rounded-lg p-4" style={{ backgroundColor: site.color + "10", border: `1px solid ${site.color}40` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb size={14} style={{ color: site.color }} />
                          <span className="text-xs font-mono" style={{ color: site.color }}>对我们的启示</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "#F5F5F5" }}>{site.applyToUs}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {globalTab === 1 && (
            <div className="space-y-6">
              {/* Livestock GPS Sites */}
              {[
                {
                  brand: "Halter", country: "🇳🇿 新西兰", type: "情感化农场叙事",
                  color: "#2E7D32",
                  heroText: "\"Farm the way you've always wanted.\" — 直击农场主最深层梦想，不说产品，先说愿景",
                  heroScene: "大幅牧场航拍+农场主与牛互动，绿色调（自然/可持续），全幅情感场景",
                  narrativeFlow: ["梦想愿景", "功能场景", "工作原理", "真实案例", "CTA行动"],
                  emotionalHooks: [
                    { hook: "梦想愿景开场", detail: "'Farm the way you've always wanted' — 不卖产品，先卖梦想，让农场主产生强烈共鸣" },
                    { hook: "劳动力成本痛点", detail: "'saving 3 hours of labour a day' — 省3小时/天是最有力的说服点，直接换算成钱" },
                    { hook: "具体数字案例", detail: "'we used to waste 20-30% but now the cows graze it clean' — 具体数字的真实案例" },
                    { hook: "情感共鸣金句", detail: "'Halter doesn't replace being a farmer, it helps you be a better farmer' — 不是替代，是赋能" }
                  ],
                  keyFormula: "梦想愿景 → 功能价值 → 真实农场主证言（含具体数字）→ 立即体验",
                  applyToUs: "我们的牲畜定位器Banner应该是：'Never Lose Your Livestock' 或 '让你的手机替你看管牛羊' + 牧场实景"
                },
                {
                  brand: "CowManager", country: "🇺🇸 美国", type: "数据驱动叙事",
                  color: "#C62828",
                  heroText: "\"MONITOR FROM CALF TO COW\" — 全生命周期管理，强调数据价值而非硬件",
                  heroScene: "产品特写（耳标）+ 深色背景，专业医疗级感觉，红色品牌色",
                  narrativeFlow: ["价值主张", "监测维度", "收益量化", "农场主故事", "经销商网络"],
                  emotionalHooks: [
                    { hook: "提前预警价值", detail: "'Get an alert up to 3 days before any signs of clinical illness' — 提前3天预警，减少损失" },
                    { hook: "盈利直接挂钩", detail: "'Increase profit with timely insemination' — 直接与盈利挂钩，不谈技术谈钱" },
                    { hook: "全球经销商网络", detail: "展示全球经销商地图 — '我们在你身边' 的信任感" },
                    { hook: "科学研究背书", detail: "'Backed by scientific research, on-farm validation' — 学术权威背书" }
                  ],
                  keyFormula: "数据（耳温+活动+反刍）→ 洞察（提前3天预警）→ 行动（及时干预）→ 结果（减少损失+增加收益）",
                  applyToUs: "我们需要：'牛羊马健康异常提前X小时预警' + 具体减少损失数据 + 全球经销商地图"
                },
                {
                  brand: "mOOvement", country: "🇳🇱 荷兰/澳大利亚", type: "简洁痛点直击",
                  color: "#1565C0",
                  heroText: "\"LET YOUR PHONE CHECK YOUR CATTLE\" — 极简直白，一句话说清楚价值",
                  heroScene: "牧场实景（牛群在草地）+ 白色大字，简洁有力，蓝色CTA按钮",
                  narrativeFlow: ["痛点标题", "解决方案", "透明定价", "真实案例", "联系询价"],
                  emotionalHooks: [
                    { hook: "最简价值主张", detail: "'LET YOUR PHONE CHECK YOUR CATTLE' — 7个词说清楚产品价值，无需解释" },
                    { hook: "Never lose承诺", detail: "'Never lose your cattle' — 最基本的安全感需求，直击恐惧" },
                    { hook: "规模化证明", detail: "'Live in 5 continents, 23 countries' — 全球验证，降低决策风险" },
                    { hook: "定价透明", detail: "直接展示25/100/250/500 Tags套餐定价 — 透明定价建立信任" }
                  ],
                  keyFormula: "极简痛点标题 → Never Lose承诺 → 透明定价 → 全球规模证明 → 询价",
                  applyToUs: "我们的牲畜定位器文案公式：'Let Your Phone Watch Your Herd' + 透明价格梯度 + 覆盖国家数"
                },
                {
                  brand: "Ceres Tag", country: "🇦🇺 澳大利亚", type: "技术差异化叙事",
                  color: "#00838F",
                  heroText: "\"Smarter Grazing with CERES RANCHER\" — 技术赋能智慧放牧，强调'更聪明'而非'更便宜'",
                  heroScene: "农场主手持耳标产品特写，绿色调，强调自然与技术结合",
                  narrativeFlow: ["技术优势", "功能详解", "Why it matters", "软件集成", "经销商网络"],
                  emotionalHooks: [
                    { hook: "唯一性技术壁垒", detail: "'only 100% waterproof (IP68) device on the market' — 唯一性是最强差异化" },
                    { hook: "无需基础设施", detail: "'direct-to-satellite connectivity, no towers required' — 偏远牧场无信号痛点解决" },
                    { hook: "Why it matters框架", detail: "每个功能后面都跟着'Why it matters' — 把技术翻译成商业价值" },
                    { hook: "软件生态集成", detail: "与主流农场管理软件集成 — 降低切换成本" }
                  ],
                  keyFormula: "技术唯一性 → Why it matters（商业价值翻译）→ 软件生态 → 全球经销商",
                  applyToUs: "我们需要：IP68/IP67防水唯一性声明 + 每个技术参数后面跟'为什么重要' + 软件/平台集成展示"
                }
              ].map((site, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: cardBg, border: `1px solid ${site.color}30` }}>
                  <div className="p-6" style={{ borderBottom: `1px solid ${site.color}20`, background: `linear-gradient(135deg, ${site.color}10, transparent)` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: site.color + "30", color: site.color }}>{site.country}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#616161" + "30", color: "#9E9E9E" }}>{site.type}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>{site.brand}</h3>
                      </div>
                      <Beef size={28} style={{ color: site.color + "80" }} />
                    </div>
                    <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: bgColor, border: `1px solid ${site.color}20` }}>
                      <div className="text-xs font-mono mb-1" style={{ color: site.color }}>HERO ZONE 叙事</div>
                      <p className="text-sm leading-relaxed" style={{ color: "#F5F5F5" }}>{site.heroText}</p>
                      <p className="text-xs mt-1" style={{ color: "#9E9E9E" }}>{site.heroScene}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: "#616161" }}>叙事流：</span>
                      {site.narrativeFlow.map((step, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: site.color + "20", color: site.color }}>{step}</span>
                          {j < site.narrativeFlow.length - 1 && <ArrowRight size={10} style={{ color: "#616161" }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-mono mb-3" style={{ color: "#9E9E9E" }}>情感触点分析</div>
                      <div className="space-y-3">
                        {site.emotionalHooks.map((h, j) => (
                          <div key={j} className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: site.color }} />
                              <span className="text-xs font-bold" style={{ color: "#F5F5F5" }}>{h.hook}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "#9E9E9E" }}>{h.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg p-4" style={{ backgroundColor: bgColor, border: `1px solid ${site.color}30` }}>
                        <div className="text-xs font-mono mb-2" style={{ color: site.color }}>核心叙事公式</div>
                        <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>{site.keyFormula}</p>
                      </div>
                      <div className="rounded-lg p-4" style={{ backgroundColor: site.color + "10", border: `1px solid ${site.color}40` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb size={14} style={{ color: site.color }} />
                          <span className="text-xs font-mono" style={{ color: site.color }}>对我们的启示</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "#F5F5F5" }}>{site.applyToUs}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Universal Narrative Formula Summary */}
          <div className="mt-10 rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${green}30` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: green + "20", color: green }}><BookOpen size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                全球头部品牌通用叙事公式 — 可直接套用
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-mono mb-3" style={{ color: orange }}>猎狗GPS店铺叙事公式</div>
                <div className="space-y-2">
                  {[
                    { step: "01", text: "情感场景Hero：猎犬+猎人真实户外场景，暖色调", color: orange },
                    { step: "02", text: "核心技术数字：Range(km) + Dogs(数量) + Battery(天)", color: orange },
                    { step: "03", text: "社会证明：评价数 + 使用国家 + 大客户背书", color: orange },
                    { step: "04", text: "无隐性费用：No Monthly Fee / No Subscription", color: orange },
                    { step: "05", text: "OEM/经销商CTA：Become a Distributor", color: orange }
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${s.color}20` }}>
                      <span className="text-xs font-mono flex-shrink-0 mt-0.5" style={{ color: s.color }}>STEP {s.step}</span>
                      <span className="text-xs leading-relaxed" style={{ color: "#F5F5F5" }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono mb-3" style={{ color: green }}>牛羊马GPS店铺叙事公式</div>
                <div className="space-y-2">
                  {[
                    { step: "01", text: "梦想愿景Hero：'Farm the way you've always wanted' 类型文案", color: green },
                    { step: "02", text: "劳动力成本痛点：省X小时/天 + 减少X%损失的具体数字", color: green },
                    { step: "03", text: "技术翻译：每个参数后面跟'Why it matters（为什么重要）'", color: green },
                    { step: "04", text: "真实农场主案例：具体数字 + 真实姓名/农场 + 国家", color: green },
                    { step: "05", text: "全球经销商地图：覆盖国家数 + 经销商招募CTA", color: green }
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${s.color}20` }}>
                      <span className="text-xs font-mono flex-shrink-0 mt-0.5" style={{ color: s.color }}>STEP {s.step}</span>
                      <span className="text-xs leading-relaxed" style={{ color: "#F5F5F5" }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Our Shop Optimization Plan */}
          <div className="mt-8 rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${orange}30` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: orange + "20", color: orange }}><Target size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                我们店铺的7大优化方向
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  no: "01", title: "店招重构", priority: "最高优先级",
                  current: "当前：可能缺乏清晰的行业定位标签和排名背书",
                  target: "目标：'GPS Tracker Specialist · Hunting Dog & Livestock · 15+ Years Factory'",
                  source: "参考：WanWayTech #1排名标签 + Airdog专利数字化",
                  color: orange
                },
                {
                  no: "02", title: "Banner场景化", priority: "最高优先级",
                  current: "当前：产品白底图或普通背景，缺乏情感连接",
                  target: "目标：猎犬奔跑在山林（猎狗定位器）+ 牛羊群在牧场（牲畜定位器）双场景Banner",
                  source: "参考：SportDOG满身泥土的猎犬 + mOOvement牧场实景",
                  color: orange
                },
                {
                  no: "03", title: "核心文案升级", priority: "高优先级",
                  current: "当前：可能是功能描述型文案（如'GPS Tracker for Dogs'）",
                  target: "目标：情感型文案 'Never Lose Your Hound / Never Lose Your Herd'",
                  source: "参考：Halter 'Farm the way you've always wanted' + mOOvement 'Never lose your cattle'",
                  color: blue
                },
                {
                  no: "04", title: "技术参数可视化", priority: "高优先级",
                  current: "当前：文字描述技术参数，缺乏视觉冲击力",
                  target: "目标：大字数字展示：'15KM Range / 30 Days Battery / IP68 Waterproof / 21 Dogs'",
                  source: "参考：Dogtra '9 Mile Range · 2 Second Refresh' 数字化参数",
                  color: blue
                },
                {
                  no: "05", title: "双赛道产品定位", priority: "高优先级",
                  current: "当前：猎狗和牲畜定位器混合展示，定位模糊",
                  target: "目标：明确分区：'For Hunters（猎人）' vs 'For Ranchers（牧场主）' vs 'For OEM Buyers'",
                  source: "参考：Garmin按场景分类 + TR-Dog的Distributor专页",
                  color: green
                },
                {
                  no: "06", title: "社会证明体系", priority: "中优先级",
                  current: "当前：缺乏系统性的客户案例和使用数据展示",
                  target: "目标：'Trusted by 500+ Hunters in 30+ Countries' + 真实买家评价 + 使用场景地图",
                  source: "参考：mOOvement '5 continents, 23 countries' + Dogtra 293条评价",
                  color: green
                },
                {
                  no: "07", title: "经销商招募模块", priority: "中优先级",
                  current: "当前：OEM/ODM信息不突出，经销商招募入口不清晰",
                  target: "目标：独立'Become Our Distributor'模块 + 区域独家代理政策 + 展会参展记录",
                  source: "参考：TR-Dog Distributor专页 + Airdog独家代理模式",
                  color: "#7B1FA2"
                }
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${item.color}30` }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: item.color + "60" }}>{item.no}</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: item.color + "20", color: item.color }}>{item.priority}</span>
                  </div>
                  <h4 className="text-lg font-black uppercase mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>{item.title}</h4>
                  <div className="space-y-2">
                    <div className="rounded p-2" style={{ backgroundColor: cardBg }}>
                      <div className="text-xs font-mono mb-0.5" style={{ color: "#616161" }}>CURRENT</div>
                      <p className="text-xs" style={{ color: "#9E9E9E" }}>{item.current}</p>
                    </div>
                    <div className="rounded p-2" style={{ backgroundColor: item.color + "10", border: `1px solid ${item.color}20` }}>
                      <div className="text-xs font-mono mb-0.5" style={{ color: item.color }}>TARGET</div>
                      <p className="text-xs" style={{ color: "#F5F5F5" }}>{item.target}</p>
                    </div>
                    <div className="text-xs" style={{ color: "#616161" }}>📎 {item.source}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR SITE DIAGNOSIS ── */}
      <section id="oursite" className="py-16" style={{ backgroundColor: cardBg }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Our Site Diagnosis" title="guptomes.com 独立站深度诊断"
            subtitle="对标全球头部品牌，找出现有宣传语的差距，提出可直接执行的升级方案" />

          {/* Current State + Diagnosis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl p-6" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#C6282820", color: "#C62828" }}><Eye size={18} /></div>
                <h3 className="text-xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>现有宣传语 — 实际内容</h3>
              </div>
              <div className="space-y-3">
                {[
                  { zone: "页面标题 (Title Tag)", current: "Animals GPS Tracker factory - Cattle GPS Tracker manufacturer from China", type: "SEO工具文案" },
                  { zone: "Hero Banner文案", current: "From ranch to range we track", type: "定位语" },
                  { zone: "核心价值主张", current: "Provide Professional Solutions", type: "功能描述" },
                  { zone: "个人介绍副标题", current: "We have a variety of product solutions to meet the different needs of customers, our efficiency is high, service quality, customer praise.", type: "泳水文案" },
                  { zone: "优势模块标题", current: "Our Advantage", type: "泳水标题" },
                  { zone: "4大优势标签", current: "HIGH QUALITY / DEVELOPMENT / MANUFACTURING / 100% SERVICE", type: "通用化标签" },
                  { zone: "联系区文案", current: "Inquiry Me Now, Get The Price List.", type: "低级CTA" }
                ].map((item, i) => (
                  <div key={i} className="rounded-lg p-3" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono" style={{ color: "#616161" }}>{item.zone}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#C6282820", color: "#C62828" }}>{item.type}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>"{item.current}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: bgColor, border: `1px solid ${orange}30` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg" style={{ backgroundColor: orange + "20", color: orange }}><AlertTriangle size={18} /></div>
                <h3 className="text-xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>5大核心问题诊断</h3>
              </div>
              <div className="space-y-4">
                {[
                  { no: "01", severity: "严重", color: "#C62828", problem: "Hero文案缺乏情感张力", detail: "'From ranch to range we track' 虽有一定韵律感，但它是描述性的（我们追踪），而非情感性的（你得到什么）。对比Halter的'Farm the way you've always wanted'—差距在这里。" },
                  { no: "02", severity: "严重", color: "#C62828", problem: "价值主张模糊，缺乏具体数字", detail: "'Provide Professional Solutions'是任何公司都能说的话。对比Dogtra的'9 Mile Range · 2 Second Refresh'—具体数字才是信任建立的基础。" },
                  { no: "03", severity: "中等", color: orange, problem: "4大优势标签过于通用", detail: "HIGH QUALITY / DEVELOPMENT / MANUFACTURING / 100% SERVICE — 这是任何制造商都会写的标签。对比Ceres Tag的'唯一IP68防水设备'—差异化才是优势。" },
                  { no: "04", severity: "中等", color: orange, problem: "CTA文案过于低级且以自我为中心", detail: "'Inquiry Me Now, Get The Price List.' — 这是以卖家视角写的。对比mOOvement的'Never lose your cattle'—以买家痛点为中心的CTA转化率更高。" },
                  { no: "05", severity: "改进项", color: green, problem: "新闻标题有潜力，但未在首屏突出", detail: "'From China to Greece — A Journey of 8,000 km'和'帮助客户找回被盗的骆驼'这些新闻标题极具情感张力，应该被提升到首屏主要位置作为社会证明。" }
                ].map((item, i) => (
                  <div key={i} className="rounded-lg p-4" style={{ backgroundColor: cardBg, border: `1px solid ${item.color}30` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: item.color + "60" }}>{item.no}</span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: item.color + "20", color: item.color }}>{item.severity}</span>
                      <span className="text-sm font-bold" style={{ color: "#F5F5F5" }}>{item.problem}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#9E9E9E" }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upgraded Copy Proposals */}
          <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: bgColor, border: `1px solid ${green}30` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: green + "20", color: green }}><Lightbulb size={20} /></div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                升级文案方案 — 可直接替换
              </h3>
            </div>
            <div className="space-y-5">
              {[
                {
                  zone: "Hero Banner 主标题",
                  current: "From ranch to range we track",
                  opts: ["Never Lose What Matters Most.", "Your Animals. Always Found.", "From the Hunting Trail to the Open Range — We Keep Them Safe."],
                  logic: "参考Halter的梦想愿景开场 + mOOvement的Never Lose承诺公式，以买家得到的结果为中心",
                  color: green
                },
                {
                  zone: "Hero Banner 副标题",
                  current: "(空白 / 无副标题)",
                  opts: ["GPS Trackers Built for Hunters & Ranchers · 15KM Range · 6-Month Battery · IP68", "Trusted by 500+ Farms in 30+ Countries · No Monthly Fee · Ships in 48hrs", "From Hunting Dogs to Cattle & Horses — One Platform, Total Control"],
                  logic: "参考Dogtra的数字化参数展示 + mOOvement的全球规模证明，具体数字建立信任",
                  color: green
                },
                {
                  zone: "核心价值主张标题",
                  current: "Provide Professional Solutions",
                  opts: ["The World's Most Versatile Animal GPS Tracker", "Built for the Wild. Proven on the Ranch.", "One Tracker. Every Animal. Every Terrain."],
                  logic: "参考SportDOG的'ALL-BREED'通用性承诺 + Garmin的场景化定位，强调覆盖广度和场景适应性",
                  color: orange
                },
                {
                  zone: "4大优势标签升级",
                  current: "HIGH QUALITY / DEVELOPMENT / MANUFACTURING / 100% SERVICE",
                  opts: ["15KM GPS Range / 6-Month Battery / IP68 Waterproof / 21 Animals", "No Monthly Fee / Ships in 48hrs / OEM in 30 Days / 5-Year Warranty", "CE+FCC+RoHS Certified / 500+ Farms Served / 30+ Countries / Since 2015"],
                  logic: "参考Dogtra的具体数字展示 + Ceres Tag的唯一性声明，用真实数据替换泳水标签",
                  color: orange
                },
                {
                  zone: "CTA 按钮文案",
                  current: "Inquiry Me Now, Get The Price List.",
                  opts: ["Protect Your Herd — Get a Free Quote", "Start Tracking in 48 Hours →", "Become a Distributor in Your Region"],
                  logic: "参考mOOvement的买家视角CTA + TR-Dog的经销商招募公式，以买家得到的价值为中心",
                  color: blue
                },
                {
                  zone: "新闻标题升级为社会证明",
                  current: "(埋在新闻列表，未在首屏突出)",
                  opts: ["\"Our GPS tracker helped recover a stolen camel in 2 hours\" — Real Customer Story", "8,000km from China to Greece: How We Protected a Greek Farmer's Herd", "Tested in Xinjiang's No-Signal Zones: Our Tracker Still Worked"],
                  logic: "这些新闻标题已经是极强的社会证明—应该被提升到首屏主要位置，而非埋在新闻列表里",
                  color: "#7B1FA2"
                }
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${item.color}30` }}>
                  <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: item.color + "15", borderBottom: `1px solid ${item.color}20` }}>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.zone}</span>
                    <span className="text-xs font-mono" style={{ color: "#616161" }}>UPGRADE</span>
                  </div>
                  <div className="p-5" style={{ backgroundColor: cardBg }}>
                    <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: "#C6282810", border: "1px solid #C6282830" }}>
                      <div className="text-xs font-mono mb-1" style={{ color: "#C62828" }}>CURRENT (待升级)</div>
                      <p className="text-sm" style={{ color: "#9E9E9E" }}>{item.current}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {item.opts.map((opt, j) => (
                        <div key={j} className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${item.color}30` }}>
                          <div className="text-xs font-mono mb-1" style={{ color: item.color }}>OPTION {String.fromCharCode(65+j)}</div>
                          <p className="text-sm font-medium leading-relaxed" style={{ color: "#F5F5F5" }}>{opt}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 rounded-lg p-3" style={{ backgroundColor: item.color + "08", border: `1px solid ${item.color}20` }}>
                      <BookOpen size={12} className="mt-0.5 flex-shrink-0" style={{ color: item.color }} />
                      <p className="text-xs leading-relaxed" style={{ color: "#9E9E9E" }}>设计逻辑：{item.logic}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Narrative Structure Comparison */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
              首屏叙事结构对比
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-mono mb-4 px-3 py-1.5 rounded inline-block" style={{ backgroundColor: "#C6282820", color: "#C62828" }}>当前 guptomes.com 首屏结构</div>
                <div className="space-y-2">
                  {[
                    { step: "1", text: "LOGO + 导航栏", issue: "正常" },
                    { step: "2", text: "Hero: 'From ranch to range we track' + 绿色背景", issue: "缺乏情感场景" },
                    { step: "3", text: "'QUALITY SERVICE' 标签 + 'Provide Professional Solutions'", issue: "泳水文案" },
                    { step: "4", text: "新闻轮播图（实际是案例故事）", issue: "位置偶尔" },
                    { step: "5", text: "Hot Sales 产品列表", issue: "过早展示产品" },
                    { step: "6", text: "About Company + Our Advantage", issue: "优势过于通用" },
                    { step: "7", text: "Recommended Products + More Products", issue: "重复展示" }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: cardBg, border: `1px solid ${s.issue === "正常" ? borderColor : "#C6282830"}` }}>
                      <span className="text-xs font-mono w-5 flex-shrink-0" style={{ color: s.issue === "正常" ? "#9E9E9E" : "#C62828" }}>{s.step}</span>
                      <span className="text-xs flex-1" style={{ color: "#F5F5F5" }}>{s.text}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: s.issue === "正常" ? "#2E7D3220" : "#C6282820", color: s.issue === "正常" ? green : "#C62828" }}>{s.issue}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-mono mb-4 px-3 py-1.5 rounded inline-block" style={{ backgroundColor: green + "20", color: green }}>建议升级后首屏结构</div>
                <div className="space-y-2">
                  {[
                    { step: "1", text: "LOGO + 导航（增加“猎人/牧场主/经销商”分类入口）", tag: "导航优化" },
                    { step: "2", text: "Hero: 'Never Lose What Matters Most' + 猎犬奔跑/牛羊群实景场景图", tag: "情感开场" },
                    { step: "3", text: "4个具体数字卡片：15KM / 6月续航 / IP68 / No Monthly Fee", tag: "数字建信" },
                    { step: "4", text: "案例证言卡：希腊农场主/新疆牲区/被盗骆驼找回故事", tag: "社会证明" },
                    { step: "5", text: "产品分区：For Hunters / For Ranchers / For OEM Buyers", tag: "分类定位" },
                    { step: "6", text: "工厂实力：年限+专利+认证+出口国家地图", tag: "工厂背书" },
                    { step: "7", text: "Become a Distributor CTA + 区域独家代理政策", tag: "B端转化" }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: cardBg, border: `1px solid ${green}30` }}>
                      <span className="text-xs font-mono w-5 flex-shrink-0" style={{ color: green }}>{s.step}</span>
                      <span className="text-xs flex-1" style={{ color: "#F5F5F5" }}>{s.text}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: green + "20", color: green }}>{s.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORE BLUEPRINT ── */}
      <section id="blueprint" className="py-16" style={{ backgroundColor: cardBg }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="🎯 店铺整体基调定义" title="Guptomes 阿里国际站旺铺 · 顶层设计总纲"
            subtitle="装修施工前必读 | 品牌定位 · 视觉风格 · 目标买家 · 核心USP · 13模块规划 · 图片素材清单" />

          {/* 品牌定位 + 视觉风格 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${green}40` }}>
              <h3 className="text-xl font-black uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: green }}>一、品牌定位关键词</h3>
              <div className="space-y-4">
                {[
                  { label: "主定位", value: "全球动物GPS追踪器专业制造商", sub: "Hunting Dog + Livestock GPS Specialist", color: green },
                  { label: "差异化定位", value: "No Monthly Fee + 双场景覆盖（猎场+牧场）+ 全球直发", sub: "猎场（Hunting）+ 牧场（Livestock）双赛道，竞品无法复制", color: orange },
                  { label: "品牌调性", value: "专业可靠 · 户外硬核 · 技术驱动 · 全球视野", sub: "参考：Garmin的硬核专业感 + Halter的科技农业感", color: blue }
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: `${item.color}10`, border: `1px solid ${item.color}30` }}>
                    <div className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-sm font-bold" style={{ color: "#F5F5F5" }}>{item.value}</div>
                    <div className="text-xs mt-1" style={{ color: "#9E9E9E" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${blue}40` }}>
              <h3 className="text-xl font-black uppercase mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: blue }}>二、视觉风格定义</h3>
              <div className="space-y-3">
                {[
                  { label: "整体色调", value: "深色底（#0A1628深海军蓝）+ 科技绿（#00C853）+ 警示橙（#FF6D00）", ref: "参考WanWayTech深色科技风", color: "#00C853" },
                  { label: "主视觉风格", value: "户外硬核 · 科技感 · 真实场景（禁止白底产品图作Banner）", ref: "参考Garmin/Dogtra产品页风格", color: blue },
                  { label: "字体方向", value: "标题粗黑英文（Bebas Neue/Barlow Condensed）+ 正文清晰可读", ref: "参考Airdog品牌字体策略", color: orange },
                  { label: "图片风格", value: "真实户外场景（猎场+牧场）+ 产品特写 + 工厂实景", ref: "参考heseek/WanWayTech", color: "#7B1FA2" },
                  { label: "禁止使用", value: "白底产品图作Banner / 卡通图标 / 过度设计 / 空洞描述词", ref: "竞品弱点反向参考", color: "#C62828" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="text-xs font-bold flex-shrink-0 w-20 pt-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: "#BDBDBD" }}>{item.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#616161" }}>📌 {item.ref}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 三类目标买家 */}
          <div className="mb-8 rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>三、目标买家人群画像（三类）</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  type: "A类：猎人买家", en: "Hunting Dog GPS Buyer", color: green,
                  regions: "北美（美/加）· 东欧（波兰/捷克）· 西欧（德/法）· 北欧",
                  needs: ["追踪距离远（15KM+）", "电池耐用（6个月+）", "防水防摔（IP68）", "无月费（No Monthly Fee）"],
                  decision: "看参数对比 → 看真实测评 → 看价格 → 询盘",
                  hook: "Never Lose Your Hunting Dog Again"
                },
                {
                  type: "B类：牧场主买家", en: "Livestock GPS Buyer", color: orange,
                  regions: "澳大利亚 · 新西兰 · 南美（巴西/阿根廷）· 中东 · 非洲",
                  needs: ["太阳能续航", "大范围覆盖", "多动物支持（牛羊马骆驼）", "耐极端气候"],
                  decision: "看解决方案 → 看案例 → 看价格区间 → 询盘",
                  hook: "Your Herd. Always Found. Always Safe."
                },
                {
                  type: "C类：OEM分销商", en: "Distributor / Wholesaler", color: blue,
                  regions: "全球各地区渠道商 · 经销商 · 代理商",
                  needs: ["MOQ低（10pcs起）", "定制Logo/包装", "CE/FCC认证", "稳定供货"],
                  decision: "看工厂实力 → 看认证 → 看定制能力 → 看合作条款 → 询盘",
                  hook: "Your Brand. Our Factory. 30-Day OEM."
                }
              ].map((buyer, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${buyer.color}40` }}>
                  <div className="p-4" style={{ backgroundColor: `${buyer.color}15` }}>
                    <div className="text-sm font-black" style={{ color: buyer.color, fontFamily: "'Barlow Condensed', sans-serif" }}>{buyer.type}</div>
                    <div className="text-xs" style={{ color: "#9E9E9E" }}>{buyer.en}</div>
                  </div>
                  <div className="p-4 space-y-3" style={{ backgroundColor: cardBg }}>
                    <div>
                      <div className="text-xs font-bold mb-1" style={{ color: "#9E9E9E" }}>核心市场</div>
                      <div className="text-xs" style={{ color: "#BDBDBD" }}>{buyer.regions}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold mb-1" style={{ color: "#9E9E9E" }}>核心需求</div>
                      <div className="space-y-0.5">
                        {buyer.needs.map((n, j) => (
                          <div key={j} className="text-xs flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: buyer.color }} />
                            <span style={{ color: "#BDBDBD" }}>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold mb-1" style={{ color: "#9E9E9E" }}>决策路径</div>
                      <div className="text-xs" style={{ color: "#BDBDBD" }}>{buyer.decision}</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ backgroundColor: `${buyer.color}10` }}>
                      <div className="text-xs font-bold italic" style={{ color: buyer.color }}>Hook文案："{buyer.hook}"</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 核心USP */}
          <div className="mb-8 rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>四、核心价值主张（USP · 可直接复制使用）</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { level: "主USP", copy: "No Monthly Fee GPS Tracker — Buy Once, Track Forever", why: "这是最强差异化武器。竞品Garmin/Dogtra需要月费，我们不需要。这一句话能直接打动价格敏感的买家。", color: green, priority: "P0 最高优先" },
                { level: "副USP 1", copy: "15KM Range · 6-Month Solar Battery · IP68 Waterproof", why: "用三个具体参数替代空洞描述。参考NKODA的数字化表达策略——数字比形容词有力100倍。", color: blue, priority: "P0 必须展示" },
                { level: "副USP 2", copy: "Supports 21 Animal Types — Hunting Dogs to Livestock", why: "双场景覆盖是独特优势。竞品要么只做猎犬，要么只做牲畜，我们两个都做，这是蓝海。", color: orange, priority: "P0 差异化核心" },
                { level: "副USP 3", copy: "OEM Ready in 30 Days · MOQ 10pcs · CE+FCC Certified", why: "针对OEM买家的核心承诺。参考everich4的定制服务承诺策略——把门槛说清楚，买家才敢询盘。", color: "#7B1FA2", priority: "P1 OEM买家专属" }
              ].map((usp, i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: cardBg, border: `1px solid ${usp.color}30` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold" style={{ color: usp.color }}>{usp.level}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${usp.color}20`, color: usp.color }}>{usp.priority}</div>
                  </div>
                  <div className="text-sm font-bold mb-3 leading-relaxed" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>"{usp.copy}"</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#9E9E9E" }}>{usp.why}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 13模块排列顺序 */}
          <div className="mb-8 rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>五、13模块完整排列顺序 · 叙事逻辑总览</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {[
                { num: "01", name: "店招", zone: "信任建立区", desc: "Logo + 行业排名标签 + 核心认证图标横排", color: green, why: "3秒建立专业GPS品牌认知" },
                { num: "02", name: "Hero Banner", zone: "信任建立区", desc: "3张轮播：猎犬场景 / 牧场场景 / OEM工厂场景", color: green, why: "5秒触发情感共鸣，传递核心USP" },
                { num: "03", name: "数字实力条", zone: "实力证明区", desc: "5个数字：年份/面积/专利/国家/动物类型", color: blue, why: "2秒建立工厂背书，消除皮包公司疑虑" },
                { num: "04", name: "产品分类总览", zone: "实力证明区", desc: "3列分类卡片：猎犬GPS / 牲畜GPS / OEM定制", color: blue, why: "5秒让买家找到自己的需求" },
                { num: "05", name: "猎犬GPS产品线", zone: "产品深度区", desc: "左图右文：场景图 + 核心参数 + 功能点", color: orange, why: "让猎人买家感受到这就是为我设计的" },
                { num: "06", name: "牲畜GPS产品线", zone: "产品深度区", desc: "左图右文：牧场场景 + 太阳能参数 + 功能点", color: orange, why: "差异化蓝海，竞品空白区域" },
                { num: "07", name: "热销产品橱窗", zone: "产品深度区", desc: "4-6个产品卡片：场景图 + 型号 + 询盘按钮", color: orange, why: "具体SKU展示，直接引导询盘" },
                { num: "08", name: "工厂实力展示", zone: "工厂背书区", desc: "4个数字卡片 + 工厂照片4张横排", color: "#7B1FA2", why: "B端买家尽职调查的核心内容" },
                { num: "09", name: "认证证书展示", zone: "工厂背书区", desc: "CE/FCC/RoHS/IP68/Gold Supplier横排", color: "#7B1FA2", why: "进入特定市场的门票，行业标配" },
                { num: "10", name: "展会照片展示", zone: "社会证明区", desc: "Canton Fair等国际展会参展照片2-4张", color: "#C62828", why: "国际化公司的最直接证明" },
                { num: "11", name: "客户案例", zone: "社会证明区", desc: "希腊8000km案例 + 骆驼找回案例 + 全球地图", color: "#C62828", why: "最强说服工具，推动从兴趣到询盘" },
                { num: "12", name: "定制服务流程", zone: "行动引导区", desc: "5步横向流程图 + 保障标签 + OEM CTA", color: "#FF8F00", why: "降低OEM合作门槛，消除顾虑" },
                { num: "13", name: "经销商招募+CTA", zone: "行动引导区", desc: "3个CTA按钮 + WhatsApp + 24小时响应承诺", color: "#0D47A1", why: "三类买家各有行动入口，不让任何人流失" }
              ].map((mod, i) => (
                <div key={i} className="rounded-xl p-4" style={{ backgroundColor: cardBg, border: `1px solid ${mod.color}30` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-black" style={{ color: mod.color, fontFamily: "'Barlow Condensed', sans-serif", opacity: 0.5 }}>{mod.num}</div>
                    <div>
                      <div className="text-sm font-black" style={{ color: "#F5F5F5" }}>{mod.name}</div>
                      <div className="text-xs px-1.5 py-0.5 rounded inline-block" style={{ backgroundColor: `${mod.color}20`, color: mod.color }}>{mod.zone}</div>
                    </div>
                  </div>
                  <div className="text-xs mb-2" style={{ color: "#BDBDBD" }}>{mod.desc}</div>
                  <div className="text-xs" style={{ color: "#616161" }}>💡 {mod.why}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-5" style={{ backgroundColor: cardBg, border: "1px solid #FFD70030" }}>
              <div className="text-sm font-black mb-3" style={{ color: "#FFD700" }}>叙事逻辑四大核心原则</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { rule: "原则1", text: "先建立信任（店招+Banner+数字条），再展示产品", color: green },
                  { rule: "原则2", text: "先展示产品（分类+产品线+橱窗），再展示工厂", color: blue },
                  { rule: "原则3", text: "先展示工厂（实力+认证+展会），再展示案例", color: orange },
                  { rule: "原则4", text: "先展示案例（社会证明），再引导行动（定制+经销商+CTA）", color: "#C62828" }
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded" style={{ backgroundColor: `${p.color}20`, color: p.color }}>{p.rule}</div>
                    <div className="text-xs" style={{ color: "#BDBDBD" }}>{p.text}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs" style={{ color: "#616161" }}>
                买家心理路径：<span style={{ color: green }}>认知（店招+Banner）</span> → <span style={{ color: blue }}>兴趣（产品展示）</span> → <span style={{ color: orange }}>信任（工厂+认证+案例）</span> → <span style={{ color: "#C62828" }}>行动（CTA+联系）</span>
              </div>
            </div>
          </div>

          {/* 图片素材清单 */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>六、装修前必须准备的图片素材清单</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    {["板块", "需要的图片", "规格要求", "内容要求", "优先级"].map(h => (
                      <th key={h} className="text-left py-3 px-3 font-bold" style={{ color: "#9E9E9E" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["店招", "Logo高清版", "PNG透明底", "品牌Logo，需要有英文版本", "P0"],
                    ["Banner 1", "猎人+猎犬户外场景", "1920×600px", "猎人在森林/草原使用GPS追踪猎犬的真实场景，需要有动感和硬核感", "P0"],
                    ["Banner 2", "牧场+牛羊群全景", "1920×600px", "大牧场全景+牛群/羊群+太阳能耳标特写，需要有宽广感", "P0"],
                    ["Banner 3", "工厂生产线全景", "1920×600px", "工厂生产线/研发室全景，体现专业制造能力", "P0"],
                    ["产品分类", "3张分类场景图", "600×400px", "猎犬GPS / 牲畜GPS / OEM定制 各一张场景图", "P0"],
                    ["猎犬产品线", "产品+使用场景", "800×600px", "猎犬佩戴GPS追踪器的真实使用场景", "P0"],
                    ["牲畜产品线", "产品+牧场场景", "800×600px", "牛/羊佩戴GPS耳标在牧场的真实场景", "P0"],
                    ["热销橱窗", "4-6张产品场景图", "400×400px", "每个SKU的场景图（非白底图），体现使用环境", "P0"],
                    ["工厂照片", "生产线/研发/测试/仓储", "600×400px", "真实自家工厂照片，禁止使用网络下载图片", "P0"],
                    ["认证证书", "真实认证扫描件", "原始文件", "CE/FCC/RoHS/IP68等认证的真实扫描件", "P0"],
                    ["展会照片", "Canton Fair等参展照片", "原始照片", "展会现场照片，必须包含展会标志/名称", "P1"],
                    ["客户案例", "客户使用场景照片", "原始照片", "希腊/中东等客户的真实使用照片（如有）", "P1"]
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${borderColor}40` }}>
                      <td className="py-3 px-3 font-bold" style={{ color: orange }}>{row[0]}</td>
                      <td className="py-3 px-3" style={{ color: "#F5F5F5" }}>{row[1]}</td>
                      <td className="py-3 px-3 font-mono" style={{ color: blue }}>{row[2]}</td>
                      <td className="py-3 px-3" style={{ color: "#9E9E9E" }}>{row[3]}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: row[4] === "P0" ? `${green}20` : `${orange}20`, color: row[4] === "P0" ? green : orange }}>{row[4]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── MASTER GUIDE V2 ── */}
      <section id="guide" className="py-16" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="🏗 保姆级施工指南 V2.0" title="阿里国际站旺铺精修 · 逐模块施工图纸"
            subtitle="专为阿里国际站旺铺2.0定制 | 整合NKODA/Airdog/WanWayTech/heseek/Halter等29家顶级店铺研究成果 | 照着做就能1:1复刻行业顶级" />

          {/* 总体说明 */}
          <div className="mb-10 rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>一、为什么要这样排版？— 买家决策路径分析</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "#BDBDBD" }}>阿里国际站的B端买家在进入店铺后，大脑会按照固定的心理路径做决策。研究NKODA、Airdog、WanWayTech、heseek等29家顶级店铺发现：所有头部店铺的排版顺序都遵循同一个逻辑——先建立信任，再展示产品，最后促成行动。任何打乱这个顺序的店铺，都会在某个环节失去买家。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { zone: "第一区：信任建立区（店招+Banner）", logic: "买家进入店铺的前3秒，大脑在问：'这家店值得我花时间看吗？'店招的行业排名和Banner的场景图，是唯一能在3秒内回答这个问题的工具。", ref: "来源：NKODA店招的#2排名标签 + Airdog的ELITE标识", color: green },
                { zone: "第二区：实力证明区（数字带+产品分类）", logic: "建立初步信任后，买家需要知道：'你有多强？你有我要的产品吗？'数字实力条用5个具体数字建立工厂背书，产品分类让买家快速找到自己的需求。", ref: "来源：NKODA的3个数字实力条 + Garmin的场景分类", color: blue },
                { zone: "第三区：产品深度区（产品线+热销橱窗）", logic: "买家找到感兴趣的产品线后，需要看详细信息。场景图+功能点的组合，让买家感受到'这个产品就是为我设计的'。", ref: "来源：Dogtra PATHFINDER2的产品页 + Garmin的功能拆解图", color: orange },
                { zone: "第四区：工厂背书区（工厂+研发+认证）", logic: "B端买家在询盘前会做尽职调查。工厂照片+数字+专利+认证，是消除'这家工厂是不是皮包公司'疑虑的最直接方式。", ref: "来源：NKODA的工厂优势模块 + Airdog的210项专利展示", color: "#7B1FA2" },
                { zone: "第五区：社会证明区（展会+客户案例）", logic: "展会照片证明'我们是国际化的公司'，客户案例是最强的说服工具。guptomes.com已有希腊8000km案例和骆驼找回案例，这是极强的素材，必须提升到核心位置。", ref: "来源：Halter的Real Farmer Stories + mOOvement的客户地图", color: "#C62828" },
                { zone: "第六区：行动召唤区（定制流程+经销商招募）", logic: "最后一次机会让买家行动。定制流程消除合作顾虑，经销商招募吸引大B买家。放在最后是因为大B买家会把整个店铺看完才做决定。", ref: "来源：Airdog的Distributor Policy专页 + bottlefilling的整线方案", color: "#00838F" }
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${item.color}40` }}>
                  <div className="text-sm font-black mb-2" style={{ color: item.color, fontFamily: "'Barlow Condensed', sans-serif" }}>{item.zone}</div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#BDBDBD" }}>{item.logic}</p>
                  <div className="text-xs px-2 py-1 rounded inline-block" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.ref}</div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#FFD70015", border: "1px solid #FFD70040" }}>
              <p className="text-xs font-bold" style={{ color: "#FFD700" }}>⚠️ 核心原则：这个顺序不能乱。"信任建立 → 实力证明 → 产品展示 → 工厂背书 → 社会证明 → 行动召唤"是行业验证的最优路径，所有29家研究店铺都遵循这个逻辑。</p>
            </div>
          </div>

          {/* 图片规格总表 */}
          <div className="mb-10 rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>二、图片制作规格总表（施工前必读）</h3>
            <p className="text-sm mb-6" style={{ color: "#9E9E9E" }}>阿里国际站旺铺2.0的图片规格是固定的。在开始制作任何图片前，必须按照以下规格，否则上传后会出现变形、裁切等问题。所有图片统一使用JPG格式，文件大小不超过2MB。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    {["模块", "图片名称", "PC尺寸（宽×高px）", "移动端尺寸", "数量", "优先级"].map(h => (
                      <th key={h} className="text-left py-3 px-3 font-bold" style={{ color: "#9E9E9E" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["店招", "store-header", "1920×200px", "750×200px", "1张", "P0"],
                    ["Hero Banner", "banner-dog / banner-livestock / banner-oem", "1920×650px", "750×400px", "3张（轮播）", "P0"],
                    ["数字实力条", "power-strip", "1920×200px", "750×200px", "1张", "P0"],
                    ["产品分类卡片", "category-dog / category-livestock / category-oem", "600×400px", "750×400px", "3张", "P0"],
                    ["产品线展示1（猎犬）", "product-dog-main", "1200×800px", "750×500px", "1张", "P0"],
                    ["产品线展示2（牲畜）", "product-livestock-main", "1200×800px", "750×500px", "1张", "P0"],
                    ["工厂鸟瞰图", "factory-aerial", "1200×500px", "750×400px", "1张", "P1"],
                    ["工厂内部照片", "factory-interior-1/2/3/4", "400×300px", "750×400px", "3-4张", "P1"],
                    ["认证证书墙", "cert-wall", "1200×300px", "750×300px", "1张", "P1"],
                    ["展会照片", "exhibition-1/2", "600×400px", "750×400px", "2-4张", "P1"],
                    ["全球客户地图", "customer-map", "1200×500px", "750×400px", "1张", "P1"],
                    ["定制服务流程图", "oem-process", "1200×500px", "750×400px", "1张", "P2"],
                    ["经销商招募", "distributor-banner", "1920×500px", "750×400px", "1张", "P2"]
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${borderColor}40` }}>
                      <td className="py-3 px-3 font-bold" style={{ color: orange }}>{row[0]}</td>
                      <td className="py-3 px-3" style={{ color: "#BDBDBD" }}>{row[1]}</td>
                      <td className="py-3 px-3 font-bold" style={{ color: green }}>{row[2]}</td>
                      <td className="py-3 px-3" style={{ color: "#9E9E9E" }}>{row[3]}</td>
                      <td className="py-3 px-3" style={{ color: "#9E9E9E" }}>{row[4]}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: row[5]==="P0" ? `${orange}20` : row[5]==="P1" ? `${blue}20` : `${green}20`, color: row[5]==="P0" ? orange : row[5]==="P1" ? blue : green }}>{row[5]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 定价定位 */}
          <div className="mb-10 rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>三、核心差异化武器（必须在首屏出现）</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-bold mb-4" style={{ color: green }}>产品线价格区间（B端批发）</h4>
                <div className="space-y-3">
                  {[
                    { cat: "猎狗GPS追踪器", price: "$35–$85/套", vs: "eSEEK M4零售$80–120", note: "工厂直供，比竞品低30-40%" },
                    { cat: "牛羊GPS追踪器", price: "$25–$55/只", vs: "Ceres Tag零售$150", note: "无订阅费是核心差异" },
                    { cat: "马/骆驼GPS", price: "$45–$120/只", vs: "Halter $300+月费", note: "一次购买，终身使用" },
                    { cat: "OEM定制起步", price: "$20起", vs: "行业标准MOQ 100+", note: "MOQ 10件，极低门槛" }
                  ].map((row, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold" style={{ color: "#F5F5F5" }}>{row.cat}</span>
                        <span className="text-sm font-black" style={{ color: green }}>{row.price}</span>
                      </div>
                      <div className="text-xs" style={{ color: "#9E9E9E" }}>竞品：{row.vs}</div>
                      <div className="text-xs mt-1" style={{ color: orange }}>→ {row.note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-4" style={{ color: orange }}>最强差异化武器（必须在首屏出现）</h4>
                <div className="space-y-3">
                  {[
                    { weapon: "No Monthly Fee", why: "Halter/mOOvement/Ceres Tag全部需要月费$5-25/月，B端买家最敏感", priority: "P0最高优先" },
                    { weapon: "21种动物覆盖", why: "竞品通常只做1-2种动物，我们是全品类，经销商一家搞定", priority: "P1高优先" },
                    { weapon: "太阳能充电", why: "牧场无电源，太阳能是刚需，Ceres Tag没有此功能", priority: "P1高优先" },
                    { weapon: "OEM MOQ 10件", why: "行业标准MOQ 50-100件，10件极低门槛吸引小经销商", priority: "P2中优先" }
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${orange}30` }}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold" style={{ color: "#FFD700" }}>✦ {item.weapon}</span>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${orange}20`, color: orange }}>{item.priority}</span>
                      </div>
                      <p className="text-xs" style={{ color: "#9E9E9E" }}>{item.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 模块施工指南 */}
          <div className="mb-8">
            <h3 className="text-2xl font-black uppercase mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>四、逐模块施工指南（15个模块 · 从上到下 · 照着做）</h3>

            {[
              {
                num: "01", name: "店招（Store Header）",
                why: "买家进入店铺后0.3秒内看到的东西，决定第一印象：专业公司还是普通工厂？",
                ref: "参考：WanWayTech的年限+认证组合 / Airdog的#1品牌标签",
                refColor: green,
                specs: [
                  { label: "尺寸", value: "1920×150px (PC) / 750×200px (移动)" },
                  { label: "背景色", value: "深色 #0D1117 或深绿 #0A2E1A（禁用纯白/绿色渐变）" },
                  { label: "必须包含", value: "LOGO + 年限 + 认证图标 + 核心差异点" }
                ],
                versions: [
                  { type: "主推版（品牌权威型）", copy: "GUPTOMES | Animal GPS Tracker Manufacturer Since 2015 | CE · FCC · RoHS | 30+ Countries" },
                  { type: "场景版（产品定向型）", copy: "GUPTOMES | GPS Trackers for Hunters & Ranchers | Hunting Dogs · Cattle · Horses · Sheep · Camels" },
                  { type: "数字版（促销季用）", copy: "GUPTOMES | 21 Animal Types · No Monthly Fee · Ships in 48hrs | Factory Direct · OEM MOQ 10pcs" }
                ]
              },
              {
                num: "02", name: "Hero Banner（首屏主Banner）",
                why: "整个店铺最贵的广告位。买家眼睛首先落在这里，是你唯一能在3秒内传递核心信息的地方。",
                ref: "参考：mOOvement的'Never lose'恐惧触发公式 / Halter的情感愿景开场 / TR-Dog的经销商叙事",
                refColor: orange,
                specs: [
                  { label: "尺寸", value: "1920×600px (PC) / 750×400px (移动)" },
                  { label: "数量", value: "3张轮播（猎狗场景 / 牧场场景 / OEM场景）" },
                  { label: "公式", value: "情感场景图（背景）+ 核心承诺（大标题）+ 具体参数（副标题）+ 行动按钮" }
                ],
                versions: [
                  { type: "Banner1：猎人买家", copy: "Never Lose Your Hunting Dog Again. | 15KM Range · Real-Time GPS · No Monthly Fee · IP68 | [Shop Hunting Dog GPS →]" },
                  { type: "Banner2：牧场主买家", copy: "Your Herd. Always Safe. Always Found. | Solar Charging · 6-Month Battery · Geo-Fence · Works in Remote Areas | [Explore Livestock GPS →]" },
                  { type: "Banner3：OEM经销商", copy: "Become the #1 GPS Tracker Distributor in Your Region. | OEM in 30 Days · MOQ 10pcs · 21 Animal Types · Exclusive Territory | [Apply for Distributorship →]" }
                ]
              },
              {
                num: "03", name: "信任数字带（Trust Bar）",
                why: "买家还没往下滚动前，用6个具体数字建立信任。从'我们很专业'到'我们有多专业'的关键转变。当前guptomes.com完全缺失此模块。",
                ref: "参考：Dogtra的数字化参数展示 / mOOvement的信任数字带 / WanWayTech的实力数字",
                refColor: blue,
                specs: [
                  { label: "位置", value: "Hero Banner正下方，高度120-150px" },
                  { label: "布局", value: "6个图标+数字+说明的横排卡片" },
                  { label: "背景", value: "深色 #111827 或深绿 #0A2E1A" }
                ],
                versions: [
                  { type: "6个数字组合", copy: "🌍 30+ Countries | 📦 Since 2015 | 🐾 21 Animal Types | ✅ CE·FCC·RoHS | 💰 No Monthly Fee | ⚡ Ships in 48hrs" },
                  { type: "备选强化版", copy: "如有数据可替换：500+ Farms Served / 10,000+ Units Sold / 15KM GPS Range / 6-Month Battery" },
                  { type: "注意事项", copy: "所有数字必须是真实数据，不能虚构。请确认后填入。" }
                ]
              },
              {
                num: "04", name: "产品线分类展示",
                why: "先分类再展示产品。错误做法是直接展示'Hot Sales'列表，买家不知道这些产品是给谁用的。正确做法是先用大标题分类，让买家秒找到自己的需求。",
                ref: "参考：Garmin的按使用场景分类 / SportDOG的TEK系列功能分类 / Halter的'For Farmers'定向叙事",
                refColor: "#7B1FA2",
                specs: [
                  { label: "模块标题", value: "GPS Solutions for Every Animal — Whether you're a hunter, rancher, or breeder" },
                  { label: "布局", value: "3列分类：For Hunters / For Ranchers / For OEM Buyers" },
                  { label: "每列包含", value: "场景背景图 + 分类标题 + 3个核心参数 + 代表产品 + CTA按钮" }
                ],
                versions: [
                  { type: "第一列：For Hunters", copy: "Hunting Dog GPS | 15KM Range · Real-Time · Voice Intercom | [Shop Hunting Dog GPS →]" },
                  { type: "第二列：For Ranchers", copy: "Livestock GPS | Solar Charging · 6-Month Battery · Geo-Fence | [Shop Livestock GPS →]" },
                  { type: "第三列：For OEM", copy: "OEM & Wholesale | MOQ 10pcs · 30-Day Delivery · Custom Branding | [Request OEM Quote →]" }
                ]
              },
              {
                num: "05", name: "爆款产品精选（会说话的产品卡片）",
                why: "产品卡片不只是图片+名称，而是：产品图+核心参数+使用场景+差异化卖点。参考Dogtra PATHFINDER2的展示方式，每张卡片都要'会说话'。",
                ref: "参考：Dogtra的参数图标展示 / Garmin的'What makes it special'模块 / WanWayTech的价格+MOQ格式",
                refColor: "#C62828",
                specs: [
                  { label: "卡片结构", value: "产品图 + 名称 + 评分 + 3个参数图标 + 一句话卖点 + 价格区间 + CTA" },
                  { label: "主推产品", value: "猎狗GPS(主力款) / 太阳能牛羊GPS / 马骆驼大电池款 / 轻量鸽子GPS" },
                  { label: "一句话卖点公式", value: "'The only [产品] with [独特功能] — [具体场景收益]'" }
                ],
                versions: [
                  { type: "猎狗GPS卖点", copy: "'The only hunting dog GPS with voice intercom — call your dog back without moving a step.'" },
                  { type: "太阳能牛羊GPS卖点", copy: "'Solar-powered. Never charge. Never lose. Works 6 months on a single full charge.'" },
                  { type: "马骆驼GPS卖点", copy: "'20,000mAh battery. 6-9 months standby. One charge per season — that's it.'" }
                ]
              },
              {
                num: "06", name: "客户案例与社会证明",
                why: "这是整个店铺最能打动买家的模块，没有之一。guptomes.com已有极强的社会证明素材（希腊案例、骆驼找回案例），但全部埋在新闻列表里！必须提升到核心位置。",
                ref: "参考：mOOvement的'Farm Stories'模块 / Halter的真实牧场主视频证言 / WanWayTech的全球客户地图",
                refColor: "#00838F",
                specs: [
                  { label: "模块标题", value: "Real Stories. Real Results. — From the hunting trails of Europe to the ranches of Australia" },
                  { label: "布局", value: "3个案例卡片：希腊牧场 / 骆驼找回 / 新疆极端测试" },
                  { label: "卡片结构", value: "国旗+地区 + 客户引言 + 产品型号 + 具体结果 + 阅读全文链接" }
                ],
                versions: [
                  { type: "希腊案例标题", copy: "'8,000km from China to Greece — and it worked perfectly.' 🇬🇷 Greek Livestock Farm · 200+ Sheep" },
                  { type: "骆驼案例标题", copy: "'Our stolen camel was recovered in 2 hours thanks to GPS.' 🇸🇦 Middle East Camel Ranch" },
                  { type: "新疆测试标题", copy: "'Works in zero-signal zones — we tested it ourselves.' 🇨🇳 Xinjiang Remote Pastoral Area" }
                ]
              },
              {
                num: "07", name: "工厂实力展示（数字化）",
                why: "工厂实力要'数字化'。当前guptomes.com的'HIGH QUALITY / DEVELOPMENT / MANUFACTURING'是空洞描述，没有任何具体内容。参考NKODA的工厂模块：42,000㎡ + 4条生产线 + 月产300万㎡——三个数字比'大型工厂'四个字有力100倍。工厂展示必须放在产品展示之后，不能放在最前面。",
                ref: "NKODA工厂模块：42,000㎡+4条生产线+月产300万㎡ | Airdog的210项专利展示 | WanWayTech的工厂数字展示",
                refColor: green,
                specs: [
                  { label: "模块标题", value: "Built in Our Own Factory. Backed by Our Own R&D." },
                  { label: "4个数字卡片", value: "成立年份 / 工厂面积 / 专利数量 / 出口国家数（必须填入真实数据）" },
                  { label: "工厂照片内容", value: "生产线照片 + 研发实验室照片 + 产品测试照片 + 仓储包装照片（4张横排）" },
                  { label: "工厂照片要求", value: "必须是真实自家工厂照片，禁止使用网络下载图片。工厂鸟瞰图最佳，没有就用正面全景图" }
                ],
                versions: [
                  { type: "标题文案", copy: "We don't just sell GPS trackers — we design, manufacture, and test every single one." },
                  { type: "数字卡片示例", copy: "Since 2015 | 3,000㎡ Factory | 15+ Patents | 30+ Countries Served" },
                  { type: "工厂介绍文案", copy: "Guptomes is a vertically integrated manufacturer — from R&D to production, quality control to global shipping, everything happens under one roof." }
                ]
              },
              {
                num: "08", name: "认证证书展示（合规展示墙）",
                why: "认证证书是进入特定市场的门票：CE=欧洲市场，FCC=美国市场，RoHS=环保要求。展示认证证书是向买家证明'我们能帮你合规进货'的最直接方式。所有29家研究店铺全部有认证展示，平均3-6个认证，认证墙是阿里国际站的行业标配。",
                ref: "NKODA的认证展示区 | Airdog的210项专利+认证墙 | WanWayTech的认证标识展示",
                refColor: "#00838F",
                specs: [
                  { label: "展示方式", value: "认证图标横排，每个认证配一句说明（如：CE—European Market Access）" },
                  { label: "必须展示", value: "CE / FCC / RoHS / IP68防水认证 / Alibaba Gold Supplier / ISO（如有）" },
                  { label: "展示格式", value: "认证图标（真实扫描件）+ 认证名称 + 适用市场，3列或小图标横排" },
                  { label: "注意事项", value: "展示真实认证扫描件，不要用网络下载的认证图标图片替代" }
                ],
                versions: [
                  { type: "认证展示标题", copy: "Certified for Global Markets" },
                  { type: "CE认证说明", copy: "CE Certified — Ready for European Market Import" },
                  { type: "FCC认证说明", copy: "FCC Certified — Compliant for US Market Distribution" }
                ]
              },
              {
                num: "09", name: "展会照片展示（国际化证明）",
                why: "展会照片是'我们是国际化公司'的最直接证明。展示在全球展会参展的照片，让买家感受到这家公司在全球市场有影响力。展会模块应放在认证之后，共同构成'工厂背书区'的一部分。",
                ref: "WanWayTech的Canton Fair展会照片 | heseek的展会展示区 | NKODA的全球展会展示",
                refColor: "#7B1FA2",
                specs: [
                  { label: "展示内容", value: "Canton Fair / HK Electronics Fair / CES / Interzoo等国际展会照片" },
                  { label: "展会照片要求", value: "展会现场照片，必须包含展会标志/展会名称，证明真实参展" },
                  { label: "展示数量", value: "2-4张，可以展示不同展会展示不同年份的参展照片" },
                  { label: "展会名称标注", value: "每张展会照片下方标注：展会名称 + 展会地点 + 展会年份" }
                ],
                versions: [
                  { type: "展会模块标题", copy: "Meeting the World — From Canton Fair to Global Exhibitions" },
                  { type: "Canton Fair标注", copy: "Canton Fair 2024 · Guangzhou, China" },
                  { type: "展会副标题", copy: "We exhibit at major international trade shows every year — come meet us in person." }
                ]
              },
              {
                num: "10", name: "客户案例与社会证明",
                why: "这是整个店铺最能打动买家的模块。guptomes.com已有希腊8000km案例和骆驼找回案例，这是极强的社会证明素材！必须从新闻列表提升到首页核心位置。真实客户案例是推动买家从'感兴趣'到'询盘'的最强说服工具。",
                ref: "Halter的Real Farmer Stories模块 | mOOvement的客户地图 | WanWayTech的全球客户展示",
                refColor: "#FF8F00",
                specs: [
                  { label: "模块标题", value: "Real Stories. Real Results. — From the hunting trails of Europe to the ranches of Australia" },
                  { label: "案例卡片结构", value: "国旗+地区 + 客户引言 + 产品型号 + 具体结果 + 阅读全文链接" },
                  { label: "全球客户地图", value: "展示已出货国家的地图，绿色标注已有客户的国家，直观展示全球影响力" },
                  { label: "必备素材", value: "希腊8000km案例 + 骆驼找回案例 + 新疆极端测试案例（已有素材，直接制作）" }
                ],
                versions: [
                  { type: "希腊案例标题", copy: "'8,000km from China to Greece — and it worked perfectly.' 🇬🇷 Greek Livestock Farm · 200+ Sheep" },
                  { type: "骆驼案例标题", copy: "'Our stolen camel was recovered in 2 hours thanks to GPS.' 🇸🇦 Middle East Camel Ranch" },
                  { type: "全球客户地图标题", copy: "Trusted by 500+ Farms in 30+ Countries" }
                ]
              },
              {
                num: "11", name: "定制服务流程（5步透明化）",
                why: "让OEM买家看到'合作有多简单'。用清晰的步骤图，让买家知道从询价到收货需要几步、几天。降低合作门槛，消除顾虑。定制流程模块应放在客户案例之后，因为看完案例的买家已经建立了信任，此时看到定制流程更容易行动。",
                ref: "bottlefilling.en.alibaba.com的整线解决方案流程 | everich4的OEM定制承诺 | TR-Dog的快速交期策略",
                refColor: orange,
                specs: [
                  { label: "模块标题", value: "From Idea to Delivery — 30 Days OEM Process" },
                  { label: "5步流程", value: "咋询(1-2天) → 样品确认(3-5天) → 生产(15-20天) → QC检测(3-5天) → 发货(3-7天)" },
                  { label: "底部保障标签", value: "MOQ 10pcs / Custom Logo & Packaging / Sample Available / NDA Protection / CE+FCC Pre-certified" },
                  { label: "流程图制作", value: "建议用图标+简短文字的横向步骤图，不要用纯文字列表来表达流程" }
                ],
                versions: [
                  { type: "流程标题", copy: "From Idea to Delivery — 30 Days OEM Process" },
                  { type: "副标题", copy: "We handle everything: design, production, testing, packaging, and shipping. You just sell." },
                  { type: "底部CTA", copy: "[Start Your OEM Project →] (蓝色大按鈕，放在流程图正下方)" }
                ]
              },
              {
                num: "12", name: "全球经销商招募",
                why: "把买家变成合伙人。不只是卖产品，而是帮买家在当地市场建立独家代理权。这个模块放在最后是因为大B买家（经销商/代理商）会把整个店铺看完才做决定，放在最后是为了让有渠道资源的大买家在看完所有内容后，有一个明确的行动入口。",
                ref: "Airdog的全球独家代理模式 | imale.en.alibaba.com的全球布局地图 | TR-Dog的经销商叙事策略",
                refColor: "#FFD700",
                specs: [
                  { label: "模块标题", value: "Become the #1 GPS Tracker Brand in Your Country." },
                  { label: "地图展示", value: "全球地图：已有经销商国家绿色标注，空白国家灰色（暗示机会）" },
                  { label: "3列权益", value: "Exclusive Territory / Brand Support / Profit Guarantee" },
                  { label: "紧迫感设计", value: "'Only 1 distributor per country'标签，创造稀缺感，提升申请动机" }
                ],
                versions: [
                  { type: "主标题", copy: "Become the #1 GPS Tracker Brand in Your Country." },
                  { type: "副标题", copy: "We're looking for exclusive distributors in 50+ countries. Limited slots available." },
                  { type: "紧迫感CTA", copy: "Only 1 distributor per country. Apply now before your region is taken. [Apply for Distributorship →]" }
                ]
              },
              {
                num: "13", name: "联系区 + 最终CTA",
                why: "最后一次机会让买家行动。三类买家分别对应三个CTA按鈕，不要只放一个'Contact Us'。情感化标题让买家带着动力点击。这个模块的核心是：不要让买家自己去找联系方式，而是主动把联系方式送到买家面前。",
                ref: "Halter的'For Farmers/Vets/Researchers'分类入口 | mOOvement的情感标题 | deepfitness的␤小时响应承诺",
                refColor: blue,
                specs: [
                  { label: "模块标题", value: "Ready to Protect Every Animal You Care About?" },
                  { label: "3个CTA按鈕", value: "[Get a Free Sample] 绿色 / [Request OEM Quote] 蓝色 / [Become a Distributor] 橙色" },
                  { label: "WhatsApp按鈕", value: "必须加入WhatsApp快捷按鈕，这是阿里国际站买家最常用的联系方式" },
                  { label: "响应承诺", value: "'We respond within 24 hours' — 消除买家的等待焦虑" }
                ],
                versions: [
                  { type: "标题文案", copy: "Ready to Protect Every Animal You Care About?" },
                  { type: "副标题", copy: "Get a free sample or request a custom quote — we respond within 24 hours." },
                  { type: "联系信息", copy: "📧 liam@guptomes.com | 📱 WhatsApp: +86 19065036484 | 🏗 Shenzhen Guptomes Group Co., Ltd." }
                ]
              }
            ].map((module, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mb-8 rounded-2xl overflow-hidden" style={{ border: `1px solid ${module.refColor}40` }}>
                {/* 模块头部 */}
                <div className="p-6" style={{ backgroundColor: `${module.refColor}15`, borderBottom: `1px solid ${module.refColor}30` }}>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl font-black flex-shrink-0" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: module.refColor, opacity: 0.4 }}>{module.num}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black uppercase mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>模块 {module.num}：{module.name}</h4>
                      <p className="text-sm mb-3 leading-relaxed" style={{ color: "#BDBDBD" }}>{module.why}</p>
                      <div className="text-xs px-3 py-1.5 rounded-full inline-block" style={{ backgroundColor: `${module.refColor}20`, color: module.refColor }}>📌 参考来源：{module.ref}</div>
                    </div>
                  </div>
                </div>
                {/* 施工规格 */}
                <div className="p-6" style={{ backgroundColor: cardBg }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-xs font-bold uppercase mb-3" style={{ color: "#9E9E9E", letterSpacing: "0.1em" }}>📐 施工规格 & 内容要求</h5>
                      <div className="space-y-2">
                        {module.specs.map((spec, j) => (
                          <div key={j} className="flex gap-3">
                            <span className="text-xs font-bold flex-shrink-0 w-24" style={{ color: module.refColor }}>{spec.label}</span>
                            <span className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase mb-3" style={{ color: "#9E9E9E", letterSpacing: "0.1em" }}>✍️ 可直接复制的文案方案</h5>
                      <div className="space-y-2">
                        {module.versions.map((ver, j) => (
                          <div key={j} className="rounded-lg p-3" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
                            <div className="text-xs font-bold mb-1" style={{ color: module.refColor }}>{ver.type}</div>
                            <div className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>{ver.copy}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 叙事逻辑说明 */}
          <div className="mb-10 rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>五、各模块叙事逻辑 — 为什么先介绍这个，为什么后出现那个</h3>
            <div className="space-y-4">
              {[
                { order: "第1-2屏", modules: "店招 + Hero Banner", logic: "解决'我是谁'的问题。买家进入店铺的前3秒，大脑在做一个判断：'这家店值得我花时间看吗？'店招的行业排名和Banner的场景图，是回答这个问题的唯一机会。如果前两屏不能建立信任，买家会直接离开，后面所有模块都没有意义。", insight: "NKODA在店招放#2行业排名，Airdog放ELITE标识，WanWayTech放认证图标——这些都是'3秒信任建立'的工具。", color: green },
                { order: "第3屏", modules: "数字实力条 + 产品分类总览", logic: "解决'你有什么'的问题。建立信任后，买家需要快速了解：这家工厂有多强？有我需要的产品吗？数字实力条用5个具体数字（年限/专利/国家/产能）建立工厂背书，产品分类让买家在5秒内找到自己的需求。这两个模块必须紧跟Banner，不能中间插入其他内容。", insight: "NKODA的数字条：2个行业标准 | 60+全球TOP原料 | 300万㎡/月——三个数字比一段话更有力量。", color: blue },
                { order: "第4-5屏", modules: "产品线详细展示（猎犬+牲畜）", logic: "解决'适合我吗'的问题。买家找到感兴趣的产品线后，需要看详细信息。这里要用场景图+功能点的组合，让买家感受到'这个产品就是为我设计的'。注意：先展示猎犬GPS（更多买家群体），再展示牲畜GPS（差异化蓝海），顺序不能反。", insight: "Dogtra PATHFINDER2的产品页面：左侧场景图+右侧功能点列表，这是行业验证的最优产品展示布局。", color: orange },
                { order: "第6屏", modules: "热销产品橱窗", logic: "解决'买哪个'的问题。展示具体SKU，让买家可以直接点击进入产品详情页询盘。橱窗产品的主图质量直接决定点击率，必须使用场景图而非白底图。", insight: "heseek的橱窗产品全部使用白底图，这是明显的弱点。我们要用场景图超越竞品。", color: "#C62828" },
                { order: "第7-8屏", modules: "工厂实力 + 研发能力", logic: "解决'你能做到吗'的问题。B端买家在询盘前会做尽职调查，工厂照片+数字+专利是消除'这家工厂是不是皮包公司'疑虑的最直接方式。注意：工厂展示必须放在产品展示之后，不能放在最前面——买家需要先被产品吸引，再去看工厂背书。", insight: "NKODA的工厂模块：42,000㎡ + 4条生产线 + 月产300万㎡——数字化表达比'大型工厂'四个字有力100倍。", color: "#7B1FA2" },
                { order: "第9-10屏", modules: "认证证书 + 展会照片", logic: "解决'合规吗'和'国际化吗'的问题。认证证书是进入特定市场的门票（CE=欧洲，FCC=美国），展会照片是国际化的证明。这两个模块合在一起，解决了'这家公司能帮我合规进货'的问题。", insight: "所有29家研究店铺都有认证展示，平均3-6个认证，认证墙是阿里国际站的行业标配。", color: "#00838F" },
                { order: "第11-12屏", modules: "客户案例 + 定制服务流程", logic: "解决'别人用了怎么样'和'合作有多简单'的问题。社会证明是最强的说服工具，真实客户案例推动买家从'感兴趣'到'询盘'。定制流程图让OEM买家看到'合作有多简单'，消除顾虑，降低询盘门槛。", insight: "guptomes.com已有希腊8000km案例和骆驼找回案例，这是极强的社会证明素材，必须从新闻列表提升到首页核心位置。", color: "#FF8F00" },
                { order: "第13屏", modules: "经销商招募", logic: "解决'有没有更大的合作机会'的问题。放在最后是因为这个模块针对的是大B买家（经销商/代理商），他们会把整个店铺看完才做决定。把这个模块放在最后，是为了让有渠道资源的大买家在看完所有内容后，有一个明确的行动入口。", insight: "Airdog专门设了'Distributor Policy'导航页，这是他们全球经销商体系的核心入口，客单价比普通订单高10-50倍。", color: "#0D47A1" }
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${item.color}30` }}>
                  <div className="flex items-start gap-4">
                    <div className="text-sm font-black flex-shrink-0 px-3 py-1 rounded" style={{ backgroundColor: `${item.color}20`, color: item.color, fontFamily: "'Barlow Condensed', sans-serif" }}>{item.order}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold mb-2" style={{ color: "#F5F5F5" }}>{item.modules}</div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "#BDBDBD" }}>{item.logic}</p>
                      <div className="text-xs px-3 py-1.5 rounded" style={{ backgroundColor: `${item.color}10`, color: item.color }}>💡 {item.insight}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 文案总表 */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <h3 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#FFD700" }}>六、文案总表（可直接复制替换 · 对照当前文案升级）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    {["位置", "当前文案（待替换）", "推荐文案A", "推荐文案B"].map(h => (
                      <th key={h} className="text-left py-3 px-3 font-bold" style={{ color: "#9E9E9E" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["页面标题", "Animals GPS Tracker factory from China", "GPS Trackers for Hunting Dogs & Livestock | No Monthly Fee", "Never Lose Your Animals Again | Guptomes — 30+ Countries"],
                    ["Hero主标题", "From ranch to range we track", "Never Lose What Matters Most.", "Your Animals. Always Found."],
                    ["Hero副标题", "（空白）", "15KM Range · 6-Month Battery · IP68 · No Monthly Fee", "Trusted by 500+ Farms · 30+ Countries · Ships in 48hrs"],
                    ["核心价值主张", "Provide Professional Solutions", "The World's Most Versatile Animal GPS Tracker", "Built for the Wild. Proven on the Ranch."],
                    ["优势标签1", "HIGH QUALITY", "15KM GPS Range", "No Monthly Fee"],
                    ["优势标签2", "DEVELOPMENT", "6-Month Battery", "Ships in 48hrs"],
                    ["优势标签3", "MANUFACTURING", "IP68 Waterproof", "OEM in 30 Days"],
                    ["优势标签4", "100% SERVICE", "21 Animal Types", "30+ Countries"],
                    ["主CTA", "Inquiry Me Now, Get The Price List.", "Protect Your Herd — Get a Free Quote", "Start Tracking in 48 Hours →"],
                    ["经销商CTA", "（无）", "Become the #1 GPS Tracker Brand in Your Country", "Apply for Exclusive Distributorship →"]
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${borderColor}40` }}>
                      <td className="py-3 px-3 font-bold" style={{ color: orange }}>{row[0]}</td>
                      <td className="py-3 px-3" style={{ color: "#616161" }}><del>{row[1]}</del></td>
                      <td className="py-3 px-3" style={{ color: green }}>{row[2]}</td>
                      <td className="py-3 px-3" style={{ color: blue }}>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISUAL MOCKUP ── */}
      <section id="mockup" className="py-16" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="🖼 可视化施工蓝图" title="店铺首页逐板块模拟预览"
            subtitle="每个板块用真实布局框架呈现 | 灰色区域=图片占位 | 橙色标注=内容说明 | 绿色标注=设计理由 | 照着填就能完成" />

          {/* 说明条 */}
          <div className="mb-10 rounded-xl p-5 flex flex-wrap gap-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            {[
              { color: "#9E9E9E", label: "灰色框 = 图片占位区", desc: "需要你提供或制作的图片" },
              { color: orange, label: "橙色标注 = 内容说明", desc: "这里放什么内容" },
              { color: green, label: "绿色标注 = 设计理由", desc: "为什么这样设计" },
              { color: blue, label: "蓝色标注 = 文案参考", desc: "可直接使用的文案" },
              { color: "#FFD700", label: "金色标注 = 参考来源", desc: "来自哪家顶级店铺" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.label}</span>
                <span className="text-xs" style={{ color: "#616161" }}>— {item.desc}</span>
              </div>
            ))}
          </div>

          {/* ===== MODULE 01: 店招 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: orange, color: "#000" }}>MODULE 01</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>店招（Store Header）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：NKODA + Airdog + WanWayTech</div>
            </div>
            {/* 店招模拟框 */}
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${orange}40` }}>
              {/* PC版店招 1920×200px */}
              <div className="relative flex items-center justify-between px-8" style={{ height: 100, backgroundColor: "#1A1A2E", borderBottom: `1px dashed ${borderColor}` }}>
                {/* Logo区 */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 60, height: 60, backgroundColor: "#2A2A3E", border: `2px dashed #555` }}>
                    <span className="text-xs text-center" style={{ color: "#888" }}>LOGO<br/>60×60</span>
                  </div>
                  <div>
                    <div className="font-black text-lg" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>GUPTOMES</div>
                    <div className="text-xs" style={{ color: green }}>Professional GPS Tracker Manufacturer</div>
                  </div>
                </div>
                {/* 中间排名标签 */}
                <div className="flex gap-3">
                  {["#1 Hunting Dog GPS", "#1 Livestock GPS", "10+ Years"].map((tag, i) => (
                    <div key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: i===0 ? `${orange}30` : `${green}20`, color: i===0 ? orange : green, border: `1px solid ${i===0 ? orange : green}40` }}>{tag}</div>
                  ))}
                </div>
                {/* 右侧联系 */}
                <div className="text-right">
                  <div className="text-xs" style={{ color: "#9E9E9E" }}>Response Rate: 98%</div>
                  <div className="text-sm font-bold" style={{ color: green }}>Contact Us Now</div>
                </div>
                {/* 标注层 */}
                <div className="absolute top-1 left-1 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${orange}90`, color: "#000" }}>PC版 1920×200px</div>
              </div>
              {/* 标注说明 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${orange}10`, border: `1px solid ${orange}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: orange }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 左侧：品牌Logo + 公司英文名 + 一句话定位</li>
                    <li>• 中间：行业排名标签（最重要！）</li>
                    <li>• 右侧：响应率 + 联系按钮</li>
                    <li>• 背景：深色（#1A1A2E或纯黑）</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>买家进入店铺的第一眼就是店招。行业排名标签是最强的信任建立工具——NKODA用"#2 PPF Film"、Airdog用"#1 Air Purifier"，3秒内告诉买家"这家是行业头部"。没有排名标签的店招，等于浪费了最黄金的展示位置。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 文案参考</div>
                  <div className="space-y-2">
                    <div className="text-xs p-2 rounded" style={{ backgroundColor: `${blue}15`, color: "#E3F2FD" }}>"#1 Hunting Dog GPS Tracker Supplier"</div>
                    <div className="text-xs p-2 rounded" style={{ backgroundColor: `${blue}15`, color: "#E3F2FD" }}>"Professional GPS Tracker | 10+ Years | 30+ Countries"</div>
                    <div className="text-xs" style={{ color: "#FFD700" }}>📚 来源：NKODA店招排名标签策略</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 02: Hero Banner ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: orange, color: "#000" }}>MODULE 02</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>Hero Banner（主视觉轮播）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Airdog + ISF Film + Halter</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${orange}40` }}>
              {/* Banner模拟 - 3张轮播 */}
              <div className="grid grid-cols-3 gap-0" style={{ borderBottom: `1px dashed ${borderColor}` }}>
                {[
                  { label: "Banner 1", scene: "猎犬场景", bg: "#0D1117", accent: orange, headline: "NEVER LOSE YOUR HUNTING DOG AGAIN", sub: "15KM Real-Time GPS | IP68 Waterproof | No Monthly Fee", cta: "Shop Hunting GPS →", imgDesc: "猎人+猎犬在森林中，GPS设备特写，黄昏光线" },
                  { label: "Banner 2", scene: "牧场场景", bg: "#0A1628", accent: green, headline: "PROTECT YOUR HERD. ANYWHERE.", sub: "Solar Powered | 6-Month Battery | Works on 21 Animal Types", cta: "Shop Livestock GPS →", imgDesc: "大草原+牛群，牛耳标特写，蓝天白云" },
                  { label: "Banner 3", scene: "OEM场景", bg: "#1A0A00", accent: blue, headline: "YOUR BRAND. OUR TECHNOLOGY.", sub: "OEM/ODM Ready | MOQ 50pcs | Ship in 30 Days", cta: "Get OEM Quote →", imgDesc: "工厂生产线+产品特写，专业工业感" },
                ].map((banner, i) => (
                  <div key={i} className="relative" style={{ backgroundColor: banner.bg }}>
                    {/* 图片占位区 */}
                    <div className="flex items-center justify-center" style={{ height: 140, backgroundColor: `${banner.accent}10`, borderBottom: `1px dashed ${banner.accent}40` }}>
                      <div className="text-center">
                        <div className="text-3xl mb-1">🖼</div>
                        <div className="text-xs font-bold" style={{ color: banner.accent }}>{banner.imgDesc}</div>
                        <div className="text-xs mt-1" style={{ color: "#555" }}>1920×650px · 全出血背景图</div>
                      </div>
                    </div>
                    {/* 文字区模拟 */}
                    <div className="p-4">
                      <div className="text-xs font-black mb-1" style={{ color: banner.accent, fontFamily: "'Barlow Condensed', sans-serif" }}>{banner.headline}</div>
                      <div className="text-xs mb-2" style={{ color: "#9E9E9E" }}>{banner.sub}</div>
                      <div className="text-xs px-3 py-1 rounded inline-block font-bold" style={{ backgroundColor: banner.accent, color: "#000" }}>{banner.cta}</div>
                    </div>
                    <div className="absolute top-1 left-1 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${banner.accent}90`, color: "#000" }}>{banner.label} · {banner.scene}</div>
                  </div>
                ))}
              </div>
              {/* 标注说明 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${orange}10`, border: `1px solid ${orange}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: orange }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 共3张轮播，分别对应3类买家</li>
                    <li>• 每张：全出血背景图 + 左侧文字叠加</li>
                    <li>• 文字结构：大标题（痛点/承诺）+ 3个核心参数 + CTA按钮</li>
                    <li>• 图片必须是真实场景（猎场/牧场/工厂），不能用白底产品图</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>场景化Banner是头部店铺与普通店铺最大的差距。Halter的Banner是牧场主站在草原上，Dogtra的Banner是猎人在森林里，这些图片让买家立刻产生代入感："这个产品就是为我设计的"。白底产品图无法产生这种情感共鸣。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 文案结构公式</div>
                  <div className="space-y-2">
                    <div className="text-xs p-2 rounded" style={{ backgroundColor: `${blue}15`, color: "#E3F2FD" }}>大标题 = 情感承诺/痛点解决<br/>副标题 = 3个核心参数（数字化）<br/>CTA = 动词+产品+箭头</div>
                    <div className="text-xs" style={{ color: "#FFD700" }}>📚 来源：Halter "Virtual Fencing" + Airdog "ELITE" Banner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 03: 数字实力条 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: orange, color: "#000" }}>MODULE 03</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>数字实力条（Power Strip）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：NKODA + WanWayTech + Airdog</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${orange}40` }}>
              {/* 数字条模拟 */}
              <div className="flex items-center justify-around py-6 px-8" style={{ backgroundColor: "#0D1117", borderBottom: `1px dashed ${borderColor}` }}>
                {[
                  { num: "10+", label: "Years Experience", icon: "🏭" },
                  { num: "30+", label: "Countries Exported", icon: "🌍" },
                  { num: "50K+", label: "Units Sold", icon: "📦" },
                  { num: "15KM", label: "Max Tracking Range", icon: "📡" },
                  { num: "98%", label: "Response Rate", icon: "⚡" },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-2xl font-black" style={{ color: orange, fontFamily: "'Barlow Condensed', sans-serif" }}>{item.num}</div>
                    <div className="text-xs" style={{ color: "#9E9E9E" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              {/* 标注 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${orange}10`, border: `1px solid ${orange}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: orange }}>📌 内容说明（必须填真实数据！）</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 5个数字：成立年份/出口国家/销量/技术参数/响应率</li>
                    <li>• 每个数字下方配一行英文说明</li>
                    <li>• 数字要有"10+""30+"这样的量感符号</li>
                    <li>• ⚠️ 这里的数字必须是真实的，不能虚报</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>B端买家在看完Banner后，第一个问题是"这家公司有多大？"数字实力条用5个具体数字在2秒内回答这个问题，比任何文字描述都有说服力。NKODA、WanWayTech都把这个模块放在Banner正下方，是行业验证的最优位置。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 数字填写指引</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>① 成立年份 → "XX+ Years Experience"</div>
                    <div>② 出口国家 → "XX+ Countries Exported"</div>
                    <div>③ 累计销量 → "XX,000+ Units Sold"</div>
                    <div>④ 核心技术参数 → "15KM Max Range"</div>
                    <div>⑤ 服务指标 → "98% Response Rate"</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：NKODA三数字条 + WanWayTech实力展示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 04: 产品分类 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: orange, color: "#000" }}>MODULE 04</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>产品分类总览（Category Overview）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Garmin场景分类 + Airdog产品线</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${orange}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0D1117", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>EXPLORE OUR GPS TRACKER SOLUTIONS</div>
                  <div className="text-sm" style={{ color: "#9E9E9E" }}>Choose your application — we have the perfect tracker for every need</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: "Hunting Dog GPS", sub: "For Hunters & Dog Trainers", color: orange, imgDesc: "猎犬奔跑场景图\n600×400px\n深色森林背景", tags: ["15KM Range", "IP68", "Voice Call"] },
                    { title: "Livestock GPS", sub: "For Cattle, Sheep & Horse Farms", color: green, imgDesc: "牛群/羊群在草原\n600×400px\n蓝天大草原", tags: ["Solar Powered", "6-Month Battery", "21 Animals"] },
                    { title: "OEM / ODM", sub: "For Distributors & Brands", color: blue, imgDesc: "工厂生产线特写\n600×400px\n专业工业感", tags: ["MOQ 50pcs", "30-Day Ship", "Custom Logo"] },
                  ].map((cat, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${cat.color}40` }}>
                      <div className="flex items-center justify-center" style={{ height: 120, backgroundColor: `${cat.color}10` }}>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🖼</div>
                          <div className="text-xs whitespace-pre-line text-center" style={{ color: cat.color }}>{cat.imgDesc}</div>
                        </div>
                      </div>
                      <div className="p-4" style={{ backgroundColor: "#0D1117" }}>
                        <div className="font-black text-sm mb-1" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>{cat.title}</div>
                        <div className="text-xs mb-3" style={{ color: "#9E9E9E" }}>{cat.sub}</div>
                        <div className="flex flex-wrap gap-1">
                          {cat.tags.map((tag, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${orange}10`, border: `1px solid ${orange}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: orange }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 3张分类卡片：猎犬GPS / 牲畜GPS / OEM定制</li>
                    <li>• 每张：场景图 + 分类名 + 目标人群 + 3个核心参数标签</li>
                    <li>• 图片必须是真实应用场景，不能是白底产品图</li>
                    <li>• 点击后跳转到对应产品列表页</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>产品分类是买家的"导航地图"。买家进入店铺后，需要在5秒内找到自己想要的产品类别。Garmin用"Hunting / Training / Tracking"三个场景分类，让不同需求的买家立刻找到入口。没有分类的店铺，买家会因为找不到产品而直接离开。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 分类命名参考</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>① "Hunting Dog GPS Trackers"</div>
                    <div>② "Livestock & Farm Animal GPS"</div>
                    <div>③ "OEM / White Label Solutions"</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：Garmin场景化分类 + Halter产品线</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 05: 猎犬产品线 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: orange, color: "#000" }}>MODULE 05</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>猎犬GPS产品线展示（Hunting Dog Line）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Dogtra PATHFINDER2 + Garmin Alpha 200i</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${orange}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0D1117", borderBottom: `1px dashed ${borderColor}` }}>
                {/* 左图右文布局 */}
                <div className="grid grid-cols-2 gap-8 items-center">
                  {/* 左侧：产品场景图 */}
                  <div className="rounded-xl flex items-center justify-center" style={{ height: 280, backgroundColor: `${orange}08`, border: `2px dashed ${orange}40` }}>
                    <div className="text-center">
                      <div className="text-4xl mb-3">🖼</div>
                      <div className="font-bold text-sm" style={{ color: orange }}>猎犬GPS主图</div>
                      <div className="text-xs mt-2" style={{ color: "#666" }}>1200×800px</div>
                      <div className="text-xs mt-1" style={{ color: "#666" }}>内容：猎犬佩戴GPS项圈</div>
                      <div className="text-xs" style={{ color: "#666" }}>在森林/山地环境中奔跑</div>
                      <div className="text-xs" style={{ color: "#666" }}>右下角叠加产品正面图</div>
                      <div className="text-xs mt-2 px-3 py-1 rounded" style={{ backgroundColor: `${orange}20`, color: orange }}>左侧占60%宽度</div>
                    </div>
                  </div>
                  {/* 右侧：文字内容 */}
                  <div>
                    <div className="text-xs font-bold mb-2 px-2 py-1 rounded inline-block" style={{ backgroundColor: `${orange}20`, color: orange }}>HUNTING DOG GPS TRACKER</div>
                    <div className="text-2xl font-black mb-3" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>NEVER LOSE YOUR DOG IN THE FIELD</div>
                    <div className="text-sm mb-4" style={{ color: "#9E9E9E" }}>Designed for serious hunters. Tracks up to 6 dogs simultaneously with 15KM range.</div>
                    <div className="space-y-3 mb-6">
                      {[
                        { icon: "📡", feat: "15KM Real-Time Tracking", desc: "Works in dense forest & mountains" },
                        { icon: "🔊", feat: "2-Way Voice Intercom", desc: "Call your dog back instantly" },
                        { icon: "💧", feat: "IP68 Waterproof", desc: "Submersible up to 1.5m" },
                        { icon: "🔋", feat: "72-Hour Battery", desc: "Full hunt weekend coverage" },
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-lg">{f.icon}</span>
                          <div>
                            <div className="text-sm font-bold" style={{ color: "#F5F5F5" }}>{f.feat}</div>
                            <div className="text-xs" style={{ color: "#9E9E9E" }}>{f.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="px-4 py-2 rounded font-bold text-sm" style={{ backgroundColor: orange, color: "#000" }}>View Products →</div>
                      <div className="px-4 py-2 rounded font-bold text-sm" style={{ backgroundColor: `${orange}20`, color: orange, border: `1px solid ${orange}40` }}>Get Price List</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${orange}10`, border: `1px solid ${orange}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: orange }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 布局：左图右文（6:4比例）</li>
                    <li>• 左图：猎犬佩戴GPS在野外场景，右下角叠加产品图</li>
                    <li>• 右文：品类标签 + 大标题 + 副标题 + 4个功能点 + 2个CTA</li>
                    <li>• 功能点：图标+名称+一句话说明，不超过4个</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>猎人买家是你们最核心的客户群。这个模块要让猎人买家产生强烈共鸣——"这个产品就是为我设计的"。大标题用痛点句式（Never Lose...），功能点聚焦猎人最关心的4个维度：距离、通话、防水、续航。参考Dogtra PATHFINDER2的产品页叙事结构。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 文案填写指引</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>大标题：痛点解决型（Never/Stop/No More...）</div>
                    <div>副标题：目标人群+核心数字</div>
                    <div>功能点：最多4个，每个配图标</div>
                    <div>CTA1："View Products →"（主要）</div>
                    <div>CTA2："Get Price List"（次要）</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：Dogtra PATHFINDER2产品页</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 06: 牲畜产品线 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: green, color: "#000" }}>MODULE 06</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>牲畜GPS产品线展示（Livestock Line）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Halter + CowManager + mOOvement</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${green}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0A1628", borderBottom: `1px dashed ${borderColor}` }}>
                {/* 右图左文布局（与猎犬模块左右交替） */}
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-xs font-bold mb-2 px-2 py-1 rounded inline-block" style={{ backgroundColor: `${green}20`, color: green }}>LIVESTOCK GPS TRACKER — CATTLE / SHEEP / HORSE</div>
                    <div className="text-2xl font-black mb-3" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>PROTECT YOUR HERD. ANYWHERE ON EARTH.</div>
                    <div className="text-sm mb-4" style={{ color: "#9E9E9E" }}>Solar-powered ear tag GPS for cattle, sheep, goats, and horses. No monthly fee.</div>
                    <div className="space-y-3 mb-6">
                      {[
                        { icon: "☀️", feat: "Solar Powered", desc: "6-month battery, no charging needed" },
                        { icon: "🌍", feat: "Works Anywhere", desc: "4G LTE + LoRa dual network" },
                        { icon: "🐄", feat: "21 Animal Types", desc: "Cattle, sheep, horse, camel & more" },
                        { icon: "💰", feat: "No Monthly Fee", desc: "One-time purchase, lifetime tracking" },
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-lg">{f.icon}</span>
                          <div>
                            <div className="text-sm font-bold" style={{ color: "#F5F5F5" }}>{f.feat}</div>
                            <div className="text-xs" style={{ color: "#9E9E9E" }}>{f.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="px-4 py-2 rounded font-bold text-sm" style={{ backgroundColor: green, color: "#000" }}>View Livestock GPS →</div>
                      <div className="px-4 py-2 rounded font-bold text-sm" style={{ backgroundColor: `${green}20`, color: green, border: `1px solid ${green}40` }}>Free Sample</div>
                    </div>
                  </div>
                  <div className="rounded-xl flex items-center justify-center" style={{ height: 280, backgroundColor: `${green}08`, border: `2px dashed ${green}40` }}>
                    <div className="text-center">
                      <div className="text-4xl mb-3">🖼</div>
                      <div className="font-bold text-sm" style={{ color: green }}>牲畜GPS主图</div>
                      <div className="text-xs mt-2" style={{ color: "#666" }}>1200×800px</div>
                      <div className="text-xs mt-1" style={{ color: "#666" }}>内容：牛群在大草原</div>
                      <div className="text-xs" style={{ color: "#666" }}>牛耳标GPS特写</div>
                      <div className="text-xs" style={{ color: "#666" }}>蓝天白云背景</div>
                      <div className="text-xs mt-2 px-3 py-1 rounded" style={{ backgroundColor: `${green}20`, color: green }}>右侧占40%宽度</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 布局：左文右图（与猎犬模块交替，避免单调）</li>
                    <li>• 背景色与猎犬模块不同（深蓝vs深黑）</li>
                    <li>• 强调"No Monthly Fee"——这是最大差异化优势</li>
                    <li>• 支持动物种类要明确列出（21种）</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>牲畜GPS是你们的蓝海市场——竞品几乎没有专门做这个的。Halter的牧场主场景图极具感染力，CowManager用数据说话。你们的最大优势是"No Monthly Fee"，这一点必须在这个模块的最显眼位置展示，因为Halter等品牌都要收月费，这是你们的核心差异化。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 核心文案</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>必须出现："No Monthly Fee"</div>
                    <div>必须出现："Solar Powered"</div>
                    <div>必须出现：支持动物种类数量</div>
                    <div>推荐标题："Protect Your Herd. Anywhere."</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：Halter独立站 + CowManager叙事</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 07: 热销橱窗 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: orange, color: "#000" }}>MODULE 07</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>热销产品橱窗（Hot Products）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：WanWayTech + heseek + PATPET</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${orange}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0D1117", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>BEST SELLING GPS TRACKERS</div>
                  <div className="text-sm" style={{ color: "#9E9E9E" }}>Most popular products trusted by hunters and farmers worldwide</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {["T18 猎犬GPS", "S10 牲畜GPS", "T12 训练+追踪", "S20 马用GPS"].map((name, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                      <div className="flex items-center justify-center" style={{ height: 140, backgroundColor: "#1A1A2E" }}>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🖼</div>
                          <div className="text-xs" style={{ color: "#888" }}>产品白底图</div>
                          <div className="text-xs" style={{ color: "#888" }}>600×600px</div>
                          <div className="text-xs mt-1 px-2 py-0.5 rounded" style={{ backgroundColor: `${orange}20`, color: orange }}>HOT SALE</div>
                        </div>
                      </div>
                      <div className="p-3" style={{ backgroundColor: "#0D1117" }}>
                        <div className="text-sm font-bold mb-1" style={{ color: "#F5F5F5" }}>{name}</div>
                        <div className="text-xs" style={{ color: "#9E9E9E" }}>MOQ: 10pcs</div>
                        <div className="text-xs mt-1" style={{ color: orange }}>Get Price →</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${orange}10`, border: `1px solid ${orange}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: orange }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 展示4-6个热销SKU，用卡片网格排列</li>
                    <li>• 每张卡片：白底产品图 + 产品名 + MOQ + 询价按钮</li>
                    <li>• 至少1个标注"HOT SALE"或"BEST SELLER"标签</li>
                    <li>• 产品图用白底图（方便买家看清产品细节）</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>热销橱窗是买家从"浏览"转向"询价"的关键节点。放在产品线介绍之后，是因为买家已经对产品类别有了认知，现在需要看具体的SKU。WanWayTech和heseek都把热销产品放在工厂介绍之前，目的是趁买家兴趣最高时，快速引导到具体产品。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 选品建议</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>① T18（旗舰猎犬GPS）— 主推</div>
                    <div>② S10（牲畜GPS）— 蓝海主推</div>
                    <div>③ T12（训练+追踪二合一）</div>
                    <div>④ S20（马用GPS）— 高客单价</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：WanWayTech热销橱窗设计</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 08: 工厂实力 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: blue, color: "#fff" }}>MODULE 08</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>工厂实力展示（Factory Strength）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：NKODA + Airdog + WanWayTech</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${blue}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0A0A1A", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>OUR MANUFACTURING CAPABILITY</div>
                </div>
                {/* 鸟瞰图占位 */}
                <div className="rounded-xl flex items-center justify-center mb-6" style={{ height: 180, backgroundColor: `${blue}08`, border: `2px dashed ${blue}40` }}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼</div>
                    <div className="font-bold" style={{ color: blue }}>工厂鸟瞰图 / 外观图</div>
                    <div className="text-xs mt-1" style={{ color: "#666" }}>1200×500px · 展示工厂规模和专业感</div>
                    <div className="text-xs" style={{ color: "#666" }}>最好是航拍图，体现工厂体量</div>
                  </div>
                </div>
                {/* 工厂内部4图 */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {["SMT贴片车间", "组装生产线", "质检区域", "成品仓库"].map((name, i) => (
                    <div key={i} className="rounded-lg flex items-center justify-center" style={{ height: 100, backgroundColor: `${blue}08`, border: `1px dashed ${blue}30` }}>
                      <div className="text-center">
                        <div className="text-xl mb-1">🖼</div>
                        <div className="text-xs" style={{ color: blue }}>{name}</div>
                        <div className="text-xs" style={{ color: "#555" }}>400×300px</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* 工厂数字 */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { num: "5,000㎡", label: "Factory Area" },
                    { num: "200+", label: "Employees" },
                    { num: "15+", label: "R&D Engineers" },
                    { num: "10+", label: "Production Lines" },
                  ].map((item, i) => (
                    <div key={i} className="text-center rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}20` }}>
                      <div className="text-xl font-black" style={{ color: blue, fontFamily: "'Barlow Condensed', sans-serif" }}>{item.num}</div>
                      <div className="text-xs" style={{ color: "#9E9E9E" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 1张工厂鸟瞰/外观图（最重要）</li>
                    <li>• 4张工厂内部照片（SMT/组装/质检/仓库）</li>
                    <li>• 4个工厂数字（面积/员工/研发/产线）</li>
                    <li>• ⚠️ 所有数字必须是真实的</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>B端买家在询盘前会做尽职调查，工厂照片是消除"皮包公司"疑虑的最直接方式。NKODA的工厂模块用鸟瞰图+内部4图的组合，让买家感受到工厂的真实规模。没有工厂照片的店铺，大B买家不会发出询盘。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 拍摄建议</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>① 鸟瞰图：用无人机拍，体现工厂规模</div>
                    <div>② 生产线：拍员工在工作的状态，有人气</div>
                    <div>③ 质检区：展示检测设备，体现品质管控</div>
                    <div>④ 仓库：整齐的货架，体现供应链能力</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：NKODA工厂模块 + Airdog工厂展示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 09: 认证证书 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: blue, color: "#fff" }}>MODULE 09</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>认证证书展示（Certifications）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Airdog月桂叶框架 + WanWayTech证书墙</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${blue}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0A0A1A", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>CERTIFIED QUALITY YOU CAN TRUST</div>
                </div>
                {/* 证书展示 */}
                <div className="flex items-center justify-around flex-wrap gap-4">
                  {["CE RED", "RoHS", "FCC", "IP68", "ISO9001"].map((cert, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex items-center justify-center rounded-xl" style={{ width: 100, height: 80, backgroundColor: `${blue}10`, border: `2px dashed ${blue}40` }}>
                        <div className="text-center">
                          <div className="text-lg">🖼</div>
                          <div className="text-xs" style={{ color: blue }}>{cert}</div>
                          <div className="text-xs" style={{ color: "#555" }}>证书图片</div>
                        </div>
                      </div>
                      <div className="text-xs mt-2 font-bold" style={{ color: "#9E9E9E" }}>{cert}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-sm" style={{ color: "#9E9E9E" }}>你已有的证书：<span style={{ color: blue }}>CE RED ✓ &nbsp; RoHS ✓</span>（可直接使用上传的图片）</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 展示所有已获得的认证证书图片</li>
                    <li>• 你已有：CE RED、RoHS（已下载到桌面）</li>
                    <li>• 建议补充：FCC（美国市场必须）、IP68测试报告</li>
                    <li>• 排列方式：横向一排，每个证书配名称</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>认证证书是B端买家做采购决策的必要条件，尤其是欧美市场。CE RED是欧盟市场的强制认证，FCC是美国市场的强制认证。Airdog用"月桂叶框架"把认证标志包围在中间，视觉冲击力极强。你们已有CE RED和RoHS，这是非常好的基础。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 证书使用说明</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>已有（桌面/认证证书文件夹）：</div>
                    <div style={{ color: green }}>✓ CE RED证书（Collar版）</div>
                    <div style={{ color: green }}>✓ CE RED证书（Terminal版）</div>
                    <div style={{ color: green }}>✓ RoHS证书</div>
                    <div style={{ color: green }}>✓ S10产品图（S10_09, S10_13）</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：Airdog认证月桂叶框架设计</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 10: 展会照片 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: blue, color: "#fff" }}>MODULE 10</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>展会照片（Exhibition）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：WanWayTech展会模块 + NKODA展会展示</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${blue}40` }}>
              <div className="p-6" style={{ backgroundColor: "#0A0A1A", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>MEET US AT GLOBAL TRADE SHOWS</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {["Canton Fair 展位照", "CES / HK Electronics", "与客户合影"].map((name, i) => (
                    <div key={i} className="rounded-xl flex items-center justify-center" style={{ height: 140, backgroundColor: `${blue}08`, border: `2px dashed ${blue}30` }}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🖼</div>
                        <div className="text-sm font-bold" style={{ color: blue }}>{name}</div>
                        <div className="text-xs mt-1" style={{ color: "#555" }}>600×400px</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 2-4张展会照片：展位全景 + 产品展示 + 与客户合影</li>
                    <li>• 每张图片下方标注展会名称和年份</li>
                    <li>• 如有Canton Fair参展照片，优先使用（国际认知度最高）</li>
                    <li>• 如暂无展会照片，可用公司团队照片代替</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>展会照片是"国际化背书"的最直接证明。WanWayTech的展会模块让买家看到"这家公司参加了Canton Fair，是正规的出口企业"。没有展会照片的店铺，买家会怀疑这家公司是否真实存在。即使只有1-2张照片，也要放上去。</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 11: 客户案例 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: "#7B1FA2", color: "#fff" }}>MODULE 11</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>客户案例与证言（Customer Stories）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Halter Real Farmer Stories + mOOvement客户地图</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #7B1FA240" }}>
              <div className="p-6" style={{ backgroundColor: "#0D0A1A", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>TRUSTED BY HUNTERS & FARMERS WORLDWIDE</div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { country: "🇬🇷 Greece", customer: "Professional Hunter", story: "8,000km hunting trip across Greece — tracked 3 dogs simultaneously, never lost one", product: "T18 Hunting GPS", stars: 5 },
                    { country: "🇸🇦 Saudi Arabia", customer: "Camel Farm Owner", story: "Found our lost camel in the desert after 3 days — the GPS still had battery", product: "S10 Livestock GPS", stars: 5 },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl p-5" style={{ backgroundColor: "#1A1A2E", border: "1px solid #7B1FA230" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{c.country.split(" ")[0]}</div>
                        <div>
                          <div className="font-bold text-sm" style={{ color: "#F5F5F5" }}>{c.country.split(" ").slice(1).join(" ")}</div>
                          <div className="text-xs" style={{ color: "#9E9E9E" }}>{c.customer}</div>
                        </div>
                        <div className="ml-auto text-yellow-400 text-sm">{"★".repeat(c.stars)}</div>
                      </div>
                      <p className="text-sm italic mb-3" style={{ color: "#BDBDBD" }}>" {c.story} "</p>
                      <div className="text-xs px-2 py-1 rounded inline-block" style={{ backgroundColor: "#7B1FA220", color: "#CE93D8" }}>Product: {c.product}</div>
                    </div>
                  ))}
                </div>
                {/* 全球客户地图占位 */}
                <div className="mt-6 rounded-xl flex items-center justify-center" style={{ height: 120, backgroundColor: "#7B1FA210", border: "2px dashed #7B1FA240" }}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌍</div>
                    <div className="font-bold" style={{ color: "#CE93D8" }}>全球客户分布地图</div>
                    <div className="text-xs mt-1" style={{ color: "#555" }}>1200×500px · 标注出口国家的热力图或标点图</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#7B1FA210", border: "1px solid #7B1FA230" }}>
                  <div className="text-xs font-black mb-2" style={{ color: "#CE93D8" }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 2-3个真实客户案例（你们已有！）</li>
                    <li>• 每个案例：国家旗帜+客户身份+故事+产品型号+星级</li>
                    <li>• 全球客户地图：标注出口国家</li>
                    <li>• ⭐ 希腊8000km案例和骆驼案例是极强素材，必须用！</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>客户案例是最强的说服工具。Halter的"Real Farmer Stories"让每个牧场主都能找到自己的影子。你们的希腊8000km案例和沙特骆驼案例，是极具感染力的真实故事，比任何广告文案都有说服力。这两个案例必须放在最显眼的位置。</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${blue}10`, border: `1px solid ${blue}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: blue }}>💬 案例撰写格式</div>
                  <div className="space-y-1 text-xs" style={{ color: "#BDBDBD" }}>
                    <div>格式：国家 + 客户身份 + 使用场景 + 结果</div>
                    <div>示例："Greek hunter tracked 3 dogs across 8,000km — zero signal loss"</div>
                    <div className="mt-2" style={{ color: "#FFD700" }}>📚 来源：Halter Real Farmer Stories叙事</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 12: OEM定制流程 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: "#00838F", color: "#fff" }}>MODULE 12</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>OEM定制服务流程（Custom Process）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Everich一站式流程 + bottlefilling整线方案</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #00838F40" }}>
              <div className="p-6" style={{ backgroundColor: "#0A1A1A", borderBottom: `1px dashed ${borderColor}` }}>
                <div className="text-center mb-6">
                  <div className="text-lg font-black uppercase" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>OEM / ODM — FROM IDEA TO DELIVERY</div>
                  <div className="text-sm" style={{ color: "#9E9E9E" }}>MOQ 50pcs · 30-Day Production · Custom Logo & Packaging</div>
                </div>
                <div className="flex items-center justify-between">
                  {[
                    { step: "01", title: "Inquiry", desc: "Send your requirements & MOQ" },
                    { step: "02", title: "Sample", desc: "Receive sample in 7 days" },
                    { step: "03", title: "Confirm", desc: "Approve design & specs" },
                    { step: "04", title: "Produce", desc: "30-day mass production" },
                    { step: "05", title: "Ship", desc: "DHL/FedEx worldwide" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-black" style={{ backgroundColor: "#00838F", color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>{s.step}</div>
                        <div className="text-sm font-bold" style={{ color: "#F5F5F5" }}>{s.title}</div>
                        <div className="text-xs" style={{ color: "#9E9E9E" }}>{s.desc}</div>
                      </div>
                      {i < 4 && <div className="mx-3 text-xl" style={{ color: "#00838F" }}>→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#00838F10", border: "1px solid #00838F30" }}>
                  <div className="text-xs font-black mb-2" style={{ color: "#4DD0E1" }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 5步流程图：询价→样品→确认→生产→发货</li>
                    <li>• 每步配数字编号+标题+一句话说明</li>
                    <li>• 在标题下方标注关键数字（MOQ/天数）</li>
                    <li>• 最后加一个大CTA按钮："Start Your OEM Order"</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>OEM买家在合作前最大的顾虑是"流程不透明"。Everich的"From Idea to Design to Final Product"流程图，让买家清楚地看到每一步，消除了合作顾虑。这个模块放在最后，是因为OEM买家会把整个店铺看完才做决定。</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MODULE 13: 经销商招募 ===== */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded font-black text-sm" style={{ backgroundColor: "#C62828", color: "#fff" }}>MODULE 13</div>
              <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>经销商招募（Distributor Recruitment）</h3>
              <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#FFD70020", color: "#FFD700" }}>参考：Airdog Distributor Policy + imale全球经销商网络</div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #C6282840" }}>
              <div className="p-6" style={{ backgroundColor: "#1A0A0A", borderBottom: `1px dashed ${borderColor}` }}>
                {/* 全宽Banner */}
                <div className="rounded-xl flex items-center justify-between px-8" style={{ height: 160, backgroundColor: "#2A0A0A", border: "2px dashed #C6282840" }}>
                  <div>
                    <div className="text-2xl font-black uppercase mb-2" style={{ color: "#F5F5F5", fontFamily: "'Barlow Condensed', sans-serif" }}>BECOME THE #1 GPS TRACKER BRAND IN YOUR COUNTRY</div>
                    <div className="text-sm mb-4" style={{ color: "#9E9E9E" }}>Exclusive distributor rights · Marketing support · Technical training</div>
                    <div className="px-6 py-2 rounded font-bold inline-block" style={{ backgroundColor: "#C62828", color: "#fff" }}>Apply for Exclusive Distributorship →</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-1">🖼</div>
                    <div className="text-xs" style={{ color: "#C62828" }}>全球地图图片</div>
                    <div className="text-xs" style={{ color: "#555" }}>或经销商合作照片</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6" style={{ backgroundColor: cardBg }}>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#C6282810", border: "1px solid #C6282830" }}>
                  <div className="text-xs font-black mb-2" style={{ color: "#EF9A9A" }}>📌 内容说明</div>
                  <ul className="text-xs space-y-1" style={{ color: "#BDBDBD" }}>
                    <li>• 全宽Banner：大标题 + 副标题 + CTA按钮</li>
                    <li>• 大标题：用"成为XX国家第一"的野心感语言</li>
                    <li>• 列出3个经销商权益：独家区域/营销支持/技术培训</li>
                    <li>• CTA按钮链接到询盘表单</li>
                  </ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${green}10`, border: `1px solid ${green}30` }}>
                  <div className="text-xs font-black mb-2" style={{ color: green }}>✅ 设计理由</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#BDBDBD" }}>经销商招募模块是吸引大B买家的最后一击。Airdog的经销商政策页面是其最重要的流量入口之一。"Become the #1 GPS Tracker Brand in Your Country"这句话，激活了经销商买家的野心，让他们主动联系你。这个模块放在最后，是因为大B买家会把整个店铺看完才做决定。</p>
                </div>
              </div>
            </div>
          </div>

          {/* 总结提示 */}
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: cardBg, border: `2px solid ${orange}40` }}>
            <div className="text-3xl font-black uppercase mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: orange }}>🎯 施工蓝图使用说明</div>
            <p className="text-sm mb-6" style={{ color: "#9E9E9E" }}>以上13个模块是阿里国际站旺铺2.0的完整结构。每个灰色占位框对应一张需要制作的图片，橙色标注告诉你填什么，绿色标注告诉你为什么，蓝色标注给你可直接使用的文案。</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: "STEP 1", title: "准备素材", desc: "按照图片规格总表，准备所有图片素材（工厂照/产品图/场景图/证书）", color: orange },
                { step: "STEP 2", title: "按模块制图", desc: "参照每个模块的占位框和标注，用PS/AI/Canva制作对应图片", color: green },
                { step: "STEP 3", title: "上传发布", desc: "在阿里国际站旺铺2.0编辑器中，按照13个模块的顺序逐一上传", color: blue },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: bgColor, border: `1px solid ${s.color}30` }}>
                  <div className="text-sm font-black mb-1" style={{ color: s.color, fontFamily: "'Barlow Condensed', sans-serif" }}>{s.step}</div>
                  <div className="text-base font-black mb-2" style={{ color: "#F5F5F5" }}>{s.title}</div>
                  <p className="text-xs" style={{ color: "#9E9E9E" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ── */}
      <section id="conclusion" className="py-16" style={{ backgroundColor: cardBg }}>
        <div className="container mx-auto px-6">
          <SectionTitle tag="Conclusion" title="研究结论与设计来源" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
              <h3 className="text-xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                设计方案来源索引
              </h3>
              <div className="space-y-4">
                {[
                  { element: "行业排名标签策略", source: "Airdog (#1 Air Quality Appliances)", color: green },
                  { element: "场景化Banner设计", source: "ISF Film超跑场景 + Everich户外场景", color: orange },
                  { element: "认证月桂叶框架", source: "Airdog 210项专利+认证墙展示", color: blue },
                  { element: "使命宣言文案策略", source: "Deep Fitness '占领全球市场'宣言", color: "#7B1FA2" },
                  { element: "Fortune 500背书", source: "UNIEAN + Pujiang大牌OEM策略", color: "#C62828" },
                  { element: "全球客户地图", source: "Airdog 96国销售地图可视化", color: "#00838F" },
                  { element: "整体解决方案定位", source: "Highbright超市整体解决方案", color: "#FF8F00" },
                  { element: "品牌化命名策略", source: "Pujiang 'STREETWEAR DREAM FACTORY'", color: "#0D47A1" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <div>
                      <span className="font-medium text-sm" style={{ color: "#F5F5F5" }}>{item.element}</span>
                      <span className="text-xs ml-2" style={{ color: "#9E9E9E" }}>← {item.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
              <h3 className="text-xl font-black uppercase mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F5F5" }}>
                核心竞争差异化策略
              </h3>
              <div className="space-y-4">
                {[
                  { title: "技术壁垒可视化", desc: "将GPS精度/续航/防水等技术参数转化为可视化数据，如Airdog的专利数字展示", color: green },
                  { title: "场景化产品表达", desc: "猎狗奔跑在森林/牛羊群在牧场，产品在真实场景中展示，而非白底图", color: orange },
                  { title: "双赛道产品定位", desc: "猎狗追踪器（精准/耐用）与牲畜管理器（续航/太阳能）分别建立独立品牌形象", color: blue },
                  { title: "B端买家价值主张", desc: "帮助分销商建立自有品牌，提供OEM/ODM服务，参考UNIEAN'OWN YOUR FACTORY'策略", color: "#7B1FA2" }
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="rounded-lg p-4" style={{ backgroundColor: cardBg, border: `1px solid ${item.color}30` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-sm" style={{ color: "#F5F5F5" }}>{item.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#9E9E9E" }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8" style={{ backgroundColor: bgColor, borderTop: `1px solid ${borderColor}` }}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: green }}>
              <MapPin size={12} color="#0D1117" />
            </div>
            <span className="text-sm" style={{ color: "#9E9E9E" }}>TrackPro Research · 行业头部店铺视觉设计研究报告</span>
          </div>
          <div className="text-xs" style={{ color: "#616161" }}>
            基于15个行业头部 + 5个同行竞品 + 8个全球独立站 + guptomes.com诊断 共29家店铺深度分析 · 阿里国际站专属施工指南 13大模块 · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
