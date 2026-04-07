import React, { useEffect, useState } from 'react';
import { Icon } from '../components/UI';

export const VerifyPage = () => {
    const code = window.location.pathname.split('/').pop();
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!code) {
           setError("No verification code provided.");
           setLoading(false);
           return;
        }

        fetch(`http://localhost:5000/api/certificates/verify/${code}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setCertificate(data);
            })
            .catch(err => {
                setError(err.message || "Failed to verify certificate.");
            })
            .finally(() => setLoading(false));
    }, [code]);

    if (loading) return (
        <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !certificate) return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
            <div className="bg-white p-12 rounded-3xl shadow-2xl border border-red-100 max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                    <Icon name="reports" size={40} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Verification Failed</h1>
                <p className="text-gray-500 font-medium mb-8 uppercase text-xs tracking-widest">{error || "Invalid Certificate"}</p>
                <a href="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg">Return to Portal</a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-emerald-50 py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-emerald-100">
                    {/* Header Banner */}
                    <div className="bg-emerald-900 p-8 text-center text-white relative">
                        <div className="absolute top-4 right-4 bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified ✓</div>
                        <img src="/forest_gift_logo.png" style={{ height: '48px', objectFit: 'contain', margin: '0 auto 16px auto', filter: 'brightness(0) invert(1)' }} alt="ForestGift" />
                        <h1 className="text-2xl font-black uppercase tracking-[0.2em]">Certificate Verified</h1>
                        <p className="opacity-60 text-xs font-bold uppercase tracking-widest mt-2">Official Forest Plantation Record</p>
                    </div>

                    <div className="p-12">
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div>
                                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mb-1">Beneficiary Name</p>
                                <h3 className="text-2xl font-black text-gray-900 capitalize">{certificate.userName}</h3>
                            </div>
                            <div>
                                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mb-1">Certificate ID</p>
                                <h3 className="text-lg font-mono font-black text-gray-400 break-all">{certificate.verificationCode}</h3>
                            </div>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 mb-12">
                             <div className="flex items-start gap-6 mb-6 pb-6 border-b border-emerald-200/50">
                                 <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                                     <Icon name="tree" size={24} />
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-[10px] text-emerald-800/40 font-black uppercase tracking-widest mb-1">Plantation Impact</p>
                                     <p className="text-gray-900 font-bold leading-relaxed italic pr-4"> Dedicated commitment to a greener planet by planting native saplings in the MP Forest Zone. </p>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-y-6">
                                <div className="col-span-2">
                                    <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mb-3">Live Plantation Coordinates ({certificate.trees?.length > 0 ? certificate.trees.length : 1} Trees Found)</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                       {certificate.trees && certificate.trees.length > 0 ? (
                                           certificate.trees.map((t: any, i: number) => (
                                               <div key={i} className="bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm flex flex-col justify-center">
                                                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tree #{i + 1}</span>
                                                   <span className="text-xs font-mono font-black text-emerald-700">{t.lat.toFixed(4)}°N, {t.lng.toFixed(4)}°E</span>
                                               </div>
                                           ))
                                       ) : (
                                           <div className="bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm flex flex-col justify-center">
                                               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tree #1</span>
                                               <span className="text-xs font-mono font-black text-emerald-700">{certificate.lat?.toFixed(4) || '0.0000'}°N, {certificate.lng?.toFixed(4) || '0.0000'}°E</span>
                                           </div>
                                       )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mb-1">Issue Date</p>
                                    <p className="text-gray-900 font-black text-sm">{certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'Issued'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mb-1">NGO Facilitator</p>
                                    <p className="text-gray-900 font-bold text-sm">{certificate.ngoName || 'Official Partner'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mb-1">Status</p>
                                    <p className="inline-flex items-center gap-1.5 bg-emerald-950 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Live ✓</p>
                                </div>
                             </div>
                        </div>

                        {certificate.imageUrl && (
                            <div className="mb-12">
                                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mb-4">Plantation Memory</p>
                                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                    <img src={`http://localhost:5000/uploads/${certificate.imageUrl}`} className="w-full h-auto" alt="Plantation Site" />
                                </div>
                            </div>
                        )}

                        <div className="text-center pt-8 border-t border-gray-100">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em] mb-4 leading-relaxed">
                                This document is digitally signed by the Madhya Pradesh Forest Department Registrar and the ForestGift.org Secretariat.
                            </p>
                            <a href="/" className="text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:text-emerald-900 transition-colors">Return to Official Portal</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
