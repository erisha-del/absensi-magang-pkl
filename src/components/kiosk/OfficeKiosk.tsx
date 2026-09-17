import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BpsLogo } from '../common/BpsLogo';
import { Participant, Attendance } from '../../types';
import confetti from 'canvas-confetti';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  User,
  Building,
  GraduationCap,
  Sparkles,
  MapPin,
  ShieldAlert,
} from 'lucide-react';

export const OfficeKiosk: React.FC = () => {
  const {
    checkInKiosk,
    getParticipantByEmail,
    hasCheckedInToday,
    participants,
    systemSettings,
  } = useApp();

  // Kiosk step: 'input' | 'confirm' | 'success' | 'already_checked_in'
  const [step, setStep] = useState<'input' | 'confirm' | 'success' | 'already_checked_in'>('input');
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [matchedParticipant, setMatchedParticipant] = useState<Participant | null>(null);
  const [lastAttendance, setLastAttendance] = useState<Attendance | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  // Live time ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentTime);

  const formattedClock = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Countdown auto-reset on success
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'success') {
      setCountdown(5);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleResetKiosk();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleResetKiosk = () => {
    setStep('input');
    setEmailInput('');
    setErrorMessage('');
    setMatchedParticipant(null);
    setLastAttendance(null);
    setCountdown(5);
  };

  const handleVerifyEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!emailInput.trim()) {
      setErrorMessage('Silakan masukkan email Anda.');
      return;
    }

    const participant = getParticipantByEmail(emailInput);
    if (!participant) {
      setErrorMessage('Email tidak terdaftar. Silakan hubungi admin.');
      return;
    }

    if (participant.status === 'Nonaktif') {
      setErrorMessage('Akun Anda nonaktif. Silakan hubungi pembimbing BPS.');
      return;
    }

    // Check if already checked in today
    const existing = hasCheckedInToday(participant.id);
    if (existing) {
      setMatchedParticipant(participant);
      setLastAttendance(existing);
      setStep('already_checked_in');
      return;
    }

    setMatchedParticipant(participant);
    setStep('confirm');
  };

  const handlePerformCheckIn = () => {
    if (!matchedParticipant) return;

    const result = checkInKiosk(matchedParticipant.email);
    if (result.success && result.attendance) {
      setLastAttendance(result.attendance);
      setStep('success');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#38BDF8', '#10B981', '#F59E0B'],
        });
      } catch (err) {
        // Safe fallback if canvas is not ready
      }
    } else if (result.alreadyCheckedIn && result.attendance) {
      setLastAttendance(result.attendance);
      setStep('already_checked_in');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-radial from-blue-50 via-slate-50 to-blue-100/60 py-8 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Terminal Header Info Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-5 border border-blue-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>TERMINAL PC ABSENSI RESMI BPS</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md font-mono font-bold">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{formattedClock}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: INITIAL EMAIL INPUT */}
        {step === 'input' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 text-center relative overflow-hidden">
            {/* Blue accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />

            <div className="flex justify-center mb-5">
              <BpsLogo size="lg" showText={false} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
              Absensi PKL/Magang
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Silakan login untuk melakukan absensi hari ini di PC Kantor Badan Pusat Statistik.
            </p>

            <form onSubmit={handleVerifyEmail} className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Siswa / Mahasiswa:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="nama@email.com / instansi.ac.id"
                    autoFocus
                    className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all ${
                      errorMessage ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>

                {errorMessage && (
                  <div className="mt-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-start gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Login & Absen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick-select helper for easy demonstration / testing on this PC */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-3 font-medium">
                Pilih cepat untuk uji coba absensi:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {participants.slice(0, 4).map((p) => {
                  const already = hasCheckedInToday(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setEmailInput(p.email);
                        setErrorMessage('');
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        emailInput === p.email
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : already
                          ? 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                          : 'bg-blue-50/70 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="font-medium">{p.name.split(' ')[0]}</span>
                      {already && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">
                          Sudah
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Office Late Rule notice */}
            <div className="mt-5 text-[11px] text-slate-400">
              Batas waktu absensi tepat waktu:{' '}
              <span className="font-semibold text-slate-600">
                pukul {systemSettings.late_cutoff_time || '08:00'} WIB
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRMATION & IDENTITAS PESERTA */}
        {step === 'confirm' && matchedParticipant && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold text-blue-800 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Verifikasi Identitas Siswa/Mahasiswa</span>
            </div>

            {/* Student Identity Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 mb-6 text-left flex flex-col sm:flex-row items-center gap-5">
              <img
                src={matchedParticipant.profile_photo}
                alt={matchedParticipant.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-blue-100 shadow-md flex-shrink-0"
              />

              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <div className="text-xs font-mono font-semibold text-blue-600 uppercase">
                  NIM/NIS: {matchedParticipant.student_number}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {matchedParticipant.name}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{matchedParticipant.institution}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{matchedParticipant.major}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Email: <span className="font-mono text-slate-600">{matchedParticipant.email}</span>
                </div>
              </div>
            </div>

            {/* Time Info */}
            <div className="bg-blue-50/80 rounded-xl p-3.5 border border-blue-100 mb-6 flex items-center justify-between text-xs">
              <div className="text-slate-600 font-medium">
                Waktu Absensi Kantor:
              </div>
              <div className="font-bold text-blue-950 font-mono text-sm">
                {formattedClock} WIB • {formattedDate}
              </div>
            </div>

            {/* Big Check-in Button */}
            <div className="space-y-3">
              <button
                onClick={handlePerformCheckIn}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.98] text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
                <span>ABSEN SEKARANG</span>
              </button>

              <button
                onClick={handleResetKiosk}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Bukan Anda? Kembali ke Login
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Absensi berhasil!
            </h2>
            <p className="text-base text-slate-600 font-medium mb-6">
              Selamat menjalankan kegiatan PKL hari ini.
            </p>

            {/* Receipt card */}
            {lastAttendance && matchedParticipant && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-8 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Nama Peserta:</span>
                  <span className="font-bold text-slate-900">{matchedParticipant.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Jam Masuk:</span>
                  <span className="font-bold text-blue-700 font-mono text-sm">
                    {lastAttendance.check_in_time} WIB
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Status Kehadiran:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      lastAttendance.status === 'Hadir'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {lastAttendance.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sumber Absensi:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Kantor BPS
                  </span>
                </div>
              </div>
            )}

            {/* Countdown notice & instant reset button */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Otomatis kembali ke halaman login dalam{' '}
                  <strong className="text-blue-700 font-bold font-mono">{countdown} detik</strong>
                </span>
              </div>

              <div>
                <button
                  onClick={handleResetKiosk}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Selesai (Peserta Berikutnya)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ALREADY CHECKED IN TODAY */}
        {step === 'already_checked_in' && matchedParticipant && lastAttendance && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-amber-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Anda sudah melakukan absensi hari ini.
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Satu peserta hanya dapat melakukan absensi masuk 1 kali per hari.
            </p>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 mb-6 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-900 font-medium">Nama:</span>
                <span className="font-bold text-slate-900">{matchedParticipant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-900 font-medium">Waktu Absen:</span>
                <span className="font-bold font-mono text-slate-900">{lastAttendance.check_in_time} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-900 font-medium">Status:</span>
                <span className="font-bold text-emerald-700">{lastAttendance.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-900 font-medium">Sumber:</span>
                <span className="font-medium text-slate-700">{lastAttendance.source}</span>
              </div>
            </div>

            <button
              onClick={handleResetKiosk}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Kembali ke Halaman Login</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
