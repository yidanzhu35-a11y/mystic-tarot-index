import React from 'react';
import { X, Coffee } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-mystic-bg border border-mystic-gold w-full max-w-md p-8 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-mystic-gold/60 hover:text-mystic-gold"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-serif text-mystic-gold mb-6 text-center">关于本站</h2>
        
        <div className="space-y-4 text-gray-300 font-light leading-relaxed mb-8">
          <p>
            本站的目的是帮助塔罗初学者快速查阅和记忆牌意。这里有经典的韦特塔罗体系解读，涵盖感情、事业、财富、成长四个维度。
          </p>
          <p className="text-mystic-gold/80 italic">
            请记住：本站解读仅供参考，直觉永远是我们最好的引路人。
          </p>
          <p>
            祝大家未来都不再需要这里，开启属于你的塔罗叙事！
          </p>
        </div>

        <div className="border-t border-mystic-gold/20 pt-6 flex flex-col items-center text-center">
          <div className="bg-white p-2 rounded-lg mb-4">
             {/* 赞赏码 */}
             <img
                src="/code.jpg"
                alt="赞赏码"
                className="w-32 h-32 object-contain"
             />
          </div>
          <p className="text-sm text-mystic-gold mb-2 font-serif flex items-center justify-center gap-2">
            <Coffee size={16} />
            如果这个工具帮到了你
          </p>
          <p className="text-xs text-gray-400 mb-1">
            欢迎请作者喝杯咖啡！
          </p>
          <p className="text-xs text-gray-400">
            也欢迎➕vx交流：18258500632
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;