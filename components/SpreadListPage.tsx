import React, { useMemo, useState } from 'react';
import { SpreadRecord } from '../types';
import { Plus, Calendar, Edit, Trash2, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredSpreads = useMemo(() => {
    return spreads.filter(spread => {
      let matchesSearch = true;
      let matchesDate = true;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        matchesSearch = 
          spread.question.toLowerCase().includes(term) || 
          (spread.clientName && spread.clientName.toLowerCase().includes(term));
      }

      if (startDate) {
        const spreadDate = new Date(spread.date);
        const start = new Date(startDate);
        matchesDate = matchesDate && spreadDate >= start;
      }

      if (endDate) {
        const spreadDate = new Date(spread.date);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && spreadDate <= end;
      }

      return matchesSearch && matchesDate;
    });
  }, [spreads, searchTerm, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4 animate-pulse">🪄</div>
        <p className="text-mystic-gold/70 font-serif text-lg">正在查找你的牌阵记录...</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 顶部搜索和筛选区 */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            {/* 搜索框和日期筛选 */}
            <div className="flex-1 flex flex-wrap gap-4 items-start">
              {/* 搜索框 */}
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-mystic-gold" />
                </div>
                <input
                  type="text"
                  placeholder="搜索占卜问题或当事人称呼..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-mystic-gold/30 rounded-lg bg-[#2A2B55] text-gray-200 placeholder-mystic-gold/50 focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold transition-colors"
                />
              </div>

              {/* 日期筛选 */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-mystic-gold/70 text-sm font-serif">开始日期</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#2A2B55] border border-mystic-gold/30 rounded-lg p-2 text-gray-200 text-sm focus:outline-none focus:border-mystic-gold/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-mystic-gold/70 text-sm font-serif">结束日期</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-[#2A2B55] border border-mystic-gold/30 rounded-lg p-2 text-gray-200 text-sm focus:outline-none focus:border-mystic-gold/50 transition-colors"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="text-mystic-gold/60 hover:text-mystic-gold text-sm font-serif transition-colors"
                  >
                    清除日期筛选
                  </button>
                )}
              </div>
            </div>

            {/* 新建按钮 */}
            <button
              onClick={onNewSpread}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mystic-gold/20 to-mystic-gold/10 border border-mystic-gold/30 rounded-lg text-mystic-gold font-serif hover:bg-gradient-to-r from-mystic-gold/30 to-mystic-gold/20 transition-all"
            >
              <Plus size={18} />
              <span>新建</span>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        {spreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
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
        ) : filteredSpreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-mystic-gold/70 font-serif text-lg mb-2">没有找到匹配的牌阵记录</p>
            <p className="text-mystic-gold/50 text-sm mb-6">尝试更换搜索词或日期范围</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStartDate('');
                setEndDate('');
              }}
              className="text-mystic-gold/60 hover:text-mystic-gold text-sm font-serif transition-colors"
            >
              清除所有筛选条件
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpreads.map((spread) => (
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
        )}
      </div>
    </div>
  );
};

export default SpreadListPage;
