// Your public VAPID key
const VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;

async function subscribeToPush(userId) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const reg = await navigator.serviceWorker.register("/sw.js");

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log("Push Subscription:", JSON.stringify(sub));

    // Send subscription to your backend
    await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription: sub, userId }),
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper: converts VAPID key format
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export { subscribeToPush };
