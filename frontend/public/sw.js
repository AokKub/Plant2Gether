self.addEventListener("push", function (event) {
  let data = {};

  try {
    data = event.data?.json();
  } catch (err) {
    console.error("Push event error:", err);
    data = { title: "Reminder", body: "Check your plants!" };
  }

  const title = data.title || "Reminder";
  const options = {
    body: data.body || "Don't forget to care for your plants!",
    icon: "/icons/icon-192x192.png", // Optional: Add your icon path
    badge: "/icons/badge-72x72.png", // Optional: Badge for smaller devices
    data: {
      url: data.url || "/", // Optional: Click action target
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
