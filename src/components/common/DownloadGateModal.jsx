import { useState } from "react";
import { X, Download, ShieldCheck, Zap, ArrowUpRight, ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { loadRazorpaySdk, createPassOrder, verifyPassPayment } from "../../services/downloadGateService";

export default function DownloadGateModal({
  isOpen,
  onClose,
  clerkUser,
  resourceType = "ats_report",
  resourceId = "default",
  resourceName = "ATS Analysis Report PDF",
  onSuccessDownload,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePayRupee = async () => {
    if (!clerkUser) return;
    setLoading(true);
    setError(null);

    try {
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        setError("Failed to load payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const orderData = await createPassOrder(clerkUser.id, resourceType, resourceId);
      if (!orderData.success || !orderData.orderId) {
        setError(orderData.message || "Failed to initialize ₹1 download pass order.");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "CareerSense ATS",
        description: `₹1 Download Pass - ${resourceName}`,
        order_id: orderData.orderId,
        prefill: {
          name: clerkUser.fullName || clerkUser.firstName || "",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#0891b2",
        },
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await verifyPassPayment({
              clerkId: clerkUser.id,
              resourceType,
              resourceId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setLoading(false);
              onSuccessDownload?.();
              onClose();
            } else {
              setError(verifyRes.message || "Payment verification failed.");
              setLoading(false);
            }
          } catch (vErr) {
            console.error("[Download Pass Verification Error]:", vErr);
            setError("Error verifying ₹1 download pass.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("[Download pass error]:", err);
      setError("Failed to initiate ₹1 download pass.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-xs">
          <Download className="h-7 w-7" />
        </div>

        <div className="mt-4 text-center">
          <span className="inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
            Nominal Download Fee
          </span>
          <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
            Unlock {resourceName}
          </h3>
          <p className="mt-2.5 text-xs font-medium leading-relaxed text-slate-600">
            We are charging a very minimal report download charge of <strong className="text-slate-900 font-bold">₹1</strong> to support our server infrastructure and processing costs. Once unlocked, you can access and re-download this report anytime.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          {!clerkUser ? (
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B3B59] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#124b6e] transition"
              >
                <span>Sign In to Pay ₹1</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </SignInButton>
          ) : (
            <button
              type="button"
              onClick={handlePayRupee}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B3B59] to-[#0A64F4] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition disabled:opacity-60"
            >
              <span>{loading ? "Opening Checkout..." : "Pay ₹1"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-3 text-center">
          <a
            href="https://careersenseai.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#0A64F4] transition"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Need unlimited free downloads? Upgrade to Student Plan</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
