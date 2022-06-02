import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../auth.js";
dotenv.config();

const verifyLocalAuth = (req, res, next, accessToken, refreshToken) => {
    if (!accessToken && refreshToken) {
        try {
            const user = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET
            );
            console.log(user);
            const newAccessToken = refreshAccessToken(refreshToken);
            res.clearCookie("jwta");
            res.cookie("jwta", newAccessToken, {
                httpOnly: true,
                maxAge: 600000,
            });
            req.user = user;
            next();
        } catch (err) {
            res.status(403);
        }
    } else {
        try {
            const user = jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_TOKEN_SECRET
            );
            req.user = user;
            next();
        } catch (err) {
            console.log(err.message);
            return res.status(403).send(err.message);
        }
    }
};

export { verifyLocalAuth };
