import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env["GOOGLE_CLIENT_ID"]);

export const getPayload = async (
  credential: string
): Promise<TokenPayload | undefined> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env["GOOGLE_CLIENT_ID"],
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    throw err;
  }
};
