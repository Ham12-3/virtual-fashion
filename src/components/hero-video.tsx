"use client";

import { useState, useRef } from "react";

export function HeroVideo() {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setReady(true)}
        className="h-full w-full object-cover"
      >
        <source
          src="https://assets.mixkit.co/videos/805/805-720.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
