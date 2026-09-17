import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr } from '../../data/mockData';
import {
  Users,
  CheckCircle2,
  Clock,
  HeartPulse,
  XCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  Calendar,
  Check,
  X,
  MapPin,
  Building,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ onNavigate }) => {
  const {
    participants,
    attendances,
    leaveRequests,
    reviewLeaveRequest,
    getTodaySummary,
    systemSettings,
  } = useApp();

  const todaySummary = getTodaySummary();
  const [trendFilter, setTrendFilter] = useState<'today' | '7days' | 'month'>('7days');

  // Newest 5 Attendances
  const newestAttendances = useMemo(() => {
    return [...attendances].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
  }, [attendances]);

  // Pending / Newest Leave Requests
  const newestLeaves = useMemo(() => {
    return [...leaveRequests].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
  }, [leaveRequests]);

  // Compute trend data based on filter
  const trendData = useMemo(() => {
    const days = trendFilter === 'today' ? 1 : trendFilter === '7days' ? 7 : 14;
    const result: { dateStr: string; label: string; hadir: number; terlambat: number; izinSakit: number; alpha: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const dateStr = getTodayDateStr(-i);
      const dayAttendances = attendances.filter((a) => a.attendance_date === dateStr);

      let hadir = 0;
      let terlambat = 0;
      let izinSakit = 0;
      let alpha = 0;

      dayAttendances.forEach((a) => {
        if (a.status === 'Hadir') hadir++;
        else if (a.status === 'Terlambat') terlambat++;
        else if (a.status === 'Izin' || a.status === 'Sakit') izinSakit++;
        else if (a.status === 'Alpha') alpha++;
      });

      // Format short label e.g. "16 Sep"
      const parts = dateStr.split('-');
      const label = `${parts[2]}/${parts[1]}`;

      result.push({ dateStr, label, hadir, terlambat, izinSakit, alpha });
    }
    return result;
  }, [attendances, trendFilter]);

  // Max count for trend bar scaling
  const maxTrendTotal = Math.max(
    ...trendData.map((d) => d.hadir + d.terlambat + d.izinSakit + d.alpha),
    participants.length || 5
  );

  return (
    <div className="space-y-7">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Pengawasan PKL
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pusat monitoring kehadiran, absensi, dan permohonan izin peserta magang Badan Pusat Statistik.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">Batas Absen Tepat Waktu:</span>
          <span className="font-mono font-bold text-blue-700">{systemSettings.late_cutoff_time} WIB</span>
        </div>
      </div>

      {/* SECTION I: 6 SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Siswa */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {todaySummary.totalStudents}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">Total Peserta</div>
          <div className="text-[10px] text-slate-400">Aktif Terdaftar</div>
        </div>

        {/* Card 2: Hadir Hari Ini */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {todaySummary.hadir}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">Hadir Hari Ini</div>
          <div className="text-[10px] text-emerald-600 font-medium">Tepat Waktu</div>
        </div>

        {/* Card 3: Terlambat */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {todaySummary.terlambat}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">Terlambat</div>
          <div className="text-[10px] text-amber-600 font-medium">Lewat {systemSettings.late_cutoff_time}</div>
        </div>

        {/* Card 4: Izin */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {todaySummary.izin}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">Izin</div>
          <div className="text-[10px] text-sky-600 font-medium">Disetujui Admin</div>
        </div>

        {/* Card 5: Sakit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {todaySummary.sakit}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">Sakit</div>
          <div className="text-[10px] text-purple-600 font-medium">Surat Dokter</div>
        </div>

        {/* Card 6: Alpha */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {todaySummary.alpha}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">Alpha</div>
          <div className="text-[10px] text-rose-600 font-medium">Tanpa Ket.</div>
        </div>
      </div>

      {/* SECTION J: 2 CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik 1: Statistik Kehadiran (Comparison Breakdown) */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <span>Statistik Kehadiran Hari Ini</span>
              </h2>
              <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                Real-Time
              </span>
            </div>

            {/* Distribution bars */}
            <div className="mt-5 space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Hadir Tepat Waktu
                  </span>
                  <span className="font-mono text-slate-800">{todaySummary.hadir} Orang</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(todaySummary.hadir / Math.max(todaySummary.totalStudents, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Terlambat
                  </span>
                  <span className="font-mono text-slate-800">{todaySummary.terlambat} Orang</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(todaySummary.terlambat / Math.max(todaySummary.totalStudents, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Izin Disetujui
                  </span>
                  <span className="font-mono text-slate-800">{todaySummary.izin} Orang</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(todaySummary.izin / Math.max(todaySummary.totalStudents, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-purple-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Sakit
                  </span>
                  <span className="font-mono text-slate-800">{todaySummary.sakit} Orang</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(todaySummary.sakit / Math.max(todaySummary.totalStudents, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Alpha
                  </span>
                  <span className="font-mono text-slate-800">{todaySummary.alpha} Orang</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(todaySummary.alpha / Math.max(todaySummary.totalStudents, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Belum Absen Hari Ini:</span>
            <span className="font-bold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {todaySummary.belumAbsen} Peserta
            </span>
          </div>
        </div>

        {/* Grafik 2: Tren Kehadiran (Trend Over Dates) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Tren Kehadiran Peserta PKL</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distribusi jumlah kehadiran berdasarkan rentang tanggal
                </p>
              </div>

              {/* Filter: Hari ini, 7 hari terakhir, Bulan ini */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setTrendFilter('today')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    trendFilter === 'today' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-blue-600'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => setTrendFilter('7days')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    trendFilter === '7days' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-blue-600'
                  }`}
                >
                  7 Hari Terakhir
                </button>
                <button
                  onClick={() => setTrendFilter('month')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    trendFilter === 'month' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-blue-600'
                  }`}
                >
                  14 Hari / Bulan
                </button>
              </div>
            </div>

            {/* Custom Interactive SVG / Bar Trend Visualizer */}
            <div className="mt-6">
              <div className="h-44 flex items-end gap-2 sm:gap-4 pt-4 pb-2 border-b border-slate-200">
                {trendData.map((d, i) => {
                  const total = d.hadir + d.terlambat + d.izinSakit + d.alpha;
                  const totalHeightPct = Math.min(100, Math.round((total / maxTrendTotal) * 100)) || 10;
                  const hadirPct = total > 0 ? (d.hadir / total) * 100 : 0;
                  const terlambatPct = total > 0 ? (d.terlambat / total) * 100 : 0;
                  const izinPct = total > 0 ? (d.izinSakit / total) * 100 : 0;
                  const alphaPct = total > 0 ? (d.alpha / total) * 100 : 0;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg pointer-events-none z-20 whitespace-nowrap">
                        <div className="font-bold">{d.dateStr}</div>
                        <div>Hadir: {d.hadir}</div>
                        <div>Terlambat: {d.terlambat}</div>
                        <div>Izin/Sakit: {d.izinSakit}</div>
                        <div>Alpha: {d.alpha}</div>
                      </div>

                      {/* Bar Stack */}
                      <div
                        className="w-full max-w-[36px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-110 shadow-xs"
                        style={{ height: `${totalHeightPct}%` }}
                      >
                        {alphaPct > 0 && <div className="bg-rose-500 w-full" style={{ height: `${alphaPct}%` }} />}
                        {izinPct > 0 && <div className="bg-blue-400 w-full" style={{ height: `${izinPct}%` }} />}
                        {terlambatPct > 0 && <div className="bg-amber-400 w-full" style={{ height: `${terlambatPct}%` }} />}
                        {hadirPct > 0 && <div className="bg-emerald-500 w-full" style={{ height: `${hadirPct}%` }} />}
                      </div>

                      <span className="text-[10px] font-medium text-slate-500 mt-2 truncate">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Hadir
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Terlambat
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              Izin/Sakit
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Alpha
            </span>
          </div>
        </div>
      </div>

      {/* SECTION K & L: ABSENSI TERBARU & IZIN TERBARU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION K: Absensi Terbaru */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Absensi Terbaru</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Catatan check-in terkini dari seluruh peserta</p>
              </div>

              <button
                onClick={() => onNavigate('absensi')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-medium">
                    <th className="py-2.5 px-2">Peserta</th>
                    <th className="py-2.5 px-2">Waktu & Tanggal</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Sumber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {newestAttendances.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-900">{att.participant_name}</div>
                        <div className="text-[10px] text-slate-400">{att.participant_institution}</div>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className="font-mono font-semibold text-slate-800">{att.check_in_time} WIB</div>
                        <div className="text-[10px] text-slate-400">{att.attendance_date}</div>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            att.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : att.status === 'Terlambat'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap text-slate-600">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          {att.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION L: Pengajuan Izin Terbaru (with Direct Approve/Reject) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Pengajuan Izin Terbaru</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Konfirmasi permohonan ketidakhadiran peserta</p>
              </div>

              <button
                onClick={() => onNavigate('izin')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {newestLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{leave.participant_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          leave.type === 'Sakit'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {leave.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {leave.date}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-1 text-[11px]">{leave.reason}</p>
                  </div>

                  {/* Action buttons if status is Menunggu */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                    {leave.status === 'Menunggu' ? (
                      <>
                        <button
                          onClick={() => reviewLeaveRequest(leave.id, 'Disetujui')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Setujui Izin"
                        >
                          <Check className="w-3 h-3" />
                          <span>Setujui</span>
                        </button>
                        <button
                          onClick={() => reviewLeaveRequest(leave.id, 'Ditolak')}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Tolak Izin"
                        >
                          <X className="w-3 h-3" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          leave.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {leave.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
