
'use client'
import { useAuth } from '@/app/utils/authProvider'
import Link from 'next/link';

import {
    CreditCard,
    AlertTriangle,
    BarChart3,
    Map,
    LayoutDashboard,
    ToolCase
} from 'lucide-react';

function ToolCard({ icon, title, href }: { icon: React.ReactNode, title: string, href?: string }) {
    return (
        <Link href={href ? href : "/"} className="bg-base-100 cursor-pointer p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-base-200 transition active:scale-95">
            <div className="p-3 bg-gray-50 rounded-full">
                {icon}
            </div>
            <span className="text-sm font-semibold text-gray-700">{title}</span>
        </Link>
    );
}

const HomePageTools = () => {
    const { user } = useAuth()
    const isAdmin = user?.roles.map(role => role.name).includes("admin")
    return (
        <>
            <h3 className="text-gray-800 font-bold mt-8 mb-4 px-1 text-lg">Member Tools</h3>
            <div className="grid grid-cols-2 gap-4">
                <ToolCard icon={<AlertTriangle className="text-amber-500" />} title="Report Concern" href="/complaints" />
                <ToolCard icon={<BarChart3 className="text-blue-500" />} title="Usage Trends" />
                <ToolCard icon={<CreditCard className="text-emerald-500" />} title="Billing Help" />
                <ToolCard icon={<Map className="text-slate-500" />} title="Distribution Map" />
                {isAdmin && <ToolCard icon={<LayoutDashboard className="text-slate-500" />} title="Concern Dashboard" href="/complaints/dashboard" />}
                {isAdmin && <ToolCard icon={<ToolCase className="text-yellow-500" />} title="Technical Reports" href="/technical"/>}
            </div>
        </>
    )
}

export default HomePageTools