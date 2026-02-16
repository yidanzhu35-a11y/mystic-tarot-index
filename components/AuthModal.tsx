import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // 登录 - 不需要邀请码
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 注册 - 需要验证邀请码
        if (!inviteCode.trim()) {
          throw new Error('请输入邀请码');
        }

        // 验证邀请码
        const inviteCodeRef = doc(db, 'inviteCodes', inviteCode.trim());
        const inviteCodeDoc = await getDoc(inviteCodeRef);

        if (!inviteCodeDoc.exists()) {
          throw new Error('邀请码无效');
        }

        const inviteData = inviteCodeDoc.data();
        if (inviteData.used) {
          throw new Error('邀请码已被使用');
        }

        // 创建用户
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // 更新邀请码状态
        await updateDoc(inviteCodeRef, {
          used: true,
          usedBy: userId,
          usedAt: new Date().toISOString()
        });
      }
      onAuthSuccess();
      onClose();
    } catch (err: any) {
      console.error('注册/登录错误:', err);
      let errorMessage = '发生错误，请重试';
      if (err.message === '请输入邀请码' || err.message === '邀请码无效' || err.message === '邀请码已被使用') {
        errorMessage = err.message;
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = '该邮箱已被注册';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '请输入有效的邮箱地址';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = '密码至少需要 6 个字符';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = '邮箱或密码错误';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code) {
        errorMessage = err.code;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景 */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 模态框内容 */}
      <div className="relative z-10 bg-[#1F204A] border border-mystic-gold/30 w-full max-w-md rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 bg-black/40 rounded-full text-mystic-gold"
        >
          <X size={24} />
        </button>

        {/* 内容 */}
        <div className="p-6">
          <h2 className="text-2xl font-serif text-mystic-gold mb-6 text-center">
            {isLogin ? '登录' : '注册'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mystic-gold/70 mb-1">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#2A2B55] border border-mystic-gold/30 rounded text-mystic-gold-light focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold transition-colors"
                placeholder="请输入邮箱地址"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mystic-gold/70 mb-1">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-[#2A2B55] border border-mystic-gold/30 rounded text-mystic-gold-light focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold transition-colors"
                placeholder="请输入密码"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-mystic-gold/70 mb-1">
                  邀请码
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-2 bg-[#2A2B55] border border-mystic-gold/30 rounded text-mystic-gold-light focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold transition-colors"
                  placeholder="请输入邀请码"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-mystic-gold text-mystic-bg font-serif rounded hover:bg-mystic-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-mystic-gold/50 hover:text-mystic-gold transition-colors"
            >
              {isLogin ? '还没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;