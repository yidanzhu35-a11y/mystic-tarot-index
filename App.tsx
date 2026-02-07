import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CardModal from './components/CardModal';
import AboutModal from './components/AboutModal';
import AuthModal from './components/AuthModal';
import { TAROT_DECK } from './constants';
import { CardCategory, TarotCard, FilterType } from './types';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [favoriteCards, setFavoriteCards] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});

  // 监听认证状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', {
        user: currentUser ? 'logged in' : 'logged out',
        timestamp: new Date().toISOString()
      });
      
      setUser(currentUser);
      setLoading(false);
      
      // 首先总是从本地存储加载，确保快速响应
      loadFavoritesFromLocalStorage();
      loadNotesFromLocalStorage();
      console.log('Initial data loaded from localStorage');
      
      // 然后如果用户已登录，尝试与 Firebase 同步
      if (currentUser) {
        console.log('User logged in, syncing with Firebase:', currentUser.uid);
        // 从 Firebase 加载数据（如果有新数据）
        await loadFavoritesFromFirebase(currentUser.uid);
        await loadNotesFromFirebase(currentUser.uid);
        // 确保本地数据同步到 Firebase
        await saveFavorites();
      }
    });

    return unsubscribe;
  }, []);

  // 从本地存储加载收藏（优先使用）
  const loadFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('favoriteTarotCards');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        console.log('Favorites loaded from localStorage:', parsedFavorites);
        setFavoriteCards(new Set(parsedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        setFavoriteCards(new Set());
      }
    }
  };

  // 从 Firebase 加载收藏（作为备份和同步）
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
        
        // 如果 Firebase 中有数据，更新本地存储和状态
        if (favorites.length > 0) {
          setFavoriteCards(new Set(favorites));
          localStorage.setItem('favoriteTarotCards', JSON.stringify(favorites));
          console.log('Favorites synced from Firebase to localStorage');
        }
      } else {
        // 用户文档不存在，创建新文档
        console.log('Creating new user document');
        const currentFavorites = Array.from(favoriteCards);
        await setDoc(userDoc, {
          favorites: currentFavorites,
          createdAt: new Date().toISOString()
        });
        console.log('New user document created with current favorites:', currentFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from Firebase:', error);
      // 加载失败，使用本地存储中的数据
      console.log('Using localStorage data as backup');
    }
  };

  // 保存收藏到本地存储和 Firebase（本地优先）
  const saveFavorites = async () => {
    const favoritesArray = Array.from(favoriteCards);
    
    console.log('Saving favorites:', {
      favoritesArray,
      user: user ? 'logged in' : 'not logged in',
      timestamp: new Date().toISOString()
    });
    
    // 首先保存到本地存储（主要存储方式）
    localStorage.setItem('favoriteTarotCards', JSON.stringify(favoritesArray));
    console.log('Favorites saved to localStorage:', favoritesArray);
    
    // 然后尝试保存到 Firebase（备份和同步）
    if (user) {
      try {
        console.log('Syncing to Firebase for user:', user.uid);
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          favorites: favoritesArray,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('Favorites synced to Firebase successfully');
      } catch (error) {
        console.error('Error syncing favorites to Firebase:', error);
        // Firebase 同步失败不影响用户体验，因为本地存储已经保存
        console.log('Local storage is up to date, Firebase sync failed');
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

  // 从本地存储加载笔记
  const loadNotesFromLocalStorage = () => {
    const savedNotes = localStorage.getItem('tarotCardNotes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        console.log('Notes loaded from localStorage:', parsedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error loading notes from localStorage:', error);
        setNotes({});
      }
    }
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
        
        // 如果 Firebase 中有笔记数据，更新本地存储和状态
        if (Object.keys(userNotes).length > 0) {
          setNotes(userNotes);
          localStorage.setItem('tarotCardNotes', JSON.stringify(userNotes));
          console.log('Notes synced from Firebase to localStorage');
        }
      }
    } catch (error) {
      console.error('Error loading notes from Firebase:', error);
      // 加载失败，使用本地存储中的数据
      console.log('Using localStorage notes as backup');
    }
  };

  // 保存笔记到本地存储和 Firebase
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
    
    // 保存到本地存储
    localStorage.setItem('tarotCardNotes', JSON.stringify(updatedNotes));
    console.log('Note saved to localStorage:', { cardId, noteLength: note.length });
    
    // 尝试保存到 Firebase
    if (user) {
      try {
        console.log('Syncing note to Firebase for user:', user.uid);
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          notes: updatedNotes,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log('Note synced to Firebase successfully');
      } catch (error) {
        console.error('Error syncing note to Firebase:', error);
        // Firebase 同步失败不影响用户体验
        console.log('Local storage is up to date, Firebase sync failed');
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

  return (
    <div className="min-h-screen bg-mystic-bg pb-20">
      
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
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