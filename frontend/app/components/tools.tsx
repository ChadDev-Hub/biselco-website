
'use client'
import { useAuth } from '@/app/utils/authProvider'
import Link from 'next/link';
import {
    CreditCard,
    BookMarked,
    BarChart3,
    Map,
    LayoutDashboard,
    ToolCase,
    FileUser
} from 'lucide-react';
import React from 'react';

type Props = {
    children: React.ReactNode
}

function ToolCard({ icon, title, href }: { icon: React.ReactNode, title: string, href?: string }) {
    return (
        <Link href={href ? href : "/"} className="bg-base-100 cursor-pointer p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-base-200 transition active:scale-95">
            <div className="p-3 bg-gray-50 rounded-full">
                {icon}
            </div>
            <span className="text-xs font-semibold text-gray-700">{title}</span>
        </Link>
    );
}

const ComingSoon = ({ children }: Props) => {
    return (
        <div className="relative w-full h-full group">
            {/* Overlay Layer */}
            <div className="absolute inset-0  z-10 rounded-2xl flex items-center justify-center pointer-events-none">
                <span className="glass text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    Coming Soon
                </span>
            </div>
            
            {/* Disabled content look */}
            <div className="opacity-40 pointer-events-none select-none">
                {children}
            </div>
        </div>
    )
}

const HomePageTools = () => {
    const { user } = useAuth()
    const isAdmin = user?.roles.map(role => role.name).includes("admin")

    return (
        <>
            <h3 className="text-gray-800 font-bold mt-8 mb-4 px-1 text-lg">Member Tools</h3>
            <div className="grid grid-cols-2 gap-4">
                <ToolCard icon={<BookMarked className="text-amber-500" />} title="Report Concern" href="/complaints" />
                {isAdmin && <ToolCard icon={<LayoutDashboard className="text-slate-500" />} title="Concern Dashboard" href="/complaints/dashboard" />}
                {isAdmin && <ToolCard icon={<BarChart3 className="text-blue-500" />} title="AGMA Dashboard" href="/agma-dashboard?tab=overview" />}
                <ToolCard icon={<Map className="text-violet-500" />} title="Distribution Map" href="/distribution-map" />

                <ComingSoon>
                    <ToolCard icon={<CreditCard className="text-emerald-500 text-center" />} title="Billing Help" />
                </ComingSoon>
                
                {/* APPLY FOR NEW CONNECTION */}
                <ComingSoon>
                    <ToolCard icon={<FileUser className="text-slate-500 text-center" />} title="Apply for New Connection" />
                </ComingSoon>
                
                {isAdmin && <ToolCard icon={<ToolCase className="text-yellow-500" />} title="Technical Reports" href="/technical"/>}
            </div>
        </>
    )
}

export default HomePageTools