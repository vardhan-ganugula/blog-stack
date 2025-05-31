import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  HashedPassword,
  verificationToken as generateVerificationToken,
  verificationTokenExpires as generateVerificationTokenExpires,
  decodeToken,
} from "../services/auth.service.js";
import { ACCESS_EXPIRES, REFRESH_EXPIRES } from "../constants/constants.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import { sendVerificationEmail } from "../services/email.service.js";

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const response = loginSchema.safeParse(req.body);
  if (!response.success) {
    const errors = response.error.errors.map((error) => error.message);
    return res.status(400).json({ message: errors.join(", ") });
  }
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: 0, message: "User not found" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid credentials" });
    }

    const session = await sessionModel.create({
      userId: user._id,
      userAgent: req.headers["user-agent"],
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.ip,
    });

    if (!session) {
      return res.status(500).json({ message: "Error creating session" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      sessionId: session._id,
      username: user.username,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      sessionId: session._id,
    });

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_EXPIRES,
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_EXPIRES,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.verified,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
export async function register(req, res) {
  const { name: username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const response = registerSchema.safeParse(req.body);
  if (!response.success) {
    const errors = response.error.errors.map((error) => error.message);
    return res.status(400).json({ message: errors.join(", ") });
  }
  try {
    const user = await userModel.find({ email });
    if (user.length > 0) {
      return res
        .status(400)
        .json({ success: 0, message: "User already exists " });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  const verificationToken = generateVerificationToken();
  const verificationTokenExpires = generateVerificationTokenExpires();
  try {
    const newUser = await userModel.create({
      username,
      password: await HashedPassword(password),
      email,
      verificationToken,
      verificationTokenExpires,
    });
    const user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified,
      profilePicture: newUser.profilePicture,
    };

    const session = await sessionModel.create({
      userId: newUser._id,
      userAgent: req.headers["user-agent"],
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.ip,
    });

    if (!session) {
      return res.status(500).json({ message: "Error creating session" });
    }

    const accessToken = generateAccessToken({
      id: newUser._id,
      sessionId: session._id,
      username: newUser.username,
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken({
      id: newUser._id,
      sessionId: session._id,
    });

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_EXPIRES,
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_EXPIRES,
    });
    try {
      await sendVerificationEmail(email, newUser.verificationToken);
    } catch (error) {
      console.error("Error sending verification email:", error);
      return res
        .status(500)
        .json({ message: "Error sending verification email" });
    }
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
}
export async function logout(req, res) {
  const refreshToken = req.cookies["refresh-token"];
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const sessionId = decodeToken(refreshToken).sessionId;
    const session = await sessionModel.findOneAndDelete({ _id: sessionId });
    if (!session) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ status: 0, message: "Token is required" });
  }
  try {
    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ status: 0, message: "Invalid or expired token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return res
      .status(200)
      .json({ status: 1, message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 0, message: "Internal server error" });
  }
}

export async function handleVerificationEmail(req, res) {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const verificationToken = generateVerificationToken();
  const verificationTokenExpires = generateVerificationTokenExpires();
  try {
    const user = await userModel.find({ email });
    if (!user) {
      return res.status(400).json({ status: 0, message: "User not found" });
    }
    if (user.verified) {
      return res
        .status(400)
        .json({ status: 0, message: "User already verified" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    await sendVerificationEmail(email, verificationToken);
    const newUser = await userModel.findOneAndUpdate(
      { email },
      { verificationToken, verificationTokenExpires },
      { new: true }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res
      .status(500)
      .json({ status: 0, message: "Error sending verification email" });
  }
  return res
    .status(200)
    .json({ status: 1, message: "Verification email sent successfully" });
}

function parseUserAgent(ua) {
  let os = "Unknown OS";

  if (/Windows NT 10.0/.test(ua)) os = "Windows 10";
  else if (/Windows NT 6.3/.test(ua)) os = "Windows 8.1";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone/.test(ua)) os = "iOS";


  return os;
}


export async function getUserSessions(req, res) {
  const userId = req.user._id;
  try {
    const sessions = await sessionModel
      .find({ userId })
      .sort({ createdAt: -1 });
    
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: "No active sessions found" });
    }
    const result = sessions.map((session) => {
      const obj = session.toObject();
      const date = new Date(session.createdAt).toLocaleString()
      obj.device = parseUserAgent(session.userAgent);
      obj.lastActive = date;
      
      obj.valid = new Date(session.createdAt) > new Date(Date.now() - 15 * 60 * 1000); 

      return obj;
    })
    return res.status(200).json({ sessions : result });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
