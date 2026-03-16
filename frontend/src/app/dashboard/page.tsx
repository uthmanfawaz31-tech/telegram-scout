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
    Shield,
    TrendingUp
} from "lucide-react";
import Background from "@/components/Background";
import FadeIn from "@/components/FadeIn";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Overview");
    const [user, setUser] = useState<{ id?: number; first_name?: string; username?: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

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

            {/* Sidebar Toggle Button (Mobile/Floating) */}
            <button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 rounded-full shadow-lg md:hidden"
            >
                <Layers className="w-6 h-6 text-white" />
            </button>

            {/* Sidebar */}
            <aside className={`${isSidebarVisible ? "w-64" : "w-0 overflow-hidden"} blue-glass border-r border-white/5 flex flex-col z-20 transition-all duration-300 relative`}>
                <div className="p-6">
                    <div className="flex items-center justify-between text-blue-500">
                        <div className="flex items-center space-x-3">
                            <Send className="w-8 h-8" />
                            <span className="font-bold text-xl text-white">TelePro</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarVisible(false)}
                            className="text-slate-500 hover:text-white transition-colors hidden md:block"
                        >
                            <Plus className="w-5 h-5 rotate-45" />
                        </button>
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
                    <NavItem
                        icon={<Calendar className="w-5 h-5" />}
                        label="Scheduling"
                        active={activeTab === "Scheduling"}
                        onClick={() => setActiveTab("Scheduling")}
                    />
                    <NavItem
                        icon={<BarChart3 className="w-5 h-5" />}
                        label="Analytics"
                        active={activeTab === "Analytics"}
                        onClick={() => setActiveTab("Analytics")}
                    />
                    <NavItem
                        icon={<SettingIcon className="w-5 h-5" />}
                        label="Settings"
                        active={activeTab === "Settings"}
                        onClick={() => setActiveTab("Settings")}
                    />
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
                <div className="p-4 border-t border-white/5 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 z-10 text-white relative">
                {!isSidebarVisible && (
                    <button
                        onClick={() => setIsSidebarVisible(true)}
                        className="absolute top-8 left-8 p-2 blue-glass rounded-lg hover:bg-white/5 transition-all z-30"
                        title="Show Sidebar"
                    >
                        <Layers className="w-5 h-5 text-blue-400" />
                    </button>
                )}
                <header className={`flex justify-between items-center mb-12 ${!isSidebarVisible ? 'pl-12' : ''}`}>
                    <div>
                        <h1 className="text-3xl font-bold">{activeTab}</h1>
                        <p className="text-slate-400">Welcome back, {user?.first_name || "Scout"}.</p>
                    </div>
                    {(activeTab === "Broadcasts" || activeTab === "Groups") && (
                        <div className="flex space-x-4">
                            {activeTab === "Groups" && selectedGroupIds.length > 0 && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center space-x-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Broadcast to {selectedGroupIds.length}</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Campaign</span>
                            </button>
                        </div>
                    )}
                </header>

                <FadeIn key={activeTab}>
                    {activeTab === "Overview" && <OverviewView />}
                    {activeTab === "Groups" && (
                        <GroupsView
                            onRelogin={() => router.push("/")}
                            selectedIds={selectedGroupIds}
                            onSelectionChange={setSelectedGroupIds}
                        />
                    )}
                    {activeTab === "Broadcasts" && <BroadcastsView />}
                    {activeTab === "Scheduling" && <SchedulingView />}
                    {activeTab === "Analytics" && <AnalyticsView />}
                    {activeTab === "Settings" && <SettingsView />}
                </FadeIn>

                {showModal && (
                    <NewCampaignModal
                        onClose={() => setShowModal(false)}
                        initialSelectedIds={selectedGroupIds}
                    />
                )}
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

function GroupsView({ onRelogin, selectedIds, onSelectionChange }: { onRelogin: () => void; selectedIds: number[]; onSelectionChange: (ids: number[]) => void }) {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/telegram/groups`);
                const data = await response.json();
                if (!response.ok) {
                    if (data.detail && data.detail.includes("SESSION_MISSING")) {
                        throw new Error("SESSION_MISSING");
                    }
                    throw new Error(data.detail || "Failed to fetch groups");
                }
                setGroups(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const toggleSelectAll = () => {
        if (selectedIds.length === groups.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(groups.map(g => g.id));
        }
    };

    const toggleGroup = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading your Telegram groups...</div>;

    if (error === "SESSION_MISSING") {
        return (
            <div className="blue-glass p-12 rounded-2xl text-center border border-yellow-500/20">
                <Shield className="w-16 h-16 text-yellow-500/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Session Expired</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Your Telegram session is missing or has expired in our database. Please login again to restore group access.
                </p>
                <button
                    onClick={onRelogin}
                    className="btn-primary"
                >
                    Reconnect Telegram
                </button>
            </div>
        );
    }

    if (error) return (
        <div className="text-center py-20 text-red-400">
            <p className="mb-4">Error: {error}</p>
            <button onClick={() => window.location.reload()} className="text-blue-400 underline hove:text-blue-300">Try Again</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-sm text-slate-400">{selectedIds.length} groups selected</span>
                <button
                    onClick={toggleSelectAll}
                    className="text-sm text-blue-400 font-semibold hover:underline"
                >
                    {selectedIds.length === groups.length ? "Deselect All" : "Select All"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-slate-500">
                        No groups found. Try joining some or check your account.
                    </div>
                ) : (
                    groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => toggleGroup(group.id)}
                            className={`blue-glass p-6 rounded-2xl border transition-all cursor-pointer ${selectedIds.includes(group.id) ? "border-blue-500 bg-blue-500/5" : "border-white/5 hover:border-blue-500/30"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                                        {group.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold truncate w-32">{group.name}</h4>
                                        <p className="text-xs text-slate-500">{group.is_channel ? "Channel" : "Group"}</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded border ${selectedIds.includes(group.id) ? "bg-blue-500 border-blue-500" : "border-white/20"
                                    } flex items-center justify-center`}>
                                    {selectedIds.includes(group.id) && <Plus className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-[10px] text-slate-500 uppercase">ID: {group.id}</span>
                                <span className="text-blue-400 text-xs font-semibold">{selectedIds.includes(group.id) ? "Selected" : "Select"}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function SchedulingView() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`);
            if (response.ok) {
                const data = await response.json();
                // Filter for pending campaigns
                setCampaigns(data.filter((c: any) => c.status === "pending"));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleStop = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/stop`, {
                method: "POST"
            });
            if (response.ok) {
                fetchCampaigns();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading scheduled campaigns...</div>;

    return (
        <div className="space-y-6">
            {campaigns.length === 0 ? (
                <div className="blue-glass p-12 rounded-2xl text-center">
                    <Calendar className="w-16 h-16 text-blue-500/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Scheduled Campaigns</h3>
                    <p className="text-slate-400 mb-6">Create a campaign and set a future date to see it here.</p>
                </div>
            ) : (
                campaigns.map((camp) => (
                    <div key={camp.id} className="blue-glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">{camp.name}</h4>
                                    <p className="text-sm text-slate-500">Scheduled for {new Date(camp.scheduled_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleStop(camp.id)}
                                className="text-red-400 text-xs font-bold hover:underline"
                            >
                                CANCEL
                            </button>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl text-sm text-slate-300 line-clamp-2 italic">
                            "{camp.message_text}"
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function AnalyticsView() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Reach" value="342k" icon={<Users />} trend="+15%" />
                <StatCard label="Engagement" value="4.2%" icon={<TrendingUp className="w-4 h-4" />} trend="+0.8%" />
                <StatCard label="CTR" value="1.2%" icon={<ArrowUpRight className="w-4 h-4" />} trend="-0.2%" />
                <StatCard label="Delivery Rate" value="98.1%" icon={<Shield />} trend="+0.1%" />
            </div>

            <div className="blue-glass p-8 rounded-2xl h-64 flex items-center justify-center border border-white/5">
                <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Analytics engine initializing...</p>
                    <p className="text-xs text-slate-600 mt-2">Charts will appear once 1,000 messages are delivered.</p>
                </div>
            </div>
        </div>
    );
}

function SettingsView() {
    return (
        <div className="max-w-2xl space-y-6">
            <div className="blue-glass p-6 rounded-2xl border border-white/5">
                <h4 className="font-semibold text-lg mb-4">Account Configuration</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm font-medium">Broadcast Speed</p>
                            <p className="text-xs text-slate-500">Auto-balanced (Safe Mode)</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm font-medium">Anti-Ban Protection</p>
                            <p className="text-xs text-slate-500">Advanced proxy rotation enabled</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="blue-glass p-6 rounded-2xl border border-white/5">
                <h4 className="font-semibold text-lg mb-4 text-red-400">Zone of Danger</h4>
                <p className="text-xs text-slate-500 mb-4">Permanent actions that cannot be undone.</p>
                <button className="px-6 py-2 rounded-lg border border-red-500/20 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-all">
                    Reset Telegram Session
                </button>
            </div>
        </div>
    );
}

function BroadcastsView() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleStop = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/stop`, {
                method: "POST"
            });
            if (response.ok) {
                fetchCampaigns();
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                    <div key={camp.id} className="blue-glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${camp.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : camp.status === "cancelled" ? "bg-slate-500/10 text-slate-400" : "bg-blue-500/10 text-blue-400"}`}>
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">{camp.name}</h4>
                                <p className="text-sm text-slate-400 line-clamp-1 max-w-md">{camp.message_text}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase">Status</p>
                                <p className={`text-sm font-semibold capitalize ${camp.status === "completed" ? "text-emerald-400" : camp.status === "cancelled" ? "text-red-400" : "text-blue-400"}`}>{camp.status}</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500 uppercase">Date</p>
                                <p className="text-sm font-semibold">{new Date(camp.created_at).toLocaleDateString()}</p>
                            </div>
                            {(camp.status === "running" || camp.status === "pending") && (
                                <button
                                    onClick={() => handleStop(camp.id)}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all"
                                >
                                    STOP
                                </button>
                            )}
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

function NewCampaignModal({ onClose, initialSelectedIds = [] }: { onClose: () => void; initialSelectedIds?: number[] }) {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pastMessages, setPastMessages] = useState<string[]>([]);

    useEffect(() => {
        const fetchPastMessages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`);
                if (response.ok) {
                    const data = await response.json();
                    const completed = data.filter((c: any) => c.status === "completed");
                    const messages = Array.from(new Set(completed.map((c: any) => c.message_text))) as string[];
                    setPastMessages(messages);
                }
            } catch (err) {
                console.error("Failed to fetch past campaigns", err);
            }
        };
        fetchPastMessages();
    }, []);

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
                    scheduled_at: new Date(scheduledAt).toISOString(),
                    chat_ids: initialSelectedIds.length > 0 ? initialSelectedIds : null
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
                        {pastMessages.length > 0 && (
                            <div className="mb-3">
                                <select
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all appearance-none"
                                    onChange={(e) => {
                                        if (e.target.value) setMessage(e.target.value);
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>--- Reuse a successful message ---</option>
                                    {pastMessages.map((msg, idx) => (
                                        <option key={idx} value={msg}>{msg.length > 60 ? msg.substring(0, 60) + "..." : msg}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <textarea
                            placeholder="Type your message here..."
                            rows={4}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <p className="mt-2 text-[10px] text-slate-500">
                            Tip: Use spintax like <code className="text-blue-400">{"{Hello|Hi|Greetings}"}</code> to vary your messages.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Schedule Time</label>
                        <input
                            type="datetime-local"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            required
                        />
                    </div>
                    {initialSelectedIds.length > 0 && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-400 font-medium">
                                Broadcasting to {initialSelectedIds.length} selected groups.
                            </p>
                        </div>
                    )}
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
