import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Calendar,
  Clock,
  Paperclip,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const AdminLeaves: React.FC = () => {
  const { leaveRequests, reviewLeaveRequest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter((leave) => {
      const matchesSearch =
        leave.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.participant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'Semua' || leave.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leaveRequests, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Data Pengajuan Izin & Sakit</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Tinjau, setujui, atau tolak permohonan izin dari peserta PKL. Persetujuan otomatis memperbarui rekap absensi.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama peserta / alasan izin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400 text-xs self-start sm:self-auto">
          Total Pengajuan: <strong>{filteredLeaves.length}</strong>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Jenis Izin</th>
                <th className="py-3.5 px-4">Tanggal Izin</th>
                <th className="py-3.5 px-4">Alasan</th>
                <th className="py-3.5 px-4">Lampiran</th>
                <th className="py-3.5 px-4">Waktu Pengajuan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada permohonan izin yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{leave.participant_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{leave.participant_email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          leave.type === 'Sakit'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {leave.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {leave.date}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {leave.proof_file ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-semibold cursor-pointer hover:underline">
                          <Paperclip className="w-3 h-3" />
                          <span>{leave.proof_file}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {leave.created_at}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          leave.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-800'
                            : leave.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {leave.status === 'Menunggu' && (
                          <>
                            <button
                              onClick={() => reviewLeaveRequest(leave.id, 'Disetujui')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title="Setujui"
                            >
                              <Check className="w-3 h-3" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => reviewLeaveRequest(leave.id, 'Ditolak')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              title="Tolak"
                            >
                              <X className="w-3 h-3" />
                              <span>Tolak</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Detail Permohonan Izin</span>
              </h3>
              <button
                onClick={() => setSelectedLeave(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-medium block">Nama Peserta:</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {selectedLeave.participant_name}
                </span>
                <span className="font-mono text-slate-500 block text-[11px]">
                  {selectedLeave.participant_email}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Jenis:</span>
                  <span className="font-bold text-slate-800">{selectedLeave.type}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Tanggal:</span>
                  <span className="font-bold text-slate-800">{selectedLeave.date}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">Alasan Pengajuan:</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedLeave.reason}
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1">Bukti Surat / Foto:</span>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="font-mono text-blue-800 font-semibold">
                    {selectedLeave.proof_file || 'Tidak ada lampiran'}
                  </span>
                  {selectedLeave.proof_file && (
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                      Terverifikasi
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-[11px]">
                Status saat ini: <strong className="text-slate-800">{selectedLeave.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                {selectedLeave.status === 'Menunggu' && (
                  <>
                    <button
                      onClick={() => {
                        reviewLeaveRequest(selectedLeave.id, 'Ditolak');
                        setSelectedLeave(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => {
                        reviewLeaveRequest(selectedLeave.id, 'Disetujui');
                        setSelectedLeave(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                      Setujui Izin
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
