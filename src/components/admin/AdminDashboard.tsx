import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminStudents } from './AdminStudents';
import { AdminAttendance } from './AdminAttendance';
import { AdminLeaves } from './AdminLeaves';
import { AdminLogbooks } from './AdminLogbooks';
import { AdminRecap } from './AdminRecap';
import { AdminSettings } from './AdminSettings';
import { BpsLogo } from '../common/BpsLogo';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BookOpen,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminUser,
    loginAdmin,
    logoutAdmin,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin Login states
  const [email, setEmail] = useState('admin@bps.go.id');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = loginAdmin(email, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // IF ADMIN IS NOT LOGGED IN: SHOW ADMIN LOGIN SCREEN
  if (!isAdminLoggedIn || !adminUser) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center">
          <div className="flex justify-center mb-5">
            <BpsLogo size="lg" showText={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Portal</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Login Admin Pembimbing BPS
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Akses khusus pembimbing dan pengelola PKL Badan Pusat Statistik.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Email Admin:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Dashboard Admin</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
            Kredensial Default Demo: <br />
            <span className="font-mono font-bold text-slate-600">admin@bps.go.id / admin123</span>
          </div>
        </div>
      </div>
    );
  }

  // NAVIGATION MENU ITEMS
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'siswa', label: 'Data Siswa/Mahasiswa', icon: Users },
    { id: 'absensi', label: 'Data Absensi', icon: Calendar },
    { id: 'izin', label: 'Data Izin', icon: FileText },
    { id: 'logbook', label: 'Data Logbook', icon: BookOpen },
    { id: 'rekap', label: 'Rekap Absensi', icon: FileSpreadsheet },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BpsLogo size="sm" showText={false} />
          <div>
            <div className="font-bold text-xs leading-tight">Admin BPS</div>
            <div className="text-[10px] text-slate-400">{adminUser.name}</div>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-slate-200 p-5 flex flex-col justify-between flex-shrink-0 z-30`}
      >
        <div className="space-y-6">
          {/* Admin Identity Card in Sidebar */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
              A
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-white truncate">{adminUser.name}</div>
              <div className="text-[10px] text-blue-400 font-medium">Pembimbing PKL</div>
              <div className="text-[10px] text-slate-400 truncate">{adminUser.email}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menu Pengawasan
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Action */}
        <div className="pt-6 border-t border-slate-800 mt-6">
          <button
            onClick={() => {
              logoutAdmin();
              showToast('Anda telah keluar dari dashboard admin.', 'info');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {activeTab === 'overview' && <AdminDashboardOverview onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'siswa' && <AdminStudents />}
        {activeTab === 'absensi' && <AdminAttendance />}
        {activeTab === 'izin' && <AdminLeaves />}
        {activeTab === 'logbook' && <AdminLogbooks />}
        {activeTab === 'rekap' && <AdminRecap />}
        {activeTab === 'pengaturan' && <AdminSettings />}
      </main>
    </div>
  );
};
