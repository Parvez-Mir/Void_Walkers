import { Link } from 'react-router-dom';

const alignClasses = {
  left: '',
  center: 'mx-auto',
  right: 'ml-auto',
};

const sizeClasses = {
  sm: {
    mark: 'h-10 w-12',
    text: 'text-2xl',
  },
  md: {
    mark: 'h-12 w-14',
    text: 'text-3xl',
  },
  lg: {
    mark: 'h-14 w-16',
    text: 'text-3xl',
  },
};

export function BrandLogo({
  align = 'left',
  reverse = false,
  size = 'md',
  tone = 'light',
  showText = true,
  className = '',
}) {
  const dimensions = sizeClasses[size] || sizeClasses.md;
  const textColor = tone === 'dark' ? 'text-slate-900' : 'text-white';
  const accentColor = tone === 'dark' ? 'text-amber-600' : 'text-amber-400';

  const mark = (
    <span className={`${dimensions.mark} flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
      <img src="/globalghar-logo.svg" alt="" className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(245,158,11,0.18)]" />
    </span>
  );

  const wordmark = showText ? (
    <span className={`${dimensions.text} font-bold tracking-tight ${textColor}`}>
      Global<span className={accentColor}>Ghar</span>
    </span>
  ) : null;

  return (
    <Link to="/" className={`group flex w-fit items-center gap-3 ${alignClasses[align] || ''} ${className}`}>
      {reverse ? wordmark : mark}
      {reverse ? mark : wordmark}
    </Link>
  );
}
