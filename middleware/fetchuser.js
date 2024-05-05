var jwt = require('jsonwebtoken');
const fetchuser=(req,res,next)=>{
    // get the user from the jwt token and add id to the request
    const token= req.header('auth-token')
    const JWT_secret=process.env.JWT_SECRET;
    if(!token){
        res.status(401).send({error :"token missing"})
    }
    try{
        const data=jwt.verify(token,JWT_secret)
        req.user=data;
        console.log(data);
        // console.log(token);
        next(data);
    }
    catch(error){
        res.status(401).send({error :"please authenticate a valid token"})
    }
}
module.exports=fetchuser;