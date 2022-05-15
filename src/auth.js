import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = (user) => {
    const authUser = { _id: user._id, username: user.username };
    const accessToken = jwt.sign(
        authUser,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    );

    return accessToken;
};

const generateRefreshToken = (user) => {
    const authUser = { _id: user._id, username: user.username };
    const refreshToken = jwt.sign(
        authUser,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    return refreshToken;
};

const refreshAccessToken = (token) => {
    console.log("Refreshing access token...");
    const accessToken = jwt.verify(
        token,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                return err;
            }

            return generateAccessToken(user);
        }
    );

    return accessToken;
};

export { generateAccessToken, generateRefreshToken, refreshAccessToken };
