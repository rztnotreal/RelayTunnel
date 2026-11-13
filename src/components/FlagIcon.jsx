import React from 'react';

// Crisp SVG country flags rendered reliably on Windows / Linux / macOS
export default function FlagIcon({ code, className = "w-5 h-3.5 rounded-sm shadow-sm inline-block object-cover" }) {
  switch (code) {
    case 'FI': // Finland
      return (
        <svg className={className} viewBox="0 0 18 11" fill="none">
          <rect width="18" height="11" fill="#FFFFFF" />
          <rect x="5" width="3" height="11" fill="#003580" />
          <rect y="4" width="18" height="3" fill="#003580" />
        </svg>
      );
    case 'SE': // Sweden
      return (
        <svg className={className} viewBox="0 0 16 10" fill="none">
          <rect width="16" height="10" fill="#006AA7" />
          <rect x="5" width="2" height="10" fill="#FECC00" />
          <rect y="4" width="16" height="2" fill="#FECC00" />
        </svg>
      );
    case 'DE': // Germany
      return (
        <svg className={className} viewBox="0 0 5 3" fill="none">
          <rect width="5" height="1" fill="#000000" />
          <rect y="1" width="5" height="1" fill="#DD0000" />
          <rect y="2" width="5" height="1" fill="#FFCE00" />
        </svg>
      );
    case 'NL': // Netherlands
      return (
        <svg className={className} viewBox="0 0 9 6" fill="none">
          <rect width="9" height="2" fill="#AE1C28" />
          <rect y="2" width="9" height="2" fill="#FFFFFF" />
          <rect y="4" width="9" height="2" fill="#21468B" />
        </svg>
      );
    case 'US': // USA
      return (
        <svg className={className} viewBox="0 0 19 10" fill="none">
          <rect width="19" height="10" fill="#B22234" />
          <line x1="0" y1="1.54" x2="19" y2="1.54" stroke="white" strokeWidth="0.77" />
          <line x1="0" y1="3.08" x2="19" y2="3.08" stroke="white" strokeWidth="0.77" />
          <line x1="0" y1="4.62" x2="19" y2="4.62" stroke="white" strokeWidth="0.77" />
          <line x1="0" y1="6.15" x2="19" y2="6.15" stroke="white" strokeWidth="0.77" />
          <line x1="0" y1="7.69" x2="19" y2="7.69" stroke="white" strokeWidth="0.77" />
          <line x1="0" y1="9.23" x2="19" y2="9.23" stroke="white" strokeWidth="0.77" />
          <rect width="7.6" height="5.38" fill="#3C3B6E" />
          <circle cx="2" cy="1.5" r="0.4" fill="white" />
          <circle cx="3.8" cy="1.5" r="0.4" fill="white" />
          <circle cx="5.6" cy="1.5" r="0.4" fill="white" />
          <circle cx="2.9" cy="2.7" r="0.4" fill="white" />
          <circle cx="4.7" cy="2.7" r="0.4" fill="white" />
          <circle cx="2" cy="3.9" r="0.4" fill="white" />
          <circle cx="3.8" cy="3.9" r="0.4" fill="white" />
          <circle cx="5.6" cy="3.9" r="0.4" fill="white" />
        </svg>
      );
    case 'GB': // UK
      return (
        <svg className={className} viewBox="0 0 60 30" fill="none">
          <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      );
    case 'CH': // Switzerland
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" fill="#D52B1E" />
          <rect x="13" y="6" width="6" height="20" fill="#FFFFFF" />
          <rect x="6" y="13" width="20" height="6" fill="#FFFFFF" />
        </svg>
      );
    case 'JP': // Japan
      return (
        <svg className={className} viewBox="0 0 900 600" fill="none">
          <rect width="900" height="600" fill="#FFFFFF" />
          <circle cx="450" cy="300" r="180" fill="#BC002D" />
        </svg>
      );
    default:
      return (
        <div className="w-5 h-3.5 bg-zinc-700 rounded-sm flex items-center justify-center text-[8px] font-bold text-white">
          {code}
        </div>
      );
  }
}
