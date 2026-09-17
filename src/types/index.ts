export type UserRole = 'admin' | 'participant';

export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Alpha';

export type AttendanceSource = 'Kantor' | 'Portal Rumah';

export type LeaveType = 'Izin' | 'Sakit';

export type LeaveStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';

export type ParticipantStatus = 'Aktif' | 'Selesai' | 'Nonaktif';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_photo: string;
  created_at: string;
}

export interface Participant {
  id: string;
  user_id: string;
  name: string;
  email: string;
  student_number: string; // NIM/NIS
  institution: string; // Sekolah/Universitas
  major: string; // Program Studi / Jurusan
  phone: string;
  start_date: string;
  end_date: string;
  status: ParticipantStatus;
  profile_photo: string;
}

export interface Attendance {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_email: string;
  participant_institution: string;
  attendance_date: string; // YYYY-MM-DD
  check_in_time: string; // HH:mm:ss
  status: AttendanceStatus;
  source: AttendanceSource;
  notes?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_email: string;
  participant_institution: string;
  type: LeaveType;
  date: string; // YYYY-MM-DD
  reason: string;
  attachment?: string; // Data URL or description
  status: LeaveStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Logbook {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_institution: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  attachment?: string;
  status: 'Tercatat' | 'Disetujui' | 'Perlu Revisi';
  notes?: string;
  created_at: string;
}

export interface SystemSettings {
  office_name: string;
  office_address: string;
  late_cutoff_time: string; // e.g. "08:00"
  work_start_time: string; // e.g. "07:30"
  work_end_time: string; // e.g. "16:00"
}
