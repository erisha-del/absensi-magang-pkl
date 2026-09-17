import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Participant,
  Attendance,
  LeaveRequest,
  Logbook,
  SystemSettings,
  AttendanceStatus,
  LeaveStatus,
} from '../types';
import {
  initialAdminUser,
  initialParticipants,
  initialAttendances,
  initialLeaveRequests,
  initialLogbooks,
  initialSystemSettings,
  getTodayDateStr,
} from '../data/mockData';

export type AppInterface = 'kiosk' | 'portal' | 'admin';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & Sessions
  currentInterface: AppInterface;
  setCurrentInterface: (mode: AppInterface) => void;
  currentParticipant: Participant | null;
  setCurrentParticipant: (participant: Participant | null) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  adminUser: User;

  // Data Stores
  participants: Participant[];
  attendances: Attendance[];
  leaveRequests: LeaveRequest[];
  logbooks: Logbook[];
  systemSettings: SystemSettings;

  // Actions - Kiosk
  checkInKiosk: (email: string) => {
    success: boolean;
    message: string;
    participant?: Participant;
    attendance?: Attendance;
    alreadyCheckedIn?: boolean;
  };
  getParticipantByEmail: (email: string) => Participant | undefined;

  // Actions - Leave Requests
  submitLeaveRequest: (data: {
    participant_id: string;
    type: 'Izin' | 'Sakit';
    date: string;
    reason: string;
    attachment?: string;
  }) => { success: boolean; message: string };
  reviewLeaveRequest: (id: string, status: LeaveStatus) => void;

  // Actions - Logbook
  submitLogbook: (data: {
    participant_id: string;
    date: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    attachment?: string;
    notes?: string;
  }) => { success: boolean; message: string };
  updateLogbook: (id: string, data: Partial<Logbook>) => void;
  reviewLogbook: (id: string, status: 'Disetujui' | 'Perlu Revisi', notes?: string) => void;

  // Actions - Participants
  addParticipant: (data: Omit<Participant, 'id' | 'user_id'>) => { success: boolean; message: string };
  updateParticipant: (id: string, data: Partial<Participant>) => void;
  toggleParticipantStatus: (id: string) => void;

  // Actions - Manual Attendance (Admin)
  addManualAttendance: (data: Omit<Attendance, 'id' | 'created_at'>) => void;
  deleteAttendance: (id: string) => void;

  // Settings & Storage
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetAllData: () => void;

  // Computations
  getParticipantStats: (participantId: string) => {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    totalHadirDanTerlambat: number;
    totalSemua: number;
  };
  getTodaySummary: () => {
    totalStudents: number;
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    belumAbsen: number;
  };
  hasCheckedInToday: (participantId: string) => Attendance | undefined;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentInterface, setCurrentInterface] = useState<AppInterface>(() => {
    return (localStorage.getItem('bps_current_interface') as AppInterface) || 'kiosk';
  });

  // Data persistence
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('bps_participants');
    return saved ? JSON.parse(saved) : initialParticipants;
  });

  const [attendances, setAttendances] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('bps_attendances');
    return saved ? JSON.parse(saved) : initialAttendances;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('bps_leave_requests');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [logbooks, setLogbooks] = useState<Logbook[]>(() => {
    const saved = localStorage.getItem('bps_logbooks');
    return saved ? JSON.parse(saved) : initialLogbooks;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('bps_system_settings');
    return saved ? JSON.parse(saved) : initialSystemSettings;
  });

  // Sessions
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(() => {
    const savedEmail = localStorage.getItem('bps_logged_in_participant_email');
    if (savedEmail) {
      const found = (JSON.parse(localStorage.getItem('bps_participants') || '[]') as Participant[]).find(
        (p) => p.email.toLowerCase() === savedEmail.toLowerCase()
      );
      if (found) return found;
    }
    return initialParticipants[0]; // Default to Isma Choirunnisa for seamless exploration
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('bps_is_admin_logged_in');
    return saved ? JSON.parse(saved) : true; // Default to true so admin can be evaluated directly
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bps_current_interface', currentInterface);
  }, [currentInterface]);

  useEffect(() => {
    localStorage.setItem('bps_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('bps_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('bps_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('bps_logbooks', JSON.stringify(logbooks));
  }, [logbooks]);

  useEffect(() => {
    localStorage.setItem('bps_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    if (currentParticipant) {
      localStorage.setItem('bps_logged_in_participant_email', currentParticipant.email);
    } else {
      localStorage.removeItem('bps_logged_in_participant_email');
    }
  }, [currentParticipant]);

  useEffect(() => {
    localStorage.setItem('bps_is_admin_logged_in', JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getParticipantByEmail = (email: string): Participant | undefined => {
    const cleanEmail = email.trim().toLowerCase();
    return participants.find((p) => p.email.toLowerCase() === cleanEmail);
  };

  const hasCheckedInToday = (participantId: string): Attendance | undefined => {
    const today = getTodayDateStr(0);
    return attendances.find(
      (a) => a.participant_id === participantId && a.attendance_date === today
    );
  };

  // Kiosk Check-in Logic
  const checkInKiosk = (email: string) => {
    const participant = getParticipantByEmail(email);
    if (!participant) {
      return {
        success: false,
        message: 'Email tidak terdaftar. Silakan hubungi admin.',
      };
    }

    if (participant.status === 'Nonaktif') {
      return {
        success: false,
        message: 'Akun Anda sedang nonaktif. Silakan hubungi admin pembimbing BPS.',
      };
    }

    const today = getTodayDateStr(0);
    const existing = attendances.find(
      (a) => a.participant_id === participant.id && a.attendance_date === today
    );

    if (existing) {
      return {
        success: false,
        alreadyCheckedIn: true,
        participant,
        attendance: existing,
        message: 'Anda sudah melakukan absensi hari ini.',
      };
    }

    // Determine current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const checkInTime = `${hours}:${minutes}:${seconds}`;

    // Compare with late cutoff
    const cutoff = systemSettings.late_cutoff_time || '08:00';
    const currentTimeStr = `${hours}:${minutes}`;
    const status: AttendanceStatus = currentTimeStr > cutoff ? 'Terlambat' : 'Hadir';

    const newAttendance: Attendance = {
      id: `att-${Date.now()}`,
      participant_id: participant.id,
      participant_name: participant.name,
      participant_email: participant.email,
      participant_institution: participant.institution,
      attendance_date: today,
      check_in_time: checkInTime,
      status,
      source: 'Kantor',
      notes: status === 'Terlambat' ? `Terlambat (masuk lewat pukul ${cutoff})` : 'Tepat waktu di PC Kantor',
      created_at: new Date().toISOString(),
    };

    setAttendances((prev) => [newAttendance, ...prev]);

    return {
      success: true,
      message: 'Absensi berhasil! Selamat menjalankan kegiatan PKL hari ini.',
      participant,
      attendance: newAttendance,
    };
  };

  // Leave Requests
  const submitLeaveRequest = (data: {
    participant_id: string;
    type: 'Izin' | 'Sakit';
    date: string;
    reason: string;
    attachment?: string;
  }) => {
    const participant = participants.find((p) => p.id === data.participant_id);
    if (!participant) {
      return { success: false, message: 'Peserta tidak ditemukan.' };
    }

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      participant_id: participant.id,
      participant_name: participant.name,
      participant_email: participant.email,
      participant_institution: participant.institution,
      type: data.type,
      date: data.date,
      reason: data.reason,
      attachment: data.attachment || '',
      status: 'Menunggu',
      created_at: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    showToast('Pengajuan izin berhasil dikirim. Menunggu persetujuan admin.', 'success');
    return { success: true, message: 'Pengajuan izin berhasil dikirim.' };
  };

  const reviewLeaveRequest = (id: string, status: LeaveStatus) => {
    const target = leaveRequests.find((r) => r.id === id);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              reviewed_by: initialAdminUser.name,
              reviewed_at: new Date().toISOString(),
            }
          : req
      )
    );

    // If approved, automatically insert/update attendance record with status 'Izin' or 'Sakit'
    if (status === 'Disetujui') {
      const attendanceStatus: AttendanceStatus = target.type === 'Sakit' ? 'Sakit' : 'Izin';
      setAttendances((prev) => {
        // Check if attendance already exists for that date and participant
        const index = prev.findIndex(
          (a) => a.participant_id === target.participant_id && a.attendance_date === target.date
        );

        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: attendanceStatus,
            source: 'Portal Rumah',
            notes: `Disetujui dari pengajuan izin: ${target.reason}`,
          };
          return updated;
        } else {
          const newAtt: Attendance = {
            id: `att-leave-${Date.now()}`,
            participant_id: target.participant_id,
            participant_name: target.participant_name,
            participant_email: target.participant_email,
            participant_institution: target.participant_institution,
            attendance_date: target.date,
            check_in_time: '08:00:00',
            status: attendanceStatus,
            source: 'Portal Rumah',
            notes: `Pengajuan ${target.type} disetujui: ${target.reason}`,
            created_at: new Date().toISOString(),
          };
          return [newAtt, ...prev];
        }
      });

      showToast(`Pengajuan ${target.type} dari ${target.participant_name} telah disetujui.`, 'success');
    } else {
      showToast(`Pengajuan ${target.type} dari ${target.participant_name} telah ditolak.`, 'info');
    }
  };

  // Logbooks
  const submitLogbook = (data: {
    participant_id: string;
    date: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    attachment?: string;
    notes?: string;
  }) => {
    const participant = participants.find((p) => p.id === data.participant_id);
    if (!participant) {
      return { success: false, message: 'Peserta tidak ditemukan.' };
    }

    const newLogbook: Logbook = {
      id: `log-${Date.now()}`,
      participant_id: participant.id,
      participant_name: participant.name,
      participant_institution: participant.institution,
      date: data.date,
      title: data.title,
      description: data.description,
      start_time: data.start_time,
      end_time: data.end_time,
      attachment: data.attachment || '',
      status: 'Tercatat',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
    };

    setLogbooks((prev) => [newLogbook, ...prev]);
    showToast('Logbook kegiatan harian berhasil disimpan.', 'success');
    return { success: true, message: 'Logbook berhasil disimpan.' };
  };

  const updateLogbook = (id: string, data: Partial<Logbook>) => {
    setLogbooks((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...data } : log))
    );
    showToast('Logbook berhasil diperbarui.', 'success');
  };

  const reviewLogbook = (id: string, status: 'Disetujui' | 'Perlu Revisi', notes?: string) => {
    setLogbooks((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status, notes: notes || log.notes } : log))
    );
    showToast(`Logbook berhasil diupdate statusnya menjadi ${status}.`, 'success');
  };

  // Participant Management
  const addParticipant = (data: Omit<Participant, 'id' | 'user_id'>) => {
    if (participants.some((p) => p.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      user_id: `usr-${Date.now()}`,
      ...data,
    };

    setParticipants((prev) => [...prev, newParticipant]);
    showToast(`Peserta baru "${newParticipant.name}" berhasil ditambahkan.`, 'success');
    return { success: true, message: 'Peserta berhasil ditambahkan.' };
  };

  const updateParticipant = (id: string, data: Partial<Participant>) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    // Also update in current session if matching
    if (currentParticipant && currentParticipant.id === id) {
      setCurrentParticipant((prev) => (prev ? { ...prev, ...data } : null));
    }
    showToast('Data peserta berhasil diperbarui.', 'success');
  };

  const toggleParticipantStatus = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
    showToast('Status peserta berhasil diubah.', 'info');
  };

  // Manual Attendance
  const addManualAttendance = (data: Omit<Attendance, 'id' | 'created_at'>) => {
    const newAtt: Attendance = {
      id: `att-man-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    setAttendances((prev) => [newAtt, ...prev]);
    showToast('Data absensi manual berhasil dicatat.', 'success');
  };

  const deleteAttendance = (id: string) => {
    setAttendances((prev) => prev.filter((a) => a.id !== id));
    showToast('Data absensi berhasil dihapus.', 'info');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Pengaturan sistem berhasil disimpan.', 'success');
  };

  const resetAllData = () => {
    setParticipants(initialParticipants);
    setAttendances(initialAttendances);
    setLeaveRequests(initialLeaveRequests);
    setLogbooks(initialLogbooks);
    setSystemSettings(initialSystemSettings);
    setCurrentParticipant(initialParticipants[0]);
    localStorage.removeItem('bps_participants');
    localStorage.removeItem('bps_attendances');
    localStorage.removeItem('bps_leave_requests');
    localStorage.removeItem('bps_logbooks');
    localStorage.removeItem('bps_system_settings');
    showToast('Data sistem berhasil direset ke setelan awal.', 'info');
  };

  // Statistics computations
  const getParticipantStats = (participantId: string) => {
    const records = attendances.filter((a) => a.participant_id === participantId);
    let hadir = 0;
    let terlambat = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    records.forEach((r) => {
      if (r.status === 'Hadir') hadir++;
      else if (r.status === 'Terlambat') terlambat++;
      else if (r.status === 'Izin') izin++;
      else if (r.status === 'Sakit') sakit++;
      else if (r.status === 'Alpha') alpha++;
    });

    return {
      hadir,
      terlambat,
      izin,
      sakit,
      alpha,
      totalHadirDanTerlambat: hadir + terlambat,
      totalSemua: records.length,
    };
  };

  const getTodaySummary = () => {
    const today = getTodayDateStr(0);
    const activeParticipants = participants.filter((p) => p.status === 'Aktif');
    const todayAttendances = attendances.filter((a) => a.attendance_date === today);

    let hadir = 0;
    let terlambat = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    todayAttendances.forEach((a) => {
      if (a.status === 'Hadir') hadir++;
      else if (a.status === 'Terlambat') terlambat++;
      else if (a.status === 'Izin') izin++;
      else if (a.status === 'Sakit') sakit++;
      else if (a.status === 'Alpha') alpha++;
    });

    const totalStudents = activeParticipants.length;
    const sudahAbsenCount = todayAttendances.length;
    const belumAbsen = Math.max(0, totalStudents - sudahAbsenCount);

    return {
      totalStudents,
      hadir,
      terlambat,
      izin,
      sakit,
      alpha,
      belumAbsen,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentInterface,
        setCurrentInterface,
        currentParticipant,
        setCurrentParticipant,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminUser: initialAdminUser,
        participants,
        attendances,
        leaveRequests,
        logbooks,
        systemSettings,
        checkInKiosk,
        getParticipantByEmail,
        submitLeaveRequest,
        reviewLeaveRequest,
        submitLogbook,
        updateLogbook,
        reviewLogbook,
        addParticipant,
        updateParticipant,
        toggleParticipantStatus,
        addManualAttendance,
        deleteAttendance,
        updateSettings,
        resetAllData,
        getParticipantStats,
        getTodaySummary,
        hasCheckedInToday,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
