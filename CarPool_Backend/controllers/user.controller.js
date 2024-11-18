const { customError } = require('../middlewares/errorhandler.middleware.js');
const userServices = require('./../services/user.services.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class userController{
    async signUp(req, res, next){
        try {
            const userData = req.body;
            userData.password = await bcrypt.hash(req.body.password, 12);
            const result = await userServices.signup(userData);
            res.status(201).json(result);
        } catch (error) {
            next(error)
        }
    }
    async signIn(req, res, next){
        try {
            const {email, password} = req.body;
            const result = await userServices.findByEmail(email);
            const checkPassword = await bcrypt.compare( password, result.user.password);
            if (checkPassword) {
                const token = jwt.sign({userId: result.user._id}, 'secret', { expiresIn: "30m" });
                res.cookie("jwtToken", token);
                res.cookie("token", token);
                res.status(200).json(result);
            }else{
                throw new customError(401, "Invalid Credentials")
            }
            
        } catch (error) {
            next(error)
        }
    }
    async findByUserId(req, res, next){
        try {
            const userId = req.userId;
            const result = await userServices.findByUserId(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const userId = req.userId;
            const updateUserData = req.body;
            const result = await userServices.updateUser(userId, updateUserData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async removeUser(req, res, next) {
        try {
            const userId = req.userId;
            const result = await userServices.removeUser(userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = userController;