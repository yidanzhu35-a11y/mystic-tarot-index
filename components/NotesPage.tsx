import React, { useState } from 'react';
import { TarotCard, CardCategory, Notes } from '../types';
import { TAROT_DECK } from '../constants';
import { exportSingleCardNotesToPDF } from '../utils/pdfExport';
import { FileDown, CheckSquare, Square } from 'lucide-react';

interface NotesPageProps {
  notes: Notes;
  onBack: () => void;
  onOpenCard: (card: TarotCard) => void;
  loading: boolean;
}

const NotesPage: React.FC<NotesPageProps> = ({ notes, onOpenCard, loading }) => {
  const categories = [CardCategory.MAJOR, CardCategory.WANDS, CardCategory.CUPS, CardCategory.SWORDS, CardCategory.PENTACLES];
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);

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

  const toggleCardSelection = (cardId: number) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const toggleAllSelection = () => {
    const allCardIdsWithNotes = TAROT_DECK.filter(
      card => notes[card.id] && notes[card.id].trim().length > 0
    ).map(card => card.id);

    if (selectedCardIds.length === allCardIdsWithNotes.length) {
      setSelectedCardIds([]);
    } else {
      setSelectedCardIds(allCardIdsWithNotes);
    }
  };

  const handleExportPDF = () => {
    exportSingleCardNotesToPDF(notes, selectedCardIds);
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

  const allCardIdsWithNotes = TAROT_DECK.filter(
    card => notes[card.id] && notes[card.id].trim().length > 0
  ).map(card => card.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAllSelection}
            className="flex items-center gap-2 px-4 py-2 border border-mystic-gold/30 rounded-lg text-mystic-gold font-serif hover:bg-mystic-gold/10 transition-colors"
          >
            {selectedCardIds.length === allCardIdsWithNotes.length ? (
              <CheckSquare size={18} />
            ) : (
              <Square size={18} />
            )}
            <span>
              {selectedCardIds.length === allCardIdsWithNotes.length 
                ? '取消全选' 
                : '全选'}
            </span>
          </button>
          {selectedCardIds.length > 0 && (
            <span className="text-mystic-gold/70 text-sm font-serif">
              已选择 {selectedCardIds.length} 条笔记
            </span>
          )}
        </div>
        <button
          onClick={handleExportPDF}
          disabled={selectedCardIds.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-serif transition-all ${
            selectedCardIds.length === 0
              ? 'bg-gray-700/30 text-gray-500 border-gray-600/30 cursor-not-allowed'
              : 'bg-gradient-to-r from-mystic-gold/20 to-mystic-gold/10 border border-mystic-gold/30 text-mystic-gold hover:bg-gradient-to-r from-mystic-gold/30 to-mystic-gold/20'
          }`}
        >
          <FileDown size={18} />
          <span>导出PDF</span>
        </button>
      </div>

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
                  className="bg-[#2A2B55] border border-mystic-gold/20 rounded-lg p-6 hover:border-mystic-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-48 flex-shrink-0 rounded overflow-hidden border border-mystic-gold/20">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCard(card);
                        }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 
                          className="text-xl font-serif text-mystic-gold cursor-pointer hover:underline"
                          onClick={() => onOpenCard(card)}
                        >
                          {card.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardSelection(card.id);
                          }}
                          className="p-1 text-mystic-gold/50 hover:text-mystic-gold transition-colors"
                        >
                          {selectedCardIds.includes(card.id) ? (
                            <CheckSquare size={20} />
                          ) : (
                            <Square size={20} />
                          )}
                        </button>
                      </div>
                      <p 
                        className="text-gray-300 text-sm leading-relaxed flex-1 overflow-hidden cursor-pointer"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 7,
                          WebkitBoxOrient: 'vertical',
                        }}
                        onClick={() => onOpenCard(card)}
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
