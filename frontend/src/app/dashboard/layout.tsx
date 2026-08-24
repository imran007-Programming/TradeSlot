"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api";
import { getCookie, deleteCookie } from "@/lib/cookies";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import {
  MessageSquare,
  CalendarDays,
  Users,
  MapPin,
  Zap,
  LogOut,
  RefreshCw,
  CreditCard,
  Clock,
  BarChart3,
  DollarSign,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    onboardingComplete: boolean;
  }>({ connected: false, onboardingComplete: false });
  const [paymentSummary, setPaymentSummary] = useState<{
    totalEarned: number;
    totalPending: number;
    succeededCount: number;
    pendingCount: number;
  }>({ totalEarned: 0, totalPending: 0, succeededCount: 0, pendingCount: 0 });
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [intakesCount, setIntakesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [workAreasCount, setWorkAreasCount] = useState(0);
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => {
      setIsRouteChanging(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Work area modal from header
  const [showWorkAreaModal, setShowWorkAreaModal] = useState(false);
  const [workAreaDate, setWorkAreaDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [workAreaName, setWorkAreaName] = useState("");
  const [settingWorkArea, setSettingWorkArea] = useState(false);
  const [workAreaMessage, setWorkAreaMessage] = useState("");

  const refreshLayoutData = async () => {
    try {
      const [userRes, stripeRes, paymentRes, convRes, bookRes, waRes] =
        await Promise.allSettled([
          apiClient.get("/auth/me"),
          apiClient.get("/traders/stripe/status"),
          apiClient.get("/payments/summary"),
          apiClient.get("/conversations"),
          apiClient.get("/bookings"),
          apiClient.get("/work-area"),
        ]);

      if (userRes.status === "fulfilled" && userRes.value.success) {
        setUser(userRes.value.data);
      }
      if (
        stripeRes.status === "fulfilled" &&
        stripeRes.value.success &&
        stripeRes.value.data
      ) {
        setStripeStatus({
          connected: stripeRes.value.data.connected,
          onboardingComplete: stripeRes.value.data.onboardingComplete,
        });
      }
      if (
        paymentRes.status === "fulfilled" &&
        paymentRes.value.success &&
        paymentRes.value.data
      ) {
        setPaymentSummary(paymentRes.value.data);
      }
      if (
        convRes.status === "fulfilled" &&
        convRes.value.success &&
        convRes.value.data
      ) {
        const convs = convRes.value.data || [];
        setIntakesCount(convs.length);
        const uniqueCustomers = new Set(convs.map((c: any) => c.customerId));
        setCustomersCount(uniqueCustomers.size);
      }
      if (
        bookRes.status === "fulfilled" &&
        bookRes.value.success &&
        bookRes.value.data
      ) {
        setBookingsCount((bookRes.value.data || []).length);
      }
      if (
        waRes.status === "fulfilled" &&
        waRes.value.success &&
        waRes.value.data
      ) {
        setWorkAreasCount((waRes.value.data || []).length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const token = getCookie("accessToken");
    const init = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        if (res.success && res.data) {
          setUser(res.data);
          await refreshLayoutData();
        } else if (!token) {
          router.push("/");
        } else {
          await refreshLayoutData();
        }
      } catch {
        if (!token) router.push("/");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      refreshLayoutData();
    }
  }, [pathname, loading]);

  useEffect(() => {
    const handleRefresh = () => {
      refreshLayoutData();
    };
    window.addEventListener("dashboard:refresh", handleRefresh);
    const interval = setInterval(refreshLayoutData, 4000);
    return () => {
      window.removeEventListener("dashboard:refresh", handleRefresh);
      clearInterval(interval);
    };
  }, []);

  const checkStripe = async () => {
    try {
      const res = await apiClient.get("/traders/stripe/status");
      if (res.success && res.data) {
        setStripeStatus({
          connected: res.data.connected,
          onboardingComplete: res.data.onboardingComplete,
        });
      }
    } catch {}
  };

  const handleConnectStripe = async () => {
    setConnectingStripe(true);
    try {
      const res = await apiClient.post("/traders/stripe/connect");
      if (res.success && res.data?.onboardingUrl) {
        const popup = window.open(res.data.onboardingUrl, "_blank");
        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            checkStripe();
          }
        }, 1000);
      } else {
        toast.error(res.message || "Failed to generate Stripe link");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConnectingStripe(false);
    }
  };

  const handleResetStripe = () => {
    toast("Reset your Stripe connection?", {
      action: {
        label: "Reset",
        onClick: async () => {
          try {
            const res = await apiClient.post("/traders/stripe/reset");
            if (res.success) {
              setStripeStatus({ connected: false, onboardingComplete: false });
              toast.success("Stripe reset done!");
            }
          } catch (err: any) {
            toast.error(err.message);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {}
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const handleSetWorkArea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingWorkArea(true);
    setWorkAreaMessage("");
    try {
      const res = await apiClient.post("/work-area/set-area", {
        availableDate: workAreaDate,
        area: workAreaName,
      });
      if (res.success) {
        toast.success("Work area zone saved successfully!");
        setWorkAreaName("");
        setShowWorkAreaModal(false);
        refreshLayoutData();
      } else {
        toast.error(res.message || "Failed to save work area zone");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving work area");
    } finally {
      setSettingWorkArea(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <Image
              src="/tools.png"
              alt="Loading..."
              width={56}
              height={56}
              className="w-14 h-14 object-contain animate-bounce drop-shadow-md"
              priority
            />
          </div>
          <p className="text-slate-600 font-bold text-sm tracking-tight">
            Loading TradeSlot...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: "/dashboard/messages",
      icon: <MessageSquare size={15} />,
      label: "Messages",
      count: intakesCount,
    },
    {
      href: "/dashboard/bookings",
      icon: <CalendarDays size={15} />,
      label: "Bookings",
      count: bookingsCount,
    },
    {
      href: "/dashboard/customers",
      icon: <Users size={15} />,
      label: "Customers",
      count: customersCount,
    },
    {
      href: "/dashboard/workareas",
      icon: <MapPin size={15} />,
      label: "Work Areas",
      count: workAreasCount,
    },
  ];

  const inputCls =
    "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div
      className="h-screen w-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden"
      style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
    >
      {/* Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/worker.png"
              alt="TradeSlot Logo"
              width={34}
              height={34}
              className="w-8 h-8 rounded-xl object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              priority
            />
            <h1 className="text-sm font-bold text-[#0F172A] tracking-tight">
              Trade<span className="text-[#E11D48]">Slot</span>
            </h1>
          </Link>
          <span className="text-[10px] bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/30 px-1.5 py-0.5 rounded-md uppercase tracking-widest font-bold">
            Pro
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWorkAreaModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin size={13} className="text-[#E11D48]" /> Set Work Area
          </button>
          {stripeStatus.onboardingComplete ? (
            <div className="flex items-center gap-1.5">
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <CreditCard size={13} className="text-emerald-600" />
                <span>Stripe Active</span>
              </span>
              <button
                onClick={handleResetStripe}
                className="bg-slate-100 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer group shadow-2xs"
                title="Remove Stripe Account"
              >
                <RefreshCw
                  size={12}
                  className="transition-transform group-hover:rotate-180 duration-500 text-slate-400 group-hover:text-red-600"
                />
                <span>Remove Account</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectStripe}
              disabled={connectingStripe}
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard size={13} />{" "}
              {connectingStripe ? "Connecting..." : "Connect Stripe"}
            </button>
          )}
          <div className="h-5 w-px bg-slate-200 mx-1" />
          <span className="text-xs text-slate-400 font-mono">
            {user?.phone}
          </span>
          <button
            onClick={handleLogout}
            className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden w-full">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 h-full py-5 px-3 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
              Navigation
            </p>
            {navItems.map(({ href, icon, label, count }) => {
              const isActive =
                pathname === href ||
                (href === "/dashboard/messages" && pathname === "/dashboard");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/30 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  {icon} <span>{label}</span>
                  {count > 0 && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-bold border bg-white text-[#E11D48] border-[#E11D48]/20">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock size={12} />
                Buffer
              </span>
              <strong className="text-xs text-[#E11D48] font-bold">
                30 min
              </strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <BarChart3 size={12} />
                Channels
              </span>
              <strong className="text-xs text-slate-600 font-bold">
                WA + Web
              </strong>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden bg-slate-50 p-4 flex flex-col gap-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-3 flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Total Customers
                </p>
                <h3 className="text-2xl font-bold mt-0.5 text-[#0F172A]">
                  {intakesCount}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                <MessageSquare size={18} className="text-[#E11D48]" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Confirmed Jobs
                </p>
                <h3 className="text-2xl font-bold mt-0.5 text-emerald-600">
                  {paymentSummary.succeededCount}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {paymentSummary.succeededCount} of {bookingsCount} paid
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <CalendarDays size={18} className="text-emerald-600" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Pending Payments
                </p>
                <h3 className="text-2xl font-bold mt-0.5 text-amber-600">
                  ${paymentSummary.totalPending.toFixed(2)}
                </h3>
                <p className="text-[10px] text-amber-600/90 font-bold mt-0.5">
                  {paymentSummary.pendingCount} unpaid jobs
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <Clock size={18} className="text-amber-600" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Total Earned
                </p>
                <h3 className="text-2xl font-bold mt-0.5 text-emerald-600">
                  ${paymentSummary.totalEarned.toFixed(2)}
                </h3>
                <p className="text-[10px] text-emerald-600/80 font-bold mt-0.5">
                  {paymentSummary.succeededCount} paid
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <DollarSign size={18} className="text-emerald-600" />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Stripe Payouts
                </p>
                <h3 className="text-sm font-bold mt-0.5 text-[#0F172A]">
                  {stripeStatus.onboardingComplete ? "Active" : "Not Setup"}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {stripeStatus.onboardingComplete
                    ? "Direct payout"
                    : "Action needed"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
                <CreditCard size={18} className="text-slate-600" />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden min-h-0 flex flex-col relative">
            {isRouteChanging && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-30 rounded-2xl flex items-center justify-center transition-all animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                    <Image
                      src="/tools.png"
                      alt="Loading..."
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain animate-bounce"
                      priority
                    />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 tracking-tight flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-ping" />
                    <span>Loading...</span>
                  </p>
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      {/* WORK AREA MODAL */}
      {showWorkAreaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-[#0F172A]">
            <h3 className="text-base font-bold text-[#0F172A]">
              Set Work Area Zone
            </h3>
            {workAreaMessage && (
              <p className="text-xs font-bold text-[#E11D48]">
                {workAreaMessage}
              </p>
            )}
            <form onSubmit={handleSetWorkArea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Available Date
                </label>
                <DatePicker
                  value={workAreaDate}
                  onChange={setWorkAreaDate}
                  placeholder="Select zone date"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Location Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. North London, Camden"
                  value={workAreaName}
                  onChange={(e) => setWorkAreaName(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowWorkAreaModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={settingWorkArea}
                  className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-sm cursor-pointer"
                >
                  {settingWorkArea ? "Saving..." : "Save Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
