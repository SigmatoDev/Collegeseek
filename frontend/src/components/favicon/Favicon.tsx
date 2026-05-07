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
    const getSettingsUrl = () => {
      const baseUrl = api_url?.trim();
      if (!baseUrl) return null;

      try {
        return new URL("settings", baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString();
      } catch {
        return null;
      }
    };

    const fetchSettings = async () => {
      const settingsUrl = getSettingsUrl();
      if (!settingsUrl) {
        setFavicon("/favicon.ico");
        return;
      }

      if (
        typeof window !== "undefined" &&
        window.location.protocol === "https:" &&
        settingsUrl.startsWith("http://")
      ) {
        console.warn("Skipping favicon settings request due to insecure API URL on an HTTPS page.");
        setFavicon("/favicon.ico");
        return;
      }

      try {
        const { data } = await axios.get(settingsUrl);

        const faviconUrl = data?.favicon || "/favicon.ico";
        setFavicon(faviconUrl);
      } catch (error) {
        console.warn("Using default favicon. Settings API is unreachable.", error);
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
