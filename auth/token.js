const jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.config();

function verifytoken(req, res,next){
        const authheader = req.headers.authorization;
        for (const headerName in req.headers) {
            console.log(`${headerName}: ${req.headers[headerName]}`);
          }// debug output
          
        if(!authheader || !authheader.startsWith('Bearer ')){
            return res.status(401).json({message: ' unauthorized : invalid token'});
        }

        const token = authheader && authheader.split(' ')[1];
    
        // if(!token)return res.status(401).json('token null');
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
    
            req.userId = decode;
            
            next();
        }catch(err){
            console.log(err);
            return res.status(403).json({message: 'forbidden : invalid token'});
        }

}

module.exports = verifytoken;