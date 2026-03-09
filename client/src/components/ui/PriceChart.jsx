import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const PriceChart = ({ data, forecastData, showForecast }) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize the chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: 'rgba(168, 85, 247, 0.1)' },
                horzLines: { color: 'rgba(168, 85, 247, 0.1)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
        });

        // Add Main Historical Series
        // This is where the error occurred; ensuring chart is initialized fixes it.
        const mainSeries = chart.addAreaSeries({
            lineColor: '#a855f7',
            topColor: 'rgba(168, 85, 247, 0.4)',
            bottomColor: 'rgba(168, 85, 247, 0.0)',
            lineWidth: 2,
        });

        if (data && data.length > 0) {
            mainSeries.setData(data);
        }

        // Add Forecast Series if toggled
        if (showForecast && forecastData && forecastData.length > 0) {
            const forecastSeries = chart.addLineSeries({
                color: '#ec4899',
                lineStyle: 2, // Dashed line for AI prediction
                lineWidth: 2,
            });
            forecastSeries.setData(forecastData);
        }

        // Handle window resizing
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, forecastData, showForecast]);

    return <div ref={chartContainerRef} className="w-full relative min-h-100" />;
};

export default PriceChart;