import { verifyAccessToken, refreshAccessToken } from "../auth.js";
import dotenv from "dotenv";
dotenv.config();

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies.jwta;
    const refreshToken = req.cookies.jwtr;

    if (!accessToken && !refreshToken)
        return res.status(401).send("No token found.");

    if (!accessToken && refreshToken) {
        try {
            const { user, accessToken } = refreshAccessToken(refreshToken);
            res.clearCookie("jwta");
            res.cookie("jwta", accessToken, {
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
            const user = verifyAccessToken(accessToken);
            req.user = user;
            next();
        } catch (err) {
            console.log(err.message);
            return res.status(403).send(err.message);
        }
    }
};

export { verifyJWT };
