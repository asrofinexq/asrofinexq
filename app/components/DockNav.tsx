"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Dock from "@/app/components/Dock";
import Image from "next/image";
import { VscPerson, VscTools, VscCode, VscMail } from "react-icons/vsc";

const NexqLogoIcon = () => {
  return (
    <span className="asro-dock-icon" aria-hidden="true">
      <Image
        src="/logo.png"
        alt=""
        width={24}
        height={24}
        priority
        style={{ width: 24, height: 24, objectFit: "contain" }}
      />
    </span>
  );
};

export default function DockNav() {
  const router = useRouter();

  const items = [
    {
      icon: <NexqLogoIcon />,
      label: "Home",
      onClick: () => router.push("/"),
    },
    {
      icon: <VscPerson size={20} />,
      label: "About",
      onClick: () => router.push("/about"),
    },
    {
      icon: <VscTools size={20} />,
      label: "Services",
      onClick: () => router.push("/services"),
    },
    {
      icon: <VscCode size={20} />,
      label: "Projects",
      onClick: () => router.push("/projects"),
    },
    {
      icon: <VscMail size={20} />,
      label: "Contact",
      onClick: () => router.push("/contact"),
    },
  ];

  return (
    <div className="asro-docknav-wrap">
      <Dock
        items={items}
        panelHeight={70}
        baseItemSize={50}
        magnification={90}
        distance={220}
        dockHeight={256}
      />
    </div>
  );
}

