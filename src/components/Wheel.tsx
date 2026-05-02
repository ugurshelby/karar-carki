import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import type { Venue } from '../types';

interface WheelProps {
  items: Venue[];
  onSpinComplete: (winner: Venue) => void;
  isSpinning: boolean;
}

function getCategoryColor(v: Venue): string {
  if (v.category === 'yemek') return '#E84820';
  if (v.category === 'kafe') return '#6B3A1F';
  if (v.category === 'tatlı') return '#3A8CAE';
  if (v.category === 'bar') return '#2A6B3C';
  return '#6B6560';
}

function shortenGraphemes(name: string, maxGraphemes: number): string {
  if (maxGraphemes <= 0) return '';
  try {
    const seg = new Intl.Segmenter('tr', { granularity: 'grapheme' });
    const parts = [...seg.segment(name)].map((s) => s.segment);
    if (parts.length <= maxGraphemes) return name;
    return parts.slice(0, maxGraphemes).join('') + '…';
  } catch {
    return name.length > maxGraphemes ? name.slice(0, maxGraphemes) + '…' : name;
  }
}

function computeWheelLabel(
  name: string,
  index: number,
  n: number,
  anglePerSegment: number,
  radiusPx: number
): { display: string; fontSize: number; radiusFactor: number; textLength: number } {
  const baseFont = Math.max(5, Math.min(12, anglePerSegment * 0.38));
  const radiusFactor = n > 36 ? 0.74 : n > 24 ? 0.7 : n > 12 ? 0.66 : 0.63;
  const rLabel = radiusPx * radiusFactor;
  const arcLen = rLabel * ((anglePerSegment * Math.PI) / 180);

  if (n > 24) {
    const t = String(index + 1);
    const fs = Math.max(7, Math.min(11, anglePerSegment * 0.48));
    return {
      display: t,
      fontSize: fs,
      radiusFactor,
      textLength: Math.min(arcLen * 0.95, Math.max(arcLen * 0.4, t.length * fs * 0.62)),
    };
  }

  if (n > 12) {
    const display = shortenGraphemes(name, 2);
    return {
      display,
      fontSize: baseFont,
      radiusFactor,
      textLength: Math.min(arcLen * 0.95, Math.max(arcLen * 0.45, display.length * baseFont * 0.58)),
    };
  }

  const maxG = Math.max(3, Math.min(14, Math.floor(arcLen / (baseFont * 0.52))));
  const display = shortenGraphemes(name, maxG);
  return {
    display,
    fontSize: baseFont,
    radiusFactor,
    textLength: Math.min(arcLen * 0.95, Math.max(arcLen * 0.35, display.length * baseFont * 0.55)),
  };
}

export const Wheel: React.FC<WheelProps> = ({ items, onSpinComplete, isSpinning }) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);

  const numSegments = items.length;
  const anglePerSegment = numSegments > 0 ? 360 / numSegments : 0;
  const radius = 150;
  const center = 150;

  const segments = useMemo(() => {
    if (numSegments === 0) return [];
    return items.map((item, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = (index + 1) * anglePerSegment;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      const label = computeWheelLabel(item.name, index, numSegments, anglePerSegment, radius);

      return {
        path: pathData,
        color: getCategoryColor(item),
        rotation: startAngle + anglePerSegment / 2,
        ...label,
      };
    });
  }, [items, numSegments, anglePerSegment]);

  const spin = useCallback(async () => {
    if (numSegments === 0) return;
    const randomIndex = Math.floor(Math.random() * numSegments);
    const winner = items[randomIndex];
    if (!winner) return;

    const segmentCenterAngle = randomIndex * anglePerSegment + anglePerSegment / 2;
    const targetRotation = 360 * 5 + (360 - segmentCenterAngle);
    const newTotalRotation = rotation + targetRotation;

    await controls.start({
      rotate: newTotalRotation,
      transition: {
        duration: 4,
        ease: [0.15, 0, 0.15, 1],
      },
    });

    setRotation(newTotalRotation);
    onSpinComplete(winner);
  }, [
    anglePerSegment,
    controls,
    items,
    numSegments,
    onSpinComplete,
    rotation,
  ]);

  const wasSpinningRef = useRef(false);
  useEffect(() => {
    if (items.length === 0) return;
    if (isSpinning && !wasSpinningRef.current) {
      void spin();
    }
    wasSpinningRef.current = isSpinning;
  }, [isSpinning, items.length, spin]);

  if (items.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-full border-4 border-[#262626] text-[#525252]">
        Seçenek yok
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-4">
        <div className="h-0 w-0 border-t-20 border-r-10 border-l-10 border-t-[#9A5C28] border-r-transparent border-l-transparent drop-shadow-lg" />
      </div>

      <motion.div className="h-full w-full" animate={controls} initial={{ rotate: 0 }}>
        <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-2xl">
          <g>
            {segments.map((seg, i) => {
              const tx = radius * seg.radiusFactor;
              return (
                <g key={i}>
                  <path d={seg.path} fill={seg.color} stroke="#161616" strokeWidth="2" />
                  <g
                    transform={`rotate(${seg.rotation - 90}, ${center}, ${center}) translate(${center}, ${center})`}
                  >
                    <text
                      x={tx}
                      y={5}
                      fill="#FFFFFF"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize={seg.fontSize}
                      fontWeight="700"
                      textLength={seg.textLength}
                      lengthAdjust="spacingAndGlyphs"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                      transform={`rotate(90, ${tx}, 0)`}
                    >
                      {seg.display}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
          <circle cx={center} cy={center} r={20} fill="#2e2e2e" stroke="#161616" strokeWidth="4" />
          <circle cx={center} cy={center} r={8} fill="#0A0A0A" />
        </svg>
      </motion.div>
    </div>
  );
};
