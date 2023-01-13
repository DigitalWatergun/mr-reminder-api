# mr-reminder-api

Codebase for Mr Reminder API Backend

### Architecture Diagram

![arch_diagram](https://github.com/DigitalWatergun/mr-reminder-api/blob/main/diagram/MrReminder_Architecture_Diagram.png)

Backend is written in NodeJS and takes care of all the user/reminder CRUD operations. 
Authentication is handled using jsonwebtokens and bcrypt. Oauth is used for Google Auth.
Reminders are then sent the Google PubSub in order to be added to the job queue.
