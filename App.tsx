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

  // 监听认证状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // 用户已登录，从 Firebase 加载收藏
        await loadFavoritesFromFirebase(currentUser.uid);
      } else {
        // 用户未登录，从本地存储加载收藏
        loadFavoritesFromLocalStorage();
      }
    });

    return unsubscribe;
  }, []);

  // 从本地存储加载收藏
  const loadFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('favoriteTarotCards');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavoriteCards(new Set(parsedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  };

  // 从 Firebase 加载收藏
  const loadFavoritesFromFirebase = async (userId: string) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const favorites = userData.favorites || [];
        setFavoriteCards(new Set(favorites));
      } else {
        // 用户文档不存在，创建新文档
        await setDoc(userDoc, {
          favorites: [],
          createdAt: new Date().toISOString()
        });
        setFavoriteCards(new Set());
      }
    } catch (error) {
      console.error('Error loading favorites from Firebase:', error);
      // 加载失败，从本地存储加载
      loadFavoritesFromLocalStorage();
    }
  };

  // 保存收藏到 Firebase 或本地存储
  const saveFavorites = async () => {
    const favoritesArray = Array.from(favoriteCards);
    
    if (user) {
      // 用户已登录，保存到 Firebase
      try {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          favorites: favoritesArray,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error('Error saving favorites to Firebase:', error);
      }
    } else {
      // 用户未登录，保存到本地存储
      localStorage.setItem('favoriteTarotCards', JSON.stringify(favoritesArray));
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
    if (!loading) {
      saveFavorites();
    }
  }, [favoriteCards, user, loading]);

  // 检查卡牌是否被收藏
  const isFavorite = (cardId: number) => {
    return favoriteCards.has(cardId);
  };

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