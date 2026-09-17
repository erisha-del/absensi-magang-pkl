/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigation } from './components/common/TopNavigation';
import { ToastContainer } from './components/common/ToastContainer';
import { OfficeKiosk } from './components/kiosk/OfficeKiosk';
import { UserPortal } from './components/portal/UserPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentInterface } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Universal Top Navigation: Interface Switcher & System Indicator */}
      <TopNavigation />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentInterface === 'kiosk' && <OfficeKiosk />}
        {currentInterface === 'portal' && <UserPortal />}
        {currentInterface === 'admin' && <AdminDashboard />}
      </main>

      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Official BPS Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-3 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-medium">
            <span>© 2026 Badan Pusat Statistik (BPS). Sistem Informasi Absensi & Logbook PKL Terpadu.</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Terhubung ke Database Tunggal Sinkron • Jam Kantor 08:00 - 16:00 WIB
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
