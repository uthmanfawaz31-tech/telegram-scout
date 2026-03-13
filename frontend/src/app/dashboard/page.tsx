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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Overview");
    const [user, setUser] = useState<{ id?: number; first_name?: string; username?: string } | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("tg_session");
        const userData = localStorage.getItem("tg_user");
        if (!session) {
            router.push("/");
        }
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("tg_session");
        localStorage.removeItem("tg_user");
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
                    <NavItem
                        icon={<Layers className="w-5 h-5" />}
                        label="Overview"
                        active={activeTab === "Overview"}
                        onClick={() => setActiveTab("Overview")}
                    />
                    <NavItem
                        icon={<Users className="w-5 h-5" />}
                        label="Groups"
                        active={activeTab === "Groups"}
                        onClick={() => setActiveTab("Groups")}
                    />
                    <NavItem
                        icon={<Send className="w-5 h-5" />}
                        label="Broadcasts"
                        active={activeTab === "Broadcasts"}
                        onClick={() => setActiveTab("Broadcasts")}
                    />
                    <NavItem icon={<Calendar className="w-5 h-5" />} label="Scheduling" />
                    <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
                    <NavItem icon={<SettingIcon className="w-5 h-5" />} label="Settings" />
                </nav>

                <div className="p-4 mt-auto">
                    <div className="blue-glass p-4 rounded-xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                {user?.first_name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user?.first_name || "User"}</p>
                                <p className="text-xs text-slate-500">{user?.username ? `@${user.username}` : "Telegram User"}</p>
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
            <main className="flex-1 overflow-y-auto p-8 z-10 text-white">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold">{activeTab}</h1>
                        <p className="text-slate-400">Welcome back, {user?.first_name || "Scout"}.</p>
                    </div>
                    {activeTab === "Broadcasts" && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Campaign</span>
                        </button>
                    )}
                </header>

                <FadeIn key={activeTab}>
                    {activeTab === "Overview" && <OverviewView />}
                    {activeTab === "Groups" && <GroupsView />}
                    {activeTab === "Broadcasts" && <BroadcastsView />}
                </FadeIn>

                {showModal && <NewCampaignModal onClose={() => setShowModal(false)} />}
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}

function OverviewView() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Total Groups" value="1,284" icon={<Users />} trend="+12%" />
                <StatCard label="Messages Sent" value="45.2k" icon={<Send />} trend="+5%" />
                <StatCard label="Avg. Response" value="14.2%" icon={<BarChart3 />} trend="+2%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>
        </>
    );
}

function GroupsView() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/telegram/groups`);
                if (!response.ok) throw new Error("Failed to fetch groups");
                const data = await response.json();
                setGroups(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-400">Loading your Telegram groups...</div>;
    if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
                <div key={group.id} className="blue-glass p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                            {group.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-semibold truncate w-40">{group.name}</h4>
                            <p className="text-xs text-slate-500">{group.is_channel ? "Channel" : "Group"}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase">ID: {group.id}</span>
                        <button className="text-blue-400 text-xs font-semibold hover:underline">Select</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function BroadcastsView() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`);
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-400">Loading campaigns...</div>;

    return (
        <div className="space-y-6">
            {campaigns.length === 0 ? (
                <div className="blue-glass p-12 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
                    <p className="text-slate-400 mb-6">Start your first broadcast campaign to reach your audience.</p>
                </div>
            ) : (
                campaigns.map((camp) => (
                    <div key={camp.id} className="blue-glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${camp.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">{camp.name}</h4>
                                <p className="text-sm text-slate-500">{camp.message_text.substring(0, 50)}...</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase">Status</p>
                                <p className={`text-sm font-semibold capitalize ${camp.status === "completed" ? "text-emerald-400" : "text-blue-400"}`}>{camp.status}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase">Date</p>
                                <p className="text-sm font-semibold">{new Date(camp.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
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

function NewCampaignModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    message_text: message,
                    scheduled_at: new Date().toISOString()
                }),
            });
            if (!response.ok) throw new Error("Failed to create campaign");
            onClose();
            // Refresh page to show new campaign
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="blue-glass w-full max-w-lg p-8 rounded-2xl border border-white/10"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">New Campaign</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Campaign Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Weekly Newsletter"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Message Text</label>
                        <textarea
                            placeholder="Type your message here..."
                            rows={4}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary"
                        >
                            {loading ? "Creating..." : "Start Broadcast"}
                        </button>
                    </div>
                </form>
            </motion.div>
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
