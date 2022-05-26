import _ from "lodash";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { generateAccessToken, generateRefreshToken } from "../auth.js";
import {
    queryUserById,
    queryUserByUsername,
    queryUserByEmail,
    createUser,
    updateUser,
    removeRegisterHash,
    deleteUser,
} from "../services/userService.js";
import {
    validateUserRegister,
    validateChangePassword,
} from "../validator/validator.js";
import { removeReminderByUserId } from "../services/reminderService.js";
import {
    sendRegistrationEmail,
    sendTempPassword,
} from "../emitter/notifications/mailer/mailer.js";
import dotenv from "dotenv";
dotenv.config();

const verifyGoogleToken = async (token) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
        });

        return ticket;
    } catch (err) {
        return err;
    }
};

const addUser = async (req, res) => {
    const validateStatus = validateUserRegister(req.body);
    if (!validateStatus.status) {
        res.status(500).send(validateStatus.error);
    } else {
        const user = {
            _id: uuid(),
            type: "local",
            active: false,
            username: _.toLower(req.body.username),
            userDisplayName: req.body.username,
            password: await bcrypt.hash(req.body.password, 15),
            email: req.body.email,
            registerHash: randomBytes(32).toString("hex"),
        };
        const result = await createUser(user);

        if (result.error) {
            if (
                result.error.message.includes(
                    "E11000 duplicate key error collection"
                )
            ) {
                res.status(500).send(
                    "An account with this username or email already exists."
                );
            } else {
                res.status(500).send(result.error.message);
            }
        } else {
            await sendRegistrationEmail(
                user.userDisplayName,
                user.email,
                user.registerHash
            );
            res.status(201).send(result);
        }
    }
};

const loginUser = async (req, res) => {
    const loginData = req.body;

    if (loginData.authType === "google") {
        const token = loginData.data.credential;
        const ticketResponse = await verifyGoogleToken(token);
        const ticketPayload = ticketResponse.payload;

        const user = (
            await queryUserByUsername(ticketPayload.email, "google")
        )[0];
        if (user === undefined) {
            const user = {
                _id: ticketPayload.sub,
                type: "google",
                active: true,
                username: ticketPayload.email,
                userDisplayName: ticketPayload.given_name,
                email: ticketPayload.email,
                refreshToken: token,
            };
            const result = await createUser(user);
            if (result.error) {
                if (
                    result.error.message.includes(
                        "E11000 duplicate key error collection"
                    )
                ) {
                    res.status(500).send(
                        "An account with this username or email already exists."
                    );
                } else {
                    res.status(500).send(result.error.message);
                }
            } else {
                res.cookie("jwtg", token, {
                    domain: process.env.BASE_URL,
                    httpOnly: true,
                    maxAge: 600000,
                });
                res.json({
                    userId: user._id,
                    username: user.userDisplayName,
                    type: user.type,
                });
            }
        } else {
            user["refreshToken"] = token;
            await updateUser(user);
            res.cookie("jwtg", token, {
                domain: process.env.BASE_URL,
                httpOnly: true,
                maxAge: 600000,
            });
            res.json({
                userId: user._id,
                username: user.userDisplayName,
                type: user.type,
            });
        }
    } else if (loginData.authType === "local") {
        const username = _.toLower(loginData.data.username);
        const user = (await queryUserByUsername(username, "local"))[0];

        if (user === undefined) {
            res.status(400).json("The username or password is incorrect.");
            console.log("The user does not exist.");
        } else {
            if (
                !(await bcrypt.compare(loginData.data.password, user.password))
            ) {
                console.log("The username or password is not correct.");
                res.status(403).send("The username or password is incorrect.");
            } else if (loginData.data.registerHash !== undefined) {
                if (loginData.data.registerHash === user.registerHash) {
                    const accessToken = generateAccessToken(user);
                    const refreshToken = generateRefreshToken(user);
                    user["refreshToken"] = refreshToken;
                    user["active"] = true;
                    await updateUser(user);
                    await removeRegisterHash(user);
                    res.cookie("jwta", accessToken, {
                        domain: process.env.BASE_URL,
                        httpOnly: true,
                        maxAge: 600000,
                    });
                    res.cookie("jwtr", refreshToken, {
                        domain: process.env.BASE_URL,
                        httpOnly: true,
                        maxAge: 60 * 60 * 1000,
                    });
                    res.json({
                        userId: user._id,
                        username: user.userDisplayName,
                        changePassword: user.changePassword,
                        type: user.type,
                    });
                } else {
                    res.status(401).send("The activation code is incorrect.");
                }
            } else if (!user.active) {
                res.status(401).send(
                    "The user needs to be activated. Please check your email for the activation code."
                );
            } else {
                console.log("The password is correct.");
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                user["refreshToken"] = refreshToken;
                await updateUser(user);
                res.cookie("jwta", accessToken, {
                    domain: process.env.BASE_URL,
                    httpOnly: true,
                    maxAge: 600000,
                });
                res.cookie("jwtr", refreshToken, {
                    domain: process.env.BASE_URL,
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000,
                });
                res.json({
                    userId: user._id,
                    username: user.userDisplayName,
                    changePassword: user.changePassword,
                    type: user.type,
                });
            }
        }
    }
};

const changeUserPassword = async (req, res) => {
    const id = req.body.userId;
    const user = (await queryUserById(id))[0];

    if (user.type === "google") {
        res.status(400).send("This account is managed by Google.");
    } else {
        const validateStatus = validateChangePassword(req.body);
        if (!validateStatus.status) {
            res.status(500).send(validateStatus.error);
        } else if (user === undefined) {
            res.status(400).send("Unable to find user");
        } else if (
            !(await bcrypt.compare(req.body.currentPassword, user.password))
        ) {
            res.status(403).send("The current password is incorrect.");
        } else {
            console.log("The password is correct.");
            const newPassword = await bcrypt.hash(req.body.newPassword, 15);
            user["password"] = newPassword;
            if (req.body.changePassword) {
                user["changePassword"] = false;
            }
            await updateUser(user);
            res.sendStatus(200);
        }
    }
};

const resetUserPassword = async (req, res) => {
    const user = await queryUserByEmail(req.body.email);

    if (user === null || user === undefined) {
        res.status(401).send(
            "This account does not exist. Please make a new account."
        );
    } else {
        if (req.body.username === user.username) {
            const tempPass = randomBytes(8).toString("hex");
            user["password"] = await bcrypt.hash(tempPass, 15);
            user["changePassword"] = true;
            await updateUser(user);
            await sendTempPassword(user.username, user.email, tempPass);
            res.send("A temporary password has been sent to your email.");
        }
    }
};

const logoutUser = async (req, res) => {
    const user = (await queryUserById(req.body.userId))[0];
    user["refreshToken"] = "";
    await updateUser(user);
    if (req.cookies) {
        res.clearCookie("jwta");
        res.clearCookie("jwtr");
        res.clearCookie("jwtg");
    }
    res.send("User has been logged out.");
};

const deleteAccount = async (req, res) => {
    try {
        await removeReminderByUserId(req.body.userId);
        const result = await deleteUser(req.body.userId);
        if (result.deletedCount === 1) {
            res.clearCookie("jwta");
            res.clearCookie("jwtr");
            res.clearCookie("jwtg");
            res.send(result);
        } else {
            res.status(500).send("Unable to delete user.");
        }
    } catch (err) {
        res.send(err);
    }
};

export {
    addUser,
    loginUser,
    changeUserPassword,
    resetUserPassword,
    logoutUser,
    deleteAccount,
};
