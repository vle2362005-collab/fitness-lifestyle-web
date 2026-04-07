"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Users, Dumbbell, Home, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Lấy dữ liệu
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 2. Debug (Mở F12 chọn tab Console để xem dòng này)
    console.log("🔍 KIỂM TRA ADMIN:", { token: !!token, role: role });

    // 3. Chuẩn hóa Role (Xóa ngoặc kép, khoảng trắng)
    const roleStr = role ? String(role).replace(/['"]/g, '').trim() : "";

    // 4. Kiểm tra điều kiện
    if (!token || token === 'undefined' || token === 'null') {
      console.error("❌ Không có Token, đá về Login");
      router.replace('/login');
    } else if (roleStr !== '1' && roleStr !== 'Admin') {
      console.error("⛔ Role không hợp lệ:", roleStr);
      alert("Bạn không có quyền Admin!");
      router.replace('/dashboard');
    } else {
      console.log("✅ Quyền Admin hợp lệ!");
      setIsAdmin(true);
    }
  }, [router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-cyan-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0B0F19]">
      <aside className="w-64 border-r border-slate-800 bg-slate-950/50 p-6 flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-10 text-purple-400">
          <Shield size={28} />
          <span className="text-xl font-black tracking-widest">ADMIN PORTAL</span>
        </div>
        <div className="flex flex-col gap-4 font-medium text-slate-400">
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 hover:text-purple-400 transition-colors">
            <Users size={20}/> Quản lý User
          </Link>
          <Link href="/admin/exercises" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
            <Dumbbell size={20}/> Quản lý Bài tập
          </Link>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 text-blue-400 hover:bg-blue-500/10 rounded-xl font-medium">
            <Home size={20}/> Về Dashboard
          </Link>
          <button onClick={() => {localStorage.clear(); router.push('/login');}} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl font-medium">
            <LogOut size={20}/> Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto text-white">
        {children}
      </main>
    </div>
  );
}