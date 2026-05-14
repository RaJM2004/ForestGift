import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Icon } from '../../shared/components/UI';

interface CertificateModalProps {
  user: any;
  submission: any;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ user, submission, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      // Ensure all images and fonts are loaded
      await document.fonts.ready;
      
      const element = certificateRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        logging: false,
        onclone: (clonedDoc) => {
          const sanitize = (str: string) => str.replace(/(oklch|oklab|display-p3|color\(|hwb\([^)]+\))/g, '#064e3b');
          
          // 1. Remove preview scale transform
          const previewContainer = clonedDoc.querySelector('.preview-scale-container') as HTMLDivElement;
          if (previewContainer) {
            previewContainer.style.transform = 'none';
          }

          // 2. Sanitize all style tags
          const styleTags = Array.from(clonedDoc.getElementsByTagName('style'));
          styleTags.forEach(tag => {
            if (tag.textContent) {
              tag.textContent = sanitize(tag.textContent);
            }
          });

          // 3. Sanitize all elements for inline styles and SVG presentation attributes
          const allElements = Array.from(clonedDoc.getElementsByTagName('*'));
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style && htmlEl.style.cssText) {
               if (/(oklch|oklab|display-p3|color\(|hwb\()/.test(htmlEl.style.cssText)) {
                  htmlEl.style.cssText = sanitize(htmlEl.style.cssText);
               }
            }
            ['fill', 'stroke', 'stop-color'].forEach(attr => {
              const val = htmlEl.getAttribute(attr);
              if (val && /(oklch|oklab|display-p3|color\(|hwb\()/.test(val)) {
                htmlEl.setAttribute(attr, sanitize(val));
              }
            });
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `ForestGift-Official-Certificate-${user?.name || 'Achievement'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Certificate generation failed:", error);
      alert("Failed to generate certificate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const scale = typeof window !== 'undefined' ? Math.max(0.2, Math.min(0.85, (window.innerWidth - 32) / 1123)) : 0.85;
  const marginLossY = 794 * (1 - scale);
  
  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none" />
      
      {/* Scrollable Content Layer */}
      <div className="fixed inset-0 z-[2005] flex flex-col items-center justify-start py-8 px-2 md:px-8 overflow-y-auto overflow-x-hidden animate-in fade-in duration-500 pb-40">
        <div className="w-full flex-none flex flex-col items-center justify-start min-h-max">
        <div className="preview-scale-container relative w-fit h-fit overflow-hidden rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.1)] border border-white/20" style={{ transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: `-${marginLossY}px` }}>
          <div 
            ref={certificateRef}
            style={{ 
              position: 'relative',
              width: '1123px', 
              minHeight: '794px', 
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              userSelect: 'none',
              boxShadow: '0 60px 120px rgba(0,0,0,0.8)',
              border: '4px solid #d4af3730'
            }} 
          >
            {/* Main Ornate Background */}
            <div style={{ position: 'absolute', inset: '0', zIndex: '0', pointerEvents: 'none' }}>
                <img src="/cert_bg.png" style={{ width: '100%', height: '100%', objectFit: 'fill' }} alt="" crossOrigin="anonymous" />
            </div>

            <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: '10', justifyContent: 'space-between', padding: '48px 64px 32px 64px' }}>
              {/* Header Area */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '128px', marginBottom: '16px' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '-64px', marginBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                     <img src="/forest_dept_logo_premium.png" style={{ height: '128px', objectFit: 'contain' }} alt="MP Forest Dept" />
                   </div>
                   <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                     <img src="/forest_gift_logo.png" style={{ height: '112px', objectFit: 'contain' }} alt="ForestGift" />
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ color: '#022c22', fontSize: '72px', fontWeight: '900', letterSpacing: '0.25em', textTransform: 'uppercase', lineHeight: '1', fontFamily: "'Playfair Display', serif", margin: '0 0 24px 0' }}>
                    Certificate
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ height: '2px', width: '96px', backgroundColor: 'rgba(6, 78, 59, 0.1)' }}></div>
                     <p style={{ color: '#064e3b', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.6em', fontStyle: 'italic', fontFamily: "'Inter', sans-serif", margin: '0 32px' }}>
                       Official Achievement
                     </p>
                     <div style={{ height: '2px', width: '96px', backgroundColor: 'rgba(6, 78, 59, 0.1)' }}></div>
                  </div>
                </div>
              </div>

              {/* Body Area */}
              <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 0 48px 0' }}>
                  <p style={{ color: 'rgba(6, 78, 59, 0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5em', fontSize: '12px', marginBottom: '24px' }}>
                    This Official Document Proudly Recognizes
                  </p>
                  <div style={{ position: 'relative', display: 'inline-block', padding: '16px 48px' }}>
                     <h2 style={{ fontSize: '80px', fontWeight: '900', color: '#022c22', fontStyle: 'italic', textTransform: 'capitalize', fontFamily: "'Playfair Display', serif", margin: '0' }}>
                        {user?.name}
                     </h2>
                     <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px', background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.3), transparent)' }}></div>
                  </div>
                </div>

                <div style={{ maxWidth: '850px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ color: '#022c22', fontSize: '24px', fontWeight: '700', lineHeight: '1.625', margin: '0 0 40px 0', paddingLeft: '64px', paddingRight: '64px', fontStyle: 'italic', fontFamily: "'Crimson Text', serif", textAlign: 'center', letterSpacing: 'normal' }}>
                    For their extraordinary commitment to the planet by planting <span style={{ color: '#059669', fontWeight: '900', fontStyle: 'normal', borderBottom: '2px solid rgba(6, 78, 59, 0.2)', paddingBottom: '8px', marginLeft: '4px', marginRight: '4px', letterSpacing: 'normal' }}>
                    {user?.trees || 1} {submission?.species || 'Native Tree'}</span>.
                  </p>
                  
                  {/* Newly added compulsory plantation details */}
                  <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', backgroundColor: 'rgba(6, 78, 59, 0.03)', padding: '12px 32px', borderRadius: '12px', border: '1px dashed rgba(6, 78, 59, 0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(6, 78, 59, 0.4)', textTransform: 'uppercase', marginBottom: '2px' }}>Executing NGO</p>
                      <p style={{ fontSize: '13px', fontWeight: '900', color: '#022c22' }}>{submission?.ngoName || user?.ngo || 'Authorized Forest Partner'}</p>
                    </div>
                  </div>

                  <p style={{ color: '#064e3b', fontSize: '18px', fontStyle: 'italic', fontWeight: '500', opacity: '0.7', fontFamily: "'Dancing Script', cursive", margin: '0', letterSpacing: 'normal' }}>
                    "Every tree planted today is a victory for the breath of our future."
                  </p>
                </div>
              </div>

              {/* Footer Area */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', padding: '40px 48px', backgroundColor: 'rgba(255, 255, 255, 0.4)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '40px', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', textAlign: 'left' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', border: '1px solid rgba(6, 78, 59, 0.05)' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.origin}/verify/${user?.certificate?.verificationCode || `TEMP-${user?.id}`}`} 
                      style={{ width: '100px', height: '100px' }} 
                      alt="Verify" 
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: '#022c22', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '4px' }}>Official Forest Registry</p>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(6, 95, 70, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blockchain Verified Identity</p>
                    {user?.certificate?.verificationCode && (
                      <p style={{ fontSize: '8px', color: 'rgba(6, 78, 59, 0.6)', marginTop: '4px', fontStyle: 'italic', letterSpacing: '0.2em' }}>
                        ID: {user?.certificate?.verificationCode}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex' }}>
                  <div style={{ textAlign: 'center', width: '224px', marginRight: '64px' }}>
                    <div style={{ borderBottom: '2px solid rgba(2, 44, 34, 0.1)', marginBottom: '16px', paddingBottom: '8px' }}>
                       <p style={{ fontSize: '24px', fontWeight: '900', color: 'rgba(6, 78, 59, 0.5)', fontStyle: 'italic', fontFamily: "'Dancing Script', cursive", margin: '0' }}>Regional Director</p>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: '#022c22', textTransform: 'uppercase', letterSpacing: '0.3em', margin: '0' }}>Narmada Range</p>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(6, 95, 70, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Forest Department</p>
                  </div>
                  <div style={{ textAlign: 'center', width: '224px' }}>
                    <div style={{ borderBottom: '2px solid rgba(2, 44, 34, 0.1)', marginBottom: '16px', paddingBottom: '8px' }}>
                       <p style={{ fontSize: '24px', fontWeight: '900', color: '#022c22', fontStyle: 'italic', fontFamily: "'Dancing Script', cursive", margin: '0' }}>ForestGift.org</p>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: '#022c22', textTransform: 'uppercase', letterSpacing: '0.3em', margin: '0' }}>Founding Registrar</p>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(6, 95, 70, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Global Secretariat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Floating Action Layer (Completely decoupled from scrolling context) */}
      <div className="fixed inset-0 z-[2020] pointer-events-none animate-in fade-in duration-500">
        
        {/* Mobile-optimized Top Right Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors shadow-2xl border border-white/10 pointer-events-auto"
        >
          <span className="sr-only">Close Preview</span>
          <Icon name="x" size={24} />
        </button>

        <div className="absolute bottom-20 md:bottom-12 left-4 right-4 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 flex flex-row md:gap-8 no-print bg-black/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none p-3 md:p-0 rounded-2xl md:rounded-none pointer-events-auto shadow-2xl md:shadow-none">
          <button 
            onClick={downloadCertificate}
            disabled={isGenerating}
            className="flex-1 md:flex-none bg-emerald-700 md:bg-[#022c22] text-white py-4 md:px-12 md:py-5 rounded-xl md:rounded-none text-[10px] md:text-sm font-black uppercase tracking-widest md:tracking-[0.4em] hover:bg-emerald-600 md:hover:bg-black transition-all flex items-center justify-center gap-2 md:gap-6 shadow-2xl group border border-emerald-500/50 md:border-[#ffffff1a] disabled:opacity-50 mr-2 md:mr-0"
          >
            {isGenerating ? (
                <div className="w-5 h-5 border-4 border-[#ffffff33] border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              <>
                <Icon name="download" size={16} className="group-hover:-translate-y-1 transition-transform" />
                Claim
              </>
            )}
          </button>
          
          <button 
            onClick={onClose}
            className="flex-1 md:flex-none bg-zinc-800 text-white py-4 md:px-12 md:py-5 rounded-xl md:rounded-none text-[10px] md:text-sm font-black uppercase tracking-widest md:tracking-[0.2em] hover:bg-zinc-700 transition-all shadow-xl border border-zinc-700/50 md:border-none"
          >
            Close Review
          </button>
        </div>
      </div>
    </>
  );
};
