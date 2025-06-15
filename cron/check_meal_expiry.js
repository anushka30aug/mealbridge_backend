const {
  emitMealExpiredToCollector,
} = require("../event/collector/collector_event");
const { emitMealExpiredToDonor } = require("../event/donor/donor_event");
const Meal = require("../models/meal");

const checkMealExpiry = async () => {
  try {
    const now = new Date();
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const expiringMeals = await Meal.find({
      expiryDate: { $lte: endOfToday },
      status: { $in: ["available", "reserved"] },
    });

    for (const meal of expiringMeals) {
      if (meal.collectorId) {
        emitMealExpiredToCollector({
          donorId: meal.donorId.toHexString(),
          mealId: meal._id.toString(),
          collectorId: meal.collectorId.toString(),
          foodDesc: meal.foodDesc,
          image: meal.image,
        });
      }

      emitMealExpiredToDonor({
        donorId: meal.donorId.toHexString(),
        mealId: meal._id.toString(),
        foodDesc: meal.foodDesc,
        image: meal.image,
      });

      meal.status = "expired";
      await meal.save();
      console.log(`[CRON] ${expiringMeals.length} meals expired and notified.`);
    }
  } catch (error) {
    console.error("[CRON] Error in checkMealExpiry:", error);
  }
};

module.exports = checkMealExpiry;
