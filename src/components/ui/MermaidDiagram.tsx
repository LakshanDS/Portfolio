"use client";

import { useEffect, useRef, useState, memo, useMemo } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
    chart: string;
    className?: string;
}

// Initialize mermaid once globally
let mermaidInitialized = false;
if (!mermaidInitialized) {
    mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
            primaryColor: "#4ADE80",
            primaryTextColor: "#E6EDF3",
            primaryBorderColor: "#1F2937",
            lineColor: "#4ADE80",
            secondaryColor: "#111827",
            tertiaryColor: "#0D1117",
            background: "#0D1117",
            mainBkg: "#111827",
            secondBkg: "#0D1117",
            textColor: "#E6EDF3",
            nodeBorder: "#4ADE80",
            clusterBkg: "#111827",
            clusterBorder: "#1F2937",
            titleColor: "#E6EDF3",
            edgeLabelBackground: "#111827",
        },
        flowchart: {
            htmlLabels: true,
            curve: "basis",
        },
    });
    mermaidInitialized = true;
}

// Cache for rendered diagrams to prevent re-rendering
const svgCache = new Map<string, string>();

function MermaidDiagramInner({ chart, className }: MermaidDiagramProps) {
    const [svg, setSvg] = useState<string>(() => svgCache.get(chart) || "");
    const [error, setError] = useState<string | null>(null);
    const renderingRef = useRef(false);

    // Generate a stable ID based on chart content
    const chartId = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < chart.length; i++) {
            const char = chart.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `mermaid-${Math.abs(hash)}`;
    }, [chart]);

    useEffect(() => {
        // If already cached, use the cached version
        if (svgCache.has(chart)) {
            setSvg(svgCache.get(chart)!);
            return;
        }

        // Prevent concurrent renders
        if (renderingRef.current) return;
        renderingRef.current = true;

        const renderChart = async () => {
            if (!chart) return;

            try {
                const { svg: renderedSvg } = await mermaid.render(chartId, chart);
                svgCache.set(chart, renderedSvg);
                setSvg(renderedSvg);
                setError(null);
            } catch (err) {
                console.error("Mermaid rendering error:", err);
                setError("Failed to render diagram");
            } finally {
                renderingRef.current = false;
            }
        };

        renderChart();
    }, [chart, chartId]);

    if (error) {
        return (
            <div className={cn("bg-[#0D1117] rounded-lg p-4 mb-6 border border-red-500/50 text-red-400 font-mono text-sm", className)}>
                <p className="mb-2">⚠️ Mermaid Diagram Error</p>
                <pre className="text-xs text-[#9CA3AF] overflow-x-auto">{chart}</pre>
            </div>
        );
    }

    // Show placeholder while loading (only briefly on first render)
    if (!svg) {
        return (
            <div className={cn("bg-[#0D1117] rounded-lg p-6 mb-6 border border-[#1F2937] flex justify-center items-center min-h-[100px]", className)}>
                <div className="text-[#4ADE80] text-sm font-mono animate-pulse">Loading diagram...</div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-[#0D1117] rounded-lg p-6 mb-6 border border-[#1F2937] overflow-x-auto shadow-inner flex justify-center",
                // This allows parent to override basics, but we might also need to target the SVG itself in global CSS or deep selection
                className
            )}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

// Memoize the component to prevent re-renders when parent re-renders
export const MermaidDiagram = memo(MermaidDiagramInner, (prevProps, nextProps) => {
    return prevProps.chart === nextProps.chart && prevProps.className === nextProps.className;
});
