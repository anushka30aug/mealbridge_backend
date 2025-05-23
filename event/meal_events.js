// event/meal_events.js

let ioInstance = null;

const setupMealEvents = (io) => {
  ioInstance = io; // Store the io instance for later use
};

const emitMealCancelled = ({ collectorId, mealId }) => {
  if (!ioInstance || !collectorId) return;

  ioInstance.to(collectorId).emit("meal_cancelled", {
    mealId: mealId,
    message: "Donor has cancelled the meal.",
  });

  console.log(
    `Notified collector ${collectorId} about meal ${mealId} cancellation.`
  );
};

const emitMealCancelledToCollector = ({
  collectorId,
  mealId,
  foodDesc,
  donorId,
}) => {
  if (!ioInstance || !collectorId) return;

  ioInstance.to(collectorId).emit("meal_reservation_cancelled_by_donor", {
    mealId,
    foodDesc,
    donorId,
    message: `The donor has cancelled your reserved meal: "${foodDesc}".`,
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
