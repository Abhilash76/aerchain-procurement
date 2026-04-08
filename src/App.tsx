/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  CloudUpload, 
  BarChart3, 
  HelpCircle, 
  Archive, 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  FileText,
  Tag,
  Users,
  Building2,
  Briefcase,
  Calendar,
  Info,
  Bold,
  Italic,
  List,
  ListOrdered,
  Table as TableIcon,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Bot,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  DollarSign,
  Trophy,
  PieChart,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';

// --- Types ---

interface LineItem {
  id: number;
  name: string;
  category: string;
  description: string;
  hsnSac: string;
  uom: string;
}

interface TimelineDate {
  label: string;
  date: string;
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-white shadow-sm text-primary font-semibold' 
        : 'text-slate-500 hover:text-primary hover:bg-white/50'
    }`}
  >
    <Icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary'} />
    <span className="text-[11px] uppercase tracking-widest font-bold">{label}</span>
  </a>
);

const InputField = ({ label, icon: Icon, value, readOnly = false }: { label: string, icon?: any, value: string, readOnly?: boolean }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative flex items-center">
      {Icon && <Icon size={16} className="absolute left-3 text-slate-400" />}
      <input 
        className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 ${Icon ? 'pl-10' : 'px-4'} pr-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all`}
        type="text" 
        defaultValue={value}
        readOnly={readOnly}
      />
    </div>
  </div>
);

