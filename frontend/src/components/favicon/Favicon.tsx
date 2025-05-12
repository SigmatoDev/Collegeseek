'use client'; // Ensure the component runs only on the client

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Using usePathname for Next.js app directory
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall"; // Adjust as necessary for your API calls

function setFavicon(href: string) {
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  if (link) {
    link.href = href;
  } else {
    link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function Favicon() {
  const pathname = usePathname(); // Use usePathname to get the current route
  const [favicon, setFaviconState] = useState<string>("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        // Set the favicon from the fetched settings
        const faviconUrl = data.favicon ? `${img_url.replace(/\/$/, "")}${data.favicon}` : "/favicon.ico";
        setFaviconState(faviconUrl);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []); // Fetch settings on component mount

  useEffect(() => {
    if (favicon) {
      setFavicon(favicon); // Set the favicon dynamically
    }
  }, [favicon]); // Run when the favicon state changes

  useEffect(() => {
    // Optionally, set the favicon based on the route
    if (pathname.startsWith("/admin")) {
      setFavicon(favicon); // Favicon for admin route
    } else if (pathname.startsWith("/other")) {
      setFavicon(favicon); // Favicon for other route
    } else {
      setFavicon(favicon); // Default favicon
    }
  }, [pathname, favicon]); // Run when route or favicon changes

  return null; // This component does not render anything to the UI
}
