import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { TAROT_DECK } from '../constants';
import { TarotCard } from '../types';
import Webcam from 'react-webcam';

interface DrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawModal: React.FC<DrawModalProps> = ({ isOpen, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [cards, setCards] = useState<number[]>([]);
  const [lastHandX, setLastHandX] = useState<number | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  // 初始化卡牌数组
  useEffect(() => {
    if (!isOpen || selectedCard) return;
    
    // 打乱卡牌顺序
    const shuffledCards = [...Array(78)].map((_, index) => index).sort(() => Math.random() - 0.5);
    setCards(shuffledCards);

    // 初始化 MediaPipe
    initMediaPipe();
  }, [isOpen, selectedCard]);

  // 初始化 MediaPipe 手势识别
  const initMediaPipe = async () => {
    try {
      // 动态导入 MediaPipe
      const { Hands } = await import('@mediapipe/hands');
      
      console.log('MediaPipe Hands imported successfully');
      
      // 这里可以添加 MediaPipe 初始化代码
      // 由于环境限制，暂时使用简化版的手势检测
    } catch (error) {
      console.error('Error importing MediaPipe:', error);
      // 降级为鼠标交互
      setupMouseInteraction();
    }
  };

  // 设置鼠标交互（降级方案）
  const setupMouseInteraction = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      if (lastHandX !== null) {
        const deltaX = x - lastHandX;
        if (Math.abs(deltaX) > 50) {
          // 鼠标移动超过阈值，打乱卡牌
          const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
          setCards(shuffledCards);
        }
      }
      
      setLastHandX(x);
    });

    canvas.addEventListener('mouseleave', () => {
      setLastHandX(null);
    });
  };

  // 抽牌函数
  const drawCard = () => {
    setIsDrawing(true);
    setIsReversed(Math.random() > 0.5); // 50% 概率逆位
    
    // 随机选择一张牌
    const randomIndex = Math.floor(Math.random() * TAROT_DECK.length);
    const card = TAROT_DECK[randomIndex];
    
    // 模拟抽牌动画延迟
    setTimeout(() => {
      setSelectedCard(card);
      setIsDrawing(false);
    }, 1500);
  };

  // 关闭抽牌结果，回到抽牌界面
  const closeCardResult = () => {
    setSelectedCard(null);
    // 重新打乱卡牌
    const shuffledCards = [...Array(78)].map((_, index) => index).sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  // 打乱卡牌
  const shuffleCards = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景 */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={selectedCard ? closeCardResult : onClose}
      ></div>

      {/* 抽牌界面 */}
      {!selectedCard ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
          {/* 背景 - 星空效果 */}
          <div className="absolute inset-0 bg-black">
            {/* 装饰性星星 */}
            {[...Array(100)].map((_, index) => (
              <div
                key={index}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`
                }}
              />
            ))}
          </div>

          {/* 已抽取卡牌指示器 */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-2">
              <div className="bg-mystic-gold/20 px-3 py-1 rounded-full">
                <span className="text-mystic-gold text-sm">已抽取 0/1</span>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-24 border border-mystic-gold/30 rounded-sm bg-mystic-gold/5 flex items-center justify-center">
                  <span className="text-mystic-gold/50 text-xs">?</span>
                </div>
              </div>
            </div>
          </div>

          {/* 主要卡牌区域 */}
          <div className="relative z-10 flex items-center justify-center">
            {/* 5张卡牌展示 */}
            <div className="flex gap-4">
              {[...Array(5)].map((_, index) => {
                // 只显示中间3张卡牌
                if (index < 1 || index > 3) return null;
                
                return (
                  <div
                    key={index}
                    className={`
                      w-24 h-36 border border-mystic-gold/30 bg-mystic-gold/10 rounded-sm
                      flex items-center justify-center cursor-pointer transition-all duration-300
                      ${index === 2 ? 'scale-110 border-mystic-gold/50' : ''}
                      hover:scale-105 hover:border-mystic-gold/50
                    `}
                    onClick={index === 2 ? drawCard : undefined}
                  >
                    {/* 卡牌背面图案 */}
                    <div className="w-20 h-32 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-mystic-gold/50 flex items-center justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-mystic-gold/20"></div>
                      </div>
                      <div className="w-16 h-1 border border-mystic-gold/30"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 提示文字 */}
          <div className="absolute bottom-20 z-10 text-center">
            <p className="text-mystic-gold mb-4">请抽取 1 张牌</p>
            <p className="text-mystic-gold/70 text-sm">点击或滑动打乱卡牌，点击中间卡牌抽取</p>
          </div>

          {/* 打乱卡牌按钮 */}
          <div className="absolute bottom-10 z-10 flex gap-4">
            <button
              onClick={shuffleCards}
              className="px-4 py-2 rounded-full text-sm font-serif bg-mystic-gold/20 text-mystic-gold hover:bg-mystic-gold/30 transition-colors"
            >
              打乱卡牌
            </button>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full bg-black/40 text-mystic-gold transition-colors hover:bg-black/60 z-10"
          >
            <X size={24} />
          </button>

          {/* 手势检测区域 */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0"
            style={{ pointerEvents: 'auto' }}
          />
        </div>
      ) : (
        /* 抽牌结果界面 */
        <div className="relative z-10 max-w-4xl w-full bg-mystic-bg border border-mystic-gold/30 rounded-lg shadow-2xl overflow-hidden">
          {/* 关闭按钮 */}
          <button
            onClick={closeCardResult}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-mystic-gold transition-colors hover:bg-black/60 z-10"
          >
            <X size={24} />
          </button>

          {/* 卡牌展示 */}
          <div className="flex flex-col md:flex-row items-center p-8">
            {/* 卡牌图像 */}
            <div className="w-64 h-96 mb-6 md:mb-0 md:mr-8 relative">
              <div 
                className={`
                  relative w-full h-full transition-all duration-1000 ease-out
                  ${isReversed ? 'rotate-180' : ''}
                `}
              >
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-full h-full object-contain"
                />
                {isReversed && (
                  <div className="absolute top-2 right-2 bg-mystic-gold text-mystic-bg text-xs px-2 py-1 rounded-full">
                    逆位
                  </div>
                )}
              </div>
            </div>

            {/* 卡牌解读 */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-serif text-mystic-gold mb-2">{selectedCard.name}</h3>
              <p className="text-mystic-gold/70 mb-6">{selectedCard.nameEn}</p>
              <p className="text-gray-300 mb-6">{selectedCard.summary}</p>
              
              {/* 再次抽牌按钮 */}
              <div className="flex justify-center md:justify-start">
                <button
                  onClick={closeCardResult}
                  className="px-6 py-2 rounded-full text-sm font-serif bg-mystic-gold/20 text-mystic-gold hover:bg-mystic-gold/30 transition-colors"
                >
                  再次抽牌
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加星空动画样式 */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default DrawModal;