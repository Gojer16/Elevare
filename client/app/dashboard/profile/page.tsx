"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiAward, FiCheckCircle, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import Image from "next/image";
import md5 from "blueimp-md5";
import { UnifiedLoadingSpinner } from "../../components/UnifiedLoadingSpinner";

interface Stats {
  tasksCompleted: number;
  reflectionsWritten: number;
  streakCount: number;
  longestStreak: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats from API
        const response = await fetch("/api/user/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  // Auto-set user timezone from the browser; falls back to server time if unset
  useEffect(() => {
    async function setTimezone() {
      if (status !== "authenticated") return;
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!tz) return;
        await fetch("/api/user/theme", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timezone: tz }),
        });
      } catch {
        // non-blocking
      }
    }
    setTimezone();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <UnifiedLoadingSpinner message="Loading profile..." size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        <p className="text-gray-600">You need to be logged in to see your stats and progress.</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 sm:px-6 py-12 bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--color-foreground)' }}>Your Progress</h1>
          <p className="opacity-80" style={{ color: 'var(--color-foreground)' }}>
            Track your journey and celebrate your wins.
          </p>
        </div>

        {/* User Info */}
        <div className="card mb-8 p-6">
          <div className="flex items-center gap-4">
            {(() => {
              const nameFallback = session?.user?.name?.charAt(0) || "U";
              const email = session?.user?.email || "";
              const gravatarUrl = email
                ? `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?s=96&d=identicon`
                : "";
              const imageSrc = session?.user?.image || gravatarUrl || "";
              return imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={session?.user?.name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {nameFallback}
                </div>
              );
            })()}
            <div>
              <h2 className="text-2xl font-bold">{session?.user?.name || "User"}</h2>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Tasks Completed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: 'var(--color-primary)' }}>
                  <FiCheckCircle className="w-8 h-8"/>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.tasksCompleted}</h3>
              <p className="mb-3" style={{ color: 'var(--color-foreground)' }}>Tasks Completed</p>
              <ProgressBar value={percent(stats.tasksCompleted, nextTarget(stats.tasksCompleted, [1,10,100]))} />
              <NextHint current={stats.tasksCompleted} thresholds={[1,10,100]} label="tasks" />
            </motion.div>

            {/* Reflections Written */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: 'var(--color-secondary)' }}>
                  <FiMessageSquare className="w-8 h-8"/>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.reflectionsWritten}</h3>
              <p className="mb-3" style={{ color: 'var(--color-foreground)' }}>Reflections Written</p>
              <ProgressBar value={percent(stats.reflectionsWritten, nextTarget(stats.reflectionsWritten, [1,10,100]))} />
              <NextHint current={stats.reflectionsWritten} thresholds={[1,10,100]} label="reflections" />
            </motion.div>

            {/* Current Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: 'var(--color-secondary)' }}>
                  <FiTrendingUp className="w-8 h-8"/>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.streakCount}</h3>
              <p className="mb-3" style={{ color: 'var(--color-foreground)' }}>Day Streak</p>
              <ProgressBar value={percent(stats.streakCount, nextTarget(stats.streakCount, [3,7,30]))} />
              <NextHint current={stats.streakCount} thresholds={[3,7,30]} label="days" />
            </motion.div>

            {/* Longest Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="card p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: 'var(--color-primary)' }}>
                  <FiAward className="w-8 h-8"/>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{stats.longestStreak}</h3>
              <p style={{ color: 'var(--color-foreground)' }}>Longest Streak</p>
            </motion.div>
          </div>
        )}

        {/* Achievements Summary */}
        <AchievementsSummary />
      </div>
    </main>
  );
}

function AchievementsSummary() {
  const [total, setTotal] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [allRes, userRes] = await Promise.all([
          fetch("/api/achievements", { cache: "no-store" }),
          fetch("/api/achievements/user", { cache: "no-store" }),
        ]);
        if (!allRes.ok || !userRes.ok) return;
        const [all, user] = await Promise.all([allRes.json(), userRes.json()]);
        if (!cancelled) {
          setTotal(Array.isArray(all) ? all.length : 0);
          setUnlocked(Array.isArray(user) ? user.length : 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-foreground)' }}>Achievements</h2>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <UnifiedLoadingSpinner message="" size="sm" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">Unlocked</div>
              <div className="text-3xl font-bold">{unlocked ?? 0}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">Total</div>
              <div className="text-3xl font-bold">{total ?? 0}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">Completion</div>
              <div className="text-3xl font-bold">
                {total ? Math.round(((unlocked || 0) / total) * 100) : 0}%
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end ">
            <a className="btn text-white bg-BrandPrimary" href="/dashboard/achievements">View all</a>
          </div>
        </>
      )}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2" aria-label="progress" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 rounded-full" style={{ width: `${v}%`, backgroundColor: 'var(--color-secondary)' }}></div>
    </div>
  );
}

function percent(current: number, target: number) {
  if (!target) return 0;
  return (current / target) * 100;
}

function nextTarget(current: number, thresholds: number[]) {
  for (const t of thresholds) {
    if (current < t) return t;
  }
  return thresholds[thresholds.length - 1];
}

function NextHint({ current, thresholds, label }: { current: number; thresholds: number[]; label: string }) {
  const target = nextTarget(current, thresholds);
  const remaining = Math.max(0, target - current);
  if (remaining === 0) return null;
  return (
    <p className="mt-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
      {remaining} more {label} to reach {target}
    </p>
  );
}