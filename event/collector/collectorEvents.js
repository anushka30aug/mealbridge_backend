let io = null;

function setCollectorIO(ioInstance) {
  io = ioInstance;
}

function emitMealBookingCancelled({ collectorId, mealId }) {
    console.log(collectorId);
    if (!io || !collectorId) return;
    io.to(collectorId).emit("mealBookingCancelled", {
        mealId,
        message: "Donor has cancelled your meal booking ",
    });
}

function emitMealCancelled({ collectorId, mealId }) {
    if (!io || !collectorId) return;

    io.to(collectorId).emit("mealCancelled", {
        mealId,
        message: "Donor has cancelled the meal listing.",
    });
}

function emitMealExpired({ donorId, mealId ,collectorId }) {
    if (!io || !donorId || !collectorId) return;
    
    io.to(collectorId).emit("mealExpired", {
        mealId,
        donorId,
        message: "Your booked meal has expired"
    });

    console.log("Meal expired event emitted to collector:", collectorId);
}

function emitMealReceived({ donorId, collectorId, mealId }) {
    if(!io || !donorId || !collectorId || !mealId) return;

    if (collectorId)
        io.to(collectorId).emit("mealReceived", {
            mealId,
            message: "You have successfully collected the meal"
        });
}

module.exports={
    setCollectorIO,
    emitMealBookingCancelled,
    emitMealCancelled,
    emitMealExpired,
    emitMealReceived
}




