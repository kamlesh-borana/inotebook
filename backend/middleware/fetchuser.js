const jwt = require("jsonwebtoken");
const JWT_SECRET = "Kamlesh Borana (KB)";

const fetchuser = (req, res, next) => {
    //Get the user from the jwt and add id to the req object
    const token = req.header("auth-token");
    if(!token) {
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    next();
}

module.exports = fetchuser;