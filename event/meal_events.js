// event/meal_events.js

let ioInstance = null;

const setupMealEvents = (io) => {
  ioInstance = io; // Store the io instance for later use
};

const emitMealCancelled = ({ collectorId, mealId }) => {
  if (!ioInstance || !collectorId) return;

  ioInstance.to(collectorId).emit("meal_cancelled", {
    meal_id: mealId,
    message: "Donor has cancelled the meal.",
  });

  console.log(
    `Notified collector ${collectorId} about meal ${mealId} cancellation.`
  );
};

const emitMealCancelledToCollector = ({
  collectorId,
  mealId,
  food_desc,
  donorId,
}) => {
  if (!ioInstance || !collectorId) return;

  ioInstance.to(collectorId).emit("meal_reservation_cancelled_by_donor", {
    mealId,
    food_desc,
    donorId,
    message: `The donor has cancelled your reserved meal: "${food_desc}".`,
  });

  console.log(
    `Sent 'meal_reservation_cancelled_by_donor' to collector ${collectorId} for meal ${mealId}.`
  );
};

module.exports = {
  setupMealEvents,
  emitMealCancelled,
  emitMealCancelledToCollector,
};
