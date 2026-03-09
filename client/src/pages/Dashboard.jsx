import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PriceChart from '../components/ui/PriceChart';
import { TrendingUp, MessageSquare, Globe, Zap } from 'lucide-react';

const Dashboard = () => {
    const [selectedAsset, setSelectedAsset] = useState('BTC');
    const [showForecast, setShowForecast] = useState(false);

    // Mock Data for UI Development
    const mockPriceData = [
        { time: '2025-02-20', value: 51000 },
        { time: '2025-02-21', value: 52500 },
        { time: '2025-02-22', value: 51800 },
        { time: '2025-02-23', value: 53000 },
        { time: '2025-02-24', value: 54500 },
    ];

    const mockForecastData = [
        { time: '2025-02-24', value: 54500 },
        { time: '2025-02-25', value: 55800 },
        { time: '2025-02-26', value: 56200 },
    ];

    return (
        <section className="min-h-screen bg-[#0a001a] pt-24 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* 1. Asset Selector Sidebar (FR3) */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="backdrop-blur-xl bg-white/5 border border-purple-500/30 p-5 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-purple-400" /> Select Asset
                        </h3>
                        {['BTC', 'ETH', 'SOL'].map((coin) => (
                            <button
                                key={coin}
                                onClick={() => setSelectedAsset(coin)}
                                className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition ${
                                    selectedAsset === coin 
                                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                                    : 'text-gray-400 hover:bg-white/5'
                                }`}
                            >
                                {coin}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Main Analysis Hub (FR4, FR5) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="backdrop-blur-xl bg-white/5 border border-purple-500/30 p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">{selectedAsset} Price Analysis</h2>
                            <button 
                                onClick={() => setShowForecast(!showForecast)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    showForecast ? 'bg-pink-500 text-white' : 'border border-gray-600 text-gray-400'
                                }`}
                            >
                                {showForecast ? 'Hide AI Forecast' : 'Show AI Forecast'}
                            </button>
                        </div>
                        <PriceChart 
                            data={mockPriceData} 
                            forecastData={mockForecastData} 
                            showForecast={showForecast} 
                        />
                    </div>

                    {/* 3. Sentiment Gauge Area (FR6) Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="backdrop-blur-xl bg-white/5 border border-purple-500/30 p-6 rounded-2xl">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <MessageSquare size={18} className="text-purple-400" /> Market Sentiment
                            </h3>
                            <div className="h-32 flex items-center justify-center text-gray-500 italic">
                                [Sentiment Gauge Component will be placed here]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;