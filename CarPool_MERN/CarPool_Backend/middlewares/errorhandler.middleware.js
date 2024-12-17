
class customError extends Error{
    constructor(statusCode, errorMessage){
        super(errorMessage);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next)=>{
    if (err instanceof customError) {
        res.status(err.statusCode).send({success: false, errorCode: err.statusCode, message: err.message});
    } else {
        res.status(500).send('Something went wrong!');
        console.log(err);
        
    }
}

module.exports = {customError, errorHandler}