const allowedOrigins = [
    "http://localhost:3000",
    "https://mrreminder.xyz",
    "http://mrreminder.xyz",
];

const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
};

export { corsOptions };
