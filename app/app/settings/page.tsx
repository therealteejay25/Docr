"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Gear,
  CreditCard,
  SignOut,
  ToggleRight,
  ToggleLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { authApi, usersApi } from "@/lib/api-client";

interface UserSettings {
  emailNotifications: boolean;
  weeklyReport: boolean;
  autoGenerate: boolean;
  slackIntegration: boolean;
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    weeklyReport: true,
    autoGenerate: true,
    slackIntegration: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Fetch actual user settings from backend
      const data = await usersApi.getSettings();
      setSettings(data.settings || settings);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof UserSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);

    // Save to backend
    try {
      setSaving(true);
      await usersApi.updateSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      router.push("/auth");
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-3xl font-semibold text-white mb-2">Settings</h1>
        <p className="text-white/60">Manage your account and preferences</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-white/20 border-t-white"></div>
          <p className="text-white/60 mt-4">Loading settings...</p>
        </div>
      ) : (
        <>
          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base border border-white/10 rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Gear size={24} />
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Profile */}
              <div className="pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  {user?.avatarUrl && (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-white">{user?.name}</h3>
                    <p className="text-sm text-white/60">{user?.email}</p>
                    <p className="text-xs text-white/50 mt-1">
                      GitHub Connected
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Preferences */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-white/60">
                    Get notified about job completions
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailNotifications")}
                  className="cursor-pointer disabled:opacity-50"
                  disabled={saving}
                >
                  {settings.emailNotifications ? (
                    <ToggleRight
                      size={32}
                      className="text-blue-500"
                      weight="fill"
                    />
                  ) : (
                    <ToggleLeft size={32} className="text-white/30" />
                  )}
                </button>
              </div>

              {/* Weekly Report */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Weekly Report</p>
                  <p className="text-sm text-white/60">
                    Receive weekly documentation summary
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("weeklyReport")}
                  className="cursor-pointer disabled:opacity-50"
                  disabled={saving}
                >
                  {settings.weeklyReport ? (
                    <ToggleRight
                      size={32}
                      className="text-blue-500"
                      weight="fill"
                    />
                  ) : (
                    <ToggleLeft size={32} className="text-white/30" />
                  )}
                </button>
              </div>

              {/* Auto Generate */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Auto Generate Docs</p>
                  <p className="text-sm text-white/60">
                    Automatically update documentation on commits
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("autoGenerate")}
                  className="cursor-pointer disabled:opacity-50"
                  disabled={saving}
                >
                  {settings.autoGenerate ? (
                    <ToggleRight
                      size={32}
                      className="text-blue-500"
                      weight="fill"
                    />
                  ) : (
                    <ToggleLeft size={32} className="text-white/30" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Integrations Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-base border border-white/10 rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Bell size={24} />
              Integrations
            </h2>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                <div className="text-left">
                  <p className="font-medium text-white">Slack Integration</p>
                  <p className="text-sm text-white/60">
                    Get notifications in Slack
                  </p>
                </div>
                <CaretRight
                  size={20}
                  className="text-white/40 group-hover:text-white transition-colors"
                />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                <div className="text-left">
                  <p className="font-medium text-white">Discord Integration</p>
                  <p className="text-sm text-white/60">
                    Send updates to Discord
                  </p>
                </div>
                <CaretRight
                  size={20}
                  className="text-white/40 group-hover:text-white transition-colors"
                />
              </button>
            </div>
          </motion.div>

          {/* Billing Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-base border border-white/10 rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <CreditCard size={24} />
              Billing
            </h2>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                <div className="text-left">
                  <p className="font-medium text-white">Subscription Plan</p>
                  <p className="text-sm text-white/60">Current: Pro Plan</p>
                </div>
                <CaretRight
                  size={20}
                  className="text-white/40 group-hover:text-white transition-colors"
                />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                <div className="text-left">
                  <p className="font-medium text-white">Billing History</p>
                  <p className="text-sm text-white/60">
                    View invoices and receipts
                  </p>
                </div>
                <CaretRight
                  size={20}
                  className="text-white/40 group-hover:text-white transition-colors"
                />
              </button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
              <SignOut size={24} />
              Danger Zone
            </h2>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}
