import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    _id: String,
    title: String,
    content: String,
    dateEnable: Boolean,
    date: String,
    timeEnable: Boolean,
    time: String,
    utcDateTime: String,
    minutes: String,
    hour: String,
    day: String,
    month: String,
    weekday: String,
    status: String,
    email: String,
    mobile: String,
    repeatEnable: Boolean,
    repeat: Number,
    enableSMS: Boolean,
    enableEmail: Boolean,
    userId: String,
});

const Reminder = mongoose.model("Reminder", reminderSchema);

export { Reminder };
