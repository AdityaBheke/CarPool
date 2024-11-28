const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startLocation: {
        address: String,
        coordinates: {
            lat: Number,
            long: Number
        }
    },
    endLocation: {
        address: String,
        coordinates: {
            lat: Number,
            long: Number
        }
    },
    route:[
        {
            lat: Number,
            long: Number
        }
    ],
    startTime: Date,
    endTime: Date,
    farePerPerson: {
        type: Number,
        default:0
    },
    totalSeats: {
        type: Number,
        default: 0
    },
    bookedSeats: {
        type: Number,
        default: 0
    },
    availableSeats:{
        type: Number,
        default: 0
    },
    passengers: [
        {
            primaryPassenger:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            allPassengers: [
                {
                    name: String,
                    age: Number,
                    gender: String
                }
            ],
            paymentStatus: {
                type: Boolean,
                default: false
            }
        }
    ],
    status:{
        type: String,
        enum: ['active','started','completed', 'cancelled']
    },
    vehicleDetails:{
        vehicleName: String,
        vehicleColor: String,
        vehiclePlate: String
    },
    createdDate: Date,
    updatedDate: Date
});

module.exports = rideSchema;