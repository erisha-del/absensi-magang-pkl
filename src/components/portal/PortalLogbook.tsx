import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr } from '../../data/mockData';
import { Logbook } from '../../types';
import {
  BookOpen,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Edit,
  FileText,
  Upload,
  AlertCircle,
  Paperclip,
  CheckSquare,
} from 'lucide-react';

export const PortalLogbook: React.FC = () => {
  const { currentParticipant, logbooks, submitLogbook, updateLogbook } = useApp();

  const [date, setDate] = useState(getTodayDateStr(0));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [attachment, setAttachment] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal state
  const [editingLogbook, setEditingLogbook] = useState<Logbook | null>(null);

  if (!currentParticipant) return null;

  // Filter only this participant's logbooks
  const myLogbooks = logbooks.filter((l) => l.participant_id === currentParticipant.id);
  const todayStr = getTodayDateStr(0);
  const todayLogbook = myLogbooks.find((l) => l.date === todayStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitLogbook({
        participant_id: currentParticipant.id,
        date,
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        attachment: attachment || 'dokumentasi_kegiatan_bps.png',
        notes,
      });

      setTitle('');
      setDescription('');
      setAttachment('');
      setNotes('');
      setIsSubmitting(false);
    }, 400);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogbook) return;

    updateLogbook(editingLogbook.id, {
      title: editingLogbook.title,
      description: editingLogbook.description,
      start_time: editingLogbook.start_time,
      end_time: editingLogbook.end_time,
      notes: editingLogbook.notes,
    });

    setEditingLogbook(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>Buku Jurnal / Logbook Kegiatan PKL</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Catat aktivitas statistik harian, analisis data, dan tugas yang Anda kerjakan di BPS.
        </p>
      </div>

      {/* Today's Logbook Spotlight */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50/50 rounded-2xl p-5 border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Logbook Hari Ini ({todayStr})
            </div>
            {todayLogbook ? (
              <div>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{todayLogbook.title}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{todayLogbook.description}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 mt-0.5">
                Anda belum mengisi logbook untuk hari ini. Silakan isi formulir di bawah.
              </p>
            )}
          </div>
        </div>

        {todayLogbook && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Tercatat
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Logbook */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm h-fit">
          <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Isi Logbook Baru</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Kegiatan:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Mulai:</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Selesai:</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Judul Kegiatan:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Validasi Data Susenas 2026..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kegiatan:</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan secara rinci tugas atau pekerjaan statistik yang dilaksanakan..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Upload Dokumentasi (Foto/File):</label>
              <div
                onClick={() => setAttachment('screenshot_pekerjaan_bps.png')}
                className="border border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-3 text-center cursor-pointer bg-slate-50/50"
              >
                <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-blue-700 block">
                  {attachment ? attachment : 'Lampirkan foto kegiatan'}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan dari pembimbing lapangan..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Logbook'}</span>
            </button>
          </form>
        </div>

        {/* Riwayat Logbook */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Riwayat Logbook Saya ({myLogbooks.length})
            </h2>
          </div>

          {myLogbooks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200 text-xs">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Belum ada catatan logbook yang tersimpan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myLogbooks.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{log.date}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.start_time} - {log.end_time} WIB</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{log.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          log.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.status}
                      </span>
                      <button
                        onClick={() => setEditingLogbook({ ...log })}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Edit Logbook"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {log.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-50">
                    {log.attachment && (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                        <Paperclip className="w-3 h-3" />
                        <span>{log.attachment}</span>
                      </span>
                    )}
                    {log.notes && (
                      <span className="italic text-slate-400">
                        Catatan: {log.notes}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingLogbook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit className="w-4 h-4 text-blue-600" />
              <span>Edit Logbook ({editingLogbook.date})</span>
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Kegiatan:</label>
                <input
                  type="text"
                  value={editingLogbook.title}
                  onChange={(e) =>
                    setEditingLogbook({ ...editingLogbook, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai:</label>
                  <input
                    type="time"
                    value={editingLogbook.start_time}
                    onChange={(e) =>
                      setEditingLogbook({ ...editingLogbook, start_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai:</label>
                  <input
                    type="time"
                    value={editingLogbook.end_time}
                    onChange={(e) =>
                      setEditingLogbook({ ...editingLogbook, end_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Kegiatan:</label>
                <textarea
                  rows={4}
                  value={editingLogbook.description}
                  onChange={(e) =>
                    setEditingLogbook({ ...editingLogbook, description: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan:</label>
                <input
                  type="text"
                  value={editingLogbook.notes || ''}
                  onChange={(e) =>
                    setEditingLogbook({ ...editingLogbook, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLogbook(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
