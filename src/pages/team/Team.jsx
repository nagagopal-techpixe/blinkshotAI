import { useState } from "react";

const members = [
  { initials: "AK", color: "linear-gradient(135deg,#8D45FE,#FD4FDA)", name: "Ava Rodriguez", email: "ava@blinkshort.ai", role: "Owner", status: "ACTIVE" },
  { initials: "MT", color: "linear-gradient(135deg,#059669,#34d399)", name: "Mira Chen", email: "mira@blinkshort.ai", role: "Editor", status: "ACTIVE" },
  { initials: "ND", color: "linear-gradient(135deg,#2563EB,#60a5fa)", name: "Jamal Khan", email: "jamal@blinkshort.ai", role: "Editor", status: "ACTIVE" },
  { initials: "BB", color: "linear-gradient(135deg,#D97706,#fbbf24)", name: "Lina Park", email: "lina@blinkshort.ai", role: "Reviewer", status: "INVITED" },
  { initials: "RJ", color: "linear-gradient(135deg,#DC2626,#f87171)", name: "Kenji Sato", email: "kenji@blinkshort.ai", role: "Client", status: "ACTIVE" },
];

const workspaces = [
  { label: "Studio Main", members: 8, color: "linear-gradient(135deg,#8D45FE,#FD4FDA)" },
  { label: "Wedding Co.", members: 4, color: "linear-gradient(135deg,#22d3ee,#2563EB)" },
  { label: "Brand Lab", members: 12, color: "linear-gradient(135deg,#f59e0b,#D97706)" },
];

const statusStyle = {
  ACTIVE: {
    bg: "rgba(74,222,128,0.15)",
    text: "#4ADE80",
  },
  INVITED: {
    bg: "rgba(251,191,36,0.15)",
    text: "#fbbf24",
  },
};

export default function Team() {
  const [memberList] = useState(members);

  return (
    <div
      className="min-h-screen p-3 sm:p-4 lg:p-6"
     
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-white text-3xl font-extrabold mb-1">
            Team
          </h1>
          <p
            className="text-sm"
            style={{ color: "#9191A8" }}
          >
            Invite collaborators and manage access for clients.
          </p>
        </div>

        <button
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
          style={{
            background:
              "linear-gradient(90deg,#8D45FE,#FD4FDA)",
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Invite Members
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Members", value: "5" },
          { label: "Pending invites", value: "1" },
          { label: "Plan seats", value: "10" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{
              background: "#060B28",
              border: "1px solid #222",
            }}
          >
            <p
              className="text-sm mb-2"
              style={{ color: "#9191A8" }}
            >
              {label}
            </p>

            <p className="text-white text-3xl font-extrabold">
              {value}
            </p>
          </div>
        ))}
      </div>

{/* Members */}
<div
  className="rounded-2xl p-4 sm:p-5 mb-6"
  style={{ background: "#060B28", border: "1px solid #222" }}
>
  <h2 className="text-white text-lg font-bold mb-4">Members</h2>

  <div className="space-y-4">
    {memberList.map(
      ({ initials, color, name, email, role, status }) => (
        <div
          key={name}
          className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{
            background: "#080e2a",
            border: "1px solid #1a1a2e",
          }}
        >
          {/* Avatar + User */}
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: color }}
            >
              {initials}
            </div>

            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                {name}
              </p>
              <p
                className="text-sm truncate"
                style={{ color: "#9191A8" }}
              >
                {email}
              </p>
            </div>
          </div>

          {/* Role + Status */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span
              className="text-sm"
              style={{ color: "#9191A8" }}
            >
              {role}
            </span>

            <span
              className="text-xs font-bold px-3 py-1 rounded-lg"
              style={{
                background: statusStyle[status].bg,
                color: statusStyle[status].text,
              }}
            >
              {status}
            </span>

            <button className="text-[#9191A8]">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      )
    )}
  </div>
</div>

      {/* Workspaces */}
{/* Workspaces */}
<div
  className="rounded-2xl p-4 sm:p-5"
  style={{
    background: "#060B28",
    border: "1px solid #222",
  }}
>
  <h2 className="text-white text-lg font-bold mb-4">
    Workspaces
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {workspaces.map(({ label, members, color }) => (
      <div
        key={label}
        className="rounded-2xl p-4 sm:p-5"
        style={{
          background: "#080e2a",
          border: "1px solid #1a1a2e",
        }}
      >
        {/* Mobile Layout */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0"
            style={{ background: color }}
          />

          <div className="flex-1 min-w-0">
            <p className="text-white text-base font-bold truncate">
              {label}
            </p>

            <p
              className="text-xs mt-1"
              style={{ color: "#9191A8" }}
            >
              {members} members
            </p>
          </div>

          <button
            className="flex items-center gap-1 text-sm font-semibold"
            style={{
              color: "#22d3ee",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Open

            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
} 