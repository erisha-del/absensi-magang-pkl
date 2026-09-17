import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Building,
  Users,
  CheckCircle2,
  Clock,
  HeartPulse,
  XCircle,
  FileText,
} from 'lucide-react';

export const AdminRecap: React.FC = () => {
  const { participants, attendances, showToast } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('09'); // September
  const [selectedYear, setSelectedYear] = useState('2026');
  const [institutionFilter, setInstitutionFilter] = useState('Semua');
  const [participantFilter, setParticipantFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Months list
  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Institutions
  const institutionList = useMemo(() => {
    return Array.from(new Set(participants.map((p) => p.institution)));
  }, [participants]);

  // Compute recap for each participant for the selected month/year
  const recapData = useMemo(() => {
    const yearMonth = `${selectedYear}-${selectedMonth}`;

    return participants
      .filter((p) => {
        const matchesInst =
          institutionFilter === 'Semua' || p.institution === institutionFilter;
        const matchesPart =
          participantFilter === 'Semua' || p.id === participantFilter;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.student_number.includes(searchQuery);

        return matchesInst && matchesPart && matchesSearch;
      })
      .map((p) => {
        const studentAttendances = attendances.filter(
          (a) => a.participant_id === p.id && a.attendance_date.startsWith(yearMonth)
        );

        let hadir = 0;
        let terlambat = 0;
        let izin = 0;
        let sakit = 0;
        let alpha = 0;

        studentAttendances.forEach((a) => {
          if (a.status === 'Hadir') hadir++;
          else if (a.status === 'Terlambat') terlambat++;
          else if (a.status === 'Izin') izin++;
          else if (a.status === 'Sakit') sakit++;
          else if (a.status === 'Alpha') alpha++;
        });

        const total = hadir + terlambat + izin + sakit + alpha;
        const presentTotal = hadir + terlambat;
        const percentage = total > 0 ? Math.round((presentTotal / total) * 100) : 100;

        return {
          participant: p,
          hadir,
          terlambat,
          izin,
          sakit,
          alpha,
          total,
          percentage,
        };
      });
  }, [
    participants,
    attendances,
    selectedMonth,
    selectedYear,
    institutionFilter,
    participantFilter,
    searchQuery,
  ]);

  // Overall totals
  const overall = useMemo(() => {
    return recapData.reduce(
      (acc, curr) => ({
        hadir: acc.hadir + curr.hadir,
        terlambat: acc.terlambat + curr.terlambat,
        izin: acc.izin + curr.izin,
        sakit: acc.sakit + curr.sakit,
        alpha: acc.alpha + curr.alpha,
        total: acc.total + curr.total,
      }),
      { hadir: 0, terlambat: 0, izin: 0, sakit: 0, alpha: 0, total: 0 }
    );
  }, [recapData]);

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const monthName = months.find((m) => m.value === selectedMonth)?.label || selectedMonth;
    const headers = [
      'No',
      'Nama Peserta',
      'NIM/NIS',
      'Sekolah/Universitas',
      'Jurusan',
      'Hadir',
      'Terlambat',
      'Izin',
      'Sakit',
      'Alpha',
      'Total Hari',
      'Persentase Kehadiran (%)',
    ];

    const rows = recapData.map((d, i) => [
      i + 1,
      `"${d.participant.name}"`,
      `"${d.participant.student_number}"`,
      `"${d.participant.institution}"`,
      `"${d.participant.major}"`,
      d.hadir,
      d.terlambat,
      d.izin,
      d.sakit,
      d.alpha,
      d.total,
      `"${d.percentage}%"`,
    ]);

    // Summary row
    rows.push([
      '',
      '"TOTAL KESELURUHAN"',
      '""',
      '""',
      '""',
      overall.hadir,
      overall.terlambat,
      overall.izin,
      overall.sakit,
      overall.alpha,
      overall.total,
      '""',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Absensi_PKL_BPS_${monthName}_${selectedYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan rekap absensi berhasil diunduh (Excel compatible).', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            <span>Rekapitulasi Absensi PKL / Magang BPS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Laporan bulanan agregat kehadiran, keterlambatan, dan persentase kehadiran seluruh peserta magang.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel (.CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Bulan */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bulan:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 bg-white"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 bg-white"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {/* Instansi */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Instansi:</label>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 bg-white"
            >
              <option value="Semua">Semua Instansi</option>
              {institutionList.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Peserta */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Peserta:</label>
            <select
              value={participantFilter}
              onChange={(e) => setParticipantFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 bg-white"
            >
              <option value="Semua">Semua Peserta</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pencarian:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800">Total Hadir</span>
          <div className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5">
            {overall.hadir}
          </div>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <span className="text-[11px] font-bold text-amber-800">Total Terlambat</span>
          <div className="text-2xl font-extrabold text-amber-900 font-mono mt-0.5">
            {overall.terlambat}
          </div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <span className="text-[11px] font-bold text-blue-800">Total Izin</span>
          <div className="text-2xl font-extrabold text-blue-900 font-mono mt-0.5">
            {overall.izin}
          </div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
          <span className="text-[11px] font-bold text-purple-800">Total Sakit</span>
          <div className="text-2xl font-extrabold text-purple-900 font-mono mt-0.5">
            {overall.sakit}
          </div>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
          <span className="text-[11px] font-bold text-rose-800">Total Alpha</span>
          <div className="text-2xl font-extrabold text-rose-900 font-mono mt-0.5">
            {overall.alpha}
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <span className="text-[11px] font-bold text-slate-300">Total Sesi Log</span>
          <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
            {overall.total}
          </div>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Instansi Asal</th>
                <th className="py-3.5 px-3 text-center text-emerald-700 bg-emerald-50/50">Hadir</th>
                <th className="py-3.5 px-3 text-center text-amber-700 bg-amber-50/50">Terlambat</th>
                <th className="py-3.5 px-3 text-center text-blue-700 bg-blue-50/50">Izin</th>
                <th className="py-3.5 px-3 text-center text-purple-700 bg-purple-50/50">Sakit</th>
                <th className="py-3.5 px-3 text-center text-rose-700 bg-rose-50/50">Alpha</th>
                <th className="py-3.5 px-3 text-center font-bold">Total</th>
                <th className="py-3.5 px-4 text-right">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recapData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada data rekap untuk filter yang dipilih.
                  </td>
                </tr>
              ) : (
                recapData.map((item) => (
                  <tr key={item.participant.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.participant.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        NIM: {item.participant.student_number}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.participant.institution}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-800 bg-emerald-50/30">
                      {item.hadir}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-800 bg-amber-50/30">
                      {item.terlambat}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-800 bg-blue-50/30">
                      {item.izin}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-purple-800 bg-purple-50/30">
                      {item.sakit}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-rose-800 bg-rose-50/30">
                      {item.alpha}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-extrabold text-slate-900">
                      {item.total}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg ${
                          item.percentage >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.percentage >= 70
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer with Totals */}
            {recapData.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 text-slate-800 font-bold border-t-2 border-slate-300">
                  <td colSpan={2} className="py-3.5 px-4 uppercase text-[11px]">
                    Total Akumulasi
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-emerald-800">
                    {overall.hadir}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-amber-800">
                    {overall.terlambat}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-blue-800">
                    {overall.izin}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-purple-800">
                    {overall.sakit}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-rose-800">
                    {overall.alpha}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-900">
                    {overall.total}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-blue-800">
                    {overall.total > 0
                      ? Math.round(
                          ((overall.hadir + overall.terlambat) / overall.total) * 100
                        )
                      : 100}
                    % Rata-rata
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
