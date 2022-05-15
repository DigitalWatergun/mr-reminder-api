import { Reminder } from "../models/reminder.js";

const queryAllRemindersByUserId = async (id) => {
    const reminders = await Reminder.find({ userId: id });

    return reminders;
};

const findReminderById = async (id) => {
    const reminder = await Reminder.findOne({ _id: id });

    return reminder;
};

const filterReminders = async (filter) => {
    const reminders = await Reminder.find(filter);

    return reminders;
};

const updateReminder = async (data) => {
    const filter = {
        _id: data._id,
    };
    const reminder = await Reminder.findOneAndUpdate(filter, data);

    return reminder;
};

const createReminder = async (data) => {
    try {
        const newReminder = Reminder({
            _id: data._id,
            title: data.title,
            content: data.content,
            dateEnable: data.dateEnable,
            date: data.date,
            timeEnable: data.timeEnable,
            timeZone: data.timeZone,
            time: data.time,
            utcDateTime: data.utcDateTime,
            minutes: data.minutes,
            hour: data.hour,
            day: data.day,
            month: data.month,
            weekday: data.weekday,
            status: data.status,
            email: data.email,
            mobile: data.mobile,
            repeatEnable: data.repeatEnable,
            repeat: data.repeat,
            enableSMS: data.enableSMS,
            enableEmail: data.enableEmail,
            userId: data.userId,
        });

        const reminder = await newReminder.save();

        return reminder;
    } catch (err) {
        console.log(err);
        return err;
    }
};

const removeReminder = async (id) => {
    try {
        await Reminder.deleteOne({ _id: id });

        return "Successfully deleted reminder.";
    } catch (err) {
        console.log(err);
        return err;
    }
};

const removeReminderByUserId = async (userId) => {
    try {
        await Reminder.deleteMany({ userId: userId });

        return `Successfully deleted all reminders for ${userId}`;
    } catch (err) {
        return err;
    }
};

export {
    queryAllRemindersByUserId,
    createReminder,
    removeReminder,
    findReminderById,
    filterReminders,
    updateReminder,
    removeReminderByUserId,
};
