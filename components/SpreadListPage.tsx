import React from 'react';
import { SpreadRecord } from '../types';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';

interface SpreadListPageProps {
  spreads: SpreadRecord[];
  onBack: () => void;
  onNewSpread: () => void;
  onEditSpread: (spread: SpreadRecord) => void;
  onDeleteSpread: (id: string) => void;
  loading: boolean;
}

const SpreadListPage: React.FC<SpreadListPageProps> = ({ 
  spreads, 
  onBack, 
  onNewSpread, 
  onEditSpread, 
  onDeleteSpread,
  loading 
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4 animate-pulse">🪄</div>
        <p className="text-mystic-gold/70 font-serif text-lg">正在查找你的牌阵记录...</p>
      </div>
    );
  }

  if (spreads.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-mystic-gold/70 font-serif text-lg mb-6">等待你记录第一个牌阵</p>
        <button
          onClick={onNewSpread}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mystic-gold/20 to-mystic-gold/10 border border-mystic-gold/30 rounded-lg text-mystic-gold font-serif hover:bg-gradient-to-r from-mystic-gold/30 to-mystic-gold/20 transition-all"
        >
          <Plus size={20} />
          <span>新建牌阵记录</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-end">
        <button
          onClick={onNewSpread}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mystic-gold/20 to-mystic-gold/10 border border-mystic-gold/30 rounded-lg text-mystic-gold font-serif hover:bg-gradient-to-r from-mystic-gold/30 to-mystic-gold/20 transition-all"
        >
          <Plus size={18} />
          <span>新建</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spreads.map((spread) => (
            <div
              key={spread.id}
              onClick={() => onEditSpread(spread)}
              className="bg-[#2A2B55] border border-mystic-gold/20 rounded-lg p-6 cursor-pointer hover:border-mystic-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-mystic-gold/60 text-sm">
                    <Calendar size={16} />
                    <span>{formatDate(spread.date)}</span>
                  </div>
                  {spread.clientName && (
                    <div className="text-mystic-gold/70 text-xs font-serif">
                      {spread.clientName}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSpread(spread);
                    }}
                    className="p-1 text-mystic-gold/50 hover:text-mystic-gold transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定要删除这条牌阵记录吗？')) {
                        onDeleteSpread(spread.id);
                      }
                    }}
                    className="p-1 text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-serif text-mystic-gold mb-3 line-clamp-2">
                {spread.question || '无问题描述'}
              </h3>
              
              <div className="flex items-center gap-2 text-mystic-gold/50 text-sm mb-3">
                <span>{spread.cards.length} 张牌</span>
              </div>

              {spread.interpretation && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {spread.interpretation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpreadListPage;
