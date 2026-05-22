import React, { useEffect, useState } from 'react';
import { Icon } from '../components/UI';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { customMarkerIcon } from '../utils/leaflet-icons';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

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

        fetch(`${API_BASE}/api/certificates/verify/${code}`)
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-[#247114]/30 border-t-[#247114] rounded-full animate-spin"></div>
                <p className="text-[#247114] font-black uppercase tracking-[0.3em] animate-pulse">Consulting Secure Ledger...</p>
            </div>
        </div>
    );

    if (error || !certificate) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white backdrop-blur-3xl p-12 rounded-[48px] border border-slate-200 shadow-2xl text-center">
                <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                    <Icon name="x" size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Verification Failed</h2>
                <p className="text-slate-500 font-bold mb-8">{error || "This certificate could not be authenticated against our registry."}</p>
                <button onClick={() => window.location.href = '/'} className="w-full bg-[#247114] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#1b5e0f] transition-colors shadow-lg shadow-[#247114]/20">
                    Return to Portal
                </button>
            </div>
        </div>
    );

    const treeEntries = [...(certificate.trees || []), ...(certificate.submissions || [])];
    const mapCenter: [number, number] = treeEntries.length > 0 && treeEntries[0].lat && treeEntries[0].lng
        ? [treeEntries[0].lat, treeEntries[0].lng] 
        : [certificate.lat || 23.2599, certificate.lng || 77.4126];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#247114]/20 overflow-x-hidden pt-8 pb-24">
            {/* Background Ambient Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#247114]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#247114]/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Branding */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/90 backdrop-blur-xl rounded-[24px] border border-slate-200 shadow-xl cursor-pointer" onClick={() => window.location.href = '/'}>
                            <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0r4EWz6LuN9z6g/title-IA5qPxoWCRTW532I.jpg" className="h-10 md:h-12 w-auto object-contain" alt="ForestGift" crossOrigin="anonymous" />
                        </div>
                        <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-slate-900">Global Registry</h1>
                            <p className="text-[10px] font-black text-[#247114] uppercase tracking-widest mt-1">Verification Node: FG-{certificate.verificationCode?.split('-').pop()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-[#247114]/10 border border-[#247114]/20 py-2.5 px-6 rounded-full shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#247114] animate-pulse"></div>
                        <span className="text-[10px] font-black text-[#247114] uppercase tracking-[0.2em]">Secure Blockchain Match</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Side: interactive Map (Identical to Dashboard) */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                        <div className="bg-white/90 backdrop-blur-3xl rounded-[48px] border border-slate-200 overflow-hidden shadow-2xl group">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Geospatial Verifier</h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Live Asset Traceability</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-[#247114]">{treeEntries.length || 1}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital Vectors</div>
                                </div>
                            </div>
                            <div className="h-[500px] w-full relative z-0">
                                <MapContainer 
                                    center={mapCenter} 
                                    zoom={14} 
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    {treeEntries.filter((te: any) => te.lat && te.lng).map((te: any, idx: number) => (
                                        <Marker key={idx} position={[te.lat, te.lng]} icon={customMarkerIcon}>
                                            <Popup>
                                                <div className="p-2 text-slate-900 font-bold uppercase text-[10px]">
                                                    Verified Plantation Site<br/>
                                                    <span className="text-[#247114] font-black">{te.species || 'Native'} Tree</span>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                    {treeEntries.filter((te: any) => te.lat && te.lng).length === 0 && (
                                         <Marker position={mapCenter} icon={customMarkerIcon}>
                                             <Popup>
                                                <div className="p-2 text-slate-900 font-bold uppercase text-[10px]">
                                                    Estimated Site Region<br/>
                                                    <span className="text-[#247114] font-black">{certificate.userName}'s Grove</span>
                                                </div>
                                            </Popup>
                                         </Marker>
                                    )}
                                </MapContainer>
                            </div>
                        </div>

                        {/* Impact Details Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] border border-slate-200 shadow-xl hover:border-[#247114]/30 transition-all group">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-[#247114] transition-colors">Asset Holder</div>
                                <div className="text-2xl font-black truncate text-slate-900">{certificate.userName}</div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] border border-[#247114]/20 shadow-xl shadow-[#247114]/5 group">
                                <div className="text-[#247114] text-[10px] font-black uppercase tracking-widest mb-1">Growth Matrix</div>
                                <div className="text-2xl font-black text-[#247114]">{treeEntries.length || 1} Verified Trees</div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[40px] border border-slate-200 shadow-xl group">
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Digital Status</div>
                                <div className="text-2xl font-black flex items-center gap-2 text-slate-900">
                                    <Icon name="check" className="text-[#247114]" size={24} />
                                    <span>Immutable</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Photographic Evidence */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                        <div className="bg-white/90 backdrop-blur-3xl p-1 rounded-[48px] border border-slate-200 shadow-2xl relative overflow-hidden group">
                            <div className="p-8 pb-4">
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Photographic Proof</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Field-Captured Plantation Evidence</p>
                            </div>
                            
                            <div className="p-4 pt-0">
                                <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-slate-100 relative bg-slate-100">
                                    <img 
                                        src={(() => {
                                            const te = treeEntries.length > 0 ? treeEntries[0] : null;
                                            const img = certificate.displayImage || (te ? (te.images?.[0] || te.proofs?.[0]) : null);
                                            
                                            if (!img) return 'https://img.freepik.com/premium-photo/aerial-view-forest-with-river-running-through-it_863013-43331.jpg';
                                            
                                            if (img.startsWith('data:') || img.startsWith('http')) return img;
                                            
                                            const cleanPath = img.replace(/^\/?uploads\//, '');
                                            return `${API_BASE}/uploads/${cleanPath}`;
                                        })()} 
                                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000" 
                                        alt="Plantation Proof" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-lg">
                                            <Icon name="map-pin" size={14} className="text-[#247114]" />
                                            <span className="text-[11px] font-black uppercase tracking-widest leading-none text-slate-900">Verified Field Proof</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Evidence Metadata */}
                            <div className="p-8 pt-0 space-y-4">
                                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Executing NGO</span>
                                    <span className="text-xs font-black text-[#247114]">{certificate.ngoName || "Regional Forest Dept."}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Network Hash</span>
                                    <span className="text-[10px] font-mono text-slate-500 truncate w-32 text-right">{certificate._id}</span>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                                        Verified against authorized registry node <br/>
                                        & forestgift.org official public ledger.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Verification Link */}
                        <div className="bg-[#247114]/5 backdrop-blur-xl rounded-[40px] border border-[#247114]/10 p-8 flex items-center justify-between gap-6 hover:bg-[#247114]/10 transition-colors shadow-sm">
                            <div className="flex-1">
                                <h4 className="text-sm font-black uppercase tracking-wider mb-2 text-slate-900">Public Proof Link</h4>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-4">Scan QR or copy link to share this proof globally.</p>
                                <div className="text-[9px] font-mono bg-white p-2 rounded-lg text-[#247114] break-all border border-slate-200 shadow-inner">
                                    {window.location.href}
                                </div>
                            </div>
                            <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 group hover:scale-105 transition-transform duration-300">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}`} className="w-full h-full" alt="QR Code" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
