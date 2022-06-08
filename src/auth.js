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

const refreshAccessToken = (refreshToken) => {
    try {
        console.log("Refreshing access token...");
        const user = verifyRefreshToken(refreshToken);
        const accessToken = generateAccessToken(user);

        return { user, accessToken };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const verifyAccessToken = (accessToken) => {
    try {
        console.log("Verifying access token...");
        const user = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );
        return user;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const verifyRefreshToken = (refreshToken) => {
    try {
        console.log("Verifying refresh token...");
        const user = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );
        return user;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    refreshAccessToken,
};
