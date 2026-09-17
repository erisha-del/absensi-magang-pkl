import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr } from '../../data/mockData';
import {
  FileText,
  Calendar,
  Send,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertCircle,
  Paperclip,
} from 'lucide-react';

export const PortalLeaveRequest: React.FC = () => {
  const { currentParticipant, leaveRequests, submitLeaveRequest } = useApp();

  const [type, setType] = useState<'Izin' | 'Sakit'>('Izin');
  const [date, setDate] = useState(getTodayDateStr(1));
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentParticipant) return null;

  // Filter only this participant's leave requests
  const myLeaveRequests = leaveRequests.filter(
    (req) => req.participant_id === currentParticipant.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reason.trim()) {
      setErrorMsg('Harap isi alasan atau keterangan pengajuan izin.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitLeaveRequest({
        participant_id: currentParticipant.id,
        type,
        date,
        reason,
        attachment: attachmentName || (type === 'Sakit' ? 'Surat_Keterangan_Dokter.pdf' : 'Surat_Izin_Resmi.pdf'),
      });

      // Reset form
      setReason('');
      setAttachmentName('');
      setIsSubmitting(false);
    }, 400);
  };

  const handleSimulateUpload = () => {
    const sampleFiles = [
      'Surat_Keterangan_Sakit_Klinik.pdf',
      'Surat_Tugas_Kampus_Akademik.pdf',
      'Bukti_Undangan_Sidang.jpg',
      'Form_Izin_Dosen_Pembimbing.pdf',
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setAttachmentName(picked);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Pengajuan Izin & Sakit</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ajukan permohonan izin tidak masuk atau istirahat sakit dari rumah secara mandiri.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Pengajuan Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm h-fit">
          <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span>Formulir Pengajuan</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Jenis Izin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Jenis Pengajuan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('Izin')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    type === 'Izin'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Izin Keperluan
                </button>
                <button
                  type="button"
                  onClick={() => setType('Sakit')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    type === 'Sakit'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sakit / Istirahat
                </button>
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Alasan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan / Alasan Lengkap:
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Mengikuti bimbingan tugas akhir dengan dosen pembimbing kampus..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            {/* Dokumen / Bukti Pendukung */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Dokumen / Bukti Pendukung:
              </label>
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/60"
              >
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-blue-700 block">
                  {attachmentName ? attachmentName : 'Pilih file surat dokter / dispensasi kampus'}
                </span>
                <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks 5MB)</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim...' : 'Ajukan Izin'}</span>
            </button>
          </form>
        </div>

        {/* Tabel Riwayat Pengajuan Izin */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Status & Riwayat Pengajuan Izin Saya</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengajuan yang disetujui admin otomatis tercatat pada riwayat absensi harian.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
              {myLeaveRequests.length} Pengajuan
            </span>
          </div>

          {myLeaveRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Belum ada pengajuan izin yang dibuat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-3">Tanggal Izin</th>
                    <th className="py-3 px-3">Jenis</th>
                    <th className="py-3 px-3">Alasan / Keterangan</th>
                    <th className="py-3 px-3">Dokumen</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myLeaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {req.date}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded ${
                            req.type === 'Sakit'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {req.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs">
                        <p className="line-clamp-2">{req.reason}</p>
                        {req.reviewed_by && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Direview oleh: {req.reviewed_by}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        {req.attachment ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline">
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{req.attachment}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Tidak ada</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {req.status === 'Disetujui' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Disetujui
                          </span>
                        )}
                        {req.status === 'Ditolak' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Ditolak
                          </span>
                        )}
                        {req.status === 'Menunggu' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Menunggu
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
