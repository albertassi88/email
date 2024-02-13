require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Acesso negado!" });
    }
    try {
        const secret = process.env.JWT_SECRET;
        await jwt.verify(token, secret, { algorithms: ['HS256'] });        
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(400).json({ message: "Token inválido!" });
    }
};

module.exports = checkToken;
