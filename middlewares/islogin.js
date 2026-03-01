const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied! Pehle login karo lala." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified; 
        next(); 
    } catch (err) {
        res.status(403).json({ message: "Invalid Token!" });
    }
};

module.exports = verifyAdmin;