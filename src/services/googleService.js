import axios from "axios";
import qs from "qs";

const getGoogleOAuthTokens = async (code) => {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: `${process.env.CLIENT_BASE_URL}/users/login/google`,
        grant_type: "authorization_code",
    };

    try {
        const response = await axios.post(url, qs.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};

const getGoogleUser = async (idToken, accessToken) => {
    try {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export { getGoogleOAuthTokens, getGoogleUser };
