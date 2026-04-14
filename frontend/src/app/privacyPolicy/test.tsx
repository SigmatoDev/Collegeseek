"use client";

import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import CallbackForm from "@/components/newsletters/page";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface PolicyType {
  _id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-3">
        <div
          className="h-5 rounded-lg w-1/3"
          style={{ background: "#e8ddd4" }}
        />
        <div className="h-3 rounded w-full" style={{ background: "#f0e8e0" }} />
        <div className="h-3 rounded w-5/6" style={{ background: "#f0e8e0" }} />
        <div className="h-3 rounded w-4/6" style={{ background: "#f0e8e0" }} />
      </div>
    ))}
  </div>
);

/* ── Brand tokens ── */
const CREAM = "#fdf1ea";
const PURPLE = "#322a75";
const PURPLE_PALE = "#ece9f8";
const BORDER = "#e8dcd4";

const PrivacyPolicy = () => {
  const [policies, setPolicies] = useState<PolicyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const fetchPrivacyPolicy = async () => {
    try {
      const { data } = await axios.get(`${api_url}privacy-policy`);
      setPolicies(data);
      if (data.length > 0) setActiveSection(data[0]._id);
    } catch {
      setError("Failed to load Privacy Policy. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [policies]);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setSidebarOpen(false);
  };

  const updatedDate = policies[0]?.updatedAt
    ? new Date(policies[0].updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <Header />

      <div
        style={{
          background: CREAM,
          minHeight: "100vh",
          fontFamily: "'Georgia', serif",
        }}
      >
        {/* ── Hero ── */}
        <div
          style={{
            background: PURPLE,
            position: "relative",
            overflow: "hidden",
          }}
          className="px-6 py-14 md:py-24 text-center"
        >
          {/* decorative rings */}
          {[
            { top: "-60px", left: "10%", size: "420px" },
            { bottom: "-80px", right: "8%", size: "300px" },
            { top: "30%", right: "22%", size: "160px" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                borderRadius: "50%",
                border: "1.5px solid rgba(253,241,234,0.12)",
                width: s.size,
                height: s.size,
                ...(s.top ? { top: s.top } : {}),
                ...(s.bottom ? { bottom: s.bottom } : {}),
                ...(s.left ? { left: s.left } : {}),
                ...(s.right ? { right: s.right } : {}),
              }}
            />
          ))}

          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            {/* pill badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "rgba(253,241,234,0.1)",
                border: "1px solid rgba(253,241,234,0.22)",
                borderRadius: "999px",
                padding: "6px 18px",
                fontSize: "11px",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "rgba(253,241,234,0.65)",
                marginBottom: "22px",
              }}
            >
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Legal Document
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 6vw, 4rem)",
                fontWeight: 800,
                color: CREAM,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: "12px",
              }}
            >
              Privacy Policy
            </h1>

            {updatedDate && (
              <p
                style={{
                  color: "rgba(253,241,234,0.45)",
                  fontSize: "13px",
                  marginTop: "10px",
                }}
              >
                Last updated: {updatedDate}
              </p>
            )}
          </div>
        </div>

        {/* wave divider */}
        <div style={{ background: PURPLE, lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 52"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", width: "100%" }}
          >
            <path
              d="M0,36 C360,4 1080,68 1440,36 L1440,52 L0,52 Z"
              fill={CREAM}
            />
          </svg>
        </div>

        {/* ── Mobile TOC bar ── */}
        {!loading && policies.length > 0 && (
          <div
            className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
            style={{
              background: CREAM,
              borderBottom: `1px solid ${BORDER}`,
              boxShadow: "0 1px 8px rgba(50,42,117,0.08)",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: PURPLE }}>
              Table of Contents
            </span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: PURPLE,
                background: "transparent",
                border: `1px solid ${BORDER}`,
                borderRadius: "8px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {sidebarOpen ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Sections
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Mobile Drawer ── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(50,42,117,0.32)",
              }}
              onClick={() => setSidebarOpen(false)}
            />
            <div
              style={{
                position: "relative",
                width: "288px",
                background: CREAM,
                height: "100%",
                overflowY: "auto",
                padding: "24px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                boxShadow: "6px 0 28px rgba(50,42,117,0.14)",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#a89ecc",
                  marginBottom: "12px",
                  paddingLeft: "8px",
                }}
              >
                Sections
              </p>
              {policies.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => scrollToSection(item._id)}
                  style={{
                    textAlign: "left",
                    fontSize: "13px",
                    padding: "9px 12px",
                    borderRadius: "9px",
                    border: "none",
                    background:
                      activeSection === item._id ? PURPLE : "transparent",
                    color: activeSection === item._id ? CREAM : "#4a3f6e",
                    fontWeight: activeSection === item._id ? 700 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: "monospace",
                      opacity: 0.45,
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main layout ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <div className="flex gap-10">
            {/* ── Desktop Sidebar ── */}
            {!loading && policies.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8">
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#a89ecc",
                      marginBottom: "12px",
                      paddingLeft: "12px",
                    }}
                  >
                    Table of Contents
                  </p>

                  <nav
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {policies.map((item, index) => {
                      const active = activeSection === item._id;
                      return (
                        <button
                          key={item._id}
                          onClick={() => scrollToSection(item._id)}
                          style={{
                            textAlign: "left",
                            fontSize: "13px",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: active ? PURPLE : "transparent",
                            color: active ? CREAM : "#4a3f6e",
                            fontWeight: active ? 700 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = PURPLE_PALE;
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = PURPLE;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "transparent";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "#4a3f6e";
                            }
                          }}
                        >
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "monospace",
                              flexShrink: 0,
                              opacity: active ? 0.5 : 0.3,
                              marginTop: "2px",
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span style={{ lineHeight: 1.4 }}>{item.title}</span>
                        </button>
                      );
                    })}
                  </nav>

                  {/* Quick info */}
                  <div
                    style={{
                      marginTop: "22px",
                      background: "#fff",
                      border: `1px solid ${BORDER}`,
                      borderRadius: "14px",
                      padding: "16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#a89ecc",
                        marginBottom: "10px",
                      }}
                    >
                      Quick Info
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "12px",
                          color: "#6b5fa0",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={PURPLE}
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {policies.length} sections
                      </div>
                      {updatedDate && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "12px",
                            color: "#6b5fa0",
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke={PURPLE}
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {updatedDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* ── Policy content ── */}
            <main style={{ flex: 1, minWidth: 0 }}>
              {/* Loading skeleton */}
              {loading && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    border: `1px solid ${BORDER}`,
                    padding: "40px",
                  }}
                >
                  <SkeletonLoader />
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#fff5f5",
                    border: "1px solid #fecaca",
                    borderRadius: "20px",
                    padding: "40px",
                    textAlign: "center",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#f87171"
                    strokeWidth={1.5}
                    style={{ margin: "0 auto 12px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  <p
                    style={{
                      color: "#b91c1c",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={fetchPrivacyPolicy}
                    style={{
                      fontSize: "13px",
                      color: "#b91c1c",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && policies.length === 0 && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    border: `1px solid ${BORDER}`,
                    padding: "60px",
                    textAlign: "center",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#c4b8e8"
                    strokeWidth={1.4}
                    style={{ margin: "0 auto 16px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p style={{ color: "#9b92c0" }}>
                    No privacy policy content found.
                  </p>
                </div>
              )}

              {/* Sections */}
              {!loading && !error && policies.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {policies.map((item, index) => (
                    <section
                      key={item._id}
                      id={item._id}
                      ref={(el) => {
                        sectionRefs.current[item._id] = el;
                      }}
                      style={{
                        background: "#fff",
                        border: `1px solid ${BORDER}`,
                        borderRadius: "20px",
                        overflow: "hidden",
                        transition: "box-shadow 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 6px 28px rgba(50,42,117,0.10)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "none";
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "18px 28px",
                          borderBottom: `1px solid ${BORDER}`,
                          background: CREAM,
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: PURPLE,
                            color: CREAM,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            fontFamily: "monospace",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <h2
                          style={{
                            fontSize: "clamp(1rem, 2.5vw, 1.18rem)",
                            fontWeight: 700,
                            color: PURPLE,
                            lineHeight: 1.3,
                            margin: 0,
                          }}
                        >
                          {item.title}
                        </h2>
                      </div>

                      {/* Body */}
                      <div
                        className="prose prose-sm max-w-none prose-p:my-3 prose-ul:pl-5 prose-li:my-1"
                        style={{
                          padding: "24px 28px",
                          fontSize: "15px",
                          lineHeight: 1.8,
                          color: "#4a4060",
                        }}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </section>
                  ))}

                  {/* CTA footer card */}
                  <div
                    style={{
                      background: PURPLE,
                      borderRadius: "20px",
                      padding: "28px 32px",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "15px",
                          color: CREAM,
                          margin: 0,
                        }}
                      >
                        Have questions about our policy?
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "rgba(253,241,234,0.52)",
                          margin: "4px 0 0",
                        }}
                      >
                        Reach out and we'll be happy to help.
                      </p>
                    </div>
                    <a
                      href="mailto:privacy@yourcompany.com"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: CREAM,
                        color: PURPLE,
                        fontSize: "13px",
                        fontWeight: 700,
                        borderRadius: "12px",
                        padding: "10px 22px",
                        textDecoration: "none",
                        flexShrink: 0,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.opacity =
                          "0.82";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.opacity =
                          "1";
                      }}
                    >
                      Contact Us
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        <CallbackForm />
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
