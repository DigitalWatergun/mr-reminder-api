import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
    getAllRemindersForUser,
    postReminder,
    deleteReminder,
    getReminderById,
    changeReminder,
    runReminder,
    stopReminder,
} from "../controllers/reminderController.js";

const router = express.Router();

router.use(verifyJWT);

router
    .route("/")
    .get(getAllRemindersForUser)
    .post(postReminder)
    .delete(deleteReminder);
router.get("/title", getReminderById);
router.post("/run", runReminder);
router.post("/stop", stopReminder);
router.patch("/update", changeReminder);

export { router as remindersRoute };
