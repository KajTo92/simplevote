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

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const isWinning = option.votes === maxVotes && maxVotes > 0;
        
        return (
          <div key={option.id} className="relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xl font-semibold ${isWinning ? 'text-yellow-700' : 'text-gray-900'} ${blurOptions ? 'blur-sm select-none' : ''}`}>
                {isWinning && '👑 '}{blurOptions ? '••••••••' : option.text}
              </h3>
              <div className="text-right">
                {showVoteCounts && (
                  <div className={`text-2xl font-bold ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                    {option.votes}
                  </div>
                )}
                {showPercentages && (
                  <div className="text-sm text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
            
            <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden">
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
                  {[...Array(3)].map((_, i) => (
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

  return (
    <div className="flex items-end justify-center gap-4 h-80 px-4">
      {options.map((option) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const height = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
        const isWinning = option.votes === maxVotes && maxVotes > 0;
        
        return (
          <div key={option.id} className="flex flex-col items-center flex-1 max-w-24">
            {/* Wartości nad słupkiem */}
            <div className="mb-2 text-center min-h-12 flex flex-col justify-end">
              {showVoteCounts && (
                <div className={`text-lg font-bold ${isWinning ? 'text-yellow-700' : 'text-gray-900'}`}>
                  {isWinning && '👑'} {option.votes}
                </div>
              )}
              {showPercentages && (
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              )}
            </div>
            
            {/* Słupek */}
            <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '240px' }}>
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
              {isWinning && option.votes > 0 && (
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
            <div className="mt-3 text-center">
              <div className={`text-sm font-medium ${isWinning ? 'text-yellow-700' : 'text-gray-900'} ${blurOptions ? 'blur-sm select-none' : ''}`}>
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
  
  if (totalVotes === 0) {
    return (
      <div className="flex items-center justify-center h-80">
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
  const radius = 96; // 24rem/4 = 96px
  const center = 120; // radius + padding

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* Wykres kołowy */}
      <div className="relative">
        <svg width="240" height="240" className="transform -rotate-90">
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
                {isWinning && (
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
            <div className="text-4xl animate-bounce">👑</div>
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="space-y-3">
        {options.map((option) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const isWinning = option.votes === maxVotes && maxVotes > 0;
          
          return (
            <div key={option.id} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <div className="flex-1">
                <div className={`font-medium ${isWinning ? 'text-yellow-700' : 'text-gray-900'} ${blurOptions ? 'blur-sm select-none' : ''}`}>
                  {isWinning && '👑 '}{blurOptions ? '••••••••' : option.text}
                </div>
                <div className="text-sm text-gray-500">
                  {showVoteCounts && showPercentages && `${option.votes} ${t.admin.votes} • `}
                  {showVoteCounts && !showPercentages && `${option.votes} ${t.admin.votes}`}
                  {!showVoteCounts && showPercentages && `${percentage.toFixed(1)}%`}
                  {showVoteCounts && showPercentages && `${percentage.toFixed(1)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 