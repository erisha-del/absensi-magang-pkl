import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortalDashboard } from './PortalDashboard';
import { PortalLeaveRequest } from './PortalLeaveRequest';
import { PortalAttendanceHistory } from './PortalAttendanceHistory';
import { PortalLogbook } from './PortalLogbook';
import { PortalProfile } from './PortalProfile';
import { BpsLogo } from '../common/BpsLogo';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Building,
  GraduationCap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const UserPortal: React.FC = () => {
  const {
    currentParticipant,
    setCurrentParticipant,
    participants,
    getParticipantByEmail,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'izin' | 'riwayat' | 'logbook' | 'profil'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login form state if not logged in
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = getParticipantByEmail(loginEmail);
    if (!found) {
      setLoginError('Email tidak terdaftar. Hubungi admin pembimbing BPS.');
      return;
    }

    if (found.status === 'Nonaktif') {
      setLoginError('Akun Anda dinonaktifkan oleh admin.');
      return;
    }

    setCurrentParticipant(found);
    showToast(`Selamat datang kembali, ${found.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentParticipant(null);
    showToast('Anda telah logout dari portal peserta.', 'info');
  };

  // IF NOT LOGGED IN AS PARTICIPANT: SHOW LOGIN SCREEN
  if (!currentParticipant) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center">
          <div className="flex justify-center mb-5">
            <BpsLogo size="lg" showText={false} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Portal Mandiri Peserta PKL
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Silakan masukkan email terdaftar Anda untuk mengakses portal dari rumah.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Email Peserta:
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="nama@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk Portal Peserta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3 font-medium">
              Atau pilih akun peserta demo:
            </p>
            <div className="space-y-2">
              {participants.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentParticipant(p);
                    showToast(`Login sebagai ${p.name}`, 'success');
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-3 text-xs cursor-pointer"
                >
                  <img
                    src={p.profile_photo}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="truncate flex-1">
                    <p className="font-semibold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.institution}</p>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold">Pilih &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NAVIGATION MENU ITEMS
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'izin', label: 'Pengajuan Izin', icon: FileText },
    { id: 'riwayat', label: 'Riwayat Absensi', icon: Calendar },
    { id: 'logbook', label: 'Logbook', icon: BookOpen },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={currentParticipant.profile_photo}
            alt={currentParticipant.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
          />
          <div>
            <div className="font-bold text-xs text-slate-900 leading-tight">
              {currentParticipant.name}
            </div>
            <div className="text-[10px] text-slate-500">Portal Peserta BPS</div>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between flex-shrink-0 z-30`}
      >
        <div className="space-y-6">
          {/* User Mini Profile Card in Sidebar */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3">
            <img
              src={currentParticipant.profile_photo}
              alt={currentParticipant.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500 shadow-xs"
            />
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentParticipant.name}
              </div>
              <div className="text-[10px] text-blue-700 font-mono font-semibold truncate">
                {currentParticipant.student_number}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentParticipant.institution}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu Peserta
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action: Logout */}
        <div className="pt-6 border-t border-slate-100 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        {activeTab === 'dashboard' && <PortalDashboard onNavigate={(t) => setActiveTab(t as any)} />}
        {activeTab === 'izin' && <PortalLeaveRequest />}
        {activeTab === 'riwayat' && <PortalAttendanceHistory />}
        {activeTab === 'logbook' && <PortalLogbook />}
        {activeTab === 'profil' && <PortalProfile />}
      </main>
    </div>
  );
};
