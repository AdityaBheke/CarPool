const express = require('express');
const rideController = require('./../controllers/ride.controller.js');
const auth = require('../middlewares/auth.middleware.js');

const rideRouter = express.Router();
const rideControllerObj = new rideController();

rideRouter.post('/', auth, (req, res, next)=>{
    rideControllerObj.publishRide(req, res, next);
});
rideRouter.put('/:id', auth, (req, res, next)=>{
    rideControllerObj.updateRide(req, res, next);
});
rideRouter.put('/start/:id', auth, (req, res, next)=>{
    rideControllerObj.startRide(req, res, next);
});
rideRouter.put('/finish/:id', auth, (req, res, next)=>{
    rideControllerObj.finishRide(req, res, next);
});
rideRouter.put('/cancel/:id', auth, (req, res, next)=>{
    rideControllerObj.cancelRide(req, res, next);
});
rideRouter.get('/active', (req, res, next)=>{
    rideControllerObj.getActiveRides(req, res, next);
});
rideRouter.get('/', auth, (req, res, next)=>{
    rideControllerObj.getUserRides(req, res, next);
});




module.exports = rideRouter;