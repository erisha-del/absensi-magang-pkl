import React, { useState, useEffect } from 'react';
import { useApp, AppInterface } from '../../context/AppContext';
import { BpsLogo } from './BpsLogo';
import {
  Monitor,
  Home,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Clock,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const {
    currentInterface,
    setCurrentInterface,
    currentParticipant,
    setCurrentParticipant,
    participants,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    resetAllData,
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentTime);

  const formattedClock = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const interfaces: { id: AppInterface; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    {
      id: 'kiosk',
      label: '1. Absensi Kantor',
      icon: Monitor,
      desc: 'Dedicated PC Kantor',
    },
    {
      id: 'portal',
      label: '2. Portal Rumah',
      icon: Home,
      desc: 'Peserta PKL Mandiri',
    },
    {
      id: 'admin',
      label: '3. Admin Dashboard',
      icon: ShieldCheck,
      desc: 'Pembimbing & Pengelola',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-[11px] font-medium py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PORTAL RESMI SISTEM INFORMASI MAGANG BADAN PUSAT STATISTIK</span>
          </div>
          <div className="flex items-center gap-4 text-blue-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-white font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span>{formattedClock} WIB</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset semua data absensi, izin, dan logbook ke pengaturan awal demo?')) {
                  resetAllData();
                }
              }}
              title="Reset data demo"
              className="text-blue-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] bg-blue-950/50 hover:bg-blue-950 px-2 py-0.5 rounded"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Logo and System Title */}
        <BpsLogo size="md" />

        {/* 3 Core Interfaces Segmented Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner overflow-x-auto">
          {interfaces.map((item) => {
            const Icon = item.icon;
            const isActive = currentInterface === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentInterface(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/30'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <div className="text-left">
                  <div className="leading-tight">{item.label}</div>
                  <div className={`text-[10px] hidden sm:block ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Active User / Quick Test Selector */}
        <div className="relative flex items-center gap-2">
          {currentInterface === 'portal' && currentParticipant && (
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 px-3 py-1.5 rounded-lg text-xs transition-colors text-slate-800"
              >
                <img
                  src={currentParticipant.profile_photo}
                  alt={currentParticipant.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-400"
                />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-blue-950 text-[11px] truncate max-w-[130px]">
                    {currentParticipant.name}
                  </div>
                  <div className="text-[10px] text-blue-700 font-mono truncate max-w-[130px]">
                    {currentParticipant.student_number}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-600 ml-0.5" />
              </button>

              {/* Quick change dropdown for reviewing different students */}
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Ganti Akun Peserta PKL:
                  </div>
                  {participants.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentParticipant(p);
                        setShowAccountMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-blue-50 transition-colors text-xs ${
                        currentParticipant?.id === p.id ? 'bg-blue-50/80 font-semibold text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      <img
                        src={p.profile_photo}
                        alt={p.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="truncate">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.institution}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentInterface === 'admin' && (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-700">Admin BPS</span>
            </div>
          )}

          {currentInterface === 'kiosk' && (
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>Mode Kiosk Aktif</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
