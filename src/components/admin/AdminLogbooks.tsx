import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Logbook } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  Paperclip,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';

export const AdminLogbooks: React.FC = () => {
  const { logbooks, participants, reviewLogbook } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Modal detail
  const [detailLogbook, setDetailLogbook] = useState<Logbook | null>(null);

  // Map participant data
  const participantMap = useMemo(() => {
    const map = new Map();
    participants.forEach((p) => map.set(p.id, p));
    return map;
  }, [participants]);

  const filteredLogbooks = useMemo(() => {
    return logbooks.filter((log) => {
      const part = participantMap.get(log.participant_id);
      const studentName = part?.name || '';
      const studentInst = part?.institution || '';

      const matchesSearch =
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStudent =
        selectedStudentId === 'Semua' || log.participant_id === selectedStudentId;

      const matchesDate = !dateFilter || log.date === dateFilter;
      const matchesStatus = statusFilter === 'Semua' || log.status === statusFilter;

      return matchesSearch && matchesStudent && matchesDate && matchesStatus;
    });
  }, [logbooks, participantMap, searchQuery, selectedStudentId, dateFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>Data Logbook & Jurnal Kegiatan Siswa</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pantau seluruh aktivitas harian, laporan tugas statistik, dan verifikasi logbook siswa magang BPS.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari judul / deskripsi / nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Filter Peserta */}
          <div>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-700 bg-white"
            >
              <option value="Semua">Semua Peserta</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tanggal */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-700"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-700 bg-white"
            >
              <option value="Semua">Semua Status Logbook</option>
              <option value="Tercatat">Tercatat</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Perlu Revisi">Perlu Revisi</option>
            </select>
          </div>
        </div>

        {(searchQuery || selectedStudentId !== 'Semua' || dateFilter || statusFilter !== 'Semua') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500">
            <span>
              Menampilkan <strong>{filteredLogbooks.length}</strong> entri logbook
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStudentId('Semua');
                setDateFilter('');
                setStatusFilter('Semua');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Jam Pelaksanaan</th>
                <th className="py-3.5 px-4">Judul Kegiatan</th>
                <th className="py-3.5 px-4">Ringkasan Kegiatan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogbooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada catatan logbook yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogbooks.map((log) => {
                  const student = participantMap.get(log.participant_id);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{student?.name || 'Peserta'}</div>
                        <div className="text-[10px] text-slate-400">{student?.institution}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {log.start_time} - {log.end_time}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                        {log.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            log.status === 'Disetujui'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'Perlu Revisi'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setDetailLogbook(log)}
                          className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tinjau</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & REVIEW MODAL */}
      {detailLogbook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Tinjau Jurnal Logbook</span>
              </h3>
              <button
                onClick={() => setDetailLogbook(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 font-medium block">Peserta:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {participantMap.get(detailLogbook.participant_id)?.name}
                </span>
                <span className="text-slate-500 block text-[11px]">
                  {participantMap.get(detailLogbook.participant_id)?.institution}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Tanggal:</span>
                  <span className="font-bold text-slate-800">{detailLogbook.date}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Jam:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {detailLogbook.start_time} - {detailLogbook.end_time} WIB
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">Judul Kegiatan:</span>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 font-bold text-slate-900">
                  {detailLogbook.title}
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">Deskripsi Lengkap:</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line">
                  {detailLogbook.description}
                </div>
              </div>

              {detailLogbook.attachment && (
                <div>
                  <span className="text-slate-700 font-bold block mb-1">Dokumentasi:</span>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-blue-600 font-medium">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{detailLogbook.attachment}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-[11px]">
                Status: <strong className="text-slate-800">{detailLogbook.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    reviewLogbook(detailLogbook.id, 'Perlu Revisi');
                    setDetailLogbook(null);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Minta Revisi</span>
                </button>
                <button
                  onClick={() => {
                    reviewLogbook(detailLogbook.id, 'Disetujui');
                    setDetailLogbook(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Setujui</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
