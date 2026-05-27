import React from "react";
import { 
  TreePine, 
  TrendingUp, 
  Award, 
  Download, 
  Share2, 
  Target, 
  ChevronDown,
  FileText
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar
} from "recharts";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import { ImpactCard } from "../../../shared/components/ui/ImpactCard";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#64748b'];

export function ImpactReportPage() {
  const { user, stats, analytics } = useUser();
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [sharedFile, setSharedFile] = React.useState<File | null>(null);
  const [isPreparing, setIsPreparing] = React.useState(false);

  // SANITIZER ENGINE
  const sanitizeStr = (str: string) => {
    if (!str || typeof str !== 'string') return str;
    // Enhanced regex to handle nested parentheses up to 1 level for funcs like color(oklch(...))
    return str.replace(/(oklch|oklab|display-p3|color|hwb)\((?:[^()]*|\([^()]*\))*\)/g, (match) => {
      const lightnessMatch = match.match(/[\d.]+/);
      const l = lightnessMatch ? parseFloat(lightnessMatch[0]) : 0.5;
      if (match.includes('oklch') || match.includes('oklab')) {
         return l > 0.8 ? '#f8fafc' : l > 0.4 ? '#10b981' : '#064e3b';
      }
      return '#10b981';
    });
  };

  const generatePDFBlob = async (): Promise<Blob> => {
    if (!reportRef.current) return new Blob();
    
    // 1. CREATE A LIVE CLONE ATTACHED TO THE DOM
    // This allows getComputedStyle to work accurately.
    const original = reportRef.current;
    const clone = original.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = original.offsetWidth + 'px';
    clone.style.zIndex = '-9999';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    try {
      // 2. SANITIZE EVERY ELEMENT IN THE LIVE CLONE
      const elements = Array.from(clone.getElementsByTagName('*'));
      elements.forEach(node => {
        const el = node as any;
        if (!el || !(el instanceof HTMLElement || el instanceof SVGElement)) return;
        
        const computed = window.getComputedStyle(el);
        const style = el.style;
        
        // Inline CRITICAL styles that html2canvas reads
        const props = [
          'color', 'backgroundColor', 'borderColor', 'fill', 'stroke',
          'opacity', 'visibility', 'boxShadow', 'borderRadius', 'display'
        ];
        
        props.forEach(p => {
          const val = (computed as any)[p];
          if (val) (style as any)[p] = sanitizeStr(val);
        });
        
        // Freeze animations
        style.animation = 'none';
        style.transition = 'none';
        if (computed.opacity === '0') style.opacity = '1';

        // Fix SVG attributes
        if (el instanceof SVGElement) {
           ['fill', 'stroke', 'stop-color'].forEach(attr => {
              const val = el.getAttribute(attr);
              if (val) el.setAttribute(attr, sanitizeStr(val));
           });
        }
      });

      // 3. CAPTURE THE PRE-SANITIZED CLONE
      const canvas = await html2canvas(clone, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
           // One final check on style tags in the clone doc
           const styles = Array.from(clonedDoc.getElementsByTagName('style'));
           styles.forEach(s => {
              s.innerHTML = sanitizeStr(s.innerHTML);
           });
           // Remove all external links that might contain oklch
           clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      return pdf.output('blob');
    } finally {
      // Cleanup the live clone
      document.body.removeChild(clone);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      if (!reportRef.current) return;
      const pdfBlob = await generatePDFBlob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ForestGift_Report_${user?.id || 'User'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (sharedFile && navigator.share) {
      try {
        await navigator.share({
          title: 'ForestGift Impact Report',
          text: `Check out my ForestGift Impact Report! 🌳 Level ${Math.floor((stats?.totalTrees || 0) / 10) + 1} reached.`,
          url: `https://forestgift.in/impact/${user?.id || 'USR001'}`,
          files: [sharedFile]
        });
        return;
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }

    setIsPreparing(true);
    try {
      const pdfBlob = await generatePDFBlob();
      const file = new File([pdfBlob], "Impact_Report.pdf", { type: "application/pdf" });
      setSharedFile(file);
    } catch (err) {
      console.error("Preparation failed:", err);
    } finally {
      setIsPreparing(false);
    }
  };

  if (!analytics) return <div className="p-20 text-center font-bold animate-pulse text-emerald-600 uppercase tracking-widest">Compiling Scientific Data...</div>;

  return (
    <div ref={reportRef} className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 bg-white">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none uppercase">IMPACT REPORT</h1>
           <p className="text-sm text-gray-500 font-medium italic mt-2">Your verified environmental contribution analysis.</p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactCard title="Trees Planted" value={stats?.totalTrees || "0"} icon={TreePine} color="green" />
        <ImpactCard title="CO2 Absorbed" value={`${stats?.carbonOffset || "0"}kg`} icon={TrendingUp} color="blue" />
        <ImpactCard title="O2 Produced" value={`${stats?.oxygenProduced || "0"}kg`} icon={Target} color="emerald" />
        <ImpactCard title="Global Rank" value={user?.rank || "UNRANKED"} icon={Award} color="purple" />
      </div>

      {/* CONSISTENCY STREAK SECTION - Gamification added as per user request */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="md:col-span-2 p-8 border-none shadow-sm relative overflow-hidden bg-white group transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-3xl">🔥</span>
                     <h3 className="text-2xl font-bold text-gray-900 uppercase">Consistency Streak</h3>
                  </div>
                  <p className="text-sm font-bold text-amber-600 uppercase tracking-widest italic">You've planted trees for {analytics.monthlyData.filter(m => m.trees > 0).length} consecutive months!</p>
               </div>
               <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase px-4 py-1 mt-1">GOLDEN RECORD</Badge>
               </div>
            </div>

            <div className="flex justify-between items-center py-6 border-y border-gray-50 mb-8">
               {analytics.monthlyData.map((m, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                     <span className="text-[10px] font-bold text-gray-400 uppercase">{m.month}</span>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${m.trees > 0 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 scale-110" : "bg-gray-100 text-gray-300"}`}>
                        {m.trees > 0 ? "✓" : ""}
                     </div>
                  </div>
               ))}
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <span className="text-xl">❄️</span>
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">1 streak freeze available</p>
               </div>
               <div className="flex gap-4">
                  <StreakBadgeMini label="3 Mo" icon="⭐️" achieved />
                  <StreakBadgeMini label="6 Mo" icon="🏆" achieved={analytics.monthlyData.filter(m => m.trees > 0).length >= 6} />
                  <StreakBadgeMini label="1 Yr" icon="👑" achieved={analytics.monthlyData.filter(m => m.trees > 0).length >= 12} />
               </div>
            </div>
         </Card>

         <Card className="p-8 border-none shadow-sm flex flex-col justify-center items-center text-center bg-emerald-950 text-white relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <TrendingUp className="w-64 h-64 -mr-32 -mb-32 absolute bottom-0 right-0" />
            </div>
            <div className="relative z-10 space-y-4">
               <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Target className="w-8 h-8 text-emerald-400" />
               </div>
               <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">Momentum</h4>
               <p className="text-3xl font-bold italic tracking-tighter">+{Math.min(100, analytics.monthlyData.filter(m => m.trees > 0).length * 15)}%</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 opacity-70">Growth multiplier applied to your next plantation</p>
            </div>
         </Card>
      </div>

      {/* Main Charts - Row 1 */}
      <div className="grid grid-cols-1 gap-6">
         <Card className="p-8 border-none shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase">Growth Over Time</h3>
                  <p className="text-xs text-gray-400 font-medium italic">Trees planted and carbon offset (Last 6 Months)</p>
               </div>
               <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase px-4 py-1.5">Last 6 Months</Badge>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="99%" height={300}>
                  <LineChart data={analytics.monthlyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 800 }}
                        itemStyle={{ padding: '2px 0' }}
                     />
                     <Line type="monotone" dataKey="trees" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Trees Planted" />
                     <Line type="monotone" dataKey="co2" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="CO2 Offset (kg)" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Biodiversity & Monthly Bars - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-8 border-none shadow-sm min-h-[380px]">
            <h3 className="text-lg font-bold text-gray-900 uppercase mb-8 text-center">Species Distribution</h3>
            <div className="h-[250px] w-full relative">
               <ResponsiveContainer width="99%" height={250}>
                  <PieChart>
                     <Pie 
                        data={analytics.speciesDistribution} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                     >
                        {analytics.speciesDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-gray-900">{stats?.totalTrees || 0}</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 text-center justify-center">
               {analytics.speciesDistribution.slice(0, 4).map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                     <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest truncate">{s.name} ({s.value})</span>
                  </div>
               ))}
            </div>
         </Card>

         <Card className="p-8 border-none shadow-sm min-h-[380px]">
            <h3 className="text-lg font-bold text-gray-900 uppercase mb-8">Monthly Impact</h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="99%" height={250}>
                  <BarChart data={analytics.monthlyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                     <Tooltip />
                     <Bar dataKey="trees" fill="#3b82f6" radius={[4, 4, 0, 0]} name="CO2 Saved" />
                     <Bar dataKey="trees" fill="#10b981" radius={[4, 4, 0, 0]} name="O2 Added" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Achievement Badges Section */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 uppercase">Impact Level: {Math.floor((stats?.totalTrees || 0) / 10) + 1}</h3>
            <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] uppercase px-4 py-1.5 flex items-center shadow-sm">
               <Award className="w-3 h-3 mr-2" /> Elite Guardian
            </Badge>
         </div>
         <Card className="p-8 border-none shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {analytics.achievements.map((ach, i) => (
                  <div key={i} className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 group hover:border-emerald-200 transition-all cursor-pointer">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all">
                           <Award className={`w-5 h-5 ${Number(ach.current) >= Number(ach.target) ? "text-emerald-600" : "text-gray-300"}`} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ach.current} / {ach.target}</span>
                     </div>
                     <h4 className="font-bold text-gray-900 uppercase text-[11px] mb-1 tracking-tight">{ach.title}</h4>
                     <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-3 shadow-inner">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${Math.min(100, (Number(ach.current) / Number(ach.target)) * 100)}%` }}
                           className={`h-full ${Number(ach.current) >= Number(ach.target) ? "bg-amber-400" : "bg-emerald-500"} rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      {/* Share Section & Marketing Brochure Trigger */}
      <div className="bg-emerald-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-200 transition-transform hover:scale-[1.01] duration-500">
         <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-48 h-48 bg-white/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400 rounded-full blur-[100px]" />
         </div>
         
         <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="space-y-3">
               <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Share Your Impact</h2>
               <p className="text-emerald-50 text-base font-medium italic opacity-90 px-4">Download your professional carbon brochure and showcase your environmental leadership to the world.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 pt-4">
               <Button 
                  onClick={handleShare}
                  disabled={isPreparing || isGenerating}
                  className={`${sharedFile ? "bg-amber-500 hover:bg-amber-600" : "bg-white"} text-emerald-700 hover:bg-emerald-50 font-bold text-[11px] uppercase tracking-widest px-10 py-7 rounded-2xl shadow-2xl flex items-center group w-full md:w-auto disabled:opacity-50`}
               >
                  {isPreparing ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" /> : <Share2 className={`w-5 h-5 mr-3 ${sharedFile ? "text-white" : "group-hover:rotate-12"} transition-transform`} />} 
                  {isPreparing ? "Generating PDF..." : sharedFile ? "Send Report Now" : "Prepare to Share"}
               </Button>
               <Button 
                  variant="outline"
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="bg-emerald-700/30 border-emerald-400/50 text-white hover:bg-emerald-700 font-bold text-[11px] uppercase tracking-widest px-10 py-7 rounded-2xl flex items-center group w-full md:w-auto disabled:opacity-50"
               >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" /> : <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
                  {isGenerating ? "Processing..." : "Impact Brochure"}
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}

const StreakBadgeMini = ({ label, icon, achieved }: any) => (
  <div className={`flex flex-col items-center gap-1 transition-all ${achieved ? "opacity-100 scale-110" : "opacity-30 grayscale"}`}>
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${achieved ? "bg-amber-50 shadow-sm border border-amber-100" : "bg-gray-100"}`}>
        {icon}
     </div>
     <p className="text-[8px] font-bold uppercase tracking-widest text-gray-900">{label}</p>
  </div>
);
