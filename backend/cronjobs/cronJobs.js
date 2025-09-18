import cron from "node-cron";

export function startCronJobs() {
  // Schedule: every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      const res = await fetch("https://s75-sreya-capstone-troop-1.onrender.com/");
      console.log("Pinged server, status:", res.status);
    } catch (err) {
      console.error("Ping failed:", err);
    }
  });
}