const SelectField = ({ label, options, defaultValue }: { label: string, options: string[], defaultValue: string }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all">
        {options.map(opt => <option key={opt} selected={opt === defaultValue}>{opt}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

export default function App() {
  const [currentStep, setCurrentStep] = useState<'RFQ' | 'Vendor' | 'Dashboard'>('RFQ');
  const [isScopeExpanded, setIsScopeExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<'Balanced' | 'Cost' | 'Speed' | 'Compliance'>('Balanced');

  const [sowPoints, setSowPoints] = useState<string[]>([
    "Strategy & Creative",
    "TVC Development",
    "TVC Production",
    "Social Organic",
    "Social Paid",
    "Compliance Review",
    "Program Mgmt"
  ]);

  const [vendors, setVendors] = useState([
    {
      name: "Nexus Creative",
      scores: [9, 8, 7, 9, 8, 9, 8],
      cost: 450000,
      delivery: 8,
      compliance: 9.5,
      risk: "Low",
      color: "#7049b3"
    },
    {
      name: "Global Media Hub",
      scores: [7, 6, 9, 8, 9, 7, 7],
      cost: 380000,
      delivery: 10,
      compliance: 8.0,
      risk: "Medium",
      color: "#3b82f6"
    },
    {
      name: "Velocity Studios",
      scores: [6, 9, 8, 7, 6, 6, 9],
      cost: 410000,
      delivery: 6,
      compliance: 7.5,
      risk: "High",
      color: "#10b981"
    }
  ]);

  const handleSowPointChange = (index: number, value: string) => {
    const updated = [...sowPoints];
    updated[index] = value;
    setSowPoints(updated);
  };

  const addSowPoint = () => {
    setSowPoints([...sowPoints, "New Requirement"]);
    setVendors(vendors.map(v => ({
      ...v,
      scores: [...v.scores, Math.floor(Math.random() * 5) + 5]
    })));
  };

  const removeSowPoint = (index: number) => {
    if (sowPoints.length <= 3) return;
    setSowPoints(sowPoints.filter((_, i) => i !== index));
    setVendors(vendors.map(v => ({
      ...v,
      scores: v.scores.filter((_, i) => i !== index)
    })));
  };

  const radarData = sowPoints.map((point, i) => ({
    subject: point,
    "Nexus Creative": vendors[0].scores[i] || 5,
    "Global Media Hub": vendors[1].scores[i] || 5,
    "Velocity Studios": vendors[2].scores[i] || 5,
    fullMark: 10,
  }));

  const costData = vendors.map(v => ({
    name: v.name,
    cost: v.cost / 1000, // in thousands
  }));

  const [timelines, setTimelines] = useState<TimelineDate[]>([
    { label: "Clarifications Deadline", date: "May 12th, 2026" },
    { label: "Technical Bid Deadline", date: "May 19th, 2026" },
    { label: "Commercial Bid Deadline", date: "May 21st, 2026" },
    { label: "Evaluation Start Date", date: "May 22nd, 2026" },
    { label: "Negotiation Start Date", date: "May 27th, 2026" },
    { label: "Final Award Date", date: "June 2nd, 2026" },
  ]);

  const handleTimelineChange = (index: number, newDate: string) => {
    const updated = [...timelines];
    updated[index].date = newDate;
    setTimelines(updated);
  };

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { 
      id: 1, 
      name: "Strategy & Creative Development", 
      category: "Services", 
      description: "Launch strategy, audience segmentation, messaging framework, creative territory development and master campaign toolkit for a new kids health drink.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 2, 
      name: "TVC Development", 
      category: "Services", 
      description: "Development of flagship TV commercial concept and all pre-production creative required for global launch approvals.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 3, 
      name: "TVC Production", 
      category: "Services", 
      description: "End-to-end TVC shoot, post-production and delivery of master film and cutdowns for paid media use.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 4, 
      name: "Social Organic Content", 
      category: "Services", 
      description: "Organic social content strategy, monthly content calendar and asset adaptation for Meta, YouTube and TikTok.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 5, 
      name: "Social Paid Media Planning", 
      category: "Services", 
      description: "Paid social and video media planning across Meta, YouTube and TikTok for global launch period.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 6, 
      name: "Social Paid Media Buying & Optimization", 
      category: "Services", 
      description: "Campaign trafficking, paid media activation, optimization and performance reporting across Meta, YouTube and TikTok.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 7, 
      name: "Kids Advertising & Claims Compliance Review", 
      category: "Services", 
      description: "Legal and regulatory review of kids advertising content and product-related claims across launch assets and scripts.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
    { 
      id: 8, 
      name: "Launch Program Management", 
      category: "Services", 
      description: "Program management, stakeholder coordination, asset trafficking and master launch governance across all workstreams.", 
      hsnSac: "8471XX", 
      uom: "Lot" 
    },
  ]);

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    setLineItems(updated);
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-100 border-r border-slate-200 fixed h-full p-4 flex flex-col gap-6 z-50">
        <div className="px-2 py-4">
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">ETHEREAL</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Procurement</p>
        </div>

        <div className="flex items-center gap-3 px-3 py-4 bg-white/60 rounded-xl border border-white shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center overflow-hidden">
            <img 
              src="https://picsum.photos/seed/procure/100/100" 
              alt="Project" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Project Alpha</p>
            <p className="text-[9px] text-slate-500 font-medium">Status: In Progress</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button onClick={() => setCurrentStep('RFQ')} className="w-full text-left">
            <SidebarItem icon={FileEdit} label="RFQ Creation" active={currentStep === 'RFQ'} />
          </button>
          <button onClick={() => setCurrentStep('Vendor')} className="w-full text-left">
            <SidebarItem icon={CloudUpload} label="Vendor Upload" active={currentStep === 'Vendor'} />
          </button>
          <button onClick={() => setCurrentStep('Dashboard')} className="w-full text-left">
            <SidebarItem icon={BarChart3} label="Comparison Dashboard" active={currentStep === 'Dashboard'} />
          </button>
        </nav>

        <button className="w-full py-3 px-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-xs uppercase tracking-widest">
          New Request
        </button>

        <div className="pt-6 border-t border-slate-200 space-y-1">
          <SidebarItem icon={HelpCircle} label="Support" />
          <SidebarItem icon={Archive} label="Archive" />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            {currentStep === 'RFQ' ? 'Step A: RFQ Creation' : currentStep === 'Vendor' ? 'Step B: Vendor Upload' : 'Step C: Comparison Dashboard'}
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search procurement data..." 
                className="bg-slate-100 border-none rounded-full px-10 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Settings size={20} />
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-2" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">Ava Thompson</span>
                <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/ava/100/100" 
                    alt="User" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {currentStep === 'RFQ' ? (
            <>
              {/* Section 1: General Info */}
              <div className="grid grid-cols-1 gap-8">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">General Information</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Basic RFP details</p>
                    </div>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField label="Subject" icon={FileText} value="RFQ for global launch marketing services for new kids health drink" />
                    <InputField label="RFP Code" icon={Tag} value="RFQ-MKT-KIDS-GL-2026-001" />
                    <SelectField label="Sourcing Type" options={['RFQ', 'RFP', 'RFI']} defaultValue="RFQ" />
                    <SelectField label="Round" options={['Round 1', 'Round 2', 'Round 3']} defaultValue="Round 1" />
                    <SelectField label="Status" options={['Draft', 'Open', 'Closed']} defaultValue="Draft" />
                    <InputField label="Owner" icon={Users} value="Ava Thompson" />
                    <SelectField label="Currency" options={['USD ($)', 'EUR (€)', 'GBP (£)']} defaultValue="USD ($)" />
                    <InputField label="Requestor" icon={Building2} value="Global Brand Marketing Team" />
                    <InputField label="Department" icon={Briefcase} value="Marketing Procurement" />
                    <InputField label="Category" icon={Tag} value="Marketing Services" />
                  </div>
                </section>
              </div>

              {/* RFQ Timelines Section */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">RFQ Timelines</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Key dates and deadlines</p>
                  </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {timelines.map((t, idx) => (
                    <div key={t.label} className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{t.label}</label>
                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 group focus-within:border-primary/30 transition-all">
                        <Calendar size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text"
                          value={t.date}
                          onChange={(e) => handleTimelineChange(idx, e.target.value)}
                          className="bg-transparent border-none p-0 text-sm font-medium text-slate-700 w-full focus:ring-0 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>


              {/* Scope of Work Section */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Scope of Work</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Statement of Work defining scope, objectives, and deliverables</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 py-2 px-5 bg-primary text-white rounded-full text-[11px] font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                    <Sparkles size={14} />
                    AI Assist
                  </button>
                </div>

                <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <button className="text-xs font-black text-slate-400 hover:text-primary">H1</button>
                    <button className="text-xs font-black text-slate-400 hover:text-primary">H2</button>
                    <button className="text-xs font-black text-slate-400 hover:text-primary">H3</button>
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <div className="flex items-center gap-4 text-slate-400">
                    <Bold size={16} className="hover:text-primary cursor-pointer" />
                    <Italic size={16} className="hover:text-primary cursor-pointer" />
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <div className="flex items-center gap-4 text-slate-400">
                    <List size={16} className="hover:text-primary cursor-pointer" />
                    <ListOrdered size={16} className="hover:text-primary cursor-pointer" />
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <div className="flex items-center gap-4 text-slate-400">
                    <TableIcon size={16} className="hover:text-primary cursor-pointer" />
                    <ImageIcon size={16} className="hover:text-primary cursor-pointer" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium italic mb-4">
                      Define the key workstreams for this RFQ. These will be used for AI analysis and vendor benchmarking.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sowPoints.map((point, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 group focus-within:border-primary/30 transition-all"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                            {idx + 1}
                          </div>
                          <input 
                            type="text"
                            value={point}
                            onChange={(e) => handleSowPointChange(idx, e.target.value)}
                            className="bg-transparent border-none p-0 text-sm font-bold text-slate-700 w-full focus:ring-0 outline-none"
                          />
                          <button 
                            onClick={() => removeSowPoint(idx)}
                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Archive size={14} />
                          </button>
                        </motion.div>
                      ))}
                      <button 
                        onClick={addSowPoint}
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary/30 hover:text-primary transition-all group"
                      >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Add Workstream</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-center">
                  <button 
                    onClick={() => setIsScopeExpanded(!isScopeExpanded)}
                    className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                  >
                    {isScopeExpanded ? 'Show Less' : 'Show More'} 
                    {isScopeExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </section>

              {/* AI Analysis Section */}
              <section className="bg-white rounded-2xl p-8 border border-primary/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles size={120} className="text-primary" />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Bot size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">AI Scope of Work Analysis</h3>
                    <p className="text-xs text-slate-500 font-medium">Describe your project requirements for AI-driven questionnaire generation.</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <textarea 
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none resize-none transition-all"
                    placeholder="Paste your project brief here..."
                    defaultValue="Seeking an integrated marketing agency for the Southeast Asian launch of 'NutriKid', a fortified chocolate health drink for children aged 5-12. Project includes 360-degree creative development, TVC production, and social media management. Key compliance requirement: Kids Advertising & Claims Review for regional regulatory bodies."
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="flex items-center gap-2 py-4 px-10 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all group disabled:opacity-70"
                    >
                      {isGenerating ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Sparkles size={18} />
                        </motion.div>
                      ) : (
                        <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                      )}
                      {isGenerating ? 'Analyzing...' : 'Generate AI Questionnaires'}
                    </button>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Suggested Compliance Questionnaire</h4>
                    <span className="text-[10px] flex items-center gap-1.5 text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full">
                      <CheckCircle2 size={12} /> AI Suggested
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-ai p-6 rounded-2xl space-y-4 group hover:bg-primary/[0.08] transition-all cursor-pointer">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">How does your agency ensure compliance with regional 'Children's Food and Beverage Advertising Initiative' (CFBAI) guidelines for SEA?</p>
                      <div className="flex items-center gap-3">
                        <span className="bg-primary/20 text-primary text-[9px] px-2.5 py-1 rounded-md font-black tracking-widest">COMPLIANCE</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
                          <BookOpen size={12} /> Source Evidence
                        </span>
                      </div>
                    </div>
                    <div className="glass-ai p-6 rounded-2xl space-y-4 group hover:bg-primary/[0.08] transition-all cursor-pointer">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">Describe your process for securing 'Child Talent Safety' certifications during TVC production in varied local jurisdictions.</p>
                      <div className="flex items-center gap-3">
                        <span className="bg-primary/20 text-primary text-[9px] px-2.5 py-1 rounded-md font-black tracking-widest">SAFETY</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
                          <BookOpen size={12} /> Source Evidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Line Items Table */}
              <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Line Items (8 Services)</h3>
                  <button className="text-primary text-xs font-bold flex items-center gap-1.5 hover:underline transition-all">
                    <Plus size={14} /> Add New Row
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] w-12 text-center">#</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Product/Service Name</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Category</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Description</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">HSN/SAC</th>
                        <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">UOM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lineItems.map((item, idx) => (
                        <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                          <td className="px-6 py-4 text-center font-bold text-slate-400">{item.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-800">{item.name}</span>
                              <Search size={14} className="text-slate-300" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <select 
                                value={item.category}
                                onChange={(e) => handleLineItemChange(idx, 'category', e.target.value)}
                                className="w-full appearance-none bg-transparent border-none p-0 text-slate-600 font-medium focus:ring-0 outline-none cursor-pointer pr-6"
                              >
                                <option>Services</option>
                                <option>Goods / Hardware</option>
                                <option>Software / SaaS</option>
                                <option>Works</option>
                                <option>Contingency</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed max-w-md">{item.description}</td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.hsnSac}</td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <select 
                                value={item.uom}
                                onChange={(e) => handleLineItemChange(idx, 'uom', e.target.value)}
                                className="w-full appearance-none bg-transparent border-none p-0 text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer pr-6"
                              >
                                <option>Lot</option>
                                <option>EA (Each)</option>
                                <option>HR (Hour)</option>
                                <option>MD (Man-Day)</option>
                                <option>MO (Month)</option>
                                <option>% (Percentage)</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="flex justify-end items-center gap-6 py-12">
                <button className="px-10 py-4 rounded-full text-slate-500 font-bold hover:bg-slate-200 transition-all text-sm uppercase tracking-widest">
                  Save Draft
                </button>
                <button 
                  onClick={() => setCurrentStep('Vendor')}
                  className="px-12 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/30 hover:bg-primary-dim hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-sm uppercase tracking-widest"
                >
                  Proceed to Vendor Upload
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : currentStep === 'Vendor' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Vendor Upload Section */}
              <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-12 text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CloudUpload size={48} className="text-primary" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Upload Vendor Document</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Select or drag and drop your vendor's proposal, technical bid, or commercial document for AI-powered analysis.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CloudUpload size={32} className="text-slate-400 group-hover:text-primary mb-4 transition-colors" />
                        <p className="mb-2 text-sm text-slate-700 font-bold">
                          <span className="text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">PDF, DOCX, or XLSX (MAX. 10MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setUploadedFile(e.target.files[0]);
                            setAiAnalysis(null);
                          }
                        }} 
                      />
                    </label>
                  </div>

                  {uploadedFile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <FileText size={24} className="text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">{uploadedFile.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setUploadedFile(null)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Archive size={20} />
                      </button>
                    </motion.div>
                  )}

                  {uploadedFile && (
                    <div className="pt-8">
                      <button 
                        onClick={() => {
                          setIsAnalyzing(true);
                          // Simulating AI Analysis with kimi-k2-thinking:cloud via Ollama
                          setTimeout(() => {
                            setIsAnalyzing(false);
                            setAiAnalysis(`### AI Analysis Report - ${uploadedFile.name}
**Model:** kimi-k2-thinking:cloud (via Ollama)

#### Executive Summary
The vendor proposal demonstrates a high level of technical competence in digital marketing and video production. They have addressed all 8 RFQ line items with specific deliverables.

#### Key Strengths
- **Regional Expertise:** Strong track record in SEA markets, particularly in compliance for kids' advertising.
- **Integrated Approach:** Seamless transition between strategy and execution.
- **Cost Efficiency:** Competitive pricing for TVC production with clear breakdown of pass-through costs.

#### Potential Risks
- **Timeline:** The proposed schedule for TVC production is tight (4 weeks vs 6 weeks recommended).
- **Resource Allocation:** Heavy reliance on a single creative director for both strategy and TVC development.

#### Recommendation
Proceed to technical interview with a focus on resource redundancy and timeline buffer management.`);
                          }, 3000);
                        }}
                        disabled={isAnalyzing}
                        className="px-12 py-5 bg-gradient-to-r from-primary to-primary-dim text-white rounded-full font-black shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 mx-auto disabled:opacity-70"
                      >
                        {isAnalyzing ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Sparkles size={24} />
                          </motion.div>
                        ) : (
                          <Bot size={24} />
                        )}
                        {isAnalyzing ? 'Analyzing with Kimi AI...' : 'Analyze with AI'}
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {aiAnalysis && (
                <motion.section 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles size={160} className="text-primary" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary/20 p-3 rounded-2xl">
                      <Bot size={32} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Kimi AI Thinking Report</h3>
                      <p className="text-xs text-slate-400 font-medium">kimi-k2-thinking:cloud • Analysis Complete</p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                      {aiAnalysis}
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end gap-4">
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
                      Download Report
                    </button>
                    <button 
                      onClick={() => setCurrentStep('Dashboard')}
                      className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                      Proceed to Comparison Dashboard
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.section>
              )}

              <div className="flex justify-start py-8">
                <button 
                  onClick={() => setCurrentStep('RFQ')}
                  className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-all text-sm uppercase tracking-widest"
                >
                  <ArrowRight size={18} className="rotate-180" />
                  Back to RFQ Creation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              {/* Dashboard Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scenario Selector */}
                <section className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Target size={24} className="text-primary" />
                    <h3 className="text-lg font-bold text-slate-800">Scenario Simulator</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Toggle between different procurement priorities to see how vendor rankings shift dynamically.
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'Balanced', label: 'Balanced Scorecard', icon: LayoutDashboard },
                      { id: 'Cost', label: 'Lowest Total Cost', icon: DollarSign },
                      { id: 'Speed', label: 'Fastest Delivery', icon: Clock },
                      { id: 'Compliance', label: 'Highest Compliance', icon: ShieldCheck },
                    ].map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => setActiveScenario(scenario.id as any)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          activeScenario === scenario.id 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <scenario.icon size={18} />
                          <span className="text-sm font-bold">{scenario.label}</span>
                        </div>
                        {activeScenario === scenario.id && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="bg-primary/5 rounded-2xl p-4 flex items-start gap-3">
                      <Bot size={20} className="text-primary mt-1" />
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <span className="font-bold text-primary">AI Insight:</span> In the <span className="font-bold">{activeScenario}</span> scenario, the recommendation shifts towards {activeScenario === 'Cost' ? 'Global Media Hub' : activeScenario === 'Speed' ? 'Velocity Studios' : 'Nexus Creative'}.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Benchmarking Radar */}
                <section className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={24} className="text-primary" />
                      <h3 className="text-lg font-bold text-slate-800">Vendor Benchmarking (SOW Points)</h3>
                    </div>
                    <div className="flex gap-4">
                      {vendors.map(v => (
                        <div key={v.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{v.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                        <Radar
                          name="Nexus Creative"
                          dataKey="Nexus Creative"
                          stroke="#7049b3"
                          fill="#7049b3"
                          fillOpacity={0.4}
                        />
                        <Radar
                          name="Global Media Hub"
                          dataKey="Global Media Hub"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Velocity Studios"
                          dataKey="Velocity Studios"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Cost Range', value: '$380k - $450k', icon: DollarSign, trend: 'Avg: $413k' },
                  { label: 'Avg. Delivery Time', value: '8.0 Weeks', icon: Clock, trend: '-12% vs Market' },
                  { label: 'Compliance Score', value: '8.3 / 10', icon: ShieldCheck, trend: 'High Confidence' },
                  { label: 'Risk Assessment', value: 'Low - Med', icon: AlertTriangle, trend: 'Manageable' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <stat.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-slate-800">{stat.value}</p>
                      <p className="text-[9px] font-bold text-primary">{stat.trend}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost vs Quality Analysis */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <PieChart size={24} className="text-primary" />
                    <h3 className="text-lg font-bold text-slate-800">Cost Analysis (in $k)</h3>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData} layout="vertical" margin={{ left: 40, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                      />
                      <Bar dataKey="cost" radius={[0, 20, 20, 0]} barSize={32}>
                        {costData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={vendors[index].color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Award Recommendation Section */}
              <section className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Trophy size={200} className="text-primary" />
                </div>

                <div className="relative z-10 space-y-12">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center">
                      <Bot size={36} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">AI Award Recommendation</h3>
                      <p className="text-slate-400 font-medium">Based on {activeScenario} Scenario Analysis</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* The Recommendation */}
                    <div className="space-y-8">
                      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/20 px-4 py-2 rounded-full">Primary Suggestion</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Confidence:</span>
                            <span className="text-xs font-black text-emerald-400">94%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-4xl font-black text-white">
                            {activeScenario === 'Cost' ? 'Split Award' : 'Nexus Creative'}
                          </h4>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {activeScenario === 'Cost' 
                              ? 'Strategic split between Global Media Hub (Media) and Velocity Studios (Production) to minimize total expenditure while maintaining speed.'
                              : 'Recommended as the single integrated partner due to superior creative scores and exceptional compliance alignment.'}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Trade-off</p>
                            <p className="text-xs font-bold text-slate-200">
                              {activeScenario === 'Cost' ? 'Increased coordination overhead' : 'Premium pricing (+15% vs lowest)'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Risk</p>
                            <p className="text-xs font-bold text-slate-200">
                              {activeScenario === 'Cost' ? 'Inconsistent brand voice' : 'Resource availability in Q3'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                          <DollarSign size={20} className="mx-auto mb-2 text-primary" />
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Saving</p>
                          <p className="text-lg font-black text-white">$42,000</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                          <Clock size={20} className="mx-auto mb-2 text-primary" />
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Time Buffer</p>
                          <p className="text-lg font-black text-white">12 Days</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                          <ShieldCheck size={20} className="mx-auto mb-2 text-primary" />
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compliance</p>
                          <p className="text-lg font-black text-white">98.2%</p>
                        </div>
                      </div>
                    </div>

                    {/* Reasoning & Scenarios */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Why this recommendation?</h5>
                        <ul className="space-y-4">
                          {[
                            "Superior alignment with Kids Advertising Compliance (SOW Point 6).",
                            "Proven track record in SEA market launches with similar scale.",
                            "Highest 'Program Management' score ensures low coordination risk.",
                            "Proprietary AI-driven media optimization tools included in base fee."
                          ].map((reason, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle2 size={12} className="text-primary" />
                              </div>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle size={18} className="text-primary" />
                          <h5 className="text-sm font-bold text-white">Alternative: Split Award Scenario</h5>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          If budget is constrained by &gt;10%, we recommend awarding <span className="text-white font-bold">TVC Production</span> to Velocity Studios and <span className="text-white font-bold">Media Planning</span> to Global Media Hub.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">
                          View Split Award Details <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Final Award Decision */}
              <section className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center space-y-8">
                <div className="max-w-2xl mx-auto space-y-4">
                  <h3 className="text-2xl font-black text-slate-800">Ready to Finalize Award?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Once finalized, the system will generate the award letters and contract drafts based on the selected scenario and vendor(s).
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <button className="px-12 py-5 bg-slate-100 text-slate-600 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Export Full Report
                  </button>
                  <button className="px-16 py-5 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4">
                    Confirm Award Selection
                    <Trophy size={20} />
                  </button>
                </div>
              </section>

              <div className="flex justify-start py-8">
                <button 
                  onClick={() => setCurrentStep('Vendor')}
                  className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-all text-sm uppercase tracking-widest"
                >
                  <ArrowRight size={18} className="rotate-180" />
                  Back to Vendor Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Action */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-primary to-primary-container text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
      >
        <Bot size={32} className="group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
}
