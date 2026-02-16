import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CardModal from './components/CardModal';
import AboutModal from './components/AboutModal';
import AuthModal from './components/AuthModal';
import NotesPage from './components/NotesPage';
import SpreadListPage from './components/SpreadListPage';
import SpreadEditPage from './components/SpreadEditPage';
import { TAROT_DECK } from './constants';
import { CardCategory, TarotCard, FilterType, Notes, SpreadRecord, SpreadRecords } from './types';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'search' | 'notes'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSpreadEditPage, setIsSpreadEditPage] = useState(false);
  const [editingSpread, setEditingSpread] = useState<SpreadRecord | null>(null);
  const [notesTab, setNotesTab] = useState<'cards' | 'spreads'>('cards');
  const [cardModalDefaultTab, setCardModalDefaultTab] = useState<'love' | 'career' | 'wealth' | 'growth' | 'notes'>('love');
  const [favoriteCards, setFavoriteCards] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [spreads, setSpreads] = useState<SpreadRecords>([]);

  // 监听认证状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', {
        user: currentUser ? 'logged in' : 'logged out',
        timestamp: new Date().toISOString()
      });
      
      setUser(currentUser);
      
      // 如果用户已登录，从 Firebase 加载数据
      if (currentUser) {
        console.log('User logged in, loading from Firebase:', currentUser.uid);
        await loadFavoritesFromFirebase(currentUser.uid);
        await loadNotesFromFirebase(currentUser.uid);
        await loadSpreadsFromFirebase(currentUser.uid);
      } else {
        // 用户未登录，清空数据
        setFavoriteCards(new Set());
        setNotes({});
        setSpreads([]);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);



  // 从 Firebase 加载收藏
  const loadFavoritesFromFirebase = async (userId: string) => {
    console.log('Loading favorites from Firebase for user:', userId);
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      console.log('Firebase document exists:', userSnapshot.exists());
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log('Firebase user data:', userData);
        const favorites = userData.favorites || [];
        console.log('Favorites from Firebase:', favorites);
        
        // 更新状态
        setFavoriteCards(new Set(favorites));
        console.log('Favorites loaded from Firebase');
      } else {
        // 用户文档不存在，创建新文档
        console.log('Creating new user document');
        await setDoc(userDoc, {
          favorites: [],
          notes: {},
          createdAt: new Date().toISOString()
        });
        console.log('New user document created');
        setFavoriteCards(new Set());
      }
    } catch (error) {
      console.error('Error loading favorites from Firebase:', error);
      // 加载失败，清空收藏
      setFavoriteCards(new Set());
    }
  };

  // 保存收藏到 Firebase
  const saveFavorites = async () => {
    const favoritesArray = Array.from(favoriteCards);
    
    console.log('Saving favorites:', {
      favoritesArray,
      user: user ? 'logged in' : 'not logged in',
      timestamp: new Date().toISOString()
    });
    
    // 只保存到 Firebase
    if (user) {
      try {
        console.log('Saving to Firebase for user:', user.uid);
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          favorites: favoritesArray,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('Favorites saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving favorites to Firebase:', error);
      }
    }
  };

  // Filter Logic
  const filteredCards = useMemo(() => {
    return TAROT_DECK.filter(card => {
      const matchesSearch = card.name.includes(searchTerm);
      let matchesFilter = true;
      
      if (activeFilter === 'FAVORITES') {
        matchesFilter = favoriteCards.has(card.id);
      } else if (activeFilter !== 'ALL') {
        matchesFilter = card.category === activeFilter;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, favoriteCards]);

  // 添加或移除收藏
  const toggleFavorite = (cardId: number) => {
    setFavoriteCards(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cardId)) {
        newFavorites.delete(cardId);
      } else {
        newFavorites.add(cardId);
      }
      return newFavorites;
    });
  };

  // 当收藏变化时保存
  useEffect(() => {
    const handleSaveFavorites = async () => {
      if (!loading) {
        await saveFavorites();
      }
    };
    
    handleSaveFavorites();
  }, [favoriteCards, user, loading]);

  // 检查卡牌是否被收藏
  const isFavorite = (cardId: number) => {
    return favoriteCards.has(cardId);
  };



  // 从 Firebase 加载笔记
  const loadNotesFromFirebase = async (userId: string) => {
    console.log('Loading notes from Firebase for user:', userId);
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      console.log('Firebase document exists:', userSnapshot.exists());
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log('Firebase user data:', userData);
        const userNotes = userData.notes || {};
        console.log('Notes from Firebase:', userNotes);
        
        // 更新状态
        setNotes(userNotes);
        console.log('Notes loaded from Firebase');
      }
    } catch (error) {
      console.error('Error loading notes from Firebase:', error);
      // 加载失败，清空笔记
      setNotes({});
    }
  };

  // 保存笔记到 Firebase
  const saveNote = async (cardId: number, note: string) => {
    console.log('Saving note:', {
      cardId,
      note: note.substring(0, 100) + (note.length > 100 ? '...' : ''),
      user: user ? 'logged in' : 'not logged in',
      timestamp: new Date().toISOString()
    });
    
    // 更新本地笔记状态
    const updatedNotes = {
      ...notes,
      [cardId]: note
    };
    setNotes(updatedNotes);
    
    // 只保存到 Firebase
    if (user) {
      try {
        console.log('Saving note to Firebase for user:', user.uid);
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          notes: updatedNotes,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('Note saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving note to Firebase:', error);
        // 保存失败，恢复之前的笔记状态
        console.log('Restoring previous notes state');
      }
    }
  };

  // 当选择卡牌变化时，加载对应的笔记
  useEffect(() => {
    if (selectedCard) {
      const cardNote = notes[selectedCard.id] || '';
      setCurrentNote(cardNote);
      console.log('Loaded note for card:', { cardId: selectedCard.id, noteLength: cardNote.length });
    }
  }, [selectedCard, notes]);

  // 从 Firebase 加载牌阵记录
  const loadSpreadsFromFirebase = async (userId: string) => {
    console.log('Loading spreads from Firebase for user:', userId);
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      console.log('Firebase document exists:', userSnapshot.exists());
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log('Firebase user data:', userData);
        const userSpreads = userData.spreads || [];
        console.log('Spreads from Firebase:', userSpreads);
        
        // 更新状态
        setSpreads(userSpreads);
        console.log('Spreads loaded from Firebase');
      }
    } catch (error) {
      console.error('Error loading spreads from Firebase:', error);
      // 加载失败，清空牌阵记录
      setSpreads([]);
    }
  };

  // 保存牌阵记录到 Firebase
  const saveSpread = async (spread: SpreadRecord) => {
    console.log('Saving spread:', {
      spreadId: spread.id,
      question: spread.question.substring(0, 50) + (spread.question.length > 50 ? '...' : ''),
      user: user ? 'logged in' : 'not logged in',
      timestamp: new Date().toISOString()
    });
    
    // 更新本地状态
    let updatedSpreads;
    const existingIndex = spreads.findIndex(s => s.id === spread.id);
    if (existingIndex >= 0) {
      updatedSpreads = [...spreads];
      updatedSpreads[existingIndex] = spread;
    } else {
      updatedSpreads = [spread, ...spreads];
    }
    
    // 按日期倒序排列
    updatedSpreads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setSpreads(updatedSpreads);
    
    // 保存到 Firebase
    if (user) {
      try {
        console.log('Saving spread to Firebase for user:', user.uid);
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          spreads: updatedSpreads,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('Spread saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving spread to Firebase:', error);
      }
    }
    
    // 关闭编辑页面
    setIsSpreadEditPage(false);
    setEditingSpread(null);
  };

  // 删除牌阵记录
  const deleteSpread = async (spreadId: string) => {
    const updatedSpreads = spreads.filter(s => s.id !== spreadId);
    setSpreads(updatedSpreads);
    
    // 保存到 Firebase
    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          spreads: updatedSpreads,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('Spread deleted from Firebase successfully');
      } catch (error) {
        console.error('Error deleting spread from Firebase:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-mystic-bg pb-20">
      {isSpreadEditPage ? (
        <SpreadEditPage
          spread={editingSpread}
          onBack={() => {
            setIsSpreadEditPage(false);
            setEditingSpread(null);
          }}
          onSave={saveSpread}
        />
      ) : (
        <>
          <Header 
            activeView={activeView}
            setActiveView={setActiveView}
            notesTab={notesTab}
            setNotesTab={setNotesTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
          />

          {activeView === 'search' ? (
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
                    onClick={() => {
                      setSelectedCard(card);
                      setCardModalDefaultTab('love');
                    }}
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
          ) : (
            <main className="max-w-7xl mx-auto px-4 mt-6">
              {notesTab === 'cards' ? (
                <NotesPage
                  notes={notes}
                  onBack={() => {}}
                  onOpenCard={(card) => {
                    setSelectedCard(card);
                    setCardModalDefaultTab('notes');
                  }}
                  loading={loading}
                />
              ) : (
                <SpreadListPage
                  spreads={spreads}
                  onBack={() => {}}
                  onNewSpread={() => {
                    setEditingSpread(null);
                    setIsSpreadEditPage(true);
                  }}
                  onEditSpread={(spread) => {
                    setEditingSpread(spread);
                    setIsSpreadEditPage(true);
                  }}
                  onDeleteSpread={deleteSpread}
                  loading={loading}
                  user={user}
                />
              )}
            </main>
          )}

          {/* Footer / Copyright */}
          <footer className="mt-20 py-8 text-center text-mystic-gold/20 text-xs font-serif">
            <p>© {new Date().getFullYear()} Mystic Tarot Index</p>
          </footer>
        </>
      )}

      {/* Modals */}
      <CardModal 
        card={selectedCard} 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
        onToggleFavorite={selectedCard ? () => toggleFavorite(selectedCard.id) : undefined}
        isFavorite={selectedCard ? isFavorite(selectedCard.id) : false}
        note={currentNote}
        onNoteChange={setCurrentNote}
        onSaveNote={selectedCard ? () => {
          setIsSavingNote(true);
          saveNote(selectedCard.id, currentNote).finally(() => setIsSavingNote(false));
        } : undefined}
        isSavingNote={isSavingNote}
        user={user}
        defaultTab={cardModalDefaultTab}
      />
      
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={() => {
          // 登录成功后不需要额外操作，因为认证状态监听器会自动处理
        }}
      />
      
      
    </div>
  );
};

export default App;