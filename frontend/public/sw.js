self.addEventListener("push", function(event) {
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
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
