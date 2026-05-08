import { logger } from '@/lib/logger';

interface TrueNorthLogoProps {
  size?: number;
  className?: string;
  hideText?: boolean;
}

export function TrueNorthLogo({ size = 8, className = "", hideText = false }: TrueNorthLogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src="/lovable-uploads/1f220341-841d-4045-8bfa-ffef2b4e7b1f.png" 
        alt="TrueNorth Logo" 
        className={`w-${size} h-${size}`}
        onError={(e) => {
          logger.log('Logo failed to load, using fallback');
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {!hideText && (
        <span className="font-bold text-xl">TrueNorth</span>
      )}
    </div>
  );
}
