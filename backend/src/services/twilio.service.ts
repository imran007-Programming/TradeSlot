import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (
  toPhoneNumber: string,
  messageBody: string
) => {
  try {
    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      body: messageBody,
      to: `whatsapp:${toPhoneNumber}`,
    });

    return {
      success: true,
      messageSid: message.sid,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as any).message,
    };
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
