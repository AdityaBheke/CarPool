const mongoose = require('mongoose');
const {customError} = require('../middlewares/errorhandler.middleware')
const userServices = require('./user.services')
const mapServices = require('./map.service');
const rideSchema = require('../models/ride.model');


const Ride = mongoose.model('Ride',rideSchema);
const rideServices = {
  // Publish a ride
  // get userID and Ride data from user
  publishRide: async function (userId, rideData) {
    try {
      // CHeck is user is present or not using userId
      const isValidUser = await userServices.findByUserId(userId);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
      
      const {
        origin,
        originId,
        destination,
        destinationId,
        journeyDate,
        startTime,
        totalSeats,
        farePerPerson,
        vehicleName,
        vehicleColor,
        vehiclePlate,
      } = rideData;

      const direction = await mapServices.getDirectionsByPlaceId(originId, destinationId);
      const {start, end} = this.getTimeRange(journeyDate,startTime, direction.duration.value);

      const formattedRideData = {
          driverId: userId,
          startLocation: {
              address: origin,
              fullAddress: direction.start_address,
              coordinates: {
                  lat: direction.start_location.lat,
                  lng: direction.start_location.lng
              }
          },
          endLocation: {
              address: destination,
              fullAddress: direction.end_address,
              coordinates: {
                  lat: direction.end_location.lat,
                  lng: direction.end_location.lng
              }
          },
          route: [ direction.start_location, ...direction.steps.map((step)=>step.end_location)],
          distance: direction.distance.value,
          startTime: start,
          endTime: end,
          farePerPerson: farePerPerson,
          totalSeats: totalSeats,
          bookedSeats: 0,
          availableSeats:totalSeats,
          status:"active",
          vehicleDetails:{
              vehicleName: vehicleName,
              vehicleColor: vehicleColor,
              vehiclePlate: vehiclePlate
          },
          createdDate: new Date(),
          updatedDate: new Date()
      }

      // create ride using rideData
      const ride = new Ride(formattedRideData);
      if (!ride._id) {
        ride._id = new mongoose.Types.ObjectId();
      }
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
  updateRide: async function(userId, rideId, updateData) {
    try {
      // check if user is present or not using userId
      const isValidUser = await userServices.findByUserId(userId);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
      //  Check if ride is present or not using rideId
      let isValidRide = await Ride.findById(rideId);
      if (!isValidRide) {
        throw new customError(404, "Ride not found");
      }
      //  Check for only authorized user is changing ride details
      if (isValidRide.driverId != userId) {
        throw new customError(403, "Only publisher can update ride details");
      }

      // CHANGE UPDATE APPROACH
      // Destructure Update Data
      const {
        origin,
        originId,
        destination,
        destinationId,
        journeyDate,
        startTime,
        totalSeats,
        farePerPerson,
        vehicleName,
        vehicleColor,
        vehiclePlate,
      } = updateData;

      const newDate = this.getTimeRange(journeyDate, startTime, 0).start;
      if (origin != isValidRide.startLocation.address || 
        destination != isValidRide.endLocation.address ||
        newDate.getTime() != isValidRide.startTime.getTime()
      ) {
        // Make google api call
        // update time range
        const direction = await mapServices.getDirectionsByPlaceId(originId, destinationId);
        const {start, end} = this.getTimeRange(journeyDate,startTime, direction.duration.value);
        isValidRide = {
          ...isValidRide,
          startLocation: {
            address: origin,
            fullAddress: direction.start_address,
            coordinates: {
              lat: direction.start_location.lat,
              lng: direction.start_location.lng,
            },
          },
          endLocation: {
            address: destination,
            fullAddress: direction.end_address,
            coordinates: {
              lat: direction.end_location.lat,
              lng: direction.end_location.lng,
            },
          },
          route: [
            direction.start_location,
            ...direction.steps.map((step) => step.end_location),
          ],
          distance: direction.distance.value,
          startTime: start,
          endTime: end,
        };
      }

      isValidRide = {
        ...isValidRide,
        totalSeats,
        farePerPerson,
        vehicleDetails: {
          vehicleName,
          vehicleColor,
          vehiclePlate,
        },
        updatedDate: new Date()
      };

      // update ride details using Update data
      await Ride.findByIdAndUpdate(rideId, isValidRide.toObject(), { new: true, runValidators: true });
      // Return updated ride details
      // const updatedRide = Object.assign(isValidRide, updateData);
      return { success: true, ride: isValidRide };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while updating a ride"
      );
    }
  },
  // Update status
  updateStatus: async(userId, rideId, status)=>{
    try {
      // check if user is present or not using userId
      const isValidUser = await userServices.findByUserId(userId);
      if (!isValidUser) {
        throw new customError(404, "User not found");
      }
      //  Check if ride is present or not using rideId
      let isValidRide = await Ride.findById(rideId);
      if (!isValidRide) {
        throw new customError(404, "Ride not found");
      }
      //  Check for only authorized user is changing ride details
      if (isValidRide.driverId != userId) {
        throw new customError(403, "Only publisher can update ride details");
      }
      isValidRide.status = status;
      await isValidRide.save();
      return {success: true, ride: isValidRide}

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
      const ride = await Ride.findById(rideId)
      .populate('driverId', 'name mobile gender age');
      
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
        const rides = await Ride.find({$or:[{driverId: userId },{passengers:{$elemMatch:{primaryPassenger:userId}}}]}).populate('driverId',"name mobile gender");
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
        journeyDate: ""
      };
      const { from, to, reqSeats, journeyDate } = {...defaultCriteria, ...criteria};

      let startTimeQuery = {$gte: new Date()};
      if (journeyDate) {
        const startOfDay = new Date(journeyDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(journeyDate);
        endOfDay.setHours(23, 59, 59, 999);
        startTimeQuery = { $gte: startOfDay, $lte: endOfDay };
      }

      const rides = await Ride.find({
        "startLocation.address": { $regex: new RegExp(from, 'i') },
        "endLocation.address": { $regex: new RegExp(to, 'i') },
        availableSeats: {$gte: Number(reqSeats)},
        startTime: startTimeQuery
      }).populate('driverId',"name mobile gender");
      return { success: true, rides: rides };
    } catch (error) {
      throw new customError(
        error.statusCode || 400,
        error.message || "Error while getting rides"
      );
    }
  },
  getTimeRange: function (date, startTime, secondsToAdd){
    const [year, month, day] = date.split('-').map((d)=>Number(d));
    const [hour, minute] = startTime.split(':').map((d)=>Number(d));
    const start = new Date(year, month-1, day, hour, minute, 0);
    const end = new Date(start.getTime() + (secondsToAdd*1000));
    return {start, end}
  }
};
module.exports = rideServices;