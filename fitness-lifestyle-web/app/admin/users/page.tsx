"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/services/api'; // Đường dẫn có thể thay đổi tùy cấu trúc thư mục của em
import { UserX, Mail, Shield, User as UserIcon, Trash2, Users } from 'lucide-react';

interface UserData {
  id: number;
  username: string; 
  email: string;
  role: number | string; 
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      
      const res = await apiClient.get('/Admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi fetch users", err);
      // Dữ liệu mẫu hiển thị nếu API lỗi hoặc chưa bật Backend
      setUsers([
        { id: 1, username: 'Admin Trần', email: 'admin@trueform.com', role: 1 },
        { id: 2, username: 'Người Dùng Test', email: 'user@test.com', role: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xử lý Xóa User
  const handleDeleteUser = async (id: number) => {
    if (confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác!")) {
      try {
        await apiClient.delete(`/Admin/users/${id}`);
        fetchUsers(); // Tải lại danh sách sau khi xóa thành công
        alert("Đã xóa tài khoản thành công!");
      } catch (error) {
        alert("Lỗi khi xóa tài khoản! (Không thể tự xóa chính mình hoặc lỗi server)");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
          <Users size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Quản lý Tài khoản</h1>
          <p className="text-slate-400 text-sm mt-1">Quản trị viên và người dùng hệ thống TrueForm.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-slate-400 animate-pulse font-medium">
            Đang tải dữ liệu người dùng...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Tài khoản</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Quyền (Role)</th>
                <th className="p-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-500">#{user.id}</td>
                  
                  <td className="p-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <UserIcon size={16} className="text-slate-400"/> {user.username}
                    </div>
                  </td>
                  
                  <td className="p-4 text-slate-300 flex items-center gap-2">
                    <Mail size={16} className="text-slate-500"/> 
                    {user.email || <span className="italic text-slate-600">Chưa cập nhật</span>}
                  </td>
                  
                  <td className="p-4">
                    {user.role === 1 || user.role === 'Admin' ? (
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-max shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        <Shield size={14}/> Quản trị viên
                      </span>
                    ) : (
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-max">
                        <UserIcon size={14}/> Người dùng
                      </span>
                    )}
                  </td>
                  
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Xóa tài khoản"
                    >
                      <UserX size={18}/>
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">
                    Hệ thống chưa có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}