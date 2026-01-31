import React from 'react';
import { CardCategory } from '../types';
import { Search, Menu } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: CardCategory | 'ALL';
  setActiveFilter: (category: CardCategory | 'ALL') => void;
  onOpenAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  activeFilter, 
  setActiveFilter,
  onOpenAbout
}) => {
  const categories = ['ALL', ...Object.values(CardCategory)];

  return (
    <div className="relative">
      {/* Title and Slogan - Scrolls away */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-serif text-mystic-gold mb-2">随身塔罗</h1>
          <p className="text-sm text-mystic-gold/70 font-sans">牌意百科，一秒读懂</p>
        </div>
      </div>
      
      {/* Search and Filters - Sticky */}
      <header className="sticky top-0 z-40 bg-mystic-bg/95 backdrop-blur-md border-b border-mystic-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Row: Search & About */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-mystic-gold" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-mystic-gold/30 rounded-md leading-5 bg-mystic-bg text-mystic-gold-light placeholder-mystic-gold/50 focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold sm:text-sm transition-colors"
                placeholder="搜索牌名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={onOpenAbout}
              className="p-2 rounded-full hover:bg-mystic-gold/10 text-mystic-gold transition-colors flex items-center gap-2"
            >
              <span className="hidden sm:inline font-serif text-sm">关于</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Row: Filters (Scrollable on mobile) */}
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-start">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              const label = cat === 'ALL' ? '全部' : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat as CardCategory | 'ALL')}
                  className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-serif border transition-all duration-200
                    ${isActive 
                      ? 'bg-mystic-gold text-mystic-bg border-mystic-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                      : 'bg-transparent text-mystic-gold/70 border-mystic-gold/30 hover:border-mystic-gold hover:text-mystic-gold'}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;