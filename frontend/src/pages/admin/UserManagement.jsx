import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineUser } from 'react-icons/hi';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                toast.success("User deleted successfully!");
                fetchUsers();
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete user");
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 pt-24 space-y-12"
        >
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display font-bold">User <span className="text-primary italic">Management</span></h1>
                    <p className="text-slate-500">Manage all registered users and admin roles.</p>
                </div>
            </header>

            <div className="bg-dark-card border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-400">User Details</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-400">Role</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-400">Joined</th>
                                <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={user._id} 
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shadow-lg border border-primary/20">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-primary transition-colors">{user.name}</h4>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                            user.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-slate-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete User"
                                        >
                                            <HiOutlineTrash size={20} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-500">
                                        <HiOutlineUser className="mx-auto mb-4 opacity-50" size={48} />
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default UserManagement;
