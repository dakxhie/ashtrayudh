/**
 * Utility Functions
 * Toast notifications, modals, and common UI helpers
 */

// ========== TOAST NOTIFICATIONS ==========

const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

export function showToast(message, type = TOAST_TYPES.INFO, duration = 4000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);

    // Add CSS styles for toasts
    const style = document.createElement("style");
    style.textContent = `
      .toast {
        padding: 14px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
        pointer-events: auto;
        white-space: nowrap;
        max-width: 350px;
      }

      .toast.success {
        background: rgba(34, 197, 94, 0.9);
        color: white;
        border: 1px solid rgba(34, 197, 94, 1);
      }

      .toast.error {
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: 1px solid rgba(239, 68, 68, 1);
      }

      .toast.info {
        background: rgba(59, 130, 246, 0.9);
        color: white;
        border: 1px solid rgba(59, 130, 246, 1);
      }

      .toast.warning {
        background: rgba(245, 158, 11, 0.9);
        color: white;
        border: 1px solid rgba(245, 158, 11, 1);
      }

      .toast-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .toast-close {
        margin-left: auto;
        cursor: pointer;
        font-size: 20px;
        opacity: 0.7;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }

      .toast-close:hover {
        opacity: 1;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      .toast.removing {
        animation: slideOutRight 0.3s ease-out forwards;
      }

      @media (max-width: 640px) {
        #toastContainer {
          left: 10px !important;
          right: 10px !important;
        }

        .toast {
          max-width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconMap = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || "•"}</span>
    <span>${message}</span>
    <span class="toast-close">×</span>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  });

  toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add("removing");
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }
}

export function showSuccess(message, duration = 4000) {
  showToast(message, TOAST_TYPES.SUCCESS, duration);
}

export function showError(message, duration = 4000) {
  showToast(message, TOAST_TYPES.ERROR, duration);
}

export function showInfo(message, duration = 4000) {
  showToast(message, TOAST_TYPES.INFO, duration);
}

// ========== MODAL/CONFIRMATION DIALOG ==========

export function showConfirmModal(title, message, onConfirm, onCancel = null) {
  // Create modal overlay
  let modalOverlay = document.getElementById("modalOverlay");
  if (modalOverlay) {
    modalOverlay.remove();
  }

  modalOverlay = document.createElement("div");
  modalOverlay.id = "modalOverlay";
  modalOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    animation: fadeIn 0.2s ease-out;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: #1a1a2e;
    border-radius: 16px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  modal.innerHTML = `
    <h2 style="color: #fff; font-size: 20px; margin-bottom: 12px; font-family: 'Playfair Display', serif;">
      ${title}
    </h2>
    <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin-bottom: 28px; line-height: 1.5;">
      ${message}
    </p>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="cancelBtn" style="
        padding: 10px 20px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      " onmouseover="this.style.background = 'rgba(255, 255, 255, 0.1)'" onmouseout="this.style.background = 'rgba(255, 255, 255, 0.05)'">
        Cancel
      </button>
      <button id="confirmBtn" style="
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, #ff3d6e, #8b1dff);
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      " onmouseover="this.style.opacity = '0.9'" onmouseout="this.style.opacity = '1'">
        Confirm
      </button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Add styles if not already present
  if (!document.querySelector('style[data-modal-styles]')) {
    const style = document.createElement("style");
    style.setAttribute("data-modal-styles", "true");
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scaleIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const closeModal = () => {
    modalOverlay.style.animation = "fadeIn 0.2s ease-out reverse";
    setTimeout(() => modalOverlay.remove(), 200);
  };

  const confirmBtn = modal.querySelector("#confirmBtn");
  const cancelBtn = modal.querySelector("#cancelBtn");

  confirmBtn.addEventListener("click", async () => {
    closeModal();
    if (typeof onConfirm === "function") {
      await onConfirm();
    }
  });

  cancelBtn.addEventListener("click", () => {
    closeModal();
    if (typeof onCancel === "function") {
      onCancel();
    }
  });

  // Close on overlay click
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  };
  document.addEventListener("keydown", handleEscape);

  return modalOverlay;
}

// ========== INPUT MODAL ==========

