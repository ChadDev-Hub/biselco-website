
"use client"
import {Bell} from 'lucide-react'
import { useAuth } from '@/app/utils/authProvider';
import { redirect } from 'next/navigation';

const HomePageHeader = () => {
    const {user} = useAuth();
    if (!user) {
        redirect("/landing")
    }
  return (
    <header className="bg-blue-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-blue-100 uppercase tracking-tight ">Busuanga Island Electric Cooperative</h1>
            <p className="text-2xl font-semibold">Hello, {user?.first_name}!</p>
          </div>
          <button title="notif" className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition">
            <Bell size={24} />
          </button>
        </div>
      </header>
  )
}

export default HomePageHeader