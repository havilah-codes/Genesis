"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BatteryMedium, Menu, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { eras } from "@/lib/eras";
import { useStoryStore } from "@/lib/store";

export default function MenuBar() {
  const [time, setTime] = useState("");
  const era = eras[useStoryStore((state) => state.currentEra)];

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.header
      className={`menu-bar ${era.id === "today" ? "menu-bar-dark" : ""} menu-bar-geometric`}
      style={{ "--menu-glass": era.palette.glass } as React.CSSProperties}
      animate={{ color: era.palette.text, backgroundColor: era.palette.glass }}
      transition={{ duration: 0.5 }}
    >
      <div className="menu-left">
        <Image className="menu-profile" src="/profile-pic.jpg" alt="Genesis logo" width={100} height={100} priority />
        <strong>Genesis</strong>
        <span className="menu-item">Story</span>
        <span className="menu-item">Archive</span>
        <span className="menu-item">View</span>
      </div>
      <div className="menu-right">
        <span className="menu-control"><Menu size={13} /></span>
        <span className="battery-status"><BatteryMedium size={14} /><span>100%</span></span>
        <Wifi size={14} />
        <span>{time}</span>
      </div>
    </motion.header>
  );
}
