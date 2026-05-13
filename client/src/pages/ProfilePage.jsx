import { useEffect, useMemo, useState } from "react";
import { Bell, Moon, Save, Shield, UserRound } from "lucide-react";
import { COINS, COIN_MAP } from "../constants/coins";
import { getProfile, removeSavedForecast, updatePassword, updateProfile } from "../services/profileService";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    profileImage: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setProfile(data);
      setForm({
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        profileImage: data.profileImage || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const isDarkMode = useMemo(() => profile?.settings?.darkMode ?? true, [profile]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...form,
        favoriteCoins: profile.favoriteCoins || [],
        settings: profile.settings,
        notificationPreferences: profile.notificationPreferences,
      };
      const data = await updateProfile(payload);
      setProfile(data.profile);
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem("userInfo", JSON.stringify({
        ...userInfo,
        username: data.profile.username,
        email: data.profile.email,
        profileImage: data.profile.profileImage,
        settings: data.profile.settings,
      }));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = (coinId) => {
    const current = profile.favoriteCoins || [];
    const updated = current.includes(coinId)
      ? current.filter((coin) => coin !== coinId)
      : [...current, coinId];
    setProfile((prev) => ({ ...prev, favoriteCoins: updated }));
  };

  const handleSettingsSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const data = await updateProfile({
        favoriteCoins: profile.favoriteCoins,
        notificationPreferences: profile.notificationPreferences,
        settings: profile.settings,
      });
      setProfile(data.profile);
      document.documentElement.style.colorScheme = data.profile.settings?.darkMode ? "dark" : "light";
      setSuccess("Preferences updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updatePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSavedForecast = async (forecastId) => {
    try {
      const data = await removeSavedForecast(forecastId);
      setProfile((prev) => ({ ...prev, savedForecasts: data.savedForecasts }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove saved forecast");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050010] px-4 py-24 md:px-8">
        <div className="max-w-7xl mx-auto"><LoadingSkeleton lines={16} /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error || "Profile is unavailable right now."} onRetry={loadProfile} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050010] text-white px-4 py-24 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-purple-300">Account</p>
          <h1 className="text-3xl font-black">User Profile</h1>
        </div>

        {error && <ErrorState message={error} />}
        {success && <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">{success}</div>}

        <div className="grid gap-6 lg:grid-cols-3">
          <form onSubmit={handleProfileSave} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 lg:col-span-2">
            <h2 className="font-semibold text-lg flex items-center gap-2"><UserRound size={16} /> Profile Info</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="bg-black/30 border border-white/10 rounded-xl p-3" placeholder="Username"
                value={form.username} onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))} />
              <input className="bg-black/30 border border-white/10 rounded-xl p-3" placeholder="Email"
                type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
              <input className="md:col-span-2 bg-black/30 border border-white/10 rounded-xl p-3" placeholder="Profile image URL"
                value={form.profileImage} onChange={(e) => setForm((s) => ({ ...s, profileImage: e.target.value }))} />
              <textarea className="md:col-span-2 bg-black/30 border border-white/10 rounded-xl p-3 min-h-24"
                placeholder="Bio" value={form.bio} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} />
            </div>
            <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold">
              <Save size={14} /> Save Profile
            </button>
          </form>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">Subscription</p>
            <p className="text-xl font-bold mt-1">{profile.subscription === "pro" ? "Premium" : "Free"}</p>
            <p className="text-xs text-gray-500 mt-2">Upgrade from pricing to unlock full analytics suite.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Bell size={16} /> Preferences & Settings</h2>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm">
                Forecast Alerts
                <input type="checkbox" checked={Boolean(profile.notificationPreferences?.forecastAlerts)}
                  onChange={(e) => setProfile((s) => ({ ...s, notificationPreferences: { ...s.notificationPreferences, forecastAlerts: e.target.checked } }))} />
              </label>
              <label className="flex items-center justify-between text-sm">
                Sentiment Alerts
                <input type="checkbox" checked={Boolean(profile.notificationPreferences?.sentimentAlerts)}
                  onChange={(e) => setProfile((s) => ({ ...s, notificationPreferences: { ...s.notificationPreferences, sentimentAlerts: e.target.checked } }))} />
              </label>
              <label className="flex items-center justify-between text-sm">
                Watchlist Alerts
                <input type="checkbox" checked={Boolean(profile.notificationPreferences?.watchlistAlerts)}
                  onChange={(e) => setProfile((s) => ({ ...s, notificationPreferences: { ...s.notificationPreferences, watchlistAlerts: e.target.checked } }))} />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1"><Moon size={14} /> Dark Mode</span>
                <input type="checkbox" checked={Boolean(isDarkMode)}
                  onChange={(e) => setProfile((s) => ({ ...s, settings: { ...s.settings, darkMode: e.target.checked } }))} />
              </label>
            </div>
            <button onClick={handleSettingsSave} disabled={saving}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold">
              Save Preferences
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Shield size={16} /> Password Reset</h2>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input type="password" required className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
                placeholder="Current password" value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((s) => ({ ...s, currentPassword: e.target.value }))} />
              <input type="password" required minLength={6} className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
                placeholder="New password" value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((s) => ({ ...s, newPassword: e.target.value }))} />
              <button disabled={saving} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold">
                Update Password
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-semibold mb-3">Favorite Coins</h2>
            <div className="flex flex-wrap gap-2">
              {COINS.map((coin) => {
                const active = (profile.favoriteCoins || []).includes(coin.id);
                return (
                  <button key={coin.id}
                    onClick={() => toggleFavorite(coin.id)}
                    className={`px-3 py-2 rounded-xl border text-sm transition ${active ? "bg-purple-500/20 border-purple-500/50 text-purple-200" : "bg-white/5 border-white/10 text-gray-300"}`}>
                    {coin.icon} {coin.symbol}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-semibold mb-3">Activity History</h2>
            {(profile.activityHistory || []).length === 0 ? (
              <EmptyState title="No activity yet" description="Recent profile and watchlist activity will appear here." />
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {profile.activityHistory.map((item, index) => (
                  <div key={`${item.createdAt}-${index}`} className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <p className="text-sm font-medium">{String(item.action).replaceAll("_", " ")}</p>
                    <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold mb-3">Saved Forecasts</h2>
          {(profile.savedForecasts || []).length === 0 ? (
            <EmptyState title="No saved forecasts" description="Save a forecast from the AI explanation page." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {profile.savedForecasts.map((item) => (
                <div key={item._id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-sm font-semibold">{COIN_MAP[item.coin]?.name || item.coin}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.summary}</p>
                  <p className="text-xs text-purple-300 mt-1">{item.direction} · {Math.round(Number(item.confidence || 0))}% confidence</p>
                  <button onClick={() => handleRemoveSavedForecast(item._id)}
                    className="mt-2 text-xs text-red-300 hover:text-red-200">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

