export function LogoIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 2L3 7v9.5c0 6.6 5.5 12.8 13 15.5 7.5-2.7 13-8.9 13-15.5V7L16 2z" fill="#DC2626"/>
      <path d="M10 16c2.5-4 7-5 11-2.5-5 1.5-8 5-9 9-1.5-1.5-2-4.5-2-6.5z" fill="white"/>
    </svg>
  );
}
