'use client';

import React, { memo, useState, useEffect, useCallback } from 'react';
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradingViewWidgetProps {
    title?: string;
    scriptUrl: string;
    config: Record<string, unknown>;
    height?: number;
    className?: string;
    /** If set, shows a fullscreen button and allows toggling fullscreen for this chart */
    fullscreenLabel?: string;
}

const TradingViewWidget = ({ title, scriptUrl, config, height = 600, className, fullscreenLabel }: TradingViewWidgetProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useTradingViewWidget(scriptUrl, config, height);

    const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

    useEffect(() => {
        if (!containerRef.current) return;
        const inner = containerRef.current.querySelector('.tradingview-widget-container__widget') as HTMLElement;
        if (!inner) return;
        if (isFullscreen) {
            const fullscreenHeight = window.innerHeight - 72;
            inner.style.height = `${fullscreenHeight}px`;
        } else {
            inner.style.height = `${height}px`;
        }
    }, [isFullscreen, height]);

    useEffect(() => {
        if (!isFullscreen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') exitFullscreen();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isFullscreen, exitFullscreen]);

    return (
        <div
            className={cn(
                'w-full relative',
                isFullscreen && 'fixed inset-0 z-50 flex flex-col bg-zinc-950 p-4'
            )}
        >
            {(title || fullscreenLabel) && (
            <div className={cn(
                'flex items-center justify-between gap-2 mb-1',
                !fullscreenLabel && 'justify-end'
            )}>
                {title && !isFullscreen && <h3 className="font-semibold text-2xl text-gray-100">{title}</h3>}
                {isFullscreen && (
                    <span className="text-lg font-medium text-zinc-200 truncate">
                        {fullscreenLabel ?? title ?? 'Chart'}
                    </span>
                )}
                {fullscreenLabel && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800"
                        onClick={() => setIsFullscreen((v) => !v)}
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>
                )}
                {isFullscreen && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-zinc-400 hover:text-zinc-200"
                        onClick={exitFullscreen}
                    >
                        Close
                    </Button>
                )}
            </div>
            )}
            <div className={cn('tradingview-widget-container flex-1 min-h-0', className)} ref={containerRef}>
                <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }} />
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);
