import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    BookOpen,
    Bot,
    Calendar,
    CheckSquare,
    ChevronDown,
    FolderKanban,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Search,
    Settings,
    Smile,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: LayoutDashboard,
        },
        {
            name: 'Habit Tracker',
            href: route('habits.index'),
            active: route().current('habits.*'),
            icon: CheckSquare,
        },
        {
            name: 'Journaling & Refleksi',
            href: route('journals.index'),
            active: route().current('journals.*'),
            icon: BookOpen,
        },
        {
            name: 'Mood & Emosi',
            href: route('moods.index'),
            active: route().current('moods.*'),
            icon: Smile,
        },
        {
            name: 'Insights & Statistik',
            href: route('analytics.index'),
            active: route().current('analytics.*'),
            icon: BarChart3,
        },
        {
            name: 'AI Assistant',
            href: route('ai-assistant.index'),
            active: route().current('ai-assistant.*'),
            icon: Bot,
            badge: 'AI Coach',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex antialiased selection:bg-[#1D63ED] selection:text-white">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Brand Header */}
                    <div className="h-16 px-5 border-b border-[#E2E8F0] flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <ApplicationLogo className="w-8 h-8 text-[#1D63ED] transition-transform group-hover:scale-105" />
                            <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
                                Mind<span className="text-[#1D63ED]">Step</span>
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-[#475569] hover:text-[#0F172A] p-1 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="p-4">
                        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                            Ruang Kerja
                        </div>
                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                            item.active
                                                ? 'bg-[#1D63ED] text-white shadow-sm shadow-[#1D63ED]/20'
                                                : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-[#64748B]'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span
                                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                                    item.active
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-[#EFF6FF] text-[#1D63ED]'
                                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Sidebar Footer User Profile */}
                <div className="p-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#1D63ED] font-bold text-sm flex items-center justify-center border border-[#DBEAFE] shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-[#0F172A] truncate">
                                    {user.name}
                                </p>
                                <p className="text-[11px] text-[#64748B] truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={route('profile.edit')}
                            title="Pengaturan Profil"
                            className="p-1.5 text-[#64748B] hover:text-[#1D63ED] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]"
                        >
                            <Settings className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
                {/* Global Topbar */}
                <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 max-w-xl">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-[#475569] hover:text-[#0F172A] p-1.5 rounded-lg border border-[#E2E8F0]"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search Input Bar */}
                        <div className="relative w-full max-w-md hidden sm:block">
                            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari jurnal, kebiasaan, atau refleksi..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] placeholder:text-[#94A3B8] text-[#0F172A] focus:outline-none focus:border-[#1D63ED] focus:ring-2 focus:ring-[#1D63ED]/15 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Action Icons & User Dropdown */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href={route('habits.index')}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-[#64748B]" />
                            <span>Jadwal</span>
                        </Link>

                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors text-xs font-bold text-[#0F172A]"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-[#1D63ED] text-white text-[11px] font-bold flex items-center justify-center">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden sm:inline truncate max-w-[120px]">
                                            {user.name.split(' ')[0]}
                                        </span>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="48" contentClasses="py-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg">
                                    <div className="px-4 py-2 border-b border-[#E2E8F0]">
                                        <p className="text-xs font-bold text-[#0F172A] truncate">{user.name}</p>
                                        <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 text-xs font-semibold text-[#334155] hover:text-[#1D63ED]">
                                        <User className="w-3.5 h-3.5 text-[#64748B]" />
                                        <span>Profil & Pengaturan</span>
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('analytics.index')} className="flex items-center gap-2 text-xs font-semibold text-[#334155] hover:text-[#1D63ED]">
                                        <Activity className="w-3.5 h-3.5 text-[#64748B]" />
                                        <span>Statistik Saya</span>
                                    </Dropdown.Link>
                                    <div className="border-t border-[#E2E8F0] my-1" />
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Keluar Akun</span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
