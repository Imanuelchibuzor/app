import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { User, UserDocument } from "../../models/user";
import AppError from "../../configs/error";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  language?: string;
  avatar?: { id?: string; url?: string } | null;
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new AppError("Missing Google OAuth credentials", 500, {
    code: "MISSING_GOOGLE_CONFIG",
    isOperational: false,
  });
}
if (!JWT_SECRET) {
  throw new AppError("Missing JWT_SECRET", 500, {
    code: "MISSING_JWT_SECRET",
    isOperational: false,
  });
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

function createToken(user: UserDocument): string {
  return jwt.sign({ id: user._id }, JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

// Convert mongoose user doc to a safe payload for response
function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id as string,
    name: user.name,
    email: user.email,
    language: user.language,
    avatar: user.avatar ?? null,
  };
}

/**
 * Exchange authorization code for tokens and verify id_token payload.
 * Returns payload with sub (googleId), email, name, picture.
 */
async function exchangeCodeAndVerify(code: string, redirectUri: string) {
  // Exchange code for tokens
  const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
  const idToken = tokens.id_token;
  if (!idToken) throw new AppError("No id_token received from Google", 401, { code: "NO_ID_TOKEN" });

  // Verify id_token and get payload
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub) {
    throw new AppError("Invalid Google id_token payload", 401, { code: "INVALID_ID_TOKEN" });
  }

  return {
    googleId: payload.sub,
    email: payload.email ?? "",
    name: payload.name ?? "",
    picture: payload.picture,
  };
}

/**
 * Find or create (or link) a user given Google profile info.
 * - If googleId exists -> return that user.
 * - Else if email exists -> link googleId to existing user.
 * - Else -> create new user with googleId and emailVerified true.
 */
async function findOrCreateUserFromGoogle(profile: {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}) {
  const { googleId, email, name, picture } = profile;

  // Try find by googleId first
  let user = await User.findOne({ googleId });
  if (user) return user;

  // If not found by googleId, try by email
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      // Link googleId to this existing account (common and user-friendly)
      user.googleId = googleId;
      // set avatar if missing
      if (!user.avatar || !user.avatar.url) user.avatar = { url: picture ?? "", id: "" };
      await user.save();
      return user;
    }
  }

  // Create new user
  const newUser = await User.create({
    name: name || "Unknown",
    email: email,
    googleId,
    password: "", // no password for social login
    avatar: { url: picture ?? "", id: "" },
    language: "en",
  });

  return newUser;
}

// Handle the backend callback flow: exchange code -> verify -> find/create user -> return token & user

export async function handleGoogleCallback(code: string, redirectUri: string): Promise<{ token: string; user: string; redirectUrl?: string }> {
  if (!code) throw new AppError("Missing authorization code", 400, { code: "MISSING_CODE" });

  const profile = await exchangeCodeAndVerify(code, redirectUri);
  const user = await findOrCreateUserFromGoogle(profile);
  const token = createToken(user);
  const safeUser = JSON.stringify(toSafeUser(user));

  return { token, user: safeUser };
}
