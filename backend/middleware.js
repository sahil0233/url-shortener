const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("inside middleware");
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader || ! authHeader.startsWith('Bearer ')){
        return res.status(403).json("User not logged in");
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    try { 
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded.userId);
        if(decoded.userId){
            req.userId = decoded.userId;
            console.log(req.userId);
            next();
        }else {
            return res.status(403).send(req.userId);
        }
    }catch(err) {
        return res.status(403).json("Error occurred");
    }
}



module.exports = {
    authMiddleware
}