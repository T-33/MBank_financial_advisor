"use client";

import React, { useState } from "react";

// Merchants that have a real logo file in /public/logos/
const LOGO_FILES: Record<string, string> = {
  "Severelectro":         "severelectro.png",
  "Bishkekteploset":      "teploset.jpg",
  "MEGA":                 "mega.png",
  "MegaCom":              "mega.png",
  "Оплата по QR Тулпар": "tulpar.png",
  "Yandex":               "yandex.png",
};

type Props = {
  name: string;
  size?: number;
  radius?: number;
};

export default function MerchantLogo({ name, size = 40, radius = 10 }: Props) {
  const file = LOGO_FILES[name];
  const initial = name.charAt(0).toUpperCase();
  const [imgFailed, setImgFailed] = useState(false);

  const showInitial = !file || imgFailed;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "#F0F0F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {!showInitial ? (
        <img
          src={`/logos/${file}`}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span style={{ color: "#666", fontWeight: 700, fontSize: Math.round(size * 0.35) }}>
          {initial}
        </span>
      )}
    </div>
  );
}
