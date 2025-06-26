let io = null;

function setCollectorIO(ioInstance) {
  io = ioInstance;
}

const emitMealReservationCancelledByDonor = ({
  collectorId,
  donorId,
  mealId,
  foodDesc,
  image,
}) => {
  if (!io || !collectorId || !donorId) return;

  io.to(collectorId).emit("meal_reservation_cancelled_by_donor", {
    mealId,
    foodDesc,
    donorId,
    image,
    message: `The donor has cancelled your meal reservation of ${foodDesc}`,
  });
};

function emitMealCancelled({ collectorId, mealId, foodDesc, donorId, image }) {
  if (!io || !collectorId) return;

  io.to(collectorId).emit("meal_cancelled", {
    mealId,
    donorId,
    image,
    foodDesc,
    message: `Donor has cancelled Donation of ${foodDesc}`,
  });
}

function emitMealExpiredToCollector({
  donorId,
  mealId,
  collectorId,
  foodDesc,
  image,
}) {
  if (!io || !donorId || !collectorId) return;

  io.to(collectorId).emit("meal_expired", {
    mealId,
    donorId,
    image,
    foodDesc,
    message: `Your booked ${foodDesc} has expired`,
  });

  console.log("Meal expired event emitted to collector:", collectorId);
}

function emitMealReceivedToCollector({
  donorId,
  collectorId,
  mealId,
  donorName,
  foodDesc,
  image,
}) {
  if (!io || !collectorId || !donorId) return;

  io.to(collectorId).emit("meal_received", {
    donorId,
    collectorId,
    mealId,
    donorName,
    foodDesc,
    image,
    message: `You have received the meal: ${foodDesc}`,
  });

  console.log("Meal received event emitted to collector:", collectorId);
}

module.exports = {
  setCollectorIO,
  emitMealReservationCancelledByDonor,
  emitMealCancelled,
  emitMealExpiredToCollector,
  emitMealReceivedToCollector,
};
