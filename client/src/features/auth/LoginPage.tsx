import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Cloud, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { login } from '../../api';

// --- 3D Components ---

const Tree = ({ position, color, height }: { position: [number, number, number], color: string, height: number }) => {
  return (
    <group position={position}>
      <mesh position={[0, height * 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.3, height * 0.4, 8]} />
        <meshStandardMaterial color="#1a120b" roughness={0.9} />
      </mesh>
      {[0.3, 0.5, 0.7, 0.9].map((offset, i) => (
        <mesh key={i} position={[0, height * offset, 0]}>
          <coneGeometry args={[1.8 - (i * 0.4), height * 0.8, 8]} />
          <meshStandardMaterial color={color} flatShading roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const Forest = () => {
  const groupRef = useRef<THREE.Group>(null);

  const trees = useMemo(() => {
    const temp = [];
    const colors = ['#064e3b', '#065f46', '#047857', '#059669', '#10b981'];
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 120;
      const z = -Math.random() * 100;
      const height = 6 + Math.random() * 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({ position: [x, 0, z] as [number, number, number], color, height });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 15;
    }
  });

  return (
    <group ref={groupRef}>
      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#011810" />
      </mesh>
    </group>
  );
};

// --- Main Page Component ---

interface LoginPageProps {
  onLogin: (role: 'admin' | 'ngo' | 'cake' | 'user', userData: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email);
      onLogin(data.role, data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid email address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#000]">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 10, 35]} fov={50} />
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 20, 10]} intensity={5} color="#10b981" />
          <directionalLight position={[-20, 40, 20]} intensity={2} color="#ffffff" />
          <spotLight position={[0, 50, 20]} intensity={15} color="#10b981" angle={0.4} />

          <fog attach="fog" args={['#000', 10, 100]} />

          <Forest />


          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Cloud opacity={0.05} speed={0.4} segments={20} position={[-15, 15, -10]} />
            <Cloud opacity={0.08} speed={0.4} segments={20} position={[20, 18, -20]} />
          </Float>
        </Canvas>
      </div>

      {/* Glassmorphism Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-black/90 pointer-events-none z-1" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-block p-5 bg-emerald-500/10 rounded-3xl mb-6 backdrop-blur-3xl border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
            FOREST<span className="text-emerald-500">GIFT</span>
          </h1>
          <p className="text-emerald-400/80 font-bold tracking-[0.3em] uppercase text-[10px] ml-1">
            Sustainable Gifting Solutions
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-[40px] p-10 shadow-[0_25px_100px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] ml-2">
                Authorized Node Identification
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@forestgift.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium text-lg"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-4 animate-bounce">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:scale-105 transition-transform duration-500" />
              <div className="relative h-[70px] flex items-center justify-center rounded-2xl text-white font-black uppercase tracking-[0.2em] text-sm group-active:scale-95 transition-transform">
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    Initializing Access...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Enter Portal
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          </form>

          <p className="mt-10 text-center text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">
            Protocols Active • v{new Date().getFullYear()}.3.12
          </p>
        </div>
      </div>
    </div>
  );
};
