
'use client'
import { useAuth } from '@/app/context/authProvider'
import ToolCard from "@/app/common/tools-compnent/tool-card";
import ComingSoon from "@/app/common/tools-compnent/coming-soon-tool-card";
import {
    CreditCard,
    BookMarked,
    BarChart3,
    Map,
    LayoutDashboard,
    ToolCase,
    FileUser
} from 'lucide-react';



const HomePageTools = () => {
    const { user } = useAuth()
    const isAdmin = user?.roles.map(role => role.name).includes("admin")

    return (
        <>
            <h3 className="text-gray-800 font-bold mt-8 mb-4 px-1 text-lg">Member Tools</h3>
            <div className="grid grid-cols-2 gap-4">
                <ToolCard  icon={<BookMarked className="text-amber-500" />} title="Report Concern" href="/complaints" />
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
                
                {isAdmin && 
                <ToolCard icon={<ToolCase className="text-yellow-500" />} title="Technical Reports" href="/technical"/>}
            </div>
        </>
    )
}

export default HomePageTools