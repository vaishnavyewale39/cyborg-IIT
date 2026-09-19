import React from 'react';
import { playTactileClick } from '../utils/audio';

interface CyberPillButtonProps {
  id?: string;
  variant?: 'primary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  badge?: string;
}

export const CyberPillButton: React.FC<CyberPillButtonProps> = ({
  id,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
  disabled = false,
  className = '',
  badge
}) => {
  const handleClick = () => {
    if (disabled) return;
    playTactileClick();
    if (onClick) onClick();
  };

  const sizeClasses = {
    sm: 'text-[11px] px-3.5 py-1.5 gap-1.5 tracking-wider',
    md: 'text-[13px] px-5 py-2 gap-2 tracking-wide',
    lg: 'text-[14px] px-7 py-3 gap-2.5 tracking-wider font-semibold'
  }[size];

  if (variant === 'primary') {
    return (
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`group relative inline-flex items-center justify-center rounded-full p-[1.5px] font-mono transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-gradient-to-r from-[#00f2fe] via-[#7b2cbf] to-[#9d4edd] hover:shadow-[0_0_18px_rgba(0,242,254,0.45)] hover:scale-[1.02] ${className}`}
      >
        <span className={`inline-flex items-center justify-center rounded-full bg-[#0a0a0f]/90 backdrop-blur-md text-[#f1f5f9] group-hover:text-[#00f2fe] group-hover:bg-[#12121a]/95 transition-colors w-full h-full ${sizeClasses}`}>
          {icon && <span className="text-[#00f2fe] transition-transform group-hover:scale-110">{icon}</span>}
          <span className="whitespace-nowrap uppercase">{children}</span>
          {badge && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40">
              {badge}
            </span>
          )}
        </span>
      </button>
    );
  }

  if (variant === 'accent') {
    return (
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`group relative inline-flex items-center justify-center rounded-full p-[1.5px] font-mono transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-gradient-to-r from-[#9d4edd] to-[#00f2fe] hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] hover:scale-[1.02] ${className}`}
      >
        <span className={`inline-flex items-center justify-center rounded-full bg-[#12121a]/90 backdrop-blur-md text-[#e0b6ff] group-hover:text-[#f1f5f9] transition-colors w-full h-full ${sizeClasses}`}>
          {icon && <span className="text-[#e0b6ff] group-hover:text-[#00f2fe] transition-colors">{icon}</span>}
          <span className="whitespace-nowrap uppercase">{children}</span>
          {badge && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-[#9d4edd]/25 text-[#e0b6ff] border border-[#9d4edd]/40">
              {badge}
            </span>
          )}
        </span>
      </button>
    );
  }

  if (variant === 'danger') {
    return (
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`group relative inline-flex items-center justify-center rounded-full border border-[#ff4d4f]/40 bg-[#1f1013]/70 backdrop-blur-md font-mono text-[#ff7875] hover:border-[#ff4d4f] hover:text-[#fff] hover:shadow-[0_0_16px_rgba(255,77,79,0.35)] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${className}`}
      >
        {icon && <span>{icon}</span>}
        <span className="whitespace-nowrap uppercase">{children}</span>
      </button>
    );
  }

  // Default: Ghost Pill
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center rounded-full border border-white/15 bg-[#12121a]/60 backdrop-blur-sm font-mono text-[#94a3b8] hover:text-[#00f2fe] hover:border-[#00f2fe]/50 hover:bg-[#00f2fe]/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${className}`}
    >
      {icon && <span className="text-[#94a3b8] group-hover:text-[#00f2fe] transition-colors">{icon}</span>}
      <span className="whitespace-nowrap uppercase">{children}</span>
      {badge && (
        <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-white/10 text-white/70">
          {badge}
        </span>
      )}
    </button>
  );
};
