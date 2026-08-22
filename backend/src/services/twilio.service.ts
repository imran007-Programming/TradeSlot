const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
const ultraMsgToken = process.env.ULTRAMSG_TOKEN;

export const sendWhatsAppMessage = async (
  toPhoneNumber: string,
  messageBody: string
) => {
  try {
    const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
    const body = new URLSearchParams({
      token: ultraMsgToken!,
      to: toPhoneNumber,
      body: messageBody,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await response.json() as any;

    if (data.sent === "true" || data.id) {
      return { success: true, messageSid: data.id };
    } else {
      return { success: false, error: JSON.stringify(data) };
    }
  } catch (error) {
    return { success: false, error: (error as any).message };
  }
};

export const verifyTwilioWebhook = (
  token: string,
  expectedToken: string
): boolean => {
  return token === expectedToken;
};

export const twilioService = {
  sendWhatsAppMessage,
  verifyTwilioWebhook,
};
