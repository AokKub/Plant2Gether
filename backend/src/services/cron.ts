import cron from "node-cron";
// @ts-ignore
import webpush from "web-push";
import { db } from "./prisma";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // 'HH:MM'

  // Fetch all reminders matching this time
  const plants = await db.plant.findMany({
    where: {
      time_reminder: {
        // Since Prisma doesn’t support time-only filter, fetch all and filter manually
      },
    },
    include: { user: { include: { subscriptions: true } } },
  });

  for (const plant of plants) {
    const reminderTime = plant.time_reminder.toTimeString().slice(0, 5);
    if (reminderTime === currentTime) {
      const user = plant.user;
      const message = `Reminder: Time to check your plant ${plant.plant_nickname}!`;

      for (const subscription of user.subscriptions) {
        await webpush
          .sendNotification(
            subscription,
            JSON.stringify({ title: "Plant Reminder", body: message }),
          )
          .catch((err: Error) => console.error("Push failed:", err));
      }
    }
  }
});
