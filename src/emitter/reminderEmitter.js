import EventEmitter from "events";
import { PubSub } from "@google-cloud/pubsub";
import { changeReminderStatus } from "../controllers/reminderController.js";
import dotenv from "dotenv";
dotenv.config();

const eventEmitter = new EventEmitter();

eventEmitter.on("test", () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`[${currentTime}] Testing EventEmitter using GET Request`);
});

eventEmitter.on("RUN", async (reminder) => {
    changeReminderStatus(reminder, "ACTIVE");

    const cronSchedule = `${reminder.minutes} ${reminder.hour} ${reminder.day} ${reminder.month} ${reminder.weekday}`;
    console.log(
        `[${new Date().toLocaleTimeString()}] Emitted RUN event. REMINDER: ${
            reminder.title
        } - ${reminder.content}. Cronschedule: ${cronSchedule}`
    );

    const data = JSON.stringify(reminder);
    const dataBuffer = Buffer.from(data);
    const customAttributes = { eventType: "RUN" };
    const pubSubClient = new PubSub({ projectId: process.env.GCP_PROJECT_ID });

    try {
        await pubSubClient
            .topic(process.env.PUBSUB_TOPIC)
            .publishMessage({ data: dataBuffer, attributes: customAttributes });
    } catch (err) {
        console.log(err);
    } finally {
        pubSubClient.close();
    }
});

eventEmitter.on("STOP", async (reminder) => {
    const data = JSON.stringify(reminder);
    const dataBuffer = Buffer.from(data);
    const customAttributes = { eventType: "STOP" };
    const pubSubClient = new PubSub();

    try {
        await pubSubClient
            .topic(process.env.PUBSUB_TOPIC)
            .publishMessage({ data: dataBuffer, attributes: customAttributes });
    } catch (err) {
        console.log(err);
    } finally {
        pubSubClient.close();
        changeReminderStatus(reminder, "INACTIVE");
    }
});

export { eventEmitter };
