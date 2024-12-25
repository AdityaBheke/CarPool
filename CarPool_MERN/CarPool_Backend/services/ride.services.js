const mongoose = require('mongoose');
const {customError} = require('../middlewares/errorhandler.middleware')
const userServices = require('./user.services')
const rideSchema = require('../models/ride.model');


const Ride = mongoose.model('Ride',rideSchema);
const rideServices = {
  // Publish a ride
  // get userID and Ride data from user
  publishRide: async (userId, rideData) => {
    try {
      // CHeck is user is present or not using userId
      const isValidUser = await userServices.findByUserId(userId);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
      // create ride using rideData
      const formattedRideData = {
        startTime: new Date(rideData.startTime),
        ...rideData
      }
      const ride = new Ride(formattedRideData);
      if (!ride._id) {
        ride._id = new mongoose.Types.ObjectId();
      }
      ride.createdDate = new Date();
      ride.updatedDate = new Date();
      ride.status = "active";
      ride.driverId = userId;
      ride.availableSeats = ride.totalSeats;
      const createdRide = await ride.save();
      // Return created ride data
      return { success: true, ride: createdRide };
    } catch (error) {
      throw new customError(
        400,
        error.message || "Error while publishing a ride"
      );
    }
  },
  // Update ride details
  // get userId, rideId and Update data
  updateRide: async (userId, rideId, updateData) => {
    try {
      // check if user is present or not using userId
      const isValidUser = await userServices.findByUserId(userId);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
      //  Check if ride is present or not using rideId
      const isValidRide = await Ride.findById(rideId);
      if (!isValidRide) {
        throw new customError(404, "Ride not found");
      }
      //  Check for only authorized user is changing ride details
      if (isValidRide.driverId != userId) {
        throw new customError(403, "Only publisher can update ride details");
      }
      updateData.updatedDate = new Date();
      // update ride details using Update data
      await Ride.findByIdAndUpdate(rideId, updateData);
      // Return updated ride details
      const updatedRide = Object.assign(isValidRide, updateData);
      return { success: true, ride: updatedRide };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while updating a ride"
      );
    }
  },
  // Update Passenger Details
  // Get userId(Primary passengerId), Ride id, Passengers Array to update
  updatePassengers: async (userId, rideId, passengerArray) => {
    try {
      // Check if user is present or not using userId
      const isValidUser = await userServices.findByUserId(userId);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
      // Check if ride is present or not using userId
      const isValidRide = await Ride.findById(rideId);
      if (!isValidRide) {
        throw new customError(404, "Ride not found");
      }
    //   Check if required seats are available or not
    if (passengerArray.length>isValidRide.availableSeats) {
        throw new customError(400, "Required number of seats are not available");
    }
    //   check if user is present in passsengers
    const passengerIndex = isValidRide.passengers.findIndex((passenger)=>passenger.primaryPassenger==userId);
    if (passengerIndex>=0) {
        // If present then update passenger array
        isValidRide.passengers[passengerIndex].allPassengers = passengerArray;
    } else {
        // If not present then push new Passenger 
        isValidRide.passengers.unshift({
            primaryPassenger: userId,
            allPassengers: passengerArray
        })
    }
    // update available seats
    isValidRide.availableSeats -= passengerArray.length
    // Update the ride
      await Ride.updateOne({ _id: rideId }, isValidRide);
      return { success: true, ride: isValidRide };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while updating passengers inside ride"
      );
    }
  },
//   Remove passenger from passengers array
// get rideId and primaryPassenger(Passnger object to remove) from user
  removePassenger: async (rideId, primaryPassenger) => {
    try {
        // check is user id Valid or not using primaryPassengerId
      const isValidUser = await userServices.findByUserId(primaryPassenger);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
    //   check if Ride is present or not using rideId
      const isValidRide = await Ride.findById(rideId);
      if (!isValidRide) {
        throw new customError(404, "Ride not found");
      }
    //  find index of passenger to remove
    const passengerIndex = isValidRide.passengers.findIndex((passenger)=>passenger.primaryPassenger==primaryPassenger);
    if (passengerIndex>=0) {
        // delete passenger from passengers array
        const deletedPassenger = isValidRide.passengers.splice(passengerIndex, 1);
        // update available seats
        isValidRide.availableSeats += deletedPassenger[0].allPassengers.length;
    } else {
        throw new customError(404, "Passenger not found");
    }
    // update ride details
      await Ride.updateOne({ _id: rideId }, isValidRide);
      return { success: true, ride: isValidRide };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while removing passenger from ride"
      );
    }
  },
  // Get particular ride by rideId
  getRideById: async (rideId) => {
    try {
      const ride = await Ride.findById(rideId);
      return { success: true, ride: ride };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while getting rides"
      );
    }
  },
  // Get all rides of Particular User
//   get userId from user
  getRidesByUserId: async (userId)=>{
    try {
        const rides = await Ride.find({$or:[{driverId: userId },{passengers:{$elemMatch:{primaryPassenger:userId}}}]});
        return {success: true, rides: rides}
    } catch (error) {
        throw new customError(
            error.statusCode || 400,
            error.message || "Error while getting rides"
          );
    }
  },
  // Get all active rides
  getActiveRides: async () => {
    try {
      // const rides = await Ride.find({status:'active',startTime:{$gte: new Date()}});
      const rides = await Ride.find({ status: "active" });
      return { success: true, rides: rides };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while getting rides"
      );
    }
  },
  // Filter Rides based on criteria provided by user
  getFilteredRides: async (criteria) => {
    try {
      const defaultCriteria = {
        from: "",
        to: "",
        reqSeats: 0,
        journeyDate: new Date()
      };
      const { from, to, reqSeats, journeyDate } = {...defaultCriteria, ...criteria};

      const rides = await Ride.find({
        "startLocation.address": { $regex: new RegExp(from, 'i') },
        "endLocation.address": { $regex: new RegExp(to, 'i') },
        availableSeats: {$gte: Number(reqSeats)},
        startTime: {$gte: new Date(journeyDate || new Date()), $lte:new Date(journeyDate || new Date())},
        status: 'active'
      });
      return { success: true, rides: rides };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while getting rides"
      );
    }
  }
};
module.exports = rideServices;