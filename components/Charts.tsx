import React from 'react';
import { PollOption } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

interface ChartProps {
  options: PollOption[];
  showPercentages?: boolean;
  showVoteCounts?: boolean;
  blurOptions?: boolean;
}

export const HorizontalChart: React.FC<ChartProps> = ({ 
  options, 
  showPercentages = true, 
  showVoteCounts = true,
  blurOptions = false
}) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map(option => option.votes));
  
  // Agresywne skalowanie w zależności od liczby opcji - wszystko musi się zmieścić
  const optionCount = options.length;
  const spacing = optionCount <= 4 ? 'space-y-6' : optionCount <= 8 ? 'space-y-3' : optionCount <= 12 ? 'space-y-2' : optionCount <= 16 ? 'space-y-1' : 'space-y-0.5';
  const barHeight = optionCount <= 4 ? 'h-12' : optionCount <= 8 ? 'h-8' : optionCount <= 12 ? 'h-6' : optionCount <= 16 ? 'h-5' : 'h-4';
  const titleSize = optionCount <= 4 ? 'text-xl' : optionCount <= 8 ? 'text-lg' : optionCount <= 12 ? 'text-base' : optionCount <= 16 ? 'text-sm' : 'text-xs';
  const voteSize = optionCount <= 4 ? 'text-2xl' : optionCount <= 8 ? 'text-xl' : optionCount <= 12 ? 'text-lg' : optionCount <= 16 ? 'text-base' : 'text-sm';
  const marginBottom = optionCount <= 8 ? 'mb-2' : optionCount <= 12 ? 'mb-1' : 'mb-0.5';

  return (
    <div className={`${spacing} h-full flex flex-col justify-center`}>
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const isWinning = option.votes === maxVotes && maxVotes > 0;
        
        return (
          <div key={option.id} className="relative">
            <div className={`flex items-center justify-between ${marginBottom}`}>
              <h3 className={`${titleSize} font-semibold line-clamp-1 flex-1 pr-2 ${isWinning ? 'text-yellow-700' : 'text-gray-900'} ${blurOptions ? 'blur-sm select-none' : ''}`}>
                {isWinning && '👑 '}{blurOptions ? '••••••••' : option.text}
              </h3>
              <div className="text-right flex-shrink-0">
                {showVoteCounts && (
                  <div className={`${voteSize} font-bold ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                    {option.votes}
                  </div>
                )}
                {showPercentages && (
                  <div className={`${optionCount > 12 ? 'text-xs' : 'text-sm'} text-gray-500`}>
                    {percentage.toFixed(optionCount > 16 ? 0 : 1)}%
                  </div>
                )}
              </div>
            </div>
            
            <div className={`relative ${barHeight} bg-gray-100 rounded-full overflow-hidden`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isWinning ? 'shadow-lg scale-y-110' : ''
                }`}
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: option.color,
                  boxShadow: isWinning ? `0 0 20px ${option.color}40` : 'none'
                }}
              />
              
              {/* Animated particles for winning option */}
              {isWinning && option.votes > 0 && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(Math.min(3, Math.floor(percentage / 20)))].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 animate-ping"
                      style={{
                        left: `${Math.random() * percentage}%`,
                        animationDelay: `${i * 0.5}s`,
                        transform: 'translateY(-50%)'
                      }}
                    >
                      ✨
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const VerticalChart: React.FC<ChartProps> = ({ 
  options, 
  showPercentages = true, 
  showVoteCounts = true,
  blurOptions = false
}) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map(option => option.votes));
  
  // Agresywne skalowanie w zależności od liczby opcji - wszystko musi się zmieścić
  const optionCount = options.length;
  const gap = optionCount <= 4 ? 'gap-6' : optionCount <= 8 ? 'gap-3' : optionCount <= 12 ? 'gap-2' : optionCount <= 16 ? 'gap-1' : 'gap-0.5';
  const maxWidth = optionCount <= 4 ? 'max-w-32' : optionCount <= 8 ? 'max-w-20' : optionCount <= 12 ? 'max-w-14' : optionCount <= 16 ? 'max-w-10' : 'max-w-8';
  const minWidth = optionCount <= 12 ? 'min-w-8' : optionCount <= 16 ? 'min-w-6' : 'min-w-4';
  const chartHeight = 'h-full';
  const barHeight = optionCount <= 6 ? '65%' : optionCount <= 10 ? '60%' : optionCount <= 16 ? '55%' : '50%';
  const textSize = optionCount <= 6 ? 'text-lg' : optionCount <= 10 ? 'text-base' : optionCount <= 16 ? 'text-sm' : 'text-xs';
  const labelSize = optionCount <= 6 ? 'text-sm' : optionCount <= 10 ? 'text-xs' : optionCount <= 16 ? 'text-xs' : 'text-xs';
  const topSpacing = optionCount <= 8 ? 'mb-1' : 'mb-0.5';

  return (
    <div className={`flex items-end justify-center ${gap} ${chartHeight} px-1`}>
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const height = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
        const isWinning = option.votes === maxVotes && maxVotes > 0;
        
        return (
          <div key={option.id} className={`flex flex-col items-center flex-1 ${maxWidth} ${minWidth}`}>
            {/* Wartości nad słupkiem */}
            <div className={`${topSpacing} text-center flex flex-col justify-end`} style={{ height: '20%' }}>
              {showVoteCounts && (
                <div className={`${textSize} font-bold ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                  {isWinning && '👑'} {option.votes}
                </div>
              )}
              {showPercentages && (
                <div className={`${optionCount > 12 ? 'text-xs' : 'text-xs'} text-gray-500`}>
                  {percentage.toFixed(optionCount > 16 ? 0 : 1)}%
                </div>
              )}
            </div>
            
            {/* Słupek */}
            <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden flex-1" style={{ height: barHeight }}>
              <div
                className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ease-out ${
                  isWinning ? 'shadow-lg' : ''
                }`}
                style={{ 
                  height: `${height}%`,
                  backgroundColor: option.color,
                  boxShadow: isWinning ? `0 0 20px ${option.color}40` : 'none'
                }}
              />
              
              {/* Animated particles for winning option */}
              {isWinning && option.votes > 0 && optionCount <= 8 && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 animate-ping"
                      style={{
                        bottom: `${Math.random() * height}%`,
                        animationDelay: `${i * 0.7}s`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      ✨
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Etykieta opcji */}
            <div className="text-center w-full" style={{ height: '15%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className={`${labelSize} font-medium leading-tight ${isWinning ? 'text-yellow-700' : 'text-gray-900'} ${blurOptions ? 'blur-sm select-none' : ''} line-clamp-2`}>
                {blurOptions ? '••••••••' : option.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({ 
  options, 
  showPercentages = true, 
  showVoteCounts = true,
  blurOptions = false
}) => {
  const { t } = useLanguage();
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map(option => option.votes));
  
  // Agresywne skalowanie w zależności od liczby opcji - wszystko musi się zmieścić
  const optionCount = options.length;
  const chartSize = optionCount <= 6 ? 280 : optionCount <= 10 ? 220 : optionCount <= 16 ? 180 : 150;
  const radius = chartSize * 0.35;
  const center = chartSize / 2;
  const legendSpacing = optionCount <= 6 ? 'space-y-2' : optionCount <= 12 ? 'space-y-1' : optionCount <= 16 ? 'space-y-0.5' : 'space-y-0';
  const legendTextSize = optionCount <= 6 ? 'text-sm font-medium' : optionCount <= 12 ? 'text-xs font-medium' : 'text-xs font-medium';
  const legendSubTextSize = optionCount <= 8 ? 'text-xs' : 'text-xs';
  const crownSize = optionCount <= 6 ? 'text-3xl' : optionCount <= 12 ? 'text-2xl' : 'text-xl';
  const layout = optionCount > 12 ? 'flex-col' : optionCount > 8 ? 'flex-col' : 'flex-col lg:flex-row';
  const gap = optionCount > 12 ? 'gap-2' : optionCount > 8 ? 'gap-3' : 'gap-4';
  
  if (totalVotes === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="w-48 h-48 mx-auto mb-4 border-4 border-gray-200 rounded-full flex items-center justify-center">
            <span className="text-6xl">🗳️</span>
          </div>
          <p className="text-lg">{t.display.waitingForVotes}</p>
        </div>
      </div>
    );
  }

  let currentAngle = 0;

  return (
    <div className={`flex ${layout} items-center ${gap} h-full`}>
      {/* Wykres kołowy */}
      <div className="relative flex-shrink-0">
        <svg width={chartSize} height={chartSize} className="transform -rotate-90">
          {options.map((option) => {
            const percentage = (option.votes / totalVotes) * 100;
            const angle = (option.votes / totalVotes) * 360;
            const isWinning = option.votes === maxVotes && maxVotes > 0;
            
            if (option.votes === 0) return null;
            
            // Oblicz współrzędne dla łuku SVG
            const startAngle = currentAngle * (Math.PI / 180);
            const endAngle = (currentAngle + angle) * (Math.PI / 180);
            
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${center} ${center}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <g key={option.id}>
                <path
                  d={pathData}
                  fill={option.color}
                  className={`transition-all duration-500 ${isWinning ? 'drop-shadow-lg' : ''}`}
                  style={{
                    filter: isWinning ? `drop-shadow(0 0 10px ${option.color}40)` : 'none'
                  }}
                />
                {/* Efekt animacji dla wygrywającej opcji */}
                {isWinning && optionCount <= 8 && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={option.color}
                    strokeWidth="2"
                    className="animate-pulse opacity-60"
                  />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Wygrywająca ikona w centrum */}
        {maxVotes > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${crownSize} animate-bounce`}>👑</div>
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className={`${legendSpacing} flex-1 ${optionCount > 16 ? 'grid grid-cols-2 gap-x-2' : ''} ${optionCount > 12 ? 'min-h-0' : ''}`}>
        {options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isWinning = option.votes === maxVotes && maxVotes > 0;
          
          return (
            <div key={option.id} className="flex items-center gap-1">
              <div
                className={`${optionCount <= 10 ? 'w-3 h-3' : 'w-2 h-2'} rounded-full flex-shrink-0`}
                style={{ backgroundColor: option.color }}
              />
              <div className="flex-1 min-w-0">
                <div className={`${legendTextSize} leading-tight ${isWinning ? 'text-yellow-700' : 'text-gray-900'} ${blurOptions ? 'blur-sm select-none' : ''} line-clamp-1`}>
                  {isWinning && '👑 '}{blurOptions ? '••••••••' : option.text}
                </div>
                <div className={`${legendSubTextSize} text-gray-500`}>
                  {showVoteCounts && showPercentages && `${option.votes} ${t.admin.votes} • `}
                  {showVoteCounts && !showPercentages && `${option.votes} ${t.admin.votes}`}
                  {!showVoteCounts && showPercentages && `${percentage.toFixed(optionCount > 16 ? 0 : 1)}%`}
                  {showVoteCounts && showPercentages && `${percentage.toFixed(optionCount > 16 ? 0 : 1)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 