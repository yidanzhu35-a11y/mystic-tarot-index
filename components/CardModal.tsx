import React, { useState, useEffect, useRef } from 'react';
import { TarotCard, TabType } from '../types';
import { X, Copy, Check, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface CardModalProps {
  card: TarotCard | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: () => void;
  isFavorite: boolean;
}

const TABS: { id: TabType; label: string }[] = [
  { id: 'love', label: '❤️ 感情' },
  { id: 'career', label: '⚔️ 事业' },
  { id: 'wealth', label: '🪙 财富' },
  { id: 'growth', label: '✨ 成长' },
];

const CardModal: React.FC<CardModalProps> = ({ card, isOpen, onClose, onToggleFavorite, isFavorite }) => {
  const [activeTab, setActiveTab] = useState<TabType>('love');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('love');
      setCopiedIndex(null);
    }
  }, [isOpen, card]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      const tabIds: TabType[] = ['love', 'career', 'wealth', 'growth'];
      const currentIndex = tabIds.indexOf(activeTab);
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
        setActiveTab(tabIds[newIndex]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = (currentIndex + 1) % tabIds.length;
        setActiveTab(tabIds[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab]);

  // Handle tab navigation
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  // Handle arrow click navigation
  const handleArrowClick = (direction: 'left' | 'right') => {
    const tabIds: TabType[] = ['love', 'career', 'wealth', 'growth'];
    const currentIndex = tabIds.indexOf(activeTab);
    
    if (direction === 'left') {
      const newIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      setActiveTab(tabIds[newIndex]);
    } else {
      const newIndex = (currentIndex + 1) % tabIds.length;
      setActiveTab(tabIds[newIndex]);
    }
  };

  if (!isOpen || !card) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#1F204A] border border-mystic-gold/30 w-full max-w-4xl max-h-[90vh] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 bg-black/40 rounded-full text-mystic-gold md:hidden"
        >
          <X size={24} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-2/5 bg-black/20 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-mystic-gold/10">
          <div className="relative aspect-[2/3] w-48 md:w-full max-w-[300px] shadow-2xl rounded-sm overflow-hidden border-2 border-mystic-gold/20">
            <img 
              src={card.image} 
              alt={card.name} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-3/5 flex flex-col max-h-[60vh] md:max-h-full overflow-hidden">
          
          {/* Header */}
          <div className="p-6 pb-2 shrink-0">
             <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-mystic-gold/60 text-sm font-serif tracking-widest uppercase mb-1">{card.category}</h3>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-serif text-mystic-gold mb-3">{card.name}</h2>
                    {onToggleFavorite && (
                      <button
                        onClick={onToggleFavorite}
                        className={`p-1 transition-all duration-300 ${isFavorite ? 'text-red-400 scale-110' : 'text-mystic-gold/40 hover:text-mystic-gold'}`}
                        title={isFavorite ? '移除收藏' : '添加收藏'}
                      >
                        <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </div>
               </div>
               <button onClick={onClose} className="hidden md:block text-mystic-gold/60 hover:text-mystic-gold transition-colors">
                 <X size={28} />
               </button>
             </div>
             <p className="text-mystic-gold-light/90 italic border-l-2 border-mystic-gold pl-4 py-1 mb-4 leading-relaxed">
               {card.summary}
             </p>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b border-mystic-gold/10 shrink-0 flex items-center justify-between">
            {/* Left Arrow */}
            <button 
              onClick={() => handleArrowClick('left')}
              className="p-2 text-mystic-gold/50 hover:text-mystic-gold transition-colors"
              aria-label="Previous topic"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Tab Buttons */}
            <div className="flex space-x-6 flex-1 justify-center">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    py-3 text-sm font-serif tracking-wider transition-all relative
                    ${activeTab === tab.id 
                      ? 'text-mystic-gold font-bold' 
                      : 'text-mystic-gold/40 hover:text-mystic-gold/70'}
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mystic-gold shadow-[0_-2px_6px_rgba(212,175,55,0.5)]"></span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Right Arrow */}
            <button 
              onClick={() => handleArrowClick('right')}
              className="p-2 text-mystic-gold/50 hover:text-mystic-gold transition-colors"
              aria-label="Next topic"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Interpretations List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {card.interpretations[activeTab].map((text, idx) => (
              <div 
                key={idx} 
                className="group bg-[#2A2B55] p-4 rounded border border-transparent hover:border-mystic-gold/20 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-200 font-light leading-relaxed text-sm md:text-base">
                    <span className="font-bold text-mystic-gold">
                      {idx === 0 ? '现状：' : idx === 1 ? '建议：' : '未来：'}
                    </span>
                    {text}
                  </p>
                  <button
                    onClick={() => handleCopy(text, idx)}
                    className="shrink-0 text-mystic-gold/40 hover:text-mystic-gold transition-colors p-1"
                    title="复制这段解读"
                  >
                    {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            ))}
            
             <div className="pt-4 flex justify-center">
                 <button 
                   onClick={() => {
                     const allText = card.interpretations[activeTab].join('\n');
                     handleCopy(allText, 999);
                   }}
                   className="text-xs text-mystic-gold/50 hover:text-mystic-gold underline underline-offset-4 transition-colors font-serif"
                 >
                   {copiedIndex === 999 ? '已复制全部' : '复制本页所有解读'}
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;