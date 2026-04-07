"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Dumbbell, Utensils, Bot, Shield } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = String(localStorage.getItem('role')).replace(/['"]/g, ''); 
    
    if (!token) {
      router.replace('/login');
    } else {
      setIsAuth(true);
      if (role === '1' || role === 'Admin') setIsAdmin(true); 
    }
  }, [router]);

  const handleLogout = () => {
    if(confirm("Bạn muốn đăng xuất?")) {
      localStorage.clear();
      router.push('/login');
    }
  };

  if (!isAuth) return <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">Đang kiểm tra bảo mật...</div>;

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <nav className="flex justify-between items-center py-4 px-10 border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md fixed w-full top-0 z-50">
        <Link href="/dashboard" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 tracking-wider">
          TRUEFORM
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-400">
          <Link href="/dashboard" className={`hover:text-blue-400 ${pathname.includes('dashboard') ? 'text-blue-400' : ''}`}>Dashboard</Link>
          <Link href="/exercises" className={`hover:text-emerald-400 ${pathname.includes('exercises') ? 'text-emerald-400' : ''}`}>Bài tập</Link>
          <Link href="/nutrition" className={`hover:text-orange-400 ${pathname.includes('nutrition') ? 'text-orange-400' : ''}`}>Dinh dưỡng</Link>
          <Link href="/trueformcoach" className={`hover:text-purple-400 ${pathname.includes('trueformcoach') ? 'text-purple-400' : ''}`}>AI Coach</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* NÚT HIỂN THỊ RIÊNG CHO ADMIN */}
          {isAdmin && (
            <Link href="/admin/users" className="text-purple-400 border border-purple-500/30 bg-purple-500/10 px-4 py-2 rounded-lg hover:bg-purple-500/20 text-sm font-bold flex items-center gap-2 transition-all">
              <Shield size={16} /> Trang Quản Trị
            </Link>
          )}
          <button onClick={handleLogout} className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 text-sm font-bold flex items-center gap-2">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </nav>
      <main className="pt-24">{children}</main>
      <ChatWidget />
    </div>
  );
}