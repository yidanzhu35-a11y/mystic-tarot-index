import React, { useState, useEffect } from 'react';
import { TarotCard, SpreadCard, SpreadRecord } from '../types';
import { TAROT_DECK } from '../constants';
import { ArrowLeft, Plus, X, RotateCcw, Save, Trash2, Search } from 'lucide-react';

interface SpreadEditPageProps {
  spread: SpreadRecord | null;
  onBack: () => void;
  onSave: (spread: SpreadRecord) => void;
}

const SpreadEditPage: React.FC<SpreadEditPageProps> = ({ spread, onBack, onSave }) => {
  const [question, setQuestion] = useState('');
  const [date, setDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [cards, setCards] = useState<SpreadCard[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState<string | null>(null);
  const [cardSearchTerm, setCardSearchTerm] = useState('');

  useEffect(() => {
    if (spread) {
      setQuestion(spread.question);
      setDate(spread.date.split('T')[0]);
      setClientName(spread.clientName || '');
      setCards(spread.cards);
      setInterpretation(spread.interpretation);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setCards([createNewSpreadCard()]);
    }
  }, [spread]);

  const createNewSpreadCard = (): SpreadCard => {
    return {
      id: Date.now().toString(),
      cardId: -1,
      isReversed: false,
      positionMeaning: ''
    };
  };

  const addCard = () => {
    setCards([...cards, createNewSpreadCard()]);
  };

  const removeCard = (cardId: string) => {
    if (cards.length > 1) {
      setCards(cards.filter(c => c.id !== cardId));
    }
  };

  const updateCard = (cardId: string, updates: Partial<SpreadCard>) => {
    setCards(cards.map(c => c.id === cardId ? { ...c, ...updates } : c));
  };

  const toggleReversed = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      updateCard(cardId, { isReversed: !card.isReversed });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const now = new Date().toISOString();
    const spreadToSave: SpreadRecord = {
      id: spread?.id || now,
      question,
      date: new Date(date).toISOString(),
      clientName,
      cards: cards.filter(c => c.cardId !== -1),
      interpretation,
      createdAt: spread?.createdAt || now,
      updatedAt: now
    };

    await onSave(spreadToSave);
    setIsSaving(false);
  };

  const filteredCards = TAROT_DECK.filter(card => 
    card.name.includes(cardSearchTerm)
  );

  const getCardById = (cardId: number): TarotCard | undefined => {
    return TAROT_DECK.find(c => c.id === cardId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-40 bg-mystic-bg/95 backdrop-blur-md border-b border-mystic-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-mystic-gold/10 text-mystic-gold transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-serif text-mystic-gold">
                {spread ? '编辑牌阵' : '新建牌阵'}
              </h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mystic-gold/20 to-mystic-gold/10 border border-mystic-gold/30 rounded-lg text-mystic-gold font-serif hover:bg-gradient-to-r from-mystic-gold/30 to-mystic-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isSaving ? '保存中...' : '保存'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 py-8 flex-1">
        {/* 基本信息 */}
        <div className="bg-[#2A2B55] border border-mystic-gold/20 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-serif text-mystic-gold mb-4">基本信息</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-mystic-gold/70 text-sm mb-2 font-serif">占卜日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1F204A] border border-mystic-gold/20 rounded p-3 text-gray-200 text-sm focus:outline-none focus:border-mystic-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-mystic-gold/70 text-sm mb-2 font-serif">当事人称呼</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="请输入当事人称呼..."
                  className="w-full bg-[#1F204A] border border-mystic-gold/20 rounded p-3 text-gray-200 text-sm focus:outline-none focus:border-mystic-gold/50 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-mystic-gold/70 text-sm mb-2 font-serif">占卜问题</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请输入当事人提出的问题..."
                className="w-full bg-[#1F204A] border border-mystic-gold/20 rounded p-3 text-gray-200 text-sm leading-relaxed resize-none min-h-[80px] focus:outline-none focus:border-mystic-gold/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 牌阵 */}
        <div className="bg-[#2A2B55] border border-mystic-gold/20 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-mystic-gold">牌阵</h2>
            <button
              onClick={addCard}
              className="flex items-center gap-2 px-3 py-1.5 bg-mystic-gold/10 border border-mystic-gold/30 rounded text-mystic-gold text-sm font-serif hover:bg-mystic-gold/20 transition-all"
            >
              <Plus size={16} />
              <span>添加牌</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => {
              const tarotCard = getCardById(card.cardId);
              
              return (
                <div key={card.id} className="bg-[#1F204A] border border-mystic-gold/10 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* 塔罗牌图片 */}
                    <div 
                      className="w-24 h-36 flex-shrink-0 rounded overflow-hidden border border-mystic-gold/20 cursor-pointer"
                      onClick={() => setShowCardSelector(card.id)}
                    >
                      {tarotCard ? (
                        <img
                          src={tarotCard.image}
                          alt={tarotCard.name}
                          className={`w-full h-full object-contain transition-transform duration-300 ${card.isReversed ? 'rotate-180' : ''}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mystic-gold/40 text-sm font-serif">
                          点击选择
                        </div>
                      )}
                    </div>

                    {/* 牌信息 */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          {tarotCard && (
                            <h3 className="text-lg font-serif text-mystic-gold">
                              {tarotCard.name}
                              {card.isReversed && <span className="text-red-400 text-sm ml-2">（逆位）</span>}
                            </h3>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {tarotCard && (
                            <button
                              onClick={() => toggleReversed(card.id)}
                              className="p-1.5 rounded-full hover:bg-mystic-gold/10 text-mystic-gold/70 hover:text-mystic-gold transition-colors"
                              title={card.isReversed ? '设为正位' : '设为逆位'}
                            >
                              <RotateCcw size={16} className={card.isReversed ? 'text-red-400' : ''} />
                            </button>
                          )}
                          <button
                            onClick={() => removeCard(card.id)}
                            disabled={cards.length <= 1}
                            className="p-1.5 rounded-full hover:bg-red-900/30 text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="删除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-mystic-gold/70 text-xs mb-1 font-serif">位置含义</label>
                        <input
                          type="text"
                          value={card.positionMeaning}
                          onChange={(e) => updateCard(card.id, { positionMeaning: e.target.value })}
                          placeholder="比如：现状、障碍、建议..."
                          className="w-full bg-[#2A2B55] border border-mystic-gold/20 rounded p-2 text-gray-200 text-sm focus:outline-none focus:border-mystic-gold/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 完整解读 */}
        <div className="bg-[#2A2B55] border border-mystic-gold/20 rounded-lg p-6">
          <h2 className="text-lg font-serif text-mystic-gold mb-4">完整解读</h2>
          <textarea
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            placeholder="在这里记录对整个牌阵的完整解读..."
            className="w-full bg-[#1F204A] border border-mystic-gold/20 rounded p-4 text-gray-200 text-sm leading-relaxed resize-none min-h-[200px] focus:outline-none focus:border-mystic-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* 卡牌选择器弹窗 */}
      {showCardSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCardSelector(null)}
          ></div>
          
          <div className="relative bg-[#1F204A] border border-mystic-gold/30 w-full max-w-4xl max-h-[80vh] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-mystic-gold/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-serif text-mystic-gold">选择塔罗牌</h3>
                <button
                  onClick={() => setShowCardSelector(null)}
                  className="p-2 text-mystic-gold/60 hover:text-mystic-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-mystic-gold" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-mystic-gold/30 rounded-md bg-[#2A2B55] text-mystic-gold-light placeholder-mystic-gold/50 focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold sm:text-sm transition-colors"
                  placeholder="搜索牌名..."
                  value={cardSearchTerm}
                  onChange={(e) => setCardSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {filteredCards.map((tarotCard) => (
                  <div
                    key={tarotCard.id}
                    onClick={() => {
                      updateCard(showCardSelector, { cardId: tarotCard.id });
                      setShowCardSelector(null);
                      setCardSearchTerm('');
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[2/3] rounded overflow-hidden border border-mystic-gold/20 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-mystic-gold">
                      <img
                        src={tarotCard.image}
                        alt={tarotCard.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="mt-2 text-center text-xs text-mystic-gold/70 group-hover:text-mystic-gold transition-colors truncate">
                      {tarotCard.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpreadEditPage;
