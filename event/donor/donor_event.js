let io = null;

function setDonorIO(ioInstance) {
  io = ioInstance;
}

function emitMealBooked({ donorId, mealId, collectorId }) {
  if (!io || !donorId) return;

  io.to(donorId).emit("meal_booked", {
    mealId,
    collectorId,
    message: "Your requested donation has been accepted",
  });
}

function emitMealExpiredToDonor({ donorId, mealId }) {
  if (!io || !donorId) return;

  io.to(donorId).emit("meal_expired", {
    mealId,
    message: "Your listed meal has expired",
  });

  console.log("Meal expired event emitted to donor:", donorId);
}

function emitMealReceivedToDonor({ donorId, collectorId, mealId }) {
  if (!io || !donorId || !collectorId || !mealId) return;

  if (donorId)
    io.to(donorId).emit("meal_received", {
      mealId,
      message: "Collector has successfully received the meal",
    });
}

function emitMealCancelledByCollector({ donorId, mealId, collectorId }) {
  if (!io || !donorId) return;

  io.to(donorId).emit("meal_reservation_cancelled_by_collector", {
    mealId,
    collectorId,
    message: "Collector has cancelled their booking",
  });
}

module.exports = {
  setDonorIO,
  emitMealCancelledByCollector,
  emitMealBooked,
  emitMealExpiredToDonor,
  emitMealReceivedToDonor,
};
