const onlyLettersAndNumbers = (string) => {
    return /^[A-Za-z\d\s.]*$/.test(string);
};

const validateUsername = (string) => {
    return /^[A-Za-z\d.]*$/.test(string);
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

const validatePassword = (pass) => {
    if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/.test(pass)) {
        return true;
    } else {
        return false;
    }
};

const validateUserRegister = (body) => {
    const result = {};
    switch (true) {
        case !("username" in body) ||
            !("password" in body) ||
            !("confirmPassword" in body) ||
            !("email" in body):
            result["error"] = "There can be no blank fields";
            result["status"] = false;
            break;
        case !validateUsername(body.username):
            result["error"] = "Username cannot have spaces";
            result["status"] = false;
            break;
        case !validatePassword(body.password):
            result["error"] = "Password requirements not met";
            result["status"] = false;
            break;
        case body.password !== body.confirmPassword:
            result["error"] = "Passwords do not match!";
            result["status"] = false;
            break;
        case !validateEmail(body.email):
            result["error"] = "Please enter a valid email address";
            result["status"] = false;
            break;
        default:
            result["status"] = true;
            break;
    }

    return result;
};

const validateChangePassword = (body) => {
    const result = {};
    switch (true) {
        case !("currentPassword" in body) ||
            !("newPassword" in body) ||
            !("confirmNewPassword" in body):
            result["error"] = "There can be no blank fields";
            result["status"] = false;
            break;
        case !validatePassword(body.newPassword):
            result["error"] = "Password requirements not met";
            result["status"] = false;
            break;
        case body.newPassword !== body.confirmNewPassword:
            result["error"] = "Passwords do not match!";
            result["status"] = false;
            break;
        default:
            result["status"] = true;
            break;
    }

    return result;
};

const validateReminderForm = (body) => {
    const result = {};

    switch (true) {
        case !body.title:
            result["error"] = "Title of reminder cannot be blank";
            result["status"] = false;
            break;
        case !onlyLettersAndNumbers(body.title):
            result["error"] = "Title can only be letters and numbers";
            result["status"] = false;
            break;
        case !onlyLettersAndNumbers(body.content):
            result["error"] = "Content can only be letters and numbers";
            result["status"] = false;
            break;
        case !body.dateEnable && !body.repeatEnable:
            result["error"] = "Please enter a date or a timer";
            result["status"] = false;
            break;
        case body.dateEnable && !body.date:
            result["error"] = "Please enter a date";
            result["status"] = false;
            break;
        case body.timeEnable && !body.time:
            result["error"] = "Please enter a time";
            result["status"] = false;
            break;
        case body.repeatEnable && !body.minutes:
            result["error"] = "Please enter # of minutes";
            result["status"] = false;
            break;
        case body.repeatEnable && !body.repeat:
            result["error"] = "Please enter your repeat count";
            result["status"] = false;
            break;
        case body.enableSMS && !validateMobile(body.mobile):
            result["error"] = "Please enter a valid mobile number";
            result["status"] = false;
            break;
        case body.enableEmail && !validateEmail(body.email):
            result["error"] = "Please enter a valid email";
            result["status"] = false;
            break;
        case !body.enableEmail && !body.enableSMS:
            result["error"] = "You need to enable at least email or SMS";
            result["status"] = false;
            break;
        default:
            result["status"] = true;
            break;
    }

    return result;
};

export {
    validateEmail,
    validatePassword,
    validateMobile,
    validateUserRegister,
    validateChangePassword,
    validateReminderForm,
};
