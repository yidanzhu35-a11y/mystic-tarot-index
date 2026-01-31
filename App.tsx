import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CardModal from './components/CardModal';
import AboutModal from './components/AboutModal';
import { TAROT_DECK } from './constants';
import { CardCategory, TarotCard } from './types';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<CardCategory | 'ALL'>('ALL');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Filter Logic
  const filteredCards = useMemo(() => {
    return TAROT_DECK.filter(card => {
      const matchesSearch = card.name.includes(searchTerm);
      const matchesFilter = activeFilter === 'ALL' || card.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-mystic-bg pb-20">
      
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Results Counter */}
        <div className="mb-4 text-mystic-gold/40 text-xs font-serif uppercase tracking-widest text-right">
          Showing {filteredCards.length} Cards
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Card Image Container */}
              <div className="relative w-full aspect-[2/3] rounded overflow-hidden border border-mystic-gold/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-mystic-gold group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  className="w-full h-full object-contain transition-opacity duration-500 opacity-90 group-hover:opacity-100"
                />
                {/* Overlay gradient for name legibility if needed, though name is outside */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Card Name */}
              <div className="mt-3 text-center">
                <h3 className="text-mystic-gold text-sm sm:text-base font-serif font-medium group-hover:text-white transition-colors">
                  {card.name}
                </h3>
                {/* Optional: Show Category on hover or always small */}
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{card.category}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-mystic-gold/30">
            <p className="text-lg font-serif">未找到相关卡牌</p>
            <p className="text-sm">尝试更换搜索词或筛选条件</p>
          </div>
        )}
      </main>

      {/* Footer / Copyright */}
      <footer className="mt-20 py-8 text-center text-mystic-gold/20 text-xs font-serif">
        <p>© {new Date().getFullYear()} Mystic Tarot Index</p>
      </footer>

      {/* Modals */}
      <CardModal 
        card={selectedCard} 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
      />
      
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />

    </div>
  );
};

export default App;