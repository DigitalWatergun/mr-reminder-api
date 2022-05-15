import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
    addUser,
    loginUser,
    changeUserPassword,
    resetUserPassword,
    logoutUser,
    deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(addUser).delete(deleteAccount);
router.post("/login", loginUser);
router.post("/update", verifyJWT, changeUserPassword);
router.post("/logout", logoutUser);
router.post("/reset", resetUserPassword);

export { router as usersRoute };
