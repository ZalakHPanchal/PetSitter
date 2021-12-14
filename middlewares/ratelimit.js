const rateLimiter  = require("express-rate-limit");
exports.logInratelimiter = rateLimiter({
    windowMs:60*1000,
    max:5,
    handler:(req,res,next)=>{
        let err = new Error('Too many request to handle,try again later');
        err.status = 429;
        return next(err);
    }
});