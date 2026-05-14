import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import FibonacciGuide   from "./learning/FibonacciGuide";
import RSIMACDGuide     from "./learning/RSIMACDGuide";
import IchimokuGuide    from "./learning/IchimokuGuide";
import PriceActionGuide from "./learning/PriceActionGuide";
import WyckoffGuide     from "./learning/WyckoffGuide";
import OnChainGuide     from "./learning/OnChainGuide";
import SMCGuide         from "./learning/SMCGuide";
import ElliottWaveGuide from "./learning/ElliottWaveGuide";
import PaymentModal     from "../components/PaymentModal";

// All 8 courses — pure React components, no HTML iframes
const REACT_COURSES = {
  "price-action": { component: PriceActionGuide, free: true  },
  "fibonacci":    { component: FibonacciGuide,   free: true  },
  "rsi-macd":     { component: RSIMACDGuide,     free: true  },
  "wyckoff":      { component: WyckoffGuide,     free: false },
  "ichimoku":     { component: IchimokuGuide,    free: false },
  "onchain":      { component: OnChainGuide,     free: false },
  "smc":          { component: SMCGuide,         free: false },
  "elliott-wave": { component: ElliottWaveGuide, free: false },
};

export default function CourseViewer() {
  const { courseId }  = useParams();
  const navigate      = useNavigate();
  const [userInfo,    setUserInfo]   = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!info) { navigate("/login"); return; }
    setUserInfo(info);
  }, [navigate, courseId]);  // re-read on courseId change too

  if (!userInfo) return null;

  const isPro   = userInfo.subscription === "pro" || userInfo.role === "admin";
  const course  = REACT_COURSES[courseId];

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-[#050010] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Course not found</p>
          <button onClick={() => navigate("/learning")} className="text-purple-400 hover:underline">
            Back to Learning Hub
          </button>
        </div>
      </div>
    );
  }

  const hasAccess = course.free || isPro;

  // Locked — show upgrade prompt
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#050010] text-white flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Pro Content</h2>
          <p className="text-gray-400 mb-8">
            This course requires a Pro membership. Upgrade for $9.99 to unlock
            all Intermediate & Advanced content forever.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/learning")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPaymentOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition"
            >
              <Zap size={15} /> Unlock Pro — $9.99
            </motion.button>
          </div>
        </motion.div>

        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onSuccess={() => {
            const info    = JSON.parse(localStorage.getItem("userInfo") || "{}");
            const updated = { ...info, subscription: "pro" };
            localStorage.setItem("userInfo", JSON.stringify(updated));
            setUserInfo(updated);
            setPaymentOpen(false);
          }}
          userInfo={userInfo}
        />
      </div>
    );
  }

  // Render the React course component
  const Component = course.component;
  return <Component />;
}