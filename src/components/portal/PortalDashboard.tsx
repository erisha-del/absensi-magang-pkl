import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  HeartPulse,
  XCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  CalendarCheck2,
} from 'lucide-react';

interface PortalDashboardProps {
  onNavigate: (tab: string) => void;
}

export const PortalDashboard: React.FC<PortalDashboardProps> = ({ onNavigate }) => {
  const { currentParticipant, attendances, getParticipantStats, hasCheckedInToday, systemSettings } = useApp();

  if (!currentParticipant) return null;

  const stats = getParticipantStats(currentParticipant.id);
  const todayAttendance = hasCheckedInToday(currentParticipant.id);

  // Month Calendar View State
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Current year & month for calendar
  const curYear = calendarDate.getFullYear();
  const curMonth = calendarDate.getMonth(); // 0-indexed

  // Days in month
  const firstDayIndex = new Date(curYear, curMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper to get attendance record on a specific date YYYY-MM-DD
  const getAttendanceForDay = (day: number) => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(curMonth + 1).padStart(2, '0');
    const dateStr = `${curYear}-${monthStr}-${dayStr}`;
    return attendances.find(
      (a) => a.participant_id === currentParticipant.id && a.attendance_date === dateStr
    );
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-600/50 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portal Mandiri Peserta PKL/Magang</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {currentParticipant.name} 👋
            </h1>
            <p className="text-blue-100/90 text-sm max-w-xl leading-relaxed">
              Selamat datang di portal informasi absensi BPS. Pantau kehadiran harian Anda, ajukan izin, dan isi catatan kegiatan logbook secara mandiri.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('izin')}
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Ajukan Izin</span>
            </button>
            <button
              onClick={() => onNavigate('logbook')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all border border-blue-400/40 flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Isi Logbook Hari Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kehadiran Hari Ini Card & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Check-in Status Spotlight */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Status Hari Ini
            </span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Batas {systemSettings.late_cutoff_time || '08:00'} WIB
            </span>
          </div>

          <div className="my-auto py-2">
            {todayAttendance ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sudah Melakukan Absensi</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {todayAttendance.check_in_time} <span className="text-sm font-sans text-slate-500">WIB</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      todayAttendance.status === 'Hadir'
                        ? 'bg-emerald-100 text-emerald-800'
                        : todayAttendance.status === 'Terlambat'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {todayAttendance.status}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    {todayAttendance.source}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Belum Absensi Hari Ini</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan absensi di PC Kantor BPS saat tiba, atau ajukan permohonan izin jika sedang berhalangan hadir.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Instansi:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[170px]">
              {currentParticipant.institution}
            </span>
          </div>
        </div>

        {/* 4 Attendance Summary Cards (Hadir, Izin, Sakit, Alpha) */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Hadir */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.hadir}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Total Hadir</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tepat waktu</div>
          </div>

          {/* Card 2: Terlambat */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.terlambat}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Terlambat</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Lewat {systemSettings.late_cutoff_time}</div>
          </div>

          {/* Card 3: Izin & Sakit */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.izin + stats.sakit}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Izin & Sakit</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Izin: {stats.izin} • Sakit: {stats.sakit}
            </div>
          </div>

          {/* Card 4: Alpha */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.alpha}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Alpha</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tanpa keterangan</div>
          </div>
        </div>
      </div>

      {/* Interactive Calendar / Absensi Summary Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span>Kalender Absensi Saya</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ringkasan catatan kehadiran Anda pada bulan {monthNames[curMonth]} {curYear}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCalendarDate(new Date(curYear, curMonth - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
            >
              &larr; Bulan Lalu
            </button>
            <span className="text-xs font-bold text-slate-800 px-2 font-mono">
              {monthNames[curMonth]} {curYear}
            </span>
            <button
              onClick={() => setCalendarDate(new Date(curYear, curMonth + 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
            >
              Bulan Depan &rarr;
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 my-4 text-center">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
            <div
              key={d}
              className={`text-xs font-bold py-1 ${
                i === 0 || i === 6 ? 'text-rose-500' : 'text-slate-600'
              }`}
            >
              {d}
            </div>
          ))}

          {/* Empty slot paddings */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 rounded-xl bg-slate-50/40 opacity-40" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const att = getAttendanceForDay(day);
            const isWeekend = (firstDayIndex + idx) % 7 === 0 || (firstDayIndex + idx) % 7 === 6;

            let badgeColor = 'bg-slate-50 text-slate-400 border-slate-100';
            let label = '';

            if (att) {
              if (att.status === 'Hadir') {
                badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
                label = 'Hadir';
              } else if (att.status === 'Terlambat') {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
                label = 'Telat';
              } else if (att.status === 'Izin') {
                badgeColor = 'bg-blue-50 text-blue-800 border-blue-200 font-bold';
                label = 'Izin';
              } else if (att.status === 'Sakit') {
                badgeColor = 'bg-purple-50 text-purple-800 border-purple-200 font-bold';
                label = 'Sakit';
              } else if (att.status === 'Alpha') {
                badgeColor = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
                label = 'Alpha';
              }
            }

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[64px] rounded-xl p-1.5 border text-left flex flex-col justify-between transition-all ${
                  isWeekend ? 'bg-slate-50/60 border-slate-100' : 'hover:border-blue-300 bg-white'
                } ${att ? badgeColor : 'border-slate-100'}`}
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className={`font-semibold ${isWeekend ? 'text-rose-400' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  {att && <span className="text-[10px] opacity-75 font-mono">{att.check_in_time.slice(0, 5)}</span>}
                </div>

                {att ? (
                  <div className="text-[10px] font-bold truncate">
                    {att.status}
                  </div>
                ) : isWeekend ? (
                  <div className="text-[9px] text-slate-300 italic">Libur</div>
                ) : (
                  <div className="text-[9px] text-slate-300">-</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300 inline-block"></span>
            <span className="text-slate-600">Hadir Tepat Waktu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300 inline-block"></span>
            <span className="text-slate-600">Terlambat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-blue-100 border border-blue-300 inline-block"></span>
            <span className="text-slate-600">Izin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-purple-100 border border-purple-300 inline-block"></span>
            <span className="text-slate-600">Sakit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300 inline-block"></span>
            <span className="text-slate-600">Alpha</span>
          </div>
        </div>
      </div>
    </div>
  );
};
