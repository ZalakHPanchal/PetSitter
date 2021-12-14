
const {validationResult,body} = require('express-validator');
const { DateTime } = require("luxon");

exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    else{
        return next();
    }
}

exports.validateuserSignUp = [body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
body('email', "Email id must be valid Email id address.").isEmail().trim().escape().normalizeEmail(),
body('password', "Password must be atleast 8 charachters and atmost 64 charachters").isLength({ min: 8, max: 64 })];

exports.validateuserLogin = [body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','password has atleast 8 character and atmost 64 character').isLength({min:8,max:64})];

exports.validationResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            req.flash('error', err.msg)
        })
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateRSVPEvent = [body('rsvp', "Response field must be valid").trim().notEmpty().isIn(["Yes","No","Maybe","YES","NO","MAYBE","yes","no","maybe"])]
exports.validateService = [
    body('Name', 'Dog Name not be empty').notEmpty().trim().escape(),
    body('OwnerName', 'Owner Name not be empty').notEmpty().trim().escape(),
    body('Breed', 'Breed not be empty ').notEmpty().trim().escape(),
    body('Service', 'Service Name not be empty').notEmpty().trim().escape(),
    body('Description', 'Description of service should be atleast 10 character long ').notEmpty().trim().isLength({min:10}).escape(),
    body('Date_implemented', "Date should be in future ;not today's date").notEmpty().trim().isAfter(new Date().toDateString()),
    body('end_time', 'end_time not be empty').notEmpty().trim().escape(),
    body('start_time', 'Start Time cannot be empty').notEmpty().trim().custom((value, { req }) => {
        // End time should be after start time and event should be atleast 10 mins long
        let startTimeObj = DateTime.fromFormat(req.body.start_time, "hh:mm");
        let endTimeObj = DateTime.fromFormat(req.body.end_time, "hh:mm");
        if (!startTimeObj.isValid) {
            throw new Error('Date is not a valid');
        }
        else {
            if ( endTimeObj > startTimeObj) {
                return true;
            } else {
                throw new Error('End time should be after start time and should be atleast 10 mins long');
            }
        }
    }),
    body('logo', 'image should be a valid URL').notEmpty().trim()
];