import React from 'react';
import { X } from 'lucide-react';

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
        
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            Hi，欢迎打开你的塔塔书～
          </p>
          <p>
            这是一个致力于为塔罗学习者提供帮助的网站。
          </p>
          <p>
            在这里，你可以：
          </p>
          
          <div className="pl-4 space-y-4">
            <div>
              <p className="text-mystic-gold font-bold mb-1">
                1️⃣ 牌意百科，一秒读懂
              </p>
              <p className="text-sm">
                这里有经典的韦特塔罗体系解读，涵盖感情、事业、财富、成长四个维度，帮助你快速掌握基础牌意。
              </p>
              <p className="text-sm text-mystic-gold/80 italic">
                当然，所有解读仅供参考，请始终相信你自己的直觉。
              </p>
            </div>
            
            <div>
              <p className="text-mystic-gold font-bold mb-1">
                2️⃣ 灵感手札，常读常新
              </p>
              <p className="text-sm">
                你可以在这里记录你对每张牌的独到理解，也可以写下每次占卜的提问与启示。让那些闪光的灵感与深沉的思考，都沉淀为你个人的智慧笔记。
              </p>
            </div>
          </div>
          
          <p className="text-center mt-6 text-mystic-gold">
            愿我们都能在学习塔罗的路上，见证自己的成长✨✨✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
