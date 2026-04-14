'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

function updateFavicon(href: string) {
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = href;
}

export default function Favicon() {
  const pathname = usePathname();
  const [favicon, setFavicon] = useState<string>("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);

        // FIX: favicon is already full URL from DB
        const faviconUrl = data?.favicon || "/favicon.ico";

        setFavicon(faviconUrl);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setFavicon("/favicon.ico");
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!favicon) return;

    // same favicon for all routes (clean logic)
    updateFavicon(favicon);
  }, [favicon, pathname]);

  return null;
}