"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, Mail, UserPlus, Shield } from 'lucide-react';
import apiClient from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/Auth/register', formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi hệ thống! Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl text-blue-400 mb-4"><UserPlus size={32} /></div>
          <h1 className="text-3xl font-black text-white tracking-wider mb-2">ĐĂNG KÝ</h1>
          <p className="text-slate-400 text-sm">Tạo tài khoản TrueForm AI</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tên đăng nhập</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-3.5 text-slate-500" />
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-blue-500" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3.5 text-slate-500" />
              <input type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-blue-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-slate-500" />
              <input type="password" required minLength={6} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-blue-500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all">
            {loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-400">
          Đã có tài khoản? <Link href="/login" className="text-blue-400 font-bold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}