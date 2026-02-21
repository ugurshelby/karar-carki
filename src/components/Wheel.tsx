import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useSpring } from 'motion/react';
import { Venue } from '../data';

interface WheelProps {
  items: Venue[];
  onSpinComplete: (winner: Venue) => void;
  isSpinning: boolean;
}

const COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
];

export const Wheel: React.FC<WheelProps> = ({ items, onSpinComplete, isSpinning }) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);

  // If no items, show placeholder
  if (items.length === 0) {
    return (
      <div className="w-full aspect-square rounded-full border-4 border-[#262626] flex items-center justify-center text-[#525252]">
        Seçenek yok
      </div>
    );
  }

  const numSegments = items.length;
  const anglePerSegment = 360 / numSegments;
  const radius = 150; // SVG coordinate space radius
  const center = 150;

  // Generate SVG paths for segments
  const segments = items.map((item, index) => {
    const startAngle = index * anglePerSegment;
    const endAngle = (index + 1) * anglePerSegment;

    // Convert polar to cartesian
    // Subtract 90 degrees to start at 12 o'clock
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    // SVG Path command
    // M = Move to center
    // L = Line to start point
    // A = Arc to end point (rx ry x-axis-rotation large-arc-flag sweep-flag x y)
    // Z = Close path
    const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    return {
      path: pathData,
      color: COLORS[index % COLORS.length],
      label: item.name,
      rotation: startAngle + anglePerSegment / 2, // For text placement
    };
  });

  useEffect(() => {
    if (isSpinning) {
      spin();
    }
  }, [isSpinning]);

  const spin = async () => {
    // Random spin logic
    // We want to land on a random segment.
    // The pointer is at the top (0 degrees / -90 degrees in SVG space).
    // But we are rotating the WHEEL.
    // So if we want segment i to be at the top, we need to rotate the wheel such that segment i is at 0 degrees.
    
    const randomIndex = Math.floor(Math.random() * numSegments);
    const winner = items[randomIndex];

    // Calculate target rotation
    // We want the center of the winning segment to align with the top pointer.
    // The segment is at (randomIndex * anglePerSegment) + (anglePerSegment / 2).
    // To bring this to 0 (top), we rotate the wheel by -(segmentAngle).
    // Add extra full rotations for effect.
    
    const segmentCenterAngle = (randomIndex * anglePerSegment) + (anglePerSegment / 2);
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 spins
    const totalRotation = rotation + (360 * extraSpins) + (360 - segmentCenterAngle + (rotation % 360));
    
    // Adjust to ensure we always spin forward significantly
    const finalRotation = totalRotation + 360 * 2; 

    // We need to calculate exactly where it stops to ensure it aligns with the pointer visually
    // The pointer is at the top.
    // If rotation is 0, index 0 starts at -90deg (12 o'clock) if we drew it that way?
    // Wait, in my SVG generation:
    // Index 0 starts at -90deg (12 o'clock) and goes clockwise.
    // So if rotation is 0, Index 0 is at the top (spanning 0 to angle).
    // Actually, my SVG math: startAngle 0 -> -90deg.
    // So Index 0 is from 12 o'clock to clockwise.
    // To select Index i, we need to rotate the wheel COUNTER-CLOCKWISE so that Index i moves to the top?
    // Or rotate CLOCKWISE?
    // If we rotate the container CLOCKWISE, the segments move CLOCKWISE.
    // To get a segment to the top, we need to rotate it so it hits the top.
    // Let's just use a large positive rotation.
    
    // Target angle for the center of the winning segment in "unrotated" space is `segmentCenterAngle`.
    // We want this angle to be at -90deg (top) after rotation.
    // Current Position + Delta = Final Position
    // But we usually just rotate the whole div.
    // Let's say we rotate by `R`.
    // The visual angle of segment `i` becomes `segmentCenterAngle + R`.
    // We want `segmentCenterAngle + R = 0` (modulo 360) (assuming 0 is top).
    // Wait, in SVG, 0 degrees is usually 3 o'clock. I shifted by -90 in drawing.
    // So visually, 0 degrees in my drawing logic IS 12 o'clock.
    // So we want `segmentCenterAngle + R = 0` (or 360k).
    // So `R = -segmentCenterAngle`.
    // Since we want to spin forward (positive R), `R = 360 * spins - segmentCenterAngle`.
    
    const targetRotation = (360 * 5) + (360 - segmentCenterAngle);
    const newTotalRotation = rotation + targetRotation;

    await controls.start({
      rotate: newTotalRotation,
      transition: {
        duration: 4,
        ease: [0.15, 0, 0.15, 1], // Custom cubic bezier for "spin" feel
      },
    });

    setRotation(newTotalRotation);
    onSpinComplete(winner);
  };

  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-white drop-shadow-lg" />
      </div>

      {/* Wheel Container */}
      <motion.div
        className="w-full h-full"
        animate={controls}
        initial={{ rotate: 0 }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-2xl"
          style={{ transform: 'rotate(0deg)' }} // Initial offset if needed
        >
          <g>
            {segments.map((seg, i) => (
              <g key={i}>
                <path d={seg.path} fill={seg.color} stroke="#161616" strokeWidth="2" />
                {/* Text Label */}
                <g transform={`rotate(${seg.rotation - 90}, ${center}, ${center}) translate(${center}, ${center})`}>
                  <text
                    x={radius * 0.65}
                    y={5}
                    fill="white"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="12"
                    fontWeight="600"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    transform={`rotate(90, ${radius * 0.65}, 0)`}
                  >
                    {seg.label.length > 12 ? seg.label.substring(0, 10) + '...' : seg.label}
                  </text>
                </g>
              </g>
            ))}
          </g>
          {/* Center Hub */}
          <circle cx={center} cy={center} r={20} fill="#262626" stroke="#161616" strokeWidth="4" />
          <circle cx={center} cy={center} r={8} fill="#0A0A0A" />
        </svg>
      </motion.div>
    </div>
  );
};
