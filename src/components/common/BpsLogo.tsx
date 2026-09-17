import React from 'react';

interface BpsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const BpsLogo: React.FC<BpsLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official BPS Geometric Emblem: 3 colored bars forming statistical data chart */}
      <div
        className={`${sizeMap[size]} flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-2 shadow-md flex items-center justify-center border border-blue-400/20`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue diamond/hexagonal motif */}
          <path
            d="M50 8L88 30V70L50 92L12 70V30L50 8Z"
            stroke="#60A5FA"
            strokeWidth="4"
            fill="#1E3A8A"
            fillOpacity="0.4"
          />
          {/* Statistical bar shapes characteristic of BPS */}
          <path
            d="M30 65V48C30 46 32 44 34 44H40C42 44 44 46 44 48V65H30Z"
            fill="#38BDF8"
          />
          <path
            d="M47 65V35C47 33 49 31 51 31H57C59 31 61 33 61 35V65H47Z"
            fill="#F59E0B"
          />
          <path
            d="M64 65V25C64 23 66 21 68 21H74C76 21 78 23 78 25V65H64Z"
            fill="#10B981"
          />
          {/* Growth curve */}
          <path
            d="M25 60C38 52 52 42 75 22"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="75" cy="22" r="3.5" fill="#EF4444" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-wider text-xs uppercase ${
              lightText ? 'text-blue-200' : 'text-blue-900'
            }`}
          >
            BADAN PUSAT STATISTIK
          </span>
          <span
            className={`font-bold tracking-tight leading-tight ${
              size === 'sm'
                ? 'text-sm'
                : size === 'lg'
                ? 'text-lg'
                : size === 'xl'
                ? 'text-xl'
                : 'text-base'
            } ${lightText ? 'text-white' : 'text-slate-900'}`}
          >
            Sistem Absensi PKL/Magang
          </span>
          <span
            className={`text-[11px] font-medium leading-none mt-0.5 ${
              lightText ? 'text-blue-300/80' : 'text-slate-500'
            }`}
          >
            BPS Pusat • Republik Indonesia
          </span>
        </div>
      )}
    </div>
  );
};
