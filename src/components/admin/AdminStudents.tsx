import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Participant, ParticipantStatus } from '../../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Power,
  Building,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  FileText,
  BookOpen,
  X,
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const {
    participants,
    addParticipant,
    updateParticipant,
    toggleParticipantStatus,
    attendances,
    leaveRequests,
    logbooks,
    getParticipantStats,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [detailParticipant, setDetailParticipant] = useState<Participant | null>(null);
  const [detailTab, setDetailTab] = useState<'biodata' | 'statistik' | 'absensi' | 'izin' | 'logbook'>('biodata');

  // New participant form state
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    student_number: '',
    institution: '',
    major: '',
    phone: '',
    start_date: '2026-08-01',
    end_date: '2026-11-30',
    status: 'Aktif' as ParticipantStatus,
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  });

  // Unique institutions for filter
  const institutionList = useMemo(() => {
    return Array.from(new Set(participants.map((p) => p.institution)));
  }, [participants]);

  // Filtered participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.student_number.includes(searchQuery) ||
        p.major.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesInst =
        institutionFilter === 'Semua' || p.institution === institutionFilter;

      const matchesStatus =
        statusFilter === 'Semua' || p.status === statusFilter;

      return matchesSearch && matchesInst && matchesStatus;
    });
  }, [participants, searchQuery, institutionFilter, statusFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addParticipant(newParticipant);
    if (res.success) {
      setShowAddModal(false);
      setNewParticipant({
        name: '',
        email: '',
        student_number: '',
        institution: '',
        major: '',
        phone: '',
        start_date: '2026-08-01',
        end_date: '2026-11-30',
        status: 'Aktif',
        profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      });
    } else {
      alert(res.message);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;
    updateParticipant(editingParticipant.id, editingParticipant);
    setEditingParticipant(null);
  };

  // Detail Modal Sub-data
  const studentAttendances = useMemo(() => {
    if (!detailParticipant) return [];
    return attendances.filter((a) => a.participant_id === detailParticipant.id);
  }, [attendances, detailParticipant]);

  const studentLeaves = useMemo(() => {
    if (!detailParticipant) return [];
    return leaveRequests.filter((l) => l.participant_id === detailParticipant.id);
  }, [leaveRequests, detailParticipant]);

  const studentLogbooks = useMemo(() => {
    if (!detailParticipant) return [];
    return logbooks.filter((l) => l.participant_id === detailParticipant.id);
  }, [logbooks, detailParticipant]);

  const studentStats = detailParticipant ? getParticipantStats(detailParticipant.id) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Data Siswa & Mahasiswa PKL</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh siswa/mahasiswa magang terdaftar di Badan Pusat Statistik.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Peserta</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama, email, NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Instansi Filter */}
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Semua">Semua Instansi / Kampus</option>
              {institutionList.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Semua">Semua Status PKL</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3.5 px-3">No</th>
                <th className="py-3.5 px-3">Foto & Nama</th>
                <th className="py-3.5 px-3">NIM / NIS</th>
                <th className="py-3.5 px-3">Sekolah / Universitas</th>
                <th className="py-3.5 px-3">Jurusan</th>
                <th className="py-3.5 px-3">Periode PKL</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data siswa/mahasiswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.profile_photo}
                          alt={p.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-blue-300"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700 font-medium">
                      {p.student_number}
                    </td>
                    <td className="py-3.5 px-3 text-slate-800 font-medium">
                      {p.institution}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{p.major}</td>
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {p.start_date} s/d {p.end_date}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Selesai'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'Aktif'
                              ? 'bg-emerald-600'
                              : p.status === 'Selesai'
                              ? 'bg-blue-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Detail */}
                        <button
                          onClick={() => {
                            setDetailParticipant(p);
                            setDetailTab('biodata');
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                          title="Lihat Detail Peserta"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingParticipant({ ...p })}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Edit Data"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Toggle Active/Inactive */}
                        <button
                          onClick={() => toggleParticipantStatus(p.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            p.status === 'Aktif'
                              ? 'border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          }`}
                          title={p.status === 'Aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TAMBAH PESERTA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Tambah Peserta PKL/Magang Baru</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  placeholder="Nama Siswa / Mahasiswa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIM / NIS:</label>
                  <input
                    type="text"
                    required
                    value={newParticipant.student_number}
                    onChange={(e) => setNewParticipant({ ...newParticipant, student_number: e.target.value })}
                    placeholder="212211..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sekolah / Universitas:</label>
                  <input
                    type="text"
                    required
                    value={newParticipant.institution}
                    onChange={(e) => setNewParticipant({ ...newParticipant, institution: e.target.value })}
                    placeholder="Politeknik Statistika STIS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jurusan / Prodi:</label>
                  <input
                    type="text"
                    required
                    value={newParticipant.major}
                    onChange={(e) => setNewParticipant({ ...newParticipant, major: e.target.value })}
                    placeholder="D4 Komputasi Statistik"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp:</label>
                <input
                  type="text"
                  required
                  value={newParticipant.phone}
                  onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai:</label>
                  <input
                    type="date"
                    required
                    value={newParticipant.start_date}
                    onChange={(e) => setNewParticipant({ ...newParticipant, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Selesai:</label>
                  <input
                    type="date"
                    required
                    value={newParticipant.end_date}
                    onChange={(e) => setNewParticipant({ ...newParticipant, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Foto Profil:</label>
                <input
                  type="text"
                  value={newParticipant.profile_photo}
                  onChange={(e) => setNewParticipant({ ...newParticipant, profile_photo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Peserta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PESERTA */}
      {editingParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <span>Edit Data Peserta PKL</span>
              </h3>
              <button
                onClick={() => setEditingParticipant(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={editingParticipant.name}
                  onChange={(e) =>
                    setEditingParticipant({ ...editingParticipant, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIM / NIS:</label>
                  <input
                    type="text"
                    required
                    value={editingParticipant.student_number}
                    onChange={(e) =>
                      setEditingParticipant({ ...editingParticipant, student_number: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status PKL:</label>
                  <select
                    value={editingParticipant.status}
                    onChange={(e) =>
                      setEditingParticipant({
                        ...editingParticipant,
                        status: e.target.value as ParticipantStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sekolah / Universitas:</label>
                  <input
                    type="text"
                    required
                    value={editingParticipant.institution}
                    onChange={(e) =>
                      setEditingParticipant({ ...editingParticipant, institution: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jurusan / Prodi:</label>
                  <input
                    type="text"
                    required
                    value={editingParticipant.major}
                    onChange={(e) =>
                      setEditingParticipant({ ...editingParticipant, major: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp:</label>
                <input
                  type="text"
                  required
                  value={editingParticipant.phone}
                  onChange={(e) =>
                    setEditingParticipant({ ...editingParticipant, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DETAIL LENGKAP PESERTA DENGAN TABS */}
      {detailParticipant && studentStats && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={detailParticipant.profile_photo}
                  alt={detailParticipant.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {detailParticipant.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    NIM: {detailParticipant.student_number} • {detailParticipant.institution}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailParticipant(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5 Detail Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
              {[
                { id: 'biodata', label: 'Biodata Lengkap', icon: Users },
                { id: 'statistik', label: 'Statistik Kehadiran', icon: CheckCircle2 },
                { id: 'absensi', label: `Riwayat Absensi (${studentAttendances.length})`, icon: Calendar },
                { id: 'izin', label: `Riwayat Izin (${studentLeaves.length})`, icon: FileText },
                { id: 'logbook', label: `Logbook (${studentLogbooks.length})`, icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = detailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: BIODATA */}
            {detailTab === 'biodata' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-semibold mb-0.5">Email</span>
                  <span className="font-bold text-slate-800 font-mono">{detailParticipant.email}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-semibold mb-0.5">Nomor WhatsApp / HP</span>
                  <span className="font-bold text-slate-800 font-mono">{detailParticipant.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-semibold mb-0.5">Instansi Asal</span>
                  <span className="font-bold text-slate-800">{detailParticipant.institution}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-semibold mb-0.5">Jurusan / Program Studi</span>
                  <span className="font-bold text-slate-800">{detailParticipant.major}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-semibold mb-0.5">Periode PKL</span>
                  <span className="font-bold text-slate-800">
                    {detailParticipant.start_date} s/d {detailParticipant.end_date}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block font-semibold mb-0.5">Status Akun PKL</span>
                  <span className="font-bold text-emerald-700">{detailParticipant.status}</span>
                </div>
              </div>
            )}

            {/* TAB 2: STATISTIK KEHADIRAN */}
            {detailTab === 'statistik' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                    <div className="text-2xl font-extrabold text-emerald-800 font-mono">
                      {studentStats.hadir}
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mt-1">Hadir Tepat</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                    <div className="text-2xl font-extrabold text-amber-800 font-mono">
                      {studentStats.terlambat}
                    </div>
                    <div className="text-xs font-semibold text-amber-700 mt-1">Terlambat</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                    <div className="text-2xl font-extrabold text-blue-800 font-mono">
                      {studentStats.izin}
                    </div>
                    <div className="text-xs font-semibold text-blue-700 mt-1">Izin</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-center">
                    <div className="text-2xl font-extrabold text-purple-800 font-mono">
                      {studentStats.sakit}
                    </div>
                    <div className="text-xs font-semibold text-purple-700 mt-1">Sakit</div>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">
                    <div className="text-2xl font-extrabold text-rose-800 font-mono">
                      {studentStats.alpha}
                    </div>
                    <div className="text-xs font-semibold text-rose-700 mt-1">Alpha</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Tingkat Kehadiran Kumulatif:</span>
                  <span className="font-bold text-blue-700 text-sm font-mono">
                    {studentStats.totalSemua > 0
                      ? Math.round(
                          ((studentStats.hadir + studentStats.terlambat) / studentStats.totalSemua) * 100
                        )
                      : 100}
                    %
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: RIWAYAT ABSENSI */}
            {detailTab === 'absensi' && (
              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b">
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Jam Masuk</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Sumber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendances.map((att) => (
                      <tr key={att.id}>
                        <td className="py-2 px-3 font-semibold">{att.attendance_date}</td>
                        <td className="py-2 px-3 font-mono">{att.check_in_time}</td>
                        <td className="py-2 px-3">
                          <span className="font-bold">{att.status}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-500">{att.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: RIWAYAT IZIN */}
            {detailTab === 'izin' && (
              <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                {studentLeaves.length === 0 ? (
                  <p className="text-center py-6 text-slate-400">Tidak ada pengajuan izin.</p>
                ) : (
                  studentLeaves.map((l) => (
                    <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{l.type} - {l.date}</span>
                        <span className="font-bold text-blue-700">{l.status}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{l.reason}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 5: LOGBOOK */}
            {detailTab === 'logbook' && (
              <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                {studentLogbooks.length === 0 ? (
                  <p className="text-center py-6 text-slate-400">Belum ada entri logbook.</p>
                ) : (
                  studentLogbooks.map((lb) => (
                    <div key={lb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{lb.title}</span>
                        <span className="font-mono text-slate-400">{lb.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{lb.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailParticipant(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
