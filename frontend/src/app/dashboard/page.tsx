"use client";

import { motion } from "framer-motion";
import {
    Users,
    Send,
    Calendar,
    Layers,
    BarChart3,
    Settings as SettingIcon,
    LogOut,
    Plus,
    ArrowUpRight,
    Clock,
    Shield
} from "lucide-react";
import Background from "@/components/Background";
import FadeIn from "@/components/FadeIn";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const session = localStorage.getItem("tg_session");
        if (!session) {
            router.push("/");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("tg_session");
        router.push("/");
    };

    return (
        <div className="min-h-screen flex bg-black/50 overflow-hidden">
            <Background />

            {/* Sidebar */}
            <aside className="w-64 blue-glass border-r border-white/5 flex flex-col z-20">
                <div className="p-6">
                    <div className="flex items-center space-x-3 text-blue-500">
                        <Send className="w-8 h-8" />
                        <span className="font-bold text-xl text-white">TelePro</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    <NavItem icon={<Layers className="w-5 h-5" />} label="Overview" active />
                    <NavItem icon={<Users className="w-5 h-5" />} label="Groups" />
                    <NavItem icon={<Send className="w-5 h-5" />} label="Broadcasts" />
                    <NavItem icon={<Calendar className="w-5 h-5" />} label="Scheduling" />
                    <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
                    <NavItem icon={<SettingIcon className="w-5 h-5" />} label="Settings" />
                </nav>

                <div className="p-4 mt-auto">
                    <div className="blue-glass p-4 rounded-xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                JD
                            </div>
                            <div>
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-slate-500">Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 z-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-slate-400">Welcome back. Here's what's happening today.</p>
                    </div>
                    <button className="btn-primary flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>New Campaign</span>
                    </button>
                </header>

                <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatCard label="Total Groups" value="1,284" icon={<Users />} trend="+12%" />
                        <StatCard label="Messages Sent" value="45.2k" icon={<Send />} trend="+5%" />
                        <StatCard label="Avg. Response" value="14.2%" icon={<BarChart3 />} trend="+2%" />
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FadeIn delay={0.2}>
                        <div className="blue-glass p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg">Recent Campaigns</h3>
                                <button className="text-blue-400 text-sm hover:underline">View all</button>
                            </div>
                            <div className="space-y-4">
                                <CampaignItem name="Spring Sale 2026" status="Active" progress={75} />
                                <CampaignItem name="Product Update" status="Completed" progress={100} />
                                <CampaignItem name="Community Poll" status="Scheduled" progress={0} />
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="blue-glass p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg">Group Activity</h3>
                                <BarChart3 className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="space-y-6">
                                <ActivityItem
                                    title="New group join"
                                    description="Successfully joined 'Crypto Alpha'"
                                    time="2m ago"
                                    icon={<Users className="w-4 h-4" />}
                                />
                                <ActivityItem
                                    title="Broadcast failed"
                                    description="Rate limit reached for campaign 'Update'"
                                    time="15m ago"
                                    icon={<Shield className="w-4 h-4 text-red-500" />}
                                    color="red"
                                />
                                <ActivityItem
                                    title="Schedule sync"
                                    description="Updated 12 scheduled messages"
                                    time="1h ago"
                                    icon={<Clock className="w-4 h-4" />}
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
    return (
        <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}

function StatCard({ label, value, icon, trend }: { label: string; value: string; icon: any; trend: string }) {
    return (
        <div className="blue-glass p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                    {icon}
                </div>
                <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-lg">
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <h4 className="text-3xl font-bold mt-1">{value}</h4>
            </div>
        </div>
    );
}

function CampaignItem({ name, status, progress }: { name: string; status: string; progress: number }) {
    return (
        <div className="group p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{name}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${status === "Active" ? "bg-blue-500/10 text-blue-400" :
                    status === "Completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                    }`}>
                    {status}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${status === "Active" ? "bg-blue-500" : "bg-emerald-500"}`}
                />
            </div>
        </div>
    );
}

function ActivityItem({ title, description, time, icon, color = "blue" }: { title: string; description: string; time: string; icon: any; color?: string }) {
    return (
        <div className="flex space-x-4">
            <div className={`mt-1 p-2 rounded-lg bg-${color}-500/10 text-${color}-400 shrink-0`}>
                {icon}
            </div>
            <div>
                <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-sm">{title}</h5>
                    <span className="text-[10px] text-slate-500 uppercase">{time}</span>
                </div>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
        </div>
    );
}
