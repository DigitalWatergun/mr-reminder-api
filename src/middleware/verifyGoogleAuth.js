import dotenv from "dotenv";
import _ from "lodash";
import { OAuth2Client } from "google-auth-library";
dotenv.config();

const verifyGoogleToken = async (req, res, next, token) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

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

export { verifyGoogleToken };
