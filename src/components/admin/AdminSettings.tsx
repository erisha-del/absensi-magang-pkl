import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Clock,
  Building,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { systemSettings, updateSettings, resetToDefaultData, showToast } = useApp();

  const [formData, setFormData] = useState({
    late_cutoff_time: systemSettings.late_cutoff_time,
    work_start_time: systemSettings.work_start_time,
    work_end_time: systemSettings.work_end_time,
    office_name: systemSettings.office_name,
    office_address: systemSettings.office_address,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengatur ulang semua data simulasi ke data awal BPS? Tindakan ini akan mengembalikan data default.'
      )
    ) {
      resetToDefaultData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Pengaturan Sistem Absensi BPS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Konfigurasi aturan jam kehadiran, ambang batas status terlambat, dan identitas instansi.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh sistem!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Aturan Jam Absensi */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Ketentuan Jam Kerja & Batas Keterlambatan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Batas Jam Tepat Waktu (Cutoff):
                </label>
                <input
                  type="time"
                  required
                  value={formData.late_cutoff_time}
                  onChange={(e) =>
                    setFormData({ ...formData, late_cutoff_time: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Check-in melewati jam ini otomatis berstatus <strong>Terlambat</strong>.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jam Mulai Pelayanan Kantor:
                </label>
                <input
                  type="time"
                  required
                  value={formData.work_start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, work_start_time: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Waktu dimulainya jam operasional kantor.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jam Selesai Kantor (Pulang):
                </label>
                <input
                  type="time"
                  required
                  value={formData.work_end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, work_end_time: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Waktu selesai dinas magang harian.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Instansi */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Profil & Satuan Kerja Badan Pusat Statistik</span>
            </h2>

            <div className="space-y-3.5 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Satuan Kerja / Kantor:
                </label>
                <input
                  type="text"
                  required
                  value={formData.office_name}
                  onChange={(e) =>
                    setFormData({ ...formData, office_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Kantor:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.office_address}
                  onChange={(e) =>
                    setFormData({ ...formData, office_address: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50/70 rounded-3xl p-6 border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Atur Ulang Data Simulasi</span>
        </div>
        <p className="text-xs text-rose-700/80">
          Jika Anda ingin menguji sistem dari kondisi bersih, Anda dapat memuat ulang seluruh basis data ke set data bawaan BPS (peserta asli, absensi hari ini, permohonan izin).
        </p>
        <button
          onClick={handleResetData}
          className="bg-white border border-rose-300 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Demo Awal</span>
        </button>
      </div>
    </div>
  );
};
