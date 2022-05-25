import dotenv from "dotenv";
import _ from "lodash";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { refreshAccessToken } from "../auth.js";
dotenv.config();

const verifyJWT = (req, res, next) => {
    const accessToken = req.cookies.jwta;
    const refreshToken = req.cookies.jwtr;
    const googleToken = req.cookies.jwtg;

    if (googleToken) {
        console.log("Google token found");
        const verifyGoogleToken = async (token) => {
            try {
                const client = new OAuth2Client(
                    process.env.GOOGLE_OAUTH_CLIENT_ID
                );

                const ticketResponse = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
                });
                const ticketPayload = ticketResponse.payload;
                const username = _.toLower(ticketPayload.email.split("@")[0]);
                const user = {
                    _id: ticketPayload.sub,
                    active: true,
                    username: username,
                    userDisplayName: username,
                    email: ticketPayload.email,
                };

                req.user = user;
                next();
            } catch (err) {
                console.log(err);
                return res.status(401).send(err.message);
            }
        };

        verifyGoogleToken(googleToken);
    } else {
        if (accessToken === null || accessToken === undefined) {
            if (refreshToken === null || refreshToken === undefined) {
                return res.status(401).send("No token found.");
            } else {
                jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_TOKEN_SECRET,
                    (err, user) => {
                        if (err) {
                            res.status(403);
                        } else {
                            const newAccessToken =
                                refreshAccessToken(refreshToken);
                            res.clearCookie("jwta");
                            res.cookie("jwta", newAccessToken, {
                                httpOnly: true,
                                maxAge: 600000,
                            });
                            req.user = user;
                            next();
                        }
                    }
                );
            }
        } else {
            jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_TOKEN_SECRET,
                (err, user) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(403).send(err.message);
                    } else {
                        req.user = user;
                        next();
                    }
                }
            );
        }
    }
};

export { verifyJWT };
