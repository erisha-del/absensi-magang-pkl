import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, AttendanceSource } from '../../types';
import { getTodayDateStr } from '../../data/mockData';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  MapPin,
  Clock,
  X,
  Building,
} from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const {
    attendances,
    participants,
    addManualAttendance,
    deleteAttendance,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [sourceFilter, setSourceFilter] = useState<string>('Semua');
  const [participantFilter, setParticipantFilter] = useState<string>('Semua');

  // Manual Add Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState(participants[0]?.id || '');
  const [manualDate, setManualDate] = useState(getTodayDateStr(0));
  const [manualTime, setManualTime] = useState('07:45:00');
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>('Hadir');
  const [manualSource, setManualSource] = useState<AttendanceSource>('Kantor');
  const [manualNotes, setManualNotes] = useState('Pencatatan manual oleh admin');

  // Filter attendances
  const filteredAttendances = useMemo(() => {
    return attendances.filter((att) => {
      const matchesSearch =
        att.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.participant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.participant_institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (att.notes && att.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDate = !dateFilter || att.attendance_date === dateFilter;
      const matchesStatus = statusFilter === 'Semua' || att.status === statusFilter;
      const matchesSource = sourceFilter === 'Semua' || att.source === sourceFilter;
      const matchesPart =
        participantFilter === 'Semua' || att.participant_id === participantFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesSource && matchesPart;
    });
  }, [attendances, searchQuery, dateFilter, statusFilter, sourceFilter, participantFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Nama Peserta',
      'Email',
      'Instansi',
      'Tanggal',
      'Jam Masuk',
      'Status',
      'Sumber',
      'Keterangan',
    ];

    const rows = filteredAttendances.map((att, i) => [
      i + 1,
      `"${att.participant_name}"`,
      `"${att.participant_email}"`,
      `"${att.participant_institution}"`,
      `"${att.attendance_date}"`,
      `"${att.check_in_time}"`,
      `"${att.status}"`,
      `"${att.source}"`,
      `"${att.notes || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_absensi_bps_${getTodayDateStr(0)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data absensi berhasil diexport ke file CSV.', 'success');
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const part = participants.find((p) => p.id === selectedParticipantId);
    if (!part) return;

    addManualAttendance({
      participant_id: part.id,
      participant_name: part.name,
      participant_email: part.email,
      participant_institution: part.institution,
      attendance_date: manualDate,
      check_in_time: manualTime,
      status: manualStatus,
      source: manualSource,
      notes: manualNotes,
    });

    setShowManualModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Data Seluruh Absensi PKL</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log rekaman kehadiran masuk kantor dan portal mandiri seluruh peserta.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input Manual</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama / email / instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Filter Tanggal */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Alpha">Alpha</option>
            </select>
          </div>

          {/* Filter Sumber */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Semua">Semua Sumber</option>
              <option value="Kantor">Kantor (PC)</option>
              <option value="Portal Rumah">Portal Rumah</option>
            </select>
          </div>

          {/* Filter Peserta */}
          <div>
            <select
              value={participantFilter}
              onChange={(e) => setParticipantFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Semua">Semua Peserta</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchQuery || dateFilter || statusFilter !== 'Semua' || sourceFilter !== 'Semua' || participantFilter !== 'Semua') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500">
            <span>
              Menampilkan <strong>{filteredAttendances.length}</strong> dari {attendances.length} total rekaman
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setDateFilter('');
                setStatusFilter('Semua');
                setSourceFilter('Semua');
                setParticipantFilter('Semua');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Instansi</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Jam Masuk</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sumber Absensi</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada rekaman absensi yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{att.participant_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{att.participant_email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{att.participant_institution}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {att.attendance_date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {att.check_in_time === '-' ? '-' : `${att.check_in_time} WIB`}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          att.status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.status === 'Terlambat'
                            ? 'bg-amber-100 text-amber-800'
                            : att.status === 'Izin'
                            ? 'bg-blue-100 text-blue-800'
                            : att.status === 'Sakit'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {att.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {att.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus data absensi tanggal ${att.attendance_date} untuk ${att.participant_name}?`)) {
                            deleteAttendance(att.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Hapus Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL ADD MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Pencatatan Absensi Manual</span>
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Peserta:</label>
                <select
                  value={selectedParticipantId}
                  onChange={(e) => setSelectedParticipantId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.institution}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal:</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Masuk:</label>
                  <input
                    type="text"
                    required
                    placeholder="07:45:00"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status:</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as AttendanceStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpha">Alpha</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumber:</label>
                  <select
                    value={manualSource}
                    onChange={(e) => setManualSource(e.target.value as AttendanceSource)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Kantor">Kantor</option>
                    <option value="Portal Rumah">Portal Rumah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Catatan:</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Absensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
