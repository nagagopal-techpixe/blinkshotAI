import { useState } from "react";

const comments = [
  { initials: "MT", color: "linear-gradient(135deg,#8D45FE,#FD4FDA)", name: "Aria — Client",  time: "at 00:08 · 12 min ago", text: "Love the opening shot! Can we hold this 0.5s longer?" },
  { initials: "MT", color: "linear-gradient(135deg,#059669,#34d399)", name: "Marcus Lee",      time: "at 00:15 · 8 min ago",  text: "Adjusted pacing. New render queued." },
  { initials: "MT", color: "linear-gradient(135deg,#8D45FE,#FD4FDA)", name: "Aria — Client",  time: "at 00:22 · 4 min ago",  text: "Caption font feels heavy here — try something lighter?" },
];

export default function CommentsTab() {
  const [comment, setComment] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden" style={{ background: "#060B28", border: "1px solid #222" }}>
        {comments.map(({ initials, color, name, time, text }, i) => (
          <div key={i} className="flex items-start gap-3 px-4 lg:px-5 py-4"
            style={{ borderBottom: i < comments.length - 1 ? "1px solid #1a1a2e" : "none" }}>
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: color }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">{name}</p>
              <p className="text-xs mb-1" style={{ color: "#9191A8" }}>{time}</p>
              <p className="text-white text-sm">{text}</p>
            </div>
            <button className="text-xs font-semibold px-2.5 lg:px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ background: "#1a1a2e", color: "#9191A8", border: "1px solid #222" }}>
              Replay
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: "#060B28", border: "1px solid #222" }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          rows={4}
          className="w-full text-white text-sm placeholder-[#9191A8] outline-none resize-none"
          style={{ background: "transparent", border: "none" }}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}>
          Post
        </button>
      </div>
    </div>
  );
}