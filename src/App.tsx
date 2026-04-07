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
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [isScopeExpanded, setIsScopeExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const lineItems: LineItem[] = [
    { id: 1, name: "Strategy & Creative Development", category: "Creative Services", description: "End-to-end brand strategy...", hsnSac: "998311", uom: "Fixed Fee" },
    { id: 2, name: "TVC Development", category: "Video Production", description: "Storyboarding and scripting...", hsnSac: "998313", uom: "Project" },
    { id: 3, name: "TVC Production", category: "Video Production", description: "Filming and post-production...", hsnSac: "998313", uom: "Project" },
    { id: 4, name: "Social Organic Content", category: "Digital Marketing", description: "Monthly content calendar...", hsnSac: "998314", uom: "Month" },
    { id: 5, name: "Social Paid Media Planning", category: "Media Services", description: "Strategic media targeting...", hsnSac: "998315", uom: "Fixed Fee" },
    { id: 6, name: "Social Paid Media Buying & Opt.", category: "Media Services", description: "Daily ad management...", hsnSac: "998315", uom: "Month" },
    { id: 7, name: "Kids Advertising & Claims Review", category: "Legal/Compliance", description: "Specialist compliance audit...", hsnSac: "998316", uom: "Fixed Fee" },
    { id: 8, name: "Launch Program Management", category: "Project Mgmt", description: "Overall coordination...", hsnSac: "998317", uom: "Fixed Fee" },
  ];

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
          <SidebarItem icon={FileEdit} label="RFQ Creation" active />
          <SidebarItem icon={CloudUpload} label="Vendor Upload" />
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
            Step A: RFQ Creation
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
                      <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{item.category}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{item.description}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.hsnSac}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.uom}</td>
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
            <button className="px-12 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/30 hover:bg-primary-dim hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-sm uppercase tracking-widest">
              Proceed to Vendor Upload
              <ArrowRight size={18} />
            </button>
          </div>
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
