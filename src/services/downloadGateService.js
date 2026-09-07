const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "https://server.datasenseai.com";
  // Strip sub-paths like /careersense/ats to get base server domain
  try {
    const parsed = new URL(envUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "https://server.datasenseai.com";
  }
};

const API_BASE = getApiBase();

export const loadRazorpaySdk = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const checkDownloadPass = async (clerkId, resourceType = "ats_report", resourceId = "default") => {
  if (!clerkId) return { canDownload: false, error: "Not signed in" };

  try {
    const res = await fetch(`${API_BASE}/careersense/download/check-pass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkId, resourceType, resourceId }),
    });
    return await res.json();
  } catch (err) {
    console.error("[checkDownloadPass error]:", err);
    return { canDownload: false, error: err.message };
  }
};

export const createPassOrder = async (clerkId, resourceType = "ats_report", resourceId = "default") => {
  try {
    const res = await fetch(`${API_BASE}/careersense/download/create-pass-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkId, resourceType, resourceId }),
    });
    return await res.json();
  } catch (err) {
    console.error("[createPassOrder error]:", err);
    return { success: false, message: err.message };
  }
};

export const verifyPassPayment = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/careersense/download/verify-pass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error("[verifyPassPayment error]:", err);
    return { success: false, message: err.message };
  }
};