export function showInputModal(title, label, placeholder = "", initialValue = "", onSubmit, onCancel = null) {
  let modalOverlay = document.getElementById("modalOverlay");
  if (modalOverlay) {
    modalOverlay.remove();
  }

  modalOverlay = document.createElement("div");
  modalOverlay.id = "modalOverlay";
  modalOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    animation: fadeIn 0.2s ease-out;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: #1a1a2e;
    border-radius: 16px;
    padding: 30px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  modal.innerHTML = `
    <h2 style="color: #fff; font-size: 20px; margin-bottom: 18px; font-family: 'Playfair Display', serif;">
      ${title}
    </h2>
    <label style="display: block; color: rgba(255, 255, 255, 0.8); font-size: 13px; margin-bottom: 8px; font-weight: 500;">
      ${label}
    </label>
    <input 
      id="inputField" 
      type="text" 
      placeholder="${placeholder}" 
      value="${initialValue}"
      style="
        width: 100%;
        padding: 12px 14px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
        color: white;
        font-size: 14px;
        margin-bottom: 20px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s;
      "
    />
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="cancelBtn" style="
        padding: 10px 20px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      " onmouseover="this.style.background = 'rgba(255, 255, 255, 0.1)'" onmouseout="this.style.background = 'rgba(255, 255, 255, 0.05)'">
        Cancel
      </button>
      <button id="submitBtn" style="
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, #ff3d6e, #8b1dff);
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      " onmouseover="this.style.opacity = '0.9'" onmouseout="this.style.opacity = '1'">
        Submit
      </button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  const closeModal = () => {
    modalOverlay.style.animation = "fadeIn 0.2s ease-out reverse";
    setTimeout(() => modalOverlay.remove(), 200);
  };

  const inputField = modal.querySelector("#inputField");
  const submitBtn = modal.querySelector("#submitBtn");
  const cancelBtn = modal.querySelector("#cancelBtn");

  inputField.focus();
  inputField.select();

  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      submitBtn.click();
    }
  });

  submitBtn.addEventListener("click", async () => {
    const value = inputField.value.trim();
    if (!value) {
      showError("Please enter a value");
      return;
    }
    closeModal();
    if (typeof onSubmit === "function") {
      await onSubmit(value);
    }
  });

  cancelBtn.addEventListener("click", () => {
    closeModal();
    if (typeof onCancel === "function") {
      onCancel();
    }
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  });

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  };
  document.addEventListener("keydown", handleEscape);

  return modalOverlay;
}

// ========== TEXTAREA MODAL ==========

export function showTextAreaModal(title, label, placeholder = "", initialValue = "", onSubmit, onCancel = null) {
  let modalOverlay = document.getElementById("modalOverlay");
  if (modalOverlay) {
    modalOverlay.remove();
  }

  modalOverlay = document.createElement("div");
  modalOverlay.id = "modalOverlay";
  modalOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    animation: fadeIn 0.2s ease-out;
    padding: 20px;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: #1a1a2e;
    border-radius: 16px;
    padding: 30px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  modal.innerHTML = `
    <h2 style="color: #fff; font-size: 20px; margin-bottom: 18px; font-family: 'Playfair Display', serif;">
      ${title}
    </h2>
    <label style="display: block; color: rgba(255, 255, 255, 0.8); font-size: 13px; margin-bottom: 8px; font-weight: 500;">
      ${label}
    </label>
    <textarea 
      id="textAreaField"
      placeholder="${placeholder}"
      style="
        width: 100%;
        padding: 12px 14px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
        color: white;
        font-size: 14px;
        margin-bottom: 20px;
        box-sizing: border-box;
        outline: none;
        min-height: 200px;
        font-family: inherit;
        resize: vertical;
        transition: border-color 0.2s;
      "
    >${initialValue}</textarea>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="cancelBtn" style="
        padding: 10px 20px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      " onmouseover="this.style.background = 'rgba(255, 255, 255, 0.1)'" onmouseout="this.style.background = 'rgba(255, 255, 255, 0.05)'">
        Cancel
      </button>
      <button id="submitBtn" style="
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(135deg, #ff3d6e, #8b1dff);
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      " onmouseover="this.style.opacity = '0.9'" onmouseout="this.style.opacity = '1'">
        Submit
      </button>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  const closeModal = () => {
    modalOverlay.style.animation = "fadeIn 0.2s ease-out reverse";
    setTimeout(() => modalOverlay.remove(), 200);
  };

  const textAreaField = modal.querySelector("#textAreaField");
  const submitBtn = modal.querySelector("#submitBtn");
  const cancelBtn = modal.querySelector("#cancelBtn");

  textAreaField.focus();
  textAreaField.select();

  submitBtn.addEventListener("click", async () => {
    const value = textAreaField.value.trim();
    if (!value) {
      showError("Please enter some content");
      return;
    }
    closeModal();
    if (typeof onSubmit === "function") {
      await onSubmit(value);
    }
  });

  cancelBtn.addEventListener("click", () => {
    closeModal();
    if (typeof onCancel === "function") {
      onCancel();
    }
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  });

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  };
  document.addEventListener("keydown", handleEscape);

  return modalOverlay;
}
