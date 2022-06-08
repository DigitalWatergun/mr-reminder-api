import { User } from "../models/users.js";

const queryUserById = async (id) => {
    const user = await User.find({ _id: id });

    return user;
};

const queryUserByUsername = async (username, type) => {
    const user = await User.find({ username, type });

    return user;
};

const queryUserByEmail = async (email) => {
    const user = await User.findOne({ email: email });

    return user;
};

const queryOrCreateUserById = async (googleUser) => {
    const user = await queryUserByEmail(googleUser.email);

    if (!user) {
        const newUser = {
            _id: googleUser.id,
            type: "google",
            active: true,
            username: googleUser.email.split("@")[0],
            userDisplayName: googleUser.given_name,
            email: googleUser.email,
        };
        const user = await createUser(newUser);
        return user;
    }

    return user;
};

const createUser = async (data) => {
    try {
        const newUser = User({
            _id: data._id,
            active: data.active,
            username: data.username,
            userDisplayName: data.userDisplayName,
            password: data.password,
            email: data.email,
            registerHash: data.registerHash,
        });

        await newUser.save();

        return `Successfully added new user ${data.username}.`;
    } catch (err) {
        return { error: err };
    }
};

const updateUser = async (data) => {
    const user = await User.findByIdAndUpdate(data._id, data);

    return user;
};

const removeRegisterHash = async (data) => {
    const user = await User.findByIdAndUpdate(data._id, {
        $unset: { registerHash: "" },
    });
    return user;
};

const deleteUser = async (userId) => {
    const result = await User.deleteOne({ _id: userId });

    return result;
};

export {
    queryUserById,
    queryUserByUsername,
    queryUserByEmail,
    queryOrCreateUserById,
    createUser,
    updateUser,
    removeRegisterHash,
    deleteUser,
};
