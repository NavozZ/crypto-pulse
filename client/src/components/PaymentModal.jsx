import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { X, Shield, Zap, BookOpen, Check, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../api.js";

// Load Stripe — publishable key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// ── Inner checkout form (must be inside <Elements>) ───────────────────────
const CheckoutForm = ({ onSuccess, onClose }) => {
  const stripe   = useStripe();
  const elements = useElements();
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/learning?upgraded=true`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else {
      // Payment succeeded without redirect
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
        <Check size={32} className="text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-white">Welcome to Pro!</h3>
      <p className="text-gray-400 text-sm text-center">Your account has been upgraded. All courses are now unlocked.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order summary */}
      <div className="bg-white/3 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">CryptoPulse Pro — Lifetime Access</span>
          <span className="text-lg font-bold text-white">$9.99</span>
        </div>
        <div className="space-y-1.5">
          {["All 8 learning modules unlocked", "Intermediate & Advanced courses", "Future courses included", "One-time payment — no subscription"].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
              <Check size={11} className="text-green-400 shrink-0" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white/3 border border-white/10 rounded-xl p-4">
        <PaymentElement options={{
          layout: "tabs",
          appearance: {
            theme: "night",
            variables: {
              colorPrimary:    "#a855f7",
              colorBackground: "#0a0010",
              colorText:       "#ffffff",
              borderRadius:    "8px",
            },
          },
        }} />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading}
        className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
        {loading ? "Processing…" : "Pay $9.99 — Upgrade to Pro"}
      </button>

      <p className="text-center text-xs text-gray-600">
        🔒 Secured by Stripe · 256-bit SSL encryption
      </p>
    </form>
  );
};

// ── PaymentModal ──────────────────────────────────────────────────────────
const PaymentModal = ({ isOpen, onClose, onSuccess, userInfo }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!isOpen || !userInfo) return;
    setLoading(true);
    setError(null);

    axios.post(`${API_BASE}/api/stripe/create-payment-intent`, {},
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    )
    .then(({ data }) => { setClientSecret(data.clientSecret); setLoading(false); })
    .catch(err => {
      setError(err.response?.data?.message || "Failed to initialise payment");
      setLoading(false);
    });
  }, [isOpen, userInfo]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0018] border border-purple-500/30 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.2)] overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <Zap size={18} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Upgrade to Pro</h2>
                  <p className="text-xs text-gray-500">Unlock all learning content</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Pro features */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: BookOpen, label: "8 Courses",   note: "All levels"    },
                  { icon: Zap,      label: "Lifetime",    note: "One payment"   },
                  { icon: Shield,   label: "Secure",      note: "Stripe SSL"    },
                ].map(({ icon: Icon, label, note }) => (
                  <div key={label} className="text-center bg-white/3 border border-white/10 rounded-xl p-3">
                    <Icon size={18} className="text-purple-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="text-xs text-gray-600">{note}</p>
                  </div>
                ))}
              </div>

              {/* Payment form */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-purple-400" />
                </div>
              )}

              {clientSecret && !loading && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "night", variables: { colorPrimary: "#a855f7" } },
                  }}
                >
                  <CheckoutForm onSuccess={onSuccess} onClose={onClose} />
                </Elements>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;