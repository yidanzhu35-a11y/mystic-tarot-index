import React, { useState } from 'react';
import { CardCategory, FilterType } from '../types';
import { Search, Menu, Heart, LogIn, LogOut, User, X, Check } from 'lucide-react';
import { auth } from '../firebase';

interface HeaderProps {
  activeView: 'search' | 'notes';
  setActiveView: (view: 'search' | 'notes') => void;
  notesTab: 'cards' | 'spreads';
  setNotesTab: (tab: 'cards' | 'spreads') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (category: FilterType) => void;
  onOpenAbout: () => void;
  onOpenAuth: () => void;
  user: any;
}

const Header: React.FC<HeaderProps> = ({ 
  activeView,
  setActiveView,
  notesTab,
  setNotesTab,
  searchTerm, 
  setSearchTerm, 
  activeFilter, 
  setActiveFilter,
  onOpenAbout,
  onOpenAuth,
  user
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 处理登出确认
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  // 确认登出
  const confirmLogout = async () => {
    try {
      await auth.signOut();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setShowLogoutConfirm(false);
    }
  };

  // 取消登出
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };
  const categories = ['ALL', ...Object.values(CardCategory), 'FAVORITES'];

  return (
    <header className="sticky top-0 z-40 bg-mystic-bg/95 backdrop-blur-md border-b border-mystic-gold/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-serif text-mystic-gold">随身塔罗</h1>
        </div>

        {/* Main Tabs */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-[#1F204A] border border-mystic-gold/20 rounded-lg p-1">
            <button
              onClick={() => setActiveView('search')}
              className={`px-8 py-2 rounded-md font-serif transition-all duration-200 ${
                activeView === 'search'
                  ? 'bg-mystic-gold/20 text-mystic-gold font-bold'
                  : 'text-mystic-gold/50 hover:text-mystic-gold/70'
              }`}
            >
              牌意百科
            </button>
            <button
              onClick={() => setActiveView('notes')}
              className={`px-8 py-2 rounded-md font-serif transition-all duration-200 ${
                activeView === 'notes'
                  ? 'bg-mystic-gold/20 text-mystic-gold font-bold'
                  : 'text-mystic-gold/50 hover:text-mystic-gold/70'
              }`}
            >
              灵感手札
            </button>
          </div>
        </div>

        {/* Top Row: Search & About */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            {activeView === 'search' ? (
              <div className="relative">
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
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setNotesTab('cards')}
                  className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-serif border transition-all duration-200
                    ${notesTab === 'cards'
                      ? 'bg-mystic-gold text-mystic-bg border-mystic-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : 'bg-transparent text-mystic-gold/70 border-mystic-gold/30 hover:border-mystic-gold hover:text-mystic-gold'
                    }
                  `}
                >
                  单牌笔记
                </button>
                <button
                  onClick={() => setNotesTab('spreads')}
                  className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-serif border transition-all duration-200
                    ${notesTab === 'spreads'
                      ? 'bg-mystic-gold text-mystic-bg border-mystic-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : 'bg-transparent text-mystic-gold/70 border-mystic-gold/30 hover:border-mystic-gold hover:text-mystic-gold'
                    }
                  `}
                >
                  牌阵笔记
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-900/30 text-mystic-gold transition-colors flex items-center gap-2"
                title="登出"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="p-2 rounded-full hover:bg-mystic-gold/10 text-mystic-gold transition-colors flex items-center gap-2"
                title="登录/注册"
              >
                <LogIn size={18} />
              </button>
            )}
            <button 
              onClick={onOpenAbout}
              className="p-2 rounded-full hover:bg-mystic-gold/10 text-mystic-gold transition-colors flex items-center gap-2"
            >
              <span className="hidden sm:inline font-serif text-sm">关于</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Filters (Scrollable on mobile) */}
        {activeView === 'search' && (
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-start mt-4">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              let label = cat === 'ALL' ? '全部' : cat === 'FAVORITES' ? '收藏' : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat as FilterType)}
                  className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-serif border transition-all duration-200
                    ${isActive 
                      ? cat === 'FAVORITES' 
                        ? 'bg-red-500 text-white border-red-500 font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-mystic-gold text-mystic-bg border-mystic-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                      : cat === 'FAVORITES'
                        ? 'bg-transparent text-red-400 border-red-400/30 hover:border-red-400 hover:text-red-300'
                        : 'bg-transparent text-mystic-gold/70 border-mystic-gold/30 hover:border-mystic-gold hover:text-mystic-gold'}
                  `}
                >
                  {cat === 'FAVORITES' ? (
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} fill={isActive ? 'currentColor' : 'none'} />
                      <span>{label}</span>
                    </div>
                  ) : (
                    label
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 退出确认弹窗 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景 */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={cancelLogout}
          ></div>

          {/* 弹窗内容 */}
          <div className="relative z-10 bg-[#1F204A] border border-mystic-gold/30 w-full max-w-sm rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-serif text-mystic-gold mb-4 text-center">
                确认退出
              </h3>
              <p className="text-gray-300 text-center mb-6">
                确定要退出登录吗？
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 py-2 bg-transparent border border-mystic-gold/30 rounded text-mystic-gold hover:bg-mystic-gold/10 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  取消
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2 bg-red-900/30 border border-red-500/30 rounded text-mystic-gold hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;