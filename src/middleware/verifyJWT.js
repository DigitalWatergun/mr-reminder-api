import dotenv from "dotenv";
import { verifyLocalAuth } from "./verifyLocalAuth";
dotenv.config();

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies.jwta;
    const refreshToken = req.cookies.jwtr;

    if (!accessToken && !refreshToken)
        return res.status(401).send("No token found.");
    verifyLocalAuth(req, res, next, accessToken, refreshToken);
};

export { verifyJWT };
