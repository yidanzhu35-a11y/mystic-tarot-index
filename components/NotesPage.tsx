import React from 'react';
import { TarotCard, CardCategory, Notes } from '../types';
import { TAROT_DECK } from '../constants';

interface NotesPageProps {
  notes: Notes;
  onBack: () => void;
  onOpenCard: (card: TarotCard) => void;
  loading: boolean;
}

const NotesPage: React.FC<NotesPageProps> = ({ notes, onOpenCard, loading }) => {
  const categories = [CardCategory.MAJOR, CardCategory.WANDS, CardCategory.CUPS, CardCategory.SWORDS, CardCategory.PENTACLES];

  const getCardsWithNotesByCategory = (category: CardCategory) => {
    return TAROT_DECK.filter(
      (card: TarotCard) => card.category === category && notes[card.id] && notes[card.id].trim().length > 0
    );
  };

  const hasAnyNotes = () => {
    return Object.values(notes).some(note => note && note.trim().length > 0);
  };

  const truncateNote = (note: string, maxLength: number = 250) => {
    if (note.length <= maxLength) return note;
    return note.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4 animate-pulse">🪄</div>
        <p className="text-mystic-gold/70 font-serif text-lg">正在查找你的笔记...</p>
      </div>
    );
  }

  if (!hasAnyNotes()) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-6xl mb-4">🪶</div>
        <p className="text-mystic-gold/70 font-serif text-lg">等待你写下第一行字</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
      {categories.map((category) => {
        const cards = getCardsWithNotesByCategory(category);
        if (cards.length === 0) return null;

        return (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-serif text-mystic-gold mb-6 border-l-4 border-mystic-gold pl-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card: TarotCard) => (
                <div
                  key={card.id}
                  onClick={() => onOpenCard(card)}
                  className="bg-[#2A2B55] border border-mystic-gold/20 rounded-lg p-6 cursor-pointer hover:border-mystic-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-48 flex-shrink-0 rounded overflow-hidden border border-mystic-gold/20">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      <h3 className="text-xl font-serif text-mystic-gold mb-3 flex-shrink-0">{card.name}</h3>
                      <p 
                        className="text-gray-300 text-sm leading-relaxed flex-1 overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 7,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {truncateNote(notes[card.id], 250)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotesPage;
