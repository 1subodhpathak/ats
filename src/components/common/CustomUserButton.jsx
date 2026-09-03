import React, { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, CircleUserRound, CreditCard, LogOut } from "lucide-react";

export default function CustomUserButton() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const displayName = user?.fullName || user?.firstName || "CareerSense member";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || "";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut({ redirectUrl: "/" });
  };

  const handleManageProfile = () => {
    setMenuOpen(false);
    navigate("/dashboard?section=profile");
  };

  const handleUsageBilling = () => {
    setMenuOpen(false);
    navigate("/dashboard?section=billing");
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="group flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white p-1 pr-2.5 text-slate-600 shadow-xs transition hover:border-teal-300 hover:text-teal-700 focus:outline-hidden"
        aria-label="Open account menu"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#2C4A4E] text-xs font-bold text-white shadow-xs">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2.5 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/15 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2C4A4E] text-sm font-bold text-white shadow-xs">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
              <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{displayEmail}</p>
            </div>
          </div>

          {/* Action Menu */}
          <div className="p-2 space-y-0.5">
            <button
              type="button"
              role="menuitem"
              onClick={handleManageProfile}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
            >
              <CircleUserRound className="h-4 w-4 text-teal-600" />
              <span>Manage profile</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleUsageBilling}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-800"
            >
              <CreditCard className="h-4 w-4 text-amber-600" />
              <span>Usage & Billing</span>
            </button>

            <div className="my-1.5 h-px bg-slate-100" />

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
