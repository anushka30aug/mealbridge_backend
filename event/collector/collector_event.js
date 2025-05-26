let io = null;

function setCollectorIO(ioInstance) {
  io = ioInstance;
}

const emitMealCancelledToCollector = ({
  collectorId,
  mealId,
  foodDesc,
  donorId,
}) => {
  if (!io || !collectorId) return;

  io.to(collectorId).emit("meal_reservation_cancelled_by_donor", {
    mealId,
    foodDesc,
    donorId,
    message: `The donor has cancelled your meal reservation: ${foodDesc}`,
  });
};

function emitMealCancelled({ collectorId, mealId }) {
  if (!io || !collectorId) return;

  io.to(collectorId).emit("meal_cancelled", {
    mealId,
    message: "Donor has cancelled the meal listing.",
  });
}

function emitMealExpired({ donorId, mealId, collectorId }) {
  if (!io || !donorId || !collectorId) return;

  io.to(collectorId).emit("meal_expired", {
    mealId,
    donorId,
    message: "Your booked meal has expired",
  });

  console.log("Meal expired event emitted to collector:", collectorId);
}

function emitMealReceivedToCollector({ donorId, collectorId, mealId }) {
  if (!io || !donorId || !collectorId || !mealId) return;

  if (collectorId)
    io.to(collectorId).emit("meal_received", {
      mealId,
      message: "You have successfully collected the meal",
    });
}

module.exports = {
  setCollectorIO,
  emitMealCancelledToCollector,
  emitMealCancelled,
  emitMealExpired,
  emitMealReceivedToCollector,
};
