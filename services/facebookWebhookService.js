import axios from "axios";

export const sendMessage = async (senderId, responseText, pageAccessToken) => {
    try {
        await axios.post(
            `https://graph.facebook.com/v22.0/me/messages?access_token=${pageAccessToken}`,
            {
                recipient: { id: senderId },
                message: { text: responseText }
            }
        );
    } catch (error) {
        console.error(error)
    }
}

export const sendPhoto = async (senderId, pageAccessToken, imageUrl) => {
    try {
        await axios.post(
            `https://graph.facebook.com/v22.0/me/messages?access_token=${pageAccessToken}`,
            {
                recipient: { id: senderId },
                message: {
                    attachment: {
                        type: "image",
                        payload: {
                            url: imageUrl,
                            is_reusable: true
                        }
                    }
                }
            }
        );
    } catch (error) {
        console.error(error)
    }
}
