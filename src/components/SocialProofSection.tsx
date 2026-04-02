import { useEffect, useRef } from "react";

const brands = [
  { name: "Vortex", letter: "V" },
  { name: "Nimbus", letter: "N" },
  { name: "Prysma", letter: "P" },
  { name: "Cirrus", letter: "C" },
  { name: "Kynder", letter: "K" },
  { name: "Halcyn", letter: "H" },
];

const SocialProofSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const fadeLoop = () => {
      if (!video.duration || video.paused) {
        rafId = requestAnimationFrame(fadeLoop);
        return;
      }

      const t = video.currentTime;
      const d = video.duration;
      const fadeTime = 0.5;

      if (t < fadeTime) {
        video.style.opacity = String(t / fadeTime);
      } else if (t > d - fadeTime) {
        video.style.opacity = String((d - t) / fadeTime);
      } else {
        video.style.opacity = "1";
      }

      rafId = requestAnimationFrame(fadeLoop);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    rafId = requestAnimationFrame(fadeLoop);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-24 px-4 gap-20">
        {/* Spacer for video visibility */}
        <div className="h-40" />

        {/* Logo Marquee */}
        <div className="max-w-5xl w-full flex items-center gap-12">
          {/* Left text */}
          <p className="text-foreground/50 text-sm whitespace-nowrap shrink-0">
            Relied on by brands
            <br />
            across the globe
          </p>

          {/* Marquee */}
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-16 animate-marquee w-max">
              {duplicatedBrands.map((brand, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold text-foreground">
                    {brand.letter}
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
