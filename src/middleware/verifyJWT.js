import dotenv from "dotenv";
import { verifyGoogleToken } from "./verifyGoogleAuth.js";
import { verifyLocalAuth } from "./verifyLocalAuth";
dotenv.config();

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies.jwta;
    const refreshToken = req.cookies.jwtr;
    const googleToken = req.cookies.jwtg;

    if (googleToken) {
        verifyGoogleToken(req, res, next, googleToken);
    } else {
        if (!accessToken && !refreshToken)
            return res.status(401).send("No token found.");
        verifyLocalAuth(req, res, next, accessToken, refreshToken);
    }
};

export { verifyJWT };
