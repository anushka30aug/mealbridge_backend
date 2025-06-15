let io = null;

function setDonorIO(ioInstance) {
  io = ioInstance;
}

function emitMealBooked({
  donorId,
  mealId,
  collectorId,
  collectorName,
  foodDesc,
  image,
}) {
  if (!io || !donorId) return;
  const message = `${collectorName} has booked your donation.`;
  io.to(donorId).emit("meal_booked", {
    mealId,
    collectorId,
    message,
    foodDesc,
    image,
  });
}

function emitMealExpiredToDonor({ donorId, mealId, foodDesc, image }) {
  if (!io || !donorId || !mealId) return;

  io.to(donorId).emit("meal_expired", {
    mealId,
    message: "Your listed meal has expired",
    foodDesc,
    image,
  });
}

function emitMealReceivedToDonor({
  donorId,
  collectorId,
  mealId,
  collectorName,
  foodDesc,
  image,
}) {
  if (!io || !donorId || !collectorId || !mealId) return;

  io.to(donorId).emit("meal_received", {
    mealId,
    collectorId,
    collectorName,
    foodDesc,
    image,
    message: `${collectorName} has successfully received your meal.`,
  });
}

function emitMealCancelledByCollector({
  donorId,
  mealId,
  collectorId,
  collectorName,
  foodDesc,
  image,
}) {
  if (!io || !donorId) return;

  io.to(donorId).emit("meal_reservation_cancelled_by_collector", {
    mealId,
    collectorId,
    collectorName,
    foodDesc,
    image,
    message: `${collectorName} has cancelled their reservation.`,
  });
}

module.exports = {
  setDonorIO,
  emitMealCancelledByCollector,
  emitMealBooked,
  emitMealExpiredToDonor,
  emitMealReceivedToDonor,
};
