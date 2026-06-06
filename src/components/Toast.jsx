import { useState, useEffect, useCallback } from "react";

/* ─── Toast Context & Hook ───── */
import { createContext, useContext } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

/* ─── Provider (wrap your App or Router) ─────── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = "info", message, duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, exiting: false }]);

    // Start exit animation before removal
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
    }, duration - 400);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 380);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/* ─── Icons  */
const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

/* ─── Container & Individual Toast ──── */
function ToastContainer({ toasts, onRemove }) {
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0);    max-height: 80px; margin-bottom: 10px; }
          to   { opacity: 0; transform: translateX(110%); max-height: 0;    margin-bottom: 0;   }
        }
        @keyframes progressShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }

        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }

        .toast {
          pointer-events: all;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 300px;
          max-width: 380px;
          padding: 14px 16px 16px;
          border-radius: 14px;
          background: rgba(18, 18, 28, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid #272737;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
          animation: toastIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .toast.exiting {
          animation: toastOut 0.38s ease-in forwards;
        }

        /* Left accent bar */
        .toast::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          border-radius: 14px 0 0 14px;
        }
        .toast.success::before { background: linear-gradient(180deg, #00E676, #00BFA5); }
        .toast.error::before   { background: linear-gradient(180deg, #FF4D6D, #FF1744); }
        .toast.info::before    { background: linear-gradient(180deg, #8D45FE, #FD4FDA); }

        /* Icon */
        .toast-icon {
          flex-shrink: 0;
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .toast.success .toast-icon { background: rgba(0, 230, 118, 0.12); color: #00E676; }
        .toast.error   .toast-icon { background: rgba(255, 77, 109, 0.12); color: #FF4D6D; }
        .toast.info    .toast-icon { background: rgba(141, 69, 254, 0.12); color: #C084FC; }

        /* Text */
        .toast-body { flex: 1; padding-top: 1px; }
        .toast-title {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.01em;
          margin: 0 0 2px;
        }
        .toast.success .toast-title { color: #00E676; }
        .toast.error   .toast-title { color: #FF4D6D; }
        .toast.info    .toast-title { color: #C084FC; }

        .toast-message {
          font-size: 13px;
          color: #B0B0C8;
          margin: 0;
          line-height: 1.45;
        }

        /* Close button */
        .toast-close {
          flex-shrink: 0;
          background: none; border: none;
          color: #555570; cursor: pointer;
          padding: 2px; line-height: 1;
          transition: color 0.2s;
          margin-top: 1px;
        }
        .toast-close:hover { color: #fff; }

        /* Progress bar */
        .toast-progress {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          border-radius: 0 0 14px 14px;
          animation: progressShrink var(--duration) linear forwards;
        }
        .toast.success .toast-progress { background: linear-gradient(90deg, #00BFA5, #00E676); }
        .toast.error   .toast-progress { background: linear-gradient(90deg, #FF1744, #FF4D6D); }
        .toast.info    .toast-progress { background: linear-gradient(90deg, #8D45FE, #FD4FDA); }

        @media (max-width: 480px) {
          .toast-container { top: 12px; right: 12px; left: 12px; }
          .toast { min-width: unset; max-width: 100%; }
        }
      `}</style>

      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}

const titles = { success: "Success", error: "Error", info: "Info" };

function ToastItem({ toast, onRemove }) {
  const { id, type, message, exiting, duration = 3500 } = toast;

  return (
    <div
      className={`toast ${type} ${exiting ? "exiting" : ""}`}
      style={{ "--duration": `${duration}ms` }}
    >
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-body">
        <p className="toast-title">{titles[type]}</p>
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close" onClick={() => onRemove(id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="toast-progress" />
    </div>
  );
}