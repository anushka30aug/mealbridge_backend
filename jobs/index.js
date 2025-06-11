const cron = require("node-cron");
const checkMealExpiry = require("../cron/check_meal_expiry");

// Run at 12:00 PM every day
cron.schedule("32 18 * * *", () => {
  console.log("[CRON] Running daily meal expiry job at 12:00 PM...");
  checkMealExpiry();
});
