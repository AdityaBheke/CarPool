const rideServices = require('./../services/ride.services');

// const {customError} = require('./../middlewares/errorhandler.middleware');

class rideController{
    async publishRide(req, res, next){
        try {
            const userId = req.userId;
            const rideData = req.body;
            const result = await rideServices.publishRide(userId, rideData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async updateRide(req, res, next){
        try {
            const userId = req.userId;
            const rideId = req.params.id;
            console.log("Update rideId",rideId);
            const updateData = req.body;
            const result = await rideServices.updateRide(userId, rideId, updateData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async startRide(req, res, next){
        try {
            const userId = req.userId;
            const rideId = req.params.id;
            console.log("Start rideId",rideId);
            const result = await rideServices.updateRide(userId, rideId, {status: 'started'});
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async finishRide(req, res, next){
        try {
            const userId = req.userId;
            const rideId = req.params.id;
            console.log("Finish rideId",rideId);
            const result = await rideServices.updateRide(userId, rideId, {status: 'completed'});
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async cancelRide(req, res, next){
        try {
            const userId = req.userId;
            const rideId = req.params.id;
            console.log("Cancel rideId",rideId);
            const result = await rideServices.updateRide(userId, rideId, {status: 'cancelled'});
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getActiveRides(req, res, next){
        try {
            const result = await rideServices.getActiveRides();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getUserRides(req, res, next){
        try {
            const userId = req.userId;
            const result = await rideServices.getRidesByUserId(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = rideController;