const service = require("../models/services")
const rsvp_model = require("../models/rsvp");
const services = require("../models/services");

exports.isGuest = (req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    else{
        req.flash('error',"You are logged in already")
        return res.redirect('/users/profile');
    }
}

//check if user is authenticated
exports.isLoggedIn = (req,res,next)=>{
    if(req.session.user){
        return next();
    }
    else{
        req.flash('error',"You need to log in first")
        return res.redirect('/users/login');
    }
}

exports.isAuthor = (req,res,next)=>{
    let id = req.params.id;
    service.findById(id)
    .then(services=>{
        if(services){
            if(services.author == req.session.user._id){
                return next;
            }
            else{
                let err = new Error('Unauthorized to access the resource')
                err.status = 401;
                return next(err);
            }
        }
    })
    if(req.session.user){
        return next();
    }
    else{
        req.flash('error',"You need to log in first")
        return res.redirect('/users/login');
    }
}

exports.isnotHost = (req, res, next)=>{
    let id = req.query.serviceid;
    service.findById(id)
    .then(services=>{
        if(services){
            if(services.author != req.session.user._id){
                return next();
            }else{
                let err = new Error('Unauthorized to access to the resource');
                err.status=401;
                return next(err);
            }
        }
        else{
            let err = new Error('Unable to find service with' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err))

};

exports.isrsvpcreator = (req, res, next) => {
    let serviceid = req.query.serviceid
    rsvp_model.find({serviceid:serviceid}).then((rsvpdata) => {
    if (rsvpdata) {
        services.find({_id:rsvpdata.serviceid}).then(rsvp => {
            if (rsvp){
                if (rsvp.user != req.session.user.id) {
                        return next()
                 } 
                 else {
                     let error = new Error('User can not prefer his own service');
                     error.status = 401;
                     return next(error);
                 }} 
                 else {
                        let error = new Error('Cannot find any service with the id: ' + id);
                        error.status = 404;
                        return next(error);
                    }
                }).catch(err => next(err));
            } else {
                let error = new Error('Cannot find any prefrence with the id: ' + id);
                error.status = 404;
                return next(err);
            }
        }).catch(err => next(err));
}

