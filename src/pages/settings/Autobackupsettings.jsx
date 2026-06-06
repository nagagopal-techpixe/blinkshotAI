import { useState } from "react";

function Dropdown({ value }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer hover:opacity-90"
      style={{ background: "#131830", border: "1px solid #2a2a40", minWidth: 160 }}>
      <span className="text-white text-sm flex-1">{value}</span>
      <svg width="14" height="14" fill="none" stroke="#9191A8" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <div onClick={onChange} className="relative cursor-pointer flex-shrink-0"
      style={{ width: 44, height: 24, borderRadius: 12, background: enabled ? "linear-gradient(90deg,#8D45FE,#FD4FDA)" : "#2a2a3e", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 4, left: enabled ? 22 : 4, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );
}

export default function AutoBackupSettings() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [e2e, setE2e] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      {/* Cloud backup */}
      <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222222" }}>
        <p className="text-white text-lg font-bold mb-1">Cloud backup</p>
        <p className="text-xs mb-5" style={{ color: "#9191A8" }}>Mirror projects to your chosen cloud destination.</p>
        <div className="flex flex-col gap-0">
          {[
            { label: "Enable auto backup",  sub: null, type: "toggle",   tkey: "auto"                   },
            { label: "Backup destination",  sub: null, type: "dropdown", value: "BlinkShort Cloud"       },
            { label: "Frequency",           sub: null, type: "dropdown", value: "Every change"           },
            { label: "Frequency",           sub: null, type: "dropdown", value: "Projects + Assets"      },
          ].map(({ label, sub, type, value, tkey }, i, arr) => (
            <div key={`${label}-${i}`} className="flex items-center justify-between py-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #222222" : "none" }}>
              <div>
                <p className="text-white text-sm font-semibold">{label}</p>
                {sub && <p className="text-xs mt-0.5" style={{ color: "#9191A8" }}>{sub}</p>}
              </div>
              {type === "toggle"   && <Toggle enabled={autoBackup} onChange={() => setAutoBackup(p => !p)} />}
              {type === "dropdown" && <Dropdown value={value} />}
            </div>
          ))}
        </div>
      </div>

      {/* Network & security */}
      <div className="rounded-2xl p-6" style={{ background: "#060B28", border: "1px solid #222222" }}>
        <p className="text-white text-lg font-bold mb-5">Network & security</p>
        <div className="flex flex-col gap-0">
          {[
            { label: "Wi-Fi only",            sub: "Pause backups on cellular networks.",  type: "toggle",   tkey: "wifi" },
            { label: "End-to-end encryption", sub: null,                                   type: "toggle",   tkey: "e2e"  },
            { label: "Retention",             sub: "Keep old versions for this long.",     type: "dropdown", value: "90 days" },
            { label: "Last backup",           sub: null,                                   type: "text",     value: "4 mins ago  1.2 gb" },
            { label: "Restore from backup",   sub: null,                                   type: "button",   value: "Browse Version" },
          ].map(({ label, sub, type, value, tkey }, i, arr) => (
            <div key={label} className="flex items-center justify-between py-4"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #222222" : "none" }}>
              <div>
                <p className="text-white text-sm font-semibold">{label}</p>
                {sub && <p className="text-xs mt-0.5" style={{ color: "#9191A8" }}>{sub}</p>}
              </div>
              {type === "toggle"   && <Toggle enabled={tkey === "wifi" ? wifiOnly : e2e} onChange={() => tkey === "wifi" ? setWifiOnly(p => !p) : setE2e(p => !p)} />}
              {type === "dropdown" && <Dropdown value={value} />}
              {type === "text"     && <span className="text-sm" style={{ color: "#9191A8" }}>{value}</span>}
              {type === "button"   && (
                <button className="px-4 py-2 rounded-xl text-white text-xs font-bold"
                  style={{ background: "#222222", border: "1px solid #2a2a3e", cursor: "pointer" }}>{value}</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#222222", color: "#9191A8", border: "1px solid #2a2a3e", cursor: "pointer" }}>Cancel</button>
        <button className="px-6 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{ background: "linear-gradient(90deg,#8D45FE,#FD4FDA)", border: "none", cursor: "pointer" }}>Save Changes</button>
      </div>
    </div>
  );
}