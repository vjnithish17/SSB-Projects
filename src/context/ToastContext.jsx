import { createContext, useContext, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import "./../components/css/toast.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (
    message,
    type = "success",
    duration = 3000
  ) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
          >
            <div className="toast-icon">
              {toast.type === "success" && (
                <CheckCircle2 size={19} />
              )}

              {toast.type === "error" && (
                <XCircle size={19} />
              )}

              {toast.type === "warning" && (
                <AlertTriangle size={19} />
              )}

              {toast.type === "info" && (
                <Info size={19} />
              )}
            </div>

            <div className="toast-content">
              <strong>
                {toast.type === "success" && "Success"}
                {toast.type === "error" && "Error"}
                {toast.type === "warning" && "Warning"}
                {toast.type === "info" && "Info"}
              </strong>

              <p>{toast.message}</p>
            </div>

            <button
              type="button"
              className="toast-close"
              onClick={() =>
                removeToast(toast.id)
              }
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
};
