import { useState } from "react";

const allNotifications = [
  {
    id: 1,
    title: "Bali Travel Story is ready",
    desc: "Your 60s cinematic reel finished rendering in 4K. Tap to preview.",
    time: "Just Now",
    unread: true,
    category: "Update",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    iconBg: "rgba(141,69,254,0.2)",
    iconColor: "#8D45FE",
  },
  {
    id: 2,
    title: "Sarah approved the wedding teaser",
    desc: "Sarah signed off on v3 — ready to deliver final files.",
    time: "2hr ago",
    unread: true,
    category: "Client",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    iconBg: "rgba(74,222,128,0.15)",
    iconColor: "#4ADE80",
  },
  {
    id: 3,
    title: "12 new caption variant",
    desc: "AI generated 12 caption options for Aurora skincare reel.",
    time: "Yesterday",
    unread: false,
    category: "Update",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    iconBg: "rgba(141,69,254,0.15)",
    iconColor: "#8D45FE",
  },
  {
    id: 4,
    title: "Mira left 3 comments",
    desc: "On Bali Travel Story timeline at 0:14, 0:28, 0:42.",
    time: "Yesterday",
    unread: false,
    category: "Client",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    iconBg: "rgba(253,79,218,0.15)",
    iconColor: "#FD4FDA",
  },
  {
    id: 5,
    title: "62% of cloud storage used",
    desc: "Consider archiving completed projects or upgrading.",
    time: "Yesterday",
    unread: false,
    category: "Update",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    iconBg: "rgba(251,191,36,0.15)",
    iconColor: "#fbbf24",
  },
];

const tabs = ["All", "Unread", "Client", "Update"];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return n.unread;
    return n.category === activeTab;
  });

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        unread: false,
      }))
    );
  };

  return (
    <div
      className="min-h-screen p-3 sm:p-4 lg:p-6"
   
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-1">
            Notifications
          </h1>

          <p className="text-sm" style={{ color: "#9191A8" }}>
            Live updates from your studio, clients, and AI.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-sm font-semibold self-start"
          style={{
            color: "#8D45FE",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Mark all read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap"
            style={{
              background:
                activeTab === tab
                  ? "linear-gradient(90deg,#8D45FE,#FD4FDA)"
                  : "#060B28",
              color: activeTab === tab ? "#fff" : "#9191A8",
              border: activeTab === tab ? "none" : "1px solid #222",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#060B28",
          border: "1px solid #222",
        }}
      >
        {filtered.map((n, i) => (
          <div
            key={n.id}
            onClick={() =>
              setNotifications((prev) =>
                prev.map((x) =>
                  x.id === n.id
                    ? { ...x, unread: false }
                    : x
                )
              )
            }
            className="relative px-4 sm:px-6 py-4 sm:py-5 cursor-pointer hover:bg-white/5 transition-all"
            style={{
              borderBottom:
                i < filtered.length - 1
                  ? "1px solid #1a1a2e"
                  : "none",
            }}
          >
            {n.unread && (
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                style={{
                  background:
                    "linear-gradient(180deg,#8D45FE,#FD4FDA)",
                }}
              />
            )}

            <div className="flex gap-3 sm:gap-4">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: n.iconBg,
                  color: n.iconColor,
                }}
              >
                {n.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: n.unread ? "#fff" : "#9191A8",
                    }}
                  >
                    {n.title}
                  </p>

                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: "#9191A8" }}
                  >
                    {n.time}
                  </span>
                </div>

                <p
                  className="text-xs sm:text-sm mt-1 leading-relaxed"
                  style={{ color: "#9191A8" }}
                >
                  {n.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}