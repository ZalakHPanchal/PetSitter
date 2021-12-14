
exports.index = (req,res)=>{
    console.log("index page")
    console.log(req.url)
    res.render('index')
};  
exports.aboutus = (req,res)=>{
    res.render('aboutus')
};  
exports.contactus = (req,res)=>{
    res.render('contactus')
};  
