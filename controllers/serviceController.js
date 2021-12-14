
const { compile } = require('morgan');
const services_model = require('../models/services');
const rsvp_model = require('../models/rsvp');


//GET /petservices : send all services to the user

exports.index = (req,res,next)=>{
    // res.send('send all services');
    services_model.find()
    .then(services=>{
        let unique = [...new Set(services.map(item => item.Service))]
        console.log(unique)
        var myServiceMap = new Map();
        let newservice = [];
        unique.forEach(element => {
            for(i=0;i<services.length;i++){
                if(services[i].Service == element){
                    newservice.push(services[i]);
                }
            }
            myServiceMap.set(element,newservice)
            newservice= []
        })
        res.render('./PetService/index',{myServiceMap,unique})
    }
    )
    .catch(err=>next(err));
};

//GET //services/new: send html form for creating a new story

exports.new = (req,res)=>{
    res.render('./PetService/new')
};  

exports.rsvpevent = (req,res,next)=>{
    rsvp_model.find({
        user: req.session.user._id,
        serviceid: req.query.serviceid
      })
      .then(rsvpdata=>{
          console.log("first---------------"+rsvpdata)
        if(rsvpdata.length == 0){
            let rsvpevent = new rsvp_model(req.query);
            rsvpevent.user = req.session.user._id;
            rsvpevent.save()
            .then(rsvp=>{
                if(rsvp){
                    req.flash('success', 'You choose  '  + req.query.rsvp+  '   ------Action Successful');
                    services_model.findOneAndUpdate({_id:req.query.serviceid}, {$inc:{ rsvpcount: 1 }},{ returnNewDocument: true, upsert : true})
                    res.redirect('/petservices/'+req.query.serviceid)
                }
                else{
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/petservices/'+req.query.serviceid);  
                }})
            .catch(
                err=>{
                    console.log("Catch")
                    console.log(err)
                    if(err.name === 'ValidationError' ) {
                        err.status = 400;
                    }
                    next(err);
                })
        }
        else{
            console.log(rsvpdata)
            rsvpid = rsvpdata[0]._id.toString()
            rsvp_model.findByIdAndUpdate(rsvpid,{rsvp:req.query.rsvp})
            .then(rsvpupdate=>{
                if(rsvpupdate) {
                    req.flash('success', 'You choose  '  + req.query.rsvp+  '   ------Action Successful');
                    res.redirect('/petservices/'+req.query.serviceid);
                    } else {
                        let err = new Error('Something Wrong');
                        err.status = 404;
                        next(err);
                    }
                })
            .catch(err=> {
                console.log(err)
                if(err.name === 'ValidationError')
                    err.status = 400;
                next(err);
            });
            console.log("notempty")
        }
      })
      .catch(err=>{
        console.log(err)
        next(err)
      }
         
      )};  

      //rsvpdelete
exports.rsvpdelete = (req,res,next)=>{
    let id = req.params.id;
    rsvp_model.findOneAndDelete({serviceid:id, user:req.session.user})
    .then(rsvpdelete =>{
        if(rsvpdelete) {
            req.flash('success', 'You have Deleted Prefrence');
            res.redirect('/users/profile');
        } else {
            let err = new Error('Cannot find a Service with id ' + id);
            err.status = 404;
            console.log(err)
            return next(err);
        }
    })
    .catch(err=>{
        console.log(err)
        next(err)}
        );
}
//POST //petservices: create a new story

exports.create = (req,res,next)=>{
    let createservice = new services_model(req.body);//create a new service document
    createservice.author = req.session.user;
    // {runValidators: true}
    createservice.save()//insert the document to the database
    .then(services=> {
        if(services){
            req.flash('success', 'You have successfully Created services');
            res.redirect('/petservices')
        }
        else{
            req.flash('error', 'Something went wrong');
            return res.render('./PetService/new');  
        }})
    .catch(err=>{
        console.log("Catch")
        if(err.name === 'ValidationError' ) {
            err.status = 400;

        }
        return res.redirect(400, '/petservices/createservice')
        // next(err);
        
    });
};

//GET /petservices/:id send details of services identified by id

exports.show = (req,res,next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    // if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     let err = new Error('Invalid Service id');
    //     err.status = 400;
    //     return next(err);
    // }
    services_model.findById(id).populate('author')
    .then(servicebyid=>{
        if(servicebyid) {
            rsvp_model.find({serviceid:servicebyid._id.toString()}).then(rsvpdata=>{
            rsvpcount = rsvpdata.length;
            return res.render('./PetService/show', {servicebyid,rsvpcount});
            })
            .catch(err=>{
                console.log(err)
                next(err)
            })
            
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//GET /petservices/:id/edit: send the html for editing an existing story

exports.edit = (req,res,next)=>{
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     let err = new Error('Invalid Service id');
    //     err.status = 400;
    //     return next(err);
    // }
    services_model.findById(id)
    .then(editservice=>{
        if(editservice) {
            return res.render('./PetService/edit', {editservice});
        } else {
            let err = new Error('Cannot find a Service with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        next(err)
    });

};

//PUT /petservices/:id: update the story identified by id
exports.update = (req,res,next)=>{
    let peteditcontent = req.body;
    let id = req.params.id;

    services_model.findByIdAndUpdate(id, peteditcontent, {useFindAndModify: false, runValidators: true})
    .then(services=>{
        if(services) {
            req.flash('success', 'You have successfully Updated services');
            res.redirect('/petservices/'+id);
        } else {
            let err = new Error('Cannot find a Services with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};
//DELETE //services/:id, delete the story identified by id

exports.delete = (req,res,next)=>{
    let id = req.params.id;

    services_model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(services =>{
        if(services) {
            rsvp_model.deleteMany({serviceid:id}).then(rsvpdata=>{
                req.flash('success', 'You have successfully Deleted services');
                res.redirect('/petservices');
                })
                .catch(err=>{
                    console.log(err)
                    next(err)
                })
        } else {
            let err = new Error('Cannot find a Service with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};


