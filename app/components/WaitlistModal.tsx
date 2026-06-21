"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: "consumer" | "seller";
}

type FormStatus = "idle" | "loading" | "success" | "error";

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbRuls3Br1yJaBRHqBPz1goCSdc2L2OFr1uVhxLxg02fuWbpGSHqO8Zs9DLRptd1DZPw/exec";

export default function WaitlistModal({ isOpen, onClose, initialRole = "consumer" }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: initialRole,
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Update role when initialRole prop changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, role: initialRole }));
  }, [initialRole]);

  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required");
      return false;
    }
    if (!formData.role) {
      setErrorMessage("Please select a role");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setStatus("loading");

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        }),
      });

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", role: "consumer" });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred. Please try again."
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleClose = () => {
    if (status !== "loading") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal Container - Fixed, Centered Overlay */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
           }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass relative w-[95vw] max-w-[600px] max-h-[85vh] overflow-y-auto rounded-2xl sm:w-[90vw]"
              style={{
                width: "min(95vw, 600px)",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              {/* Close Button - Fixed at Top Right */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ivory/10 bg-gradient-to-b from-glass to-transparent px-4 py-4 sm:px-6 sm:py-5 backdrop-blur">
                <h2 className="display text-lg font-semibold text-ivory sm:text-xl md:text-2xl">
                  Join the Waitlist
                </h2>
                <button
                  onClick={handleClose}
                  disabled={status === "loading"}
                  className="ml-4 flex-shrink-0 text-muted transition-colors hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 md:p-8">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20"
                    >
                      <Check className="text-gold" size={32} />
                    </motion.div>
                    <div>
                      <p className="text-lg font-semibold text-ivory">
                        You&apos;re on the list!
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        Thank you for joining. We&apos;ll be in touch soon.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-ivory"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={status === "loading"}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-ivory placeholder-muted/50 transition-colors focus:border-gold focus:bg-ivory/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-ivory"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={status === "loading"}
                        placeholder="your@email.com"
                        className="w-full rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-ivory placeholder-muted/50 transition-colors focus:border-gold focus:bg-ivory/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium text-ivory"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={status === "loading"}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-ivory placeholder-muted/50 transition-colors focus:border-gold focus:bg-ivory/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Role Dropdown */}
                    <div>
                      <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-medium text-ivory"
                      >
                        What&apos;s your role?
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={status === "loading"}
                        className="w-full rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-ivory transition-colors focus:border-gold focus:bg-ivory/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="consumer" className="bg-night text-ivory">
                          Consumer
                        </option>
                        <option value="seller" className="bg-night text-ivory">
                          Seller
                        </option>
                      </select>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose"
                      >
                        {errorMessage}
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="button-primary mt-6 w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                        />
                      ) : (
                        "Join Waitlist"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
