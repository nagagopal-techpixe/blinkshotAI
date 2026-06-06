import { useState } from "react";

export default function SettingsTab() {
  const [title, setTitle]    = useState("Sarah James Wedding Teaser");
  const [desc, setDesc]      = useState("Cinematic teaser for Sarah & James' wedding day.");
  const [tags, setTags]      = useState("wedding, cinematic, vertical");
  const [aspect, setAspect]  = useState("9:16 vertical");
  const [resolution, setRes] = useState("4K · 60fps");

  const inputStyle = {
    background: "#060B28",
    border: "1px solid #222",
    color: "#fff",
  };

  return (
    <div className="rounded-2xl p-4 lg:p-6" style={{ background: "#060B28", border: "1px solid #222" }}>
      <h2 className="text-white text-lg lg:text-xl font-bold mb-1">Project settings</h2>
      <div className="h-px mb-5 lg:mb-6" style={{ background: "#1e1e2e" }} />

      <div className="mb-4 lg:mb-5">
        <label className="text-white text-sm font-medium block mb-2">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={inputStyle} />
      </div>

      <div className="mb-4 lg:mb-5">
        <label className="text-white text-sm font-medium block mb-2">Description</label>
        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={inputStyle} />
      </div>

      <div className="mb-4 lg:mb-5">
        <label className="text-white text-sm font-medium block mb-2">Tags</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={inputStyle} />
      </div>

      {/* Aspect + Resolution — always 2 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 lg:mb-8">
        <div>
          <label className="text-white text-sm font-medium block mb-2">Aspect</label>
          <input type="text" value={aspect} onChange={(e) => setAspect(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={inputStyle} />
        </div>
        <div>
          <label className="text-white text-sm font-medium block mb-2">Resolution</label>
          <input type="text" value={resolution} onChange={(e) => setRes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={inputStyle} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>
          Delete Project
        </button>
        <button className="px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(90deg, #8D45FE, #FD4FDA)" }}>
          Export
        </button>
      </div>
    </div>
  );
}