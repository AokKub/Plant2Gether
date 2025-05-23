// cron.ts
import cron from "node-cron";
import * as webpush from "web-push";
import { db } from "./prisma";

export function startCronJobs() {
  // Ensure your environment variables are loaded
  const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
  const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
  const CONTACT_EMAIL = "mailto:your-email@example.com";

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("Missing VAPID keys in environment variables.");
  }

  // Set up VAPID keys
  webpush.setVapidDetails(CONTACT_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  // Cron job to run every minute
  cron.schedule("* * * * * *", async () => {
    const currentTime = new Date().toTimeString().slice(0, 5); // "HH:MM"

    const plants = await db.plant.findMany({
      include: {
        user: {
          include: { subscriptions: true },
        },
      },
    });
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    for (const plant of plants) {
      const lastNotified = plant.last_notified_at;
      const lastNotifiedDay = lastNotified?.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const date = plant.time_reminder;
      const hours = String(date?.getUTCHours()).padStart(2, "0");
      const minutes = String(date?.getUTCMinutes()).padStart(2, "0");
      const reminderTime = `${hours}:${minutes}`;
      if (reminderTime === currentTime && lastNotifiedDay != today) {
        console.log(`Time to check your plant ${plant.plant_nickname}!`);

        for (const sub of plant.user.subscriptions) {
          if (!sub.keys || typeof sub.keys !== "object") {
            console.error("Invalid subscription keys:", sub.keys);
            continue;
          }

          const keys = sub.keys as { p256dh: string; auth: string };
          if (!keys.p256dh || !keys.auth) {
            console.error("Missing p256dh or auth in subscription keys:", keys);
            continue;
          }

          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: {
                  p256dh: keys.p256dh,
                  auth: keys.auth,
                },
              },
              JSON.stringify({
                title: "Plant Reminder",
                body: `Time to check your plant ${plant.plant_nickname}!`,
                url: "/plants",
              }),
            );

            await db.plant.update({
              where: { id: plant.id },
              data: { last_notified_at: now },
            });
          } catch (err) {
            console.error("Push failed:", err);
          }
        }
      }
    }
  });

  console.log("Cron jobs started.");
}
