"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/services/api'; 
import { UserX, Mail, Shield, User as UserIcon, Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/Admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteUser = async (id: number) => {
    if (confirm("⚠️ Xóa tài khoản này?")) {
      try {
        await apiClient.delete(`/Admin/users/${id}`);
        fetchUsers(); 
        alert("Đã xóa thành công!");
      } catch (error) {
        alert("Lỗi server hoặc không thể tự xóa chính mình!");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Users size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Tài khoản</h1>
          <p className="text-slate-400 text-sm mt-1">Quản trị viên và người dùng hệ thống TrueForm.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? <div className="p-10 text-center animate-pulse">Đang tải...</div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr><th className="p-4">ID</th><th className="p-4">Tài khoản</th><th className="p-4">Email</th><th className="p-4">Quyền</th><th className="p-4 text-right">Thao tác</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/50">
                  <td className="p-4 text-slate-500">#{user.id}</td>
                  <td className="p-4 font-bold flex items-center gap-2"><UserIcon size={16} className="text-slate-400"/> {user.username}</td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                    {user.role === 1 || user.role === 'Admin' ? (
                      <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><Shield size={14}/> Admin</span>
                    ) : (
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><UserIcon size={14}/> User</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 rounded-lg"><UserX size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}