import { Router, type Router as ExpressRouter } from "express";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { Resend } from "resend";
import { UserService } from "@repo/db";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const router: ExpressRouter = Router();
const userService = new UserService();
const resend = new Resend(process.env["RESEND_API_KEY"]);
const FROM = process.env["RESEND_FROM"] ?? "onboarding@resend.dev";

const secret = new TextEncoder().encode(process.env["JWT_SECRET"] ?? "");

const signupBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinBody = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

const otpBody = z.object({
  userId: z.string().min(1),
  otp: z.string().length(6),
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function makeToken(id: string, name: string, rememberMe = false) {
  return new SignJWT({ id, name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(rememberMe ? "30d" : "7d")
    .sign(secret);
}

// POST /auth/signup — create unverified user, send OTP
router.post("/signup", async (req, res) => {
  const parsed = signupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Valid name, email and password (min 6 chars) required" });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await userService.getUserByName(name.trim());
  if (existing) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }

  const id = uuidv4();
  const hashed = await bcrypt.hash(password, 10);
  await userService.createUser(id, name.trim(), hashed);

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  await userService.setOtp(id, email, otp, expiresAt);

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your Meet verification code",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2 style="color:#800020">Verify your Meet account</h2>
        <p>Hi <strong>${name}</strong>, use this code to verify your account:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#800020;padding:20px 0">${otp}</div>
        <p style="color:#666">This code expires in <strong>10 minutes</strong>.</p>
      </div>
    `,
  });

  res.status(201).json({ pending: true, userId: id });
});

// POST /auth/verify-otp — verify OTP, return token
router.post("/verify-otp", async (req, res) => {
  const parsed = otpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "userId and 6-digit OTP required" });
    return;
  }

  const { userId, otp } = parsed.data;

  const valid = await userService.verifyOtp(userId, otp);
  if (!valid) {
    res.status(401).json({ error: "Invalid or expired OTP" });
    return;
  }

  await userService.markVerified(userId);

  const user = await userService.getUser(userId) as { id: string; name: string } | undefined;
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const token = await makeToken(user.id, user.name);
  res.json({ user: { id: user.id, name: user.name }, token });
});

// POST /auth/signin — sign in with username + password
router.post("/signin", async (req, res) => {
  const parsed = signinBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "name and password required" });
    return;
  }

  const { name, password, rememberMe } = parsed.data;

  const found = await userService.getUserByName(name.trim());
  if (!found || !found.password) {
    res.status(404).json({ error: "No account found. Create one?", redirect: "signup" });
    return;
  }

  const valid = await bcrypt.compare(password, found.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = await makeToken(found.id, found.name, rememberMe);
  res.json({ user: { id: found.id, name: found.name }, token });
});

export { router as authRoutes };
