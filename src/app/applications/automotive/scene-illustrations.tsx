/** Simple SVG illustrations for automotive application scenes. */
export function SceneIllustration({ sceneId, className }: { sceneId: string; className?: string }) {
  const cls = className || "w-full h-full";
  const S = illustrations[sceneId];
  if (!S) return null;
  return (
    <div className={cls}>
      <S />
    </div>
  );
}

type SvgFn = () => React.ReactElement;

const illustrations: Record<string, SvgFn> = {

  /* ---- Interior ---- */
  "center-console-lid": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="60" y="70" width="200" height="80" rx="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M60 82 Q160 50 260 82" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <line x1="160" y1="60" x2="160" y2="50" stroke="#ED7606" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="47" r="5" fill="#ED7606" />
      <path d="M150 45 Q160 30 170 45" fill="none" stroke="#ED7606" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="160" y="120" textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="700">CONSOLE</text>
    </svg>
  ),

  "glove-box": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="30" width="240" height="20" rx="4" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <rect x="80" y="55" width="160" height="100" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M80 75 Q160 95 240 75" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="220" cy="105" r="6" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.5" />
      <path d="M80 155 Q120 145 160 155" fill="none" stroke="#ED7606" strokeWidth="2" strokeLinecap="round" />
      <circle cx="160" cy="155" r="4" fill="#ED7606" />
    </svg>
  ),

  "inner-door-handle": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="15" width="240" height="170" rx="14" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <rect x="55" y="30" width="210" height="140" rx="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
      <rect x="200" y="70" width="60" height="18" rx="9" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M190 98 Q185 108 195 108 L215 108 Q225 108 220 98" fill="none" stroke="#ED7606" strokeWidth="3" strokeLinecap="round" />
      <circle cx="205" cy="110" r="4" fill="#ED7606" />
      <rect x="75" y="120" width="50" height="12" rx="6" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
    </svg>
  ),

  "grab-handle": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="15" width="240" height="30" rx="6" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M100 45 L100 80 Q100 90 110 90 L210 90 Q220 90 220 80 L220 45" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M120 60 Q160 50 200 60" fill="none" stroke="#ED7606" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="160" cy="56" r="4" fill="#ED7606" />
      <line x1="140" y1="45" x2="140" y2="30" stroke="#9CA3AF" strokeWidth="2" />
      <line x1="180" y1="45" x2="180" y2="30" stroke="#9CA3AF" strokeWidth="2" />
    </svg>
  ),

  "overhead-console": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="60" y="20" width="200" height="28" rx="6" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <rect x="110" y="58" width="100" height="60" rx="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M110 78 Q160 65 210 78" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="210" cy="88" r="5" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.5" />
      <path d="M130 110 Q145 105 160 110" fill="none" stroke="#ED7606" strokeWidth="2" strokeLinecap="round" />
      <circle cx="160" cy="107" r="4" fill="#ED7606" />
      <rect x="130" y="125" width="60" height="10" rx="5" fill="#D1D5DB" />
    </svg>
  ),

  "sunshade": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <line x1="40" y1="30" x2="40" y2="170" stroke="#9CA3AF" strokeWidth="2" />
      <rect x="30" y="40" width="260" height="16" rx="4" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.5" />
      <rect x="60" y="65" width="180" height="100" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M60 85 Q150 75 240 85" fill="none" stroke="#ED7606" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
      <circle cx="150" cy="80" r="5" fill="#FBBF24" />
      <line x1="150" y1="85" x2="150" y2="110" stroke="#FBBF24" strokeWidth="1.5" />
      <line x1="145" y1="105" x2="155" y2="105" stroke="#FBBF24" strokeWidth="1.5" />
    </svg>
  ),

  /* ---- Exterior ---- */
  "exterior-door-handle": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="10" width="260" height="180" rx="16" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <rect x="48" y="28" width="224" height="144" rx="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
      <rect x="220" y="75" width="40" height="16" rx="8" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M205 90 L195 100 Q190 105 195 105 L235 105 Q240 105 235 100 L228 92" fill="none" stroke="#ED7606" strokeWidth="3" strokeLinecap="round" />
      <circle cx="208" cy="91" r="4" fill="#ED7606" />
      <rect x="60" y="155" width="50" height="8" rx="4" fill="#D1D5DB" />
    </svg>
  ),

  "charging-port-cover": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="30" y="20" width="260" height="160" rx="16" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <circle cx="190" cy="90" r="42" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <circle cx="190" cy="90" r="32" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M148 90 Q190 50 232 90" fill="none" stroke="#ED7606" strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="190" cy="55" r="5" fill="#ED7606" />
      <rect x="174" y="92" width="32" height="16" rx="3" fill="#D1D5DB" />
      <rect x="188" y="78" width="4" height="30" rx="2" fill="#9CA3AF" />
    </svg>
  ),

  "back-door-handle": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="10" width="240" height="180" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M40 60 L40 10 L70 10" fill="none" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M280 60 L280 10 L250 10" fill="none" stroke="#9CA3AF" strokeWidth="2" />
      <rect x="110" y="140" width="100" height="20" rx="6" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <path d="M130 150 L120 120 Q115 112 125 112 L195 112 Q205 112 200 120 L190 150" fill="none" stroke="#ED7606" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="120" r="5" fill="#ED7606" />
      <rect x="120" y="50" width="80" height="60" rx="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
      <line x1="120" y1="80" x2="200" y2="80" stroke="#D1D5DB" strokeWidth="1" />
    </svg>
  ),

  "fuel-cap": () => (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="15" width="240" height="170" rx="14" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
      <circle cx="200" cy="80" r="30" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
      <circle cx="200" cy="80" r="22" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
      <path d="M170 80 Q200 48 230 80" fill="none" stroke="#ED7606" strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="200" cy="54" r="5" fill="#ED7606" />
      <rect x="194" y="72" width="12" height="6" rx="2" fill="#9CA3AF" />
    </svg>
  ),
};
