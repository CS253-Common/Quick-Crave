const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '123456';

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
 
    if(decoded.userType === 'customer'){
        req.customer_id = decoded.user_id;
    }
    else{
        req.canteen_id = decoded.user_id;
    }
    //console.log('from authenticate')
    //console.log(req);
    //console.log(decoded)
    //console.log(req.canteen_id);
    //console.log(token)
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = authenticateJWT;