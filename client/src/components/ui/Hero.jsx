import React, { useEffect } from "react";
import { motion } from "framer-motion";
import hero from "@/assets/hero.png";
import Bgvideo from "@/assets/bgvideo.mp4";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { ReactTyped } from "react-typed";

const Hero = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-linear-to-br from-[#0a001a] via-[#120024] to-[#1a0033] flex items-center">

      {/* 🎥 Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover opacity-10"
      >
        <source src={Bgvideo} type="video/mp4" />
      </video>

      {/* ✨ AI Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: { color: "transparent" },
          particles: {
            number: { value: 60 },
            size: { value: 2 },
            move: { enable: true, speed: 1 },
            opacity: { value: 0.5 },
            links: { enable: true, opacity: 0.2 },
          },
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* 🧠 Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">AI-Powered</span>
            <br />
            <span className="text-white">Insights for</span>
            <br />
            <ReactTyped
  strings={["Smarter Crypto Trading", "AI Crypto Decisions", "Future of Trading"]}
  typeSpeed={60}
  backSpeed={40}
  loop
  className="text-white"
/>
          </h1>

          <button className="mt-8 px-6 py-3 rounded-xl border border-purple-500 text-white backdrop-blur-lg bg-white/5 hover:bg-purple-600 transition shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            Get Started →
          </button>
        </motion.div>

        {/* 🪟 Right Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <div className="relative backdrop-blur-xl bg-white/5 border border-purple-500/30 p-5 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            <motion.img
              src={hero}
              alt="Crypto AI"
              className="w-75 md:w-105 rounded-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* 🪐 Floating Crypto Icons */}
            <motion.div className="absolute -top-6 -left-6 text-yellow-400 text-2xl" animate={{ y: [0, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>₿</motion.div>
            <motion.div className="absolute top-10 -right-6 text-blue-400 text-xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>Ξ</motion.div>
            <motion.div className="absolute bottom-6 -left-4 text-pink-400 text-xl" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }}>◈</motion.div>
          </div>
        </motion.div>
      </div>

      {/* 📜 Bottom Description */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-6 w-full px-6"
      >
        <div className="max-w-4xl mx-auto text-center text-gray-300 text-sm backdrop-blur-md bg-black/20 p-4 rounded-xl">
          “CryptoPulse is a specialized, AI-powered web platform designed to transform the way retail investors interact with the cryptocurrency market. Born out of the need to address the high-risk, unregulated nature of digital assets in emerging economies like Sri Lanka, the platform serves as a comprehensive decision-support tool. Our mission is to shift users from speculative, emotionally charged trading toward a more analytical and data-driven investment strategy.”
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;