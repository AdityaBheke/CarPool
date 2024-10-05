const mongoose = require('mongoose');
const {customError} = require('./../middlewares/errorhandler.middleware')
const userServices = require('./../services/user.services')
const rideSchema = require('./../models/ride.model');


const Ride = mongoose.model('Ride',rideSchema);
const rideServices = {
    publishRide: async (userId, rideData) => {
        try {
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            const ride = new Ride(rideData);
            if (!ride._id) {
                ride._id = new mongoose.Types.ObjectId();                
            }
            ride.createdDate = new Date();
            ride.updatedDate = new Date();
            ride.status = 'active';
            ride.driverId = userId;
            const createdRide = await ride.save();
            return {success: true, ride: createdRide};
        } catch (error) {
            throw new customError(400, error.message || 'Error while publishing a ride');
        }
    },
    updateRide: async(userId, rideId, updateData)=>{
        try {
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            const isValidRide = await Ride.findById(rideId);
            if (!isValidRide) {
                throw new customError(404, "Ride not found");
            }
            if (isValidRide.driverId != userId) {
                throw new customError(403, "Only publisher can update ride details")
            }
            updateData.updatedDate = new Date();
            await Ride.findByIdAndUpdate(rideId, updateData);
            const updatedRide = {...isValidRide, ...updateData};
            return {success: true, ride: updatedRide};
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while updating a ride');
        }
    },
    getDriverRides: async(userId)=>{
        try {
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            const rides = await Ride.find({driverId: userId});
            return {success: true, rides: rides}
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while getting rides');
        }
    },
    getPassengerRides: async(userId)=>{
        try {
            const isValidUser = await userServices.findByUserId(userId);
            if (!isValidUser) {
                throw new customError(404, "User not found");
            }
            const rides = await Ride.find({passengers:{$in:[userId]}});
            return {success: true, rides: rides}
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while getting rides');
        }
    },
    getActiveRides: async()=>{
        try {
            // const rides = await Ride.find({status:'active',startTime:{$gte: new Date()}});
            const rides = await Ride.find({status:'active'});
            return {success: true, rides: rides}
        } catch (error) {
            throw new customError(error.statusCode || 400, error.message || 'Error while getting rides');
        }
    }
}
module.exports = rideServices;