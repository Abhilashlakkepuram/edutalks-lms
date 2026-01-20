import React from "react";

const Toast = ({ toast, onClose }) => {
  return (
    <div className={`toast toast-${toast.type}`} onClick={() => onClose(toast.id)}>
      <div className="toast-message">{toast.message}</div>
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
};

export default ToastContainer;
