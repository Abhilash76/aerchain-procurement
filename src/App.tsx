/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
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
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { extractContent } from './utils/documentParser';
import { DocumentViewer } from './components/DocumentViewer';
import { CitationsRenderer } from './components/CitationsRenderer';

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

interface Question {
  id: number;
  text: string;
  tag: string;
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
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
  const [currentStep, setCurrentStep] = useState<'RFQ' | 'Vendor'>('RFQ');
  const [isScopeExpanded, setIsScopeExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<{ type: string, value: string | number } | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const [timelines, setTimelines] = useState<TimelineDate[]>([
    { label: "Clarifications Deadline", date: "May 12th, 2026" },
    { label: "Technical Bid Deadline", date: "May 19th, 2026" },
    { label: "Commercial Bid Deadline", date: "May 21st, 2026" },
    { label: "Evaluation Start Date", date: "May 22nd, 2026" },
    { label: "Negotiation Start Date", date: "May 27th, 2026" },
    { label: "Final Award Date", date: "June 2nd, 2026" },
  ]);

  const [projectBrief, setProjectBrief] = useState("Seeking an integrated marketing agency for the Southeast Asian launch of 'NutriKid', a fortified chocolate health drink for children aged 5-12. Project includes 360-degree creative development, TVC production, and social media management. Key compliance requirement: Kids Advertising & Claims Review for regional regulatory bodies.");
  const [aiQuestions, setAiQuestions] = useState<Question[]>([
    { id: 1, text: "How does your agency ensure compliance with regional 'Children's Food and Beverage Advertising Initiative' (CFBAI) guidelines for SEA?", tag: "COMPLIANCE" },
    { id: 2, text: "Describe your process for securing 'Child Talent Safety' certifications during TVC production in varied local jurisdictions.", tag: "SAFETY" }
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

  const handleGenerateAI = async () => {
    if (!projectBrief.trim()) return;
    setIsGenerating(true);
    try {
      const OLLAMA_URL = "http://localhost:11434/api/chat";
      const MODEL_NAME = "kimi-k2-thinking:cloud";

      const prompt = `Based on the following project brief, generate 4 critical procurement questionnaire questions (maximum 2 sentences each) that a vendor must answer. 
Focus on technical methodology, compliance, and risk management.
Format the response as a JSON array of objects with keys 'text' and 'tag' (short one-word category).

PROJECT BRIEF:
${projectBrief}

Example format:
[
  {"text": "How do you handle X?", "tag": "TECHNICAL"},
  ...
]`;

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: 'user', content: prompt }],
          stream: false
        })
      });

      if (!response.ok) throw new Error("Ollama connection failed");

      const data = await response.json();
      const content = data.message.content;
      
      const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setAiQuestions(parsed.map((q: any, i: number) => ({ 
          id: Date.now() + i, 
          text: q.text, 
          tag: q.tag.toUpperCase() 
        })));
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Failed to generate AI questions. Ensure Ollama is running with the correct model.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);

    try {
      // Step 1: Extract text from document
      console.log(`Extracting content from ${uploadedFile.name}...`);
      const documentText = await extractContent(uploadedFile);

      // Step 2: Call Ollama with kimi-k2-thinking:cloud
      const OLLAMA_URL = "http://localhost:11434/api/chat";
      const MODEL_NAME = "kimi-k2-thinking:cloud";

      console.log(`Analyzing document with ${MODEL_NAME}...`);

      const prompt = `Analyze the following procurement document (vendor proposal/technical bid). 

IMPORTANT INSTRUCTIONS:
1. Provide an executive summary of the proposal.
2. For each of the following Line Items, extract specific points regarding COST, METHODS, and COMPLIANCE STRATEGIES if mentioned:
${lineItems.map(item => `- ${item.name}: ${item.description}`).join('\n')}

3. Highlight any potential risks or areas requiring clarification.

CITATION RULE:
Every time you make a statement derived from the document, you MUST cite the source using the appropriate format:
- PDF: (Page X)
- PPTX: (Slide X)
- XLSX: (Sheet "Name")
- DOCX: (Section X)
Use the [PAGE: X], [SLIDE: X], [SHEET: X], and [SECTION: X] markers in the text below to identify the sources.

DOCUMENT TEXT:
${documentText.substring(0, 20000)} 
`;

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: 'user', content: prompt }],
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setAiAnalysis(data.message.content);

    } catch (error) {
      console.error("Analysis Error:", error);
      alert(`AI Analysis Failed: ${error instanceof Error ? error.message : "Unknown error"}\n\nEnsure Ollama is running with OLLAMA_ORIGINS="*" and the model is pulled.`);
    } finally {
      setIsAnalyzing(false);
    }
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
          <SidebarItem icon={BarChart3} label="Comparison Dashboard" />
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
            {currentStep === 'RFQ' ? 'Step A: RFQ Creation' : 'Step B: Vendor Upload'}
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
                  <motion.div
                    animate={{ height: isScopeExpanded ? 'auto' : '150px' }}
                    className="w-full bg-slate-50/50 rounded-xl p-6 border border-slate-100 overflow-hidden relative"
                  >
                    <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                      <p>The selected vendor(s) will support the global launch of a new kids health drink across strategy, creative development, film production, social activation and compliance review. The scope is intentionally structured to allow either a single integrated award or a multi-vendor award by workstream.</p>
                      <p><strong>1. Strategy & Creative Development:</strong> Develop launch strategy, audience understanding, positioning, campaign idea, messaging architecture and master visual direction suitable for parents, families and child-safe communication environments. Deliverables include strategic narrative, creative territory options, key visuals, copy routes and channel adaptation guidance.</p>
                      <p><strong>2. TVC Development:</strong> Create the flagship film idea and all pre-production materials including scripts, storyboard, animatic, packshot plan, supers and production approach. Concepts must be suitable for a kids/family product and avoid unsupported product or health claims.</p>
                      <p><strong>3. TVC Production:</strong> Execute end-to-end film production, including pre-production, casting, shoot, post-production, finishing and final delivery of master and cutdown assets. Vendors must account for child talent safety, usage rights, market-ready master files and trafficking-ready outputs.</p>
                      <p><strong>4. Social Organic:</strong> Build a launch-phase organic social content plan for Meta, YouTube and TikTok. Deliver content calendars, platform-adapted assets, copy and publishing guidance aligned to the campaign idea and local sensitivities for child-directed communications.</p>
                      <p><strong>5. Social Paid:</strong> Provide paid media planning and/or activation services across Meta, YouTube and TikTok. Plans should prioritize age-appropriate placements, parent/co-viewing audiences, launch objectives, reporting cadence and optimization logic. If media buying is proposed, agency fees must be clearly separated from pass-through media spend.</p>
                      <p><strong>6. Kids Advertising & Claims Compliance Review:</strong> Review scripts, visuals, videos, copy and product-related claims against applicable advertising standards, child-marketing restrictions, nutrition/health claim guardrails and platform policies. Compliance notes should be practical, market-aware and timed to avoid launch delay.</p>
                      <p><strong>7. Program Management:</strong> Manage project timelines, approvals, stakeholder coordination, version control and final asset delivery across all awarded workstreams.</p>
                      <p>All vendors must clearly specify what is included, excluded, dependent on client inputs and subject to third-party pass-through costs. Commercial submissions should map directly to the 8 RFQ line items and maintain the same line-item structure in the response.</p>
                    </div>
                    {!isScopeExpanded && <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-50 to-transparent" />}
                  </motion.div>
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
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
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
                      {isGenerating ? 'Generating...' : 'Generate AI Questionnaires'}
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
                    {aiQuestions.map((q) => (
                      <motion.div 
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-ai p-6 rounded-2xl space-y-4 group hover:bg-primary/[0.08] transition-all cursor-pointer"
                      >
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">{q.text}</p>
                        <div className="flex items-center gap-3">
                          <span className="bg-primary/20 text-primary text-[9px] px-2.5 py-1 rounded-md font-black tracking-widest">{q.tag}</span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
                            <BookOpen size={12} /> Source Evidence
                          </span>
                        </div>
                      </motion.div>
                    ))}
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
          ) : (
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
                            setActiveTarget(null);
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
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="px-12 py-5 bg-primary text-white rounded-full font-black shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 mx-auto disabled:opacity-70"
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
                        {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI'}
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
                    {/* Left Side: AI Report */}
                    <div className="prose prose-invert max-w-none text-slate-300 space-y-6 overflow-y-auto max-h-[800px] pr-4 custom-scrollbar">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 leading-relaxed font-sans text-sm">
                        <CitationsRenderer 
                          content={aiAnalysis} 
                          onCitationClick={(target) => setActiveTarget(target)} 
                        />
                      </div>
                    </div>

                    {/* Right Side: Document Preview */}
                    <div className="h-[800px]">
                      {uploadedFile && (
                        <DocumentViewer 
                          file={uploadedFile} 
                          activeTarget={activeTarget} 
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end gap-4">
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
                      Download Report
                    </button>
                    <button className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all">
                      Share with Team
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
