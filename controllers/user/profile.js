const asyncHandler = require("express-async-handler");
const Donor = require("../../models/donor");
const Receiver = require("../../models/receiver");

exports.fetchProfile = asyncHandler(async (req, res) => {
    try {
        const userType = req.header("User-Type"); 
        if (!userType || !["donor", "receiver"].includes(userType.toLowerCase())) {
            return res.status(400).json({ error: true, message: "Invalid or missing User-Type header" });
        }

        const Model = userType.toLowerCase() === "donor" ? Donor : Receiver;
        const user = await Model.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

exports.editProfile=asyncHandler(async(req , res)=>{
    try{
        const userType = req.header('User-Type');
        if (!userType || !["donor", "receiver"].includes(userType.toLowerCase())) {
            return res.status(400).json({ error: true, message: "Invalid or missing User-Type header" });
        }

        const{username , contact} = req.body;

        const Model = userType.toLowerCase() === "donor" ? Donor : Receiver;
        const user = await Model.findById(req.user.id);


        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        if (username !== undefined) user.username = username;
        if (contact !== undefined) user.contact = contact;
        await user.save();
        
        return res.status(200).json({ success: true, message: "Profile updated", data: user });

    }
    catch(err){
        console.log(err);
        res.status(400).json({ error: true, message: "Error updating user details" });
    }
})