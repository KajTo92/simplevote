import React from 'react';
import { PollOption } from '@/types';
import { useLanguage } from '@/components/LanguageProvider';

interface ChartProps {
  options: PollOption[];
  showPercentages?: boolean;
  showVoteCounts?: boolean;
  hideBars?: boolean;
}

export const HorizontalChart: React.FC<ChartProps> = ({ 
  options, 
  showPercentages = true, 
  showVoteCounts = true,
  hideBars = false
}) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map(option => option.votes));
  
  // Agresywne skalowanie w zależności od liczby opcji - wszystko musi się zmieścić
  const optionCount = options.length;
  const spacing = optionCount <= 3 ? 'space-y-6' : optionCount <= 6 ? 'space-y-2' : optionCount <= 10 ? 'space-y-1' : optionCount <= 14 ? 'space-y-0.5' : 'space-y-0';
  const barHeight = optionCount <= 3 ? 'h-12' : optionCount <= 6 ? 'h-8' : optionCount <= 10 ? 'h-6' : optionCount <= 14 ? 'h-5' : 'h-4';
  const titleSize = optionCount <= 3 ? 'text-xl' : optionCount <= 6 ? 'text-lg' : optionCount <= 10 ? 'text-base' : optionCount <= 14 ? 'text-sm' : 'text-xs';
  const voteSize = optionCount <= 3 ? 'text-2xl' : optionCount <= 6 ? 'text-xl' : optionCount <= 10 ? 'text-lg' : optionCount <= 14 ? 'text-base' : 'text-sm';
  const marginBottom = optionCount <= 3 ? 'mb-2' : optionCount <= 6 ? 'mb-1' : optionCount <= 10 ? 'mb-0.5' : 'mb-0';

  return (
    <div className={`${spacing} h-full flex flex-col justify-center`}>
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const isWinning = option.votes === maxVotes && maxVotes > 0;
        
        return (
          <div key={option.id} className="relative">
            <div className={`flex items-center justify-between ${marginBottom}`}>
              <h3 className={`${titleSize} font-semibold line-clamp-1 flex-1 pr-2 ${isWinning && !hideBars ? 'text-yellow-700' : 'text-gray-900'}`}>
                {isWinning && !hideBars && '👑 '}{option.text}
              </h3>
              <div className="text-right flex-shrink-0">
                {showVoteCounts && !hideBars && (
                  <div className={`${voteSize} font-bold ${isWinning && !hideBars ? 'text-yellow-700' : 'text-gray-900'}`}>
                    {option.votes}
                  </div>
                )}
                {showPercentages && !hideBars && (
                  <div className={`${optionCount > 12 ? 'text-xs' : 'text-sm'} text-gray-500`}>
                    {percentage.toFixed(optionCount > 16 ? 0 : 1)}%
                  </div>
                )}
              </div>
            </div>
            
            <div className={`relative ${barHeight} bg-gray-100 rounded-full overflow-hidden`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isWinning && !hideBars ? 'shadow-lg scale-y-110' : ''
                }`}
                style={{ 
                  width: hideBars ? '45%' : `${percentage}%`,
                  backgroundColor: option.color,
                  boxShadow: isWinning && !hideBars ? `0 0 20px ${option.color}40` : 'none',
                  animation: hideBars ? `irregularBounce ${10 + (parseInt(option.id, 10) || 0) % 5}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite` : undefined,
                  animationFillMode: hideBars ? 'both' : undefined,
                  transformOrigin: hideBars ? 'left center' : undefined
                }}
              />
              
              {/* Animated particles for winning option */}
              {isWinning && option.votes > 0 && !hideBars && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(Math.min(3, Math.floor(percentage / 20)))].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 animate-ping"
                      style={{
                        left: `${((parseInt(option.id) + i) % 7) * 10 + 20}%`,
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
  hideBars = false
}) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map(option => option.votes));
  
  // Agresywne skalowanie w zależności od liczby opcji - wszystko musi się zmieścić
  const optionCount = options.length;
  const gap = optionCount <= 3 ? 'gap-6' : optionCount <= 6 ? 'gap-8' : optionCount <= 10 ? 'gap-5' : optionCount <= 14 ? 'gap-3' : 'gap-2';
  const maxWidth = optionCount <= 3 ? 'max-w-32' : optionCount <= 6 ? 'max-w-40' : optionCount <= 10 ? 'max-w-28' : optionCount <= 14 ? 'max-w-20' : 'max-w-16';
  const minWidth = optionCount <= 6 ? 'min-w-12' : optionCount <= 10 ? 'min-w-10' : optionCount <= 14 ? 'min-w-8' : 'min-w-6';
  const textSize = optionCount <= 6 ? 'text-lg' : optionCount <= 10 ? 'text-base' : optionCount <= 16 ? 'text-sm' : 'text-xs';
  const labelSize = optionCount <= 6 ? 'text-base' : optionCount <= 10 ? 'text-sm' : optionCount <= 16 ? 'text-sm' : 'text-xs';

  return (
    <div className={`flex items-stretch justify-center ${gap} h-full px-1`}>
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const height = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
        const isWinning = option.votes === maxVotes && maxVotes > 0;
        
        return (
          <div key={option.id} className={`flex flex-col items-center flex-1 ${maxWidth} ${minWidth} h-full`}>
            {/* Wartości nad słupkiem - stała wysokość */}
            <div className="text-center mb-2 flex-shrink-0 h-12 flex flex-col justify-end">
              {showVoteCounts && !hideBars && (
                <div className={`${textSize} font-bold ${isWinning && !hideBars ? 'text-yellow-700' : 'text-gray-900'}`}>
                  {isWinning && !hideBars && '👑'} {option.votes}
                </div>
              )}
              {showPercentages && !hideBars && (
                <div className={`${optionCount > 12 ? 'text-xs' : 'text-xs'} text-gray-500`}>
                  {percentage.toFixed(optionCount > 16 ? 0 : 1)}%
                </div>
              )}
            </div>
            
            {/* Słupek - flex-grow zajmuje dostępną przestrzeń */}
            <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden flex-grow">
              <div
                className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ease-out ${
                  isWinning && !hideBars ? 'shadow-lg' : ''
                }`}
                style={{ 
                  height: hideBars ? '50%' : `${height}%`,
                  backgroundColor: option.color,
                  boxShadow: isWinning && !hideBars ? `0 0 20px ${option.color}40` : 'none',
                  animation: hideBars ? `irregularVerticalBounce ${12 + (parseInt(option.id, 10) || 0) % 6}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite` : undefined,
                  animationFillMode: hideBars ? 'both' : undefined,
                  transformOrigin: hideBars ? 'center bottom' : undefined
                }}
              />
              
              {/* Animated particles for winning option */}
              {isWinning && option.votes > 0 && optionCount <= 8 && !hideBars && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 animate-ping"
                      style={{
                        bottom: `${((parseInt(option.id) + i) % 5) * 15 + 25}%`,
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
            
            {/* Etykieta opcji - stała wysokość dla wszystkich */}
            <div className="text-center mt-2 flex-shrink-0 h-20 flex items-start justify-center">
              <div className={`${labelSize} font-medium leading-tight ${isWinning && !hideBars ? 'text-yellow-700' : 'text-gray-900'} line-clamp-3`}>
                {option.text}
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
  hideBars = false
}) => {
  const { t } = useLanguage();
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map(option => option.votes));
  
  // Powiększone skalowanie dla pie chart - większe koło i lepsze napisy
  const optionCount = options.length;
  const chartSize = optionCount <= 6 ? 380 : optionCount <= 10 ? 340 : optionCount <= 16 ? 300 : 260;
  const radius = chartSize * 0.42;
  const center = chartSize / 2;
  const legendSpacing = optionCount <= 6 ? 'space-y-3' : optionCount <= 12 ? 'space-y-2' : optionCount <= 16 ? 'space-y-1' : 'space-y-0.5';
  const legendTextSize = optionCount <= 6 ? 'text-lg font-medium' : optionCount <= 12 ? 'text-base font-medium' : 'text-sm font-medium';
  const legendSubTextSize = optionCount <= 8 ? 'text-sm' : 'text-xs';
  const layout = optionCount > 12 ? 'flex-col' : optionCount > 8 ? 'flex-col' : 'flex-col lg:flex-row';
  const gap = optionCount > 12 ? 'gap-3' : optionCount > 8 ? 'gap-4' : 'gap-6';
  
  if (totalVotes === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <div className="w-80 h-80 mx-auto mb-4 border-4 border-gray-200 rounded-full flex items-center justify-center">
            <span className="text-8xl">🗳️</span>
          </div>
          <p className="text-xl">{t.display.waitingForVotes}</p>
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
                  className={`transition-all duration-500 ${isWinning && !hideBars ? 'drop-shadow-lg' : ''}`}
                  style={{
                    filter: isWinning && !hideBars ? `drop-shadow(0 0 10px ${option.color}40)` : 'none'
                  }}
                />
                {/* Efekt animacji dla wygrywającej opcji */}
                {isWinning && optionCount <= 8 && !hideBars && (
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
      </div>
      
      {/* Legenda */}
      <div className={`${legendSpacing} flex-1 ${optionCount > 16 ? 'grid grid-cols-2 gap-x-4' : ''} ${optionCount > 12 ? 'min-h-0' : ''}`}>
        {options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isWinning = option.votes === maxVotes && maxVotes > 0;
          
          return (
            <div key={option.id} className="flex items-center gap-2">
              <div
                className={`${optionCount <= 6 ? 'w-5 h-5' : optionCount <= 10 ? 'w-4 h-4' : 'w-3.5 h-3.5'} rounded-full flex-shrink-0`}
                style={{ backgroundColor: option.color }}
              />
              <div className="flex-1 min-w-0">
                <div className={`${legendTextSize} leading-tight ${isWinning && !hideBars ? 'text-yellow-700' : 'text-gray-900'} line-clamp-1`}>
                  {isWinning && !hideBars && '👑 '}{option.text}
                </div>
                <div className={`${legendSubTextSize} text-gray-500`}>
                  {showVoteCounts && showPercentages && !hideBars && `${option.votes} ${t.admin.votes} • `}
                  {showVoteCounts && !showPercentages && !hideBars && `${option.votes} ${t.admin.votes}`}
                  {!showVoteCounts && showPercentages && !hideBars && `${percentage.toFixed(optionCount > 16 ? 0 : 1)}%`}
                  {showVoteCounts && showPercentages && !hideBars && `${percentage.toFixed(optionCount > 16 ? 0 : 1)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 