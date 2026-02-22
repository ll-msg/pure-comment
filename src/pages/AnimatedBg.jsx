import { useEffect } from "react";
import "./animated-bg.css";

export default function AnimatedBg() {
    useEffect(() => {
        let raf = 0;

        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                const y = window.scrollY || 0;
                const h = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1
                );
                const p = y / h;
                document.documentElement.style.setProperty("--scroll", String(p));
                raf = 0;
            });
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
        window.removeEventListener("scroll", onScroll);
        if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return <div className="animatedBg" aria-hidden="true" />;
}