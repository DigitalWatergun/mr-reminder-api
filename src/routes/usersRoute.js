import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
    addUser,
    loginUser,
    changeUserPassword,
    resetUserPassword,
    logoutUser,
    deleteAccount,
    loginWithGoogle,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login/google", loginWithGoogle);
router.post("/", addUser);
router.post("/login", loginUser);
router.post("/update", verifyJWT, changeUserPassword);
router.post("/logout", logoutUser);
router.post("/reset", resetUserPassword);
router.delete("/", verifyJWT, deleteAccount);

export { router as usersRoute };
