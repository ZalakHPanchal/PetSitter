const model = require('../models/user');
const services = require('../models/services');
const rsvp_model = require('../models/rsvp');

exports.new = (req, res)=>{
    res.render('./user/new');
};
exports.create = (req, res, next)=>{
    let user = new model(req.body);//create a new user document
    user.save()//insert the document to the database
    .then(user=>{
        req.flash('success', 'You have successfully Registerd');
        res.redirect('/users/login')
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next)=>{
    console.log("here")
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(
        err =>{
            console.log(err)
            next(err)
        } );
};
    exports.profile = (req, res, next)=>{
        let id = req.session.user;
        Promise.all([model.findById(id),services.find({author:id})])
        .then(result=>{
            if(result){
                const [user,services] = result;
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
            rsvp_model.find({user:id}).then(rsvpdata=>{
                console.log(rsvpdata)
                
                res.render('./user/profile', {user,services,myServiceMap,unique,rsvpdata})
            }).catch(err=>next(err))
            }
            else{
                let err = new Error('Cannot find a Profile of ' + id);
                err.status = 404;
                return next(err);
            }
            
        })
        .catch(err=>next(err));
    };


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };




