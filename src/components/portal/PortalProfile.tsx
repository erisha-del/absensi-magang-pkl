import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Edit,
  Camera,
  CheckCircle2,
} from 'lucide-react';

export const PortalProfile: React.FC = () => {
  const { currentParticipant, updateParticipant } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentParticipant?.name || '',
    student_number: currentParticipant?.student_number || '',
    phone: currentParticipant?.phone || '',
    institution: currentParticipant?.institution || '',
    major: currentParticipant?.major || '',
    profile_photo: currentParticipant?.profile_photo || '',
  });

  if (!currentParticipant) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateParticipant(currentParticipant.id, {
      name: formData.name,
      student_number: formData.student_number,
      phone: formData.phone,
      institution: formData.institution,
      major: formData.major,
      profile_photo: formData.profile_photo,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <User className="w-6 h-6 text-blue-600" />
          <span>Profil Peserta PKL/Magang</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Informasi biodata terdaftar resmi di Badan Pusat Statistik (BPS).
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Header Background */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900" />

        <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative">
              <img
                src={currentParticipant.profile_photo}
                alt={currentParticipant.name}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Status PKL: {currentParticipant.status}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {currentParticipant.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                NIM / NIS: <strong className="text-slate-700">{currentParticipant.student_number}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setFormData({
                name: currentParticipant.name,
                student_number: currentParticipant.student_number,
                phone: currentParticipant.phone,
                institution: currentParticipant.institution,
                major: currentParticipant.major,
                profile_photo: currentParticipant.profile_photo,
              });
              setIsEditing(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profil</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              Alamat Email
            </span>
            <div className="font-bold text-slate-800 text-sm font-mono">{currentParticipant.email}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Nomor WhatsApp / HP
            </span>
            <div className="font-bold text-slate-800 text-sm font-mono">{currentParticipant.phone}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              Sekolah / Perguruan Tinggi
            </span>
            <div className="font-bold text-slate-800 text-sm">{currentParticipant.institution}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              Program Studi / Jurusan
            </span>
            <div className="font-bold text-slate-800 text-sm">{currentParticipant.major}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Tanggal Mulai PKL
            </span>
            <div className="font-bold text-slate-800 text-sm">{currentParticipant.start_date}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Tanggal Selesai PKL
            </span>
            <div className="font-bold text-slate-800 text-sm">{currentParticipant.end_date}</div>
          </div>
        </div>
      </div>

      {/* Edit Profil Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit className="w-4 h-4 text-blue-600" />
              <span>Edit Data Profil</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIM / NIS:</label>
                <input
                  type="text"
                  value={formData.student_number}
                  onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instansi / Universitas:</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jurusan / Program Studi:</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Foto Profil:</label>
                <input
                  type="text"
                  value={formData.profile_photo}
                  onChange={(e) => setFormData({ ...formData, profile_photo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
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
