let io = null;

function setDonorIO(ioInstance) {
  io = ioInstance;
}

function emitMealBooked({ donorId, mealId, collectorId }) {
  if (!io || !donorId) return;

  io.to(donorId).emit("mealBooked", {
    mealId,
    collectorId,
    message: "Your requested donation has been accepted",
  });
}

function emitMealExpired( { donorId, mealId  }) {
    if (!io || !donorId) return;
    
    io.to(donorId).emit("mealExpired", {
        mealId,
        message: "Your listed meal has expired"
    });

    console.log("Meal expired event emitted to donor:", donorId);
}

function emitMealReceived( { donorId, collectorId, mealId }) {
    if(!io || !donorId || !collectorId || !mealId) return;

    if (donorId)
        io.to(donorId).emit("mealReceived", {
            mealId,
            message: "Collector has successfully received the meal"
        });

    
}

function emitBookingCancelledByCollector( { donorId, mealId, collectorId }) {
  if (!io || !donorId) return;

  io.to(donorId).emit("bookingCancelledByCollector", {
    mealId,
    collectorId,
    message: "Collector has cancelled their booking",
  });
}

module.exports={
    setDonorIO,
    emitBookingCancelledByCollector,
    emitMealBooked,
    emitMealExpired,
    emitMealReceived
}





