export function Shield3D({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Pedestal Gradients */}
        <linearGradient id="pedestal-top" x1="200" y1="240" x2="200" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="pedestal-side" x1="100" y1="270" x2="300" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CBD5E1" />
          <stop offset="0.5" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="pedestal-base" x1="80" y1="300" x2="320" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" />
          <stop offset="0.5" stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>

        {/* Shield Gradients */}
        <linearGradient id="shield-front" x1="120" y1="50" x2="280" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="0.5" stopColor="#DC2626" />
          <stop offset="1" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="shield-rim" x1="120" y1="50" x2="280" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCA5A5" />
          <stop offset="0.5" stopColor="#DC2626" />
          <stop offset="1" stopColor="#7F1D1D" />
        </linearGradient>
        <linearGradient id="shield-glow" x1="200" y1="50" x2="200" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="check-gradient" x1="160" y1="120" x2="240" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1F5F9" />
        </linearGradient>

        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="20" stdDeviation="15" floodOpacity="0.15" />
        </filter>
        <filter id="glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#DC2626" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Floating Orbs (Confetti) */}
      <g filter="url(#glow-shadow)">
        <circle cx="80" cy="180" r="8" fill="url(#shield-front)" />
        <circle cx="330" cy="140" r="12" fill="url(#shield-front)" />
        <circle cx="120" cy="280" r="6" fill="url(#shield-front)" />
        <circle cx="290" cy="290" r="9" fill="url(#shield-front)" />
        <circle cx="90" cy="100" r="10" fill="url(#shield-front)" opacity="0.6" />
        <circle cx="310" cy="80" r="7" fill="url(#shield-front)" opacity="0.5" />
      </g>

      {/* Pedestal Base */}
      <ellipse cx="200" cy="330" rx="140" ry="25" fill="#000000" opacity="0.05" filter="url(#drop-shadow)" />
      
      {/* Bottom Tier */}
      <path d="M60 310 C60 330, 340 330, 340 310 L340 320 C340 340, 60 340, 60 320 Z" fill="url(#pedestal-base)" />
      <ellipse cx="200" cy="310" rx="140" ry="25" fill="#E2E8F0" />
      
      {/* Middle Tier */}
      <path d="M80 290 C80 305, 320 305, 320 290 L320 310 C320 325, 80 325, 80 310 Z" fill="url(#pedestal-side)" />
      <ellipse cx="200" cy="290" rx="120" ry="20" fill="#F1F5F9" />

      {/* Top Tier */}
      <path d="M100 270 C100 282, 300 282, 300 270 L300 290 C300 302, 100 302, 100 290 Z" fill="url(#pedestal-side)" />
      <ellipse cx="200" cy="270" rx="100" ry="15" fill="url(#pedestal-top)" />
      <ellipse cx="200" cy="270" rx="90" ry="12" fill="#FFFFFF" opacity="0.8" />

      {/* Shield Group */}
      <g filter="url(#drop-shadow)">
        {/* Shield Rim/Backing for 3D depth */}
        <path d="M200 45 C280 45, 310 80, 310 140 C310 210, 240 260, 200 295 C160 260, 90 210, 90 140 C90 80, 120 45, 200 45 Z" fill="url(#shield-rim)" />
        
        {/* Shield Front */}
        <path d="M200 50 C275 50, 300 85, 300 140 C300 205, 235 250, 200 285 C165 250, 100 205, 100 140 C100 85, 125 50, 200 50 Z" fill="url(#shield-front)" />
        
        {/* Inner glow/highlight for gloss */}
        <path d="M200 50 C275 50, 300 85, 300 140 C300 205, 235 250, 200 285 C165 250, 100 205, 100 140 C100 85, 125 50, 200 50 Z" fill="url(#shield-glow)" />

        {/* 3D Checkmark */}
        <path d="M150 150 L185 185 L250 110 L265 125 L185 215 L135 165 Z" fill="url(#check-gradient)" filter="url(#glow-shadow)" />
      </g>
    </svg>
  );
}
