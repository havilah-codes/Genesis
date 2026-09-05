"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, CircleHelp, Folder, Grid2X2, Headphones, Monitor, MousePointer2, Play, Search, X } from "lucide-react";
import { eras } from "@/lib/eras";
import { useStoryStore } from "@/lib/store";
import MenuBar from "@/components/desktop/MenuBar";

function Dock({ scrollToEra }: { scrollToEra: (index: number) => void }) {
  const mouseX = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 24 });
  const icons = [null, Monitor, Folder, Headphones, MousePointer2];
  return <nav className="dock" onMouseMove={(event) => mouseX.set(event.clientX)} onMouseLeave={() => mouseX.set(-100)} aria-label="Jump to era">{icons.map((Icon, index) => <DockIcon key={eras[index].id} Icon={Icon} index={index} springX={springX} onClick={() => scrollToEra(index)} />)}</nav>;
}

function DockIcon({ Icon, index, springX, onClick }: { Icon: typeof Grid2X2 | null; index: number; springX: ReturnType<typeof useSpring>; onClick: () => void }) {
  const center = 35 + index * 58;
  const scale = useTransform(springX, (x) => Math.max(1, 1.45 - Math.abs(x - center) / 105));
  return <motion.button className="dock-icon" style={{ scale }} whileTap={{ scale: 0.88 }} onClick={onClick} aria-label={`Jump to ${eras[index].title}`}>{Icon ? <Icon size={22} strokeWidth={1.7} /> : <Image className="dock-apple-logo" src="/apple-logo.png" alt="Apple era" width={25} height={25} />}</motion.button>;
}

function ArtifactWindow({ index, onClose }: { index: number; onClose: () => void }) {
  const era = eras[index];
  return <motion.div className="artifact-window" drag dragConstraints={{ left: -80, right: 80, top: -120, bottom: 120 }} dragElastic={0.05} initial={{ opacity: 0, scale: 0.5, y: 48 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.75, y: 40 }} transition={{ type: "spring", stiffness: 240, damping: 22 }}><div className="window-top"><div className="traffic-lights"><button className="traffic red" onClick={onClose} aria-label="Close artifact"><X size={9} /></button><span className="traffic yellow" /><span className="traffic green" /></div><span>{era.artifact.label}</span><button className="window-search" aria-label="Search"><Search size={13} /></button></div><div className="artifact-content"><span className="artifact-glyph">{era.artifact.glyph}</span><div><p className="eyebrow">{era.years}</p><h3>{era.artifact.title}</h3><p>{era.artifact.detail}</p></div></div><div className="window-footer"><span><Play size={10} fill="currentColor" /> now playing</span><span>drag window</span></div></motion.div>;
}

function EraSection({ index, onEnter }: { index: number; onEnter: (index: number) => void }) {
  const era = eras[index];
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [55, -55]);
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) onEnter(index); }, { threshold: 0.55 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, [index, onEnter]);
  return <section ref={ref} id={era.id} className="era-section"><motion.div className="era-copy" style={{ y: textY }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: reducedMotion ? 0.25 : 0.7 }}><p className="eyebrow"><span className="section-number">0{index + 1}</span>{era.kicker}</p><h2>{era.title}</h2><div className="narrative">{era.narrative.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><span className="scroll-note">Scroll to continue <span><ChevronDown className="scroll-chevron" size={16} strokeWidth={1.8} aria-hidden="true" /></span></span></motion.div><div className="era-coordinate">{era.years}<br /><span>Genesis archive</span></div></section>;
}

export default function GenesisExperience() {
  const currentEra = useStoryStore((state) => state.currentEra);
  const setCurrentEra = useStoryStore((state) => state.setCurrentEra);
  const activeWindow = useStoryStore((state) => state.activeWindow);
  const setActiveWindow = useStoryStore((state) => state.setActiveWindow);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const [showAbout, setShowAbout] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => { const unsubscribe = progress.on("change", (value) => document.documentElement.style.setProperty("--story-progress", String(value))); return unsubscribe; }, [progress]);
  const scrollToEra = (index: number) => document.getElementById(eras[index].id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  const handleEnter = (index: number) => { setCurrentEra(index); setActiveWindow(true); };
  const era = eras[currentEra];
  return <main className="genesis-shell" style={{ "--era-bg": era.palette.bg, "--era-accent": era.palette.accent, "--era-text": era.palette.text, "--era-soft": era.palette.soft } as React.CSSProperties}><motion.div className="wallpaper" animate={{ background: currentEra === 0 ? "linear-gradient(180deg, #e4d5bb 0%, #d9c7a9 100%)" : `radial-gradient(circle at ${currentEra === 4 ? "70% 20%" : "20% 30%"}, ${era.palette.soft} 0%, ${era.palette.bg} 50%, ${era.palette.bg} 100%)` }} transition={{ duration: 0.9 }} /><MenuBar /><div className="progress-track"><motion.div className="progress-line" style={{ scaleY: progress }} /></div><aside className="timeline"><span className="timeline-label">THE STORY / 1976—NOW</span>{eras.map((item, index) => <button key={item.id} className={index === currentEra ? "active" : ""} onClick={() => scrollToEra(index)} aria-label={`Go to ${item.title}`}><span>{item.years}</span><i /></button>)}</aside><div className="story-content">{eras.map((item, index) => <EraSection key={item.id} index={index} onEnter={handleEnter} />)}</div><AnimatePresence>{activeWindow && <ArtifactWindow key={era.id} index={currentEra} onClose={() => setActiveWindow(false)} />}</AnimatePresence><Dock scrollToEra={scrollToEra} /><button className="about-trigger" onClick={() => setShowAbout(true)}><CircleHelp size={15} /> about this story</button><AnimatePresence>{showAbout && <motion.div className="about-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><button onClick={() => setShowAbout(false)} aria-label="Close about panel"><X size={16} /></button><p className="eyebrow">GENESIS / AN ORIGINAL ARCHIVE</p><h3>A story told through the interface.</h3><p>Five moments in the evolution of personal technology, written as original prose and staged inside a changing desktop.</p></motion.div>}</AnimatePresence></main>;
}