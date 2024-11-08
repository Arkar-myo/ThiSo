const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth")
const router = express.Router();
const prisma = require("../prismaClient");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate reset password token
function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

// First, let's define a constant for public user fields
const PUBLIC_USER_FIELDS = {
    id: true,
    username: true,
    created: true,
    updatedAt: true,
};

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('❌ POST /login - Error: Missing credentials');
        return res.status(400).json({ msg: "email and password required" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (user && user.verified && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );
            // Only return public user data
            const publicUserData = {
                id: user.id,
                username: user.username,
                created: user.created,
                updatedAt: user.updatedAt,
            };
            // Include userType if the user is an admin
            const responseData = user.userType === 'admin' ? { token, user: { ...publicUserData, userType: user.userType } } : { token, user: publicUserData };
            console.log('✅ POST /login - Success:', { email: user.email });
            return res.json(responseData);
        }
        console.log('❌ POST /login - Error: Invalid credentials');
        res.status(401).json({ msg: "incorrect email or password" });
    } catch (e) {
        console.error('❌ POST /login - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/users", auth, async (req, res) => {
    try {
        const data = await prisma.user.findMany({
            select: PUBLIC_USER_FIELDS,
            orderBy: { id: "desc" },
            take: 20,
        });
        console.log('✅ GET /users - Success:', { users_length: data.length });
        res.json(data);
    } catch (e) {
        console.error('❌ GET /users - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/users/profile", auth, async (req, res) => {
    const user = res.locals.user;
    try {
        const data = await
            prisma.user.findUnique({
                where: { id: user.id },
                // select: {
                //     ...PUBLIC_USER_FIELDS,
                //     email,
                //     songs: {
                //         select: {
                //             id: true,
                //             title: true,
                //             singer: true,
                //             writer: true,
                //             album: true,
                //             key: true,
                //             tempo: true,
                //             viewCount: true,
                //             created: true,
                //             updatedAt: true,
                //         },
                //         orderBy: {
                //             updatedAt: 'desc'
                //         }
                //     },
                //     songLikes: {
                //         select: {
                //             id: true,
                //             songId: true,
                //             created: true,
                //         },
                //         orderBy: {
                //             created: 'desc'
                //         },
                //         take: 5
                //     },
                // },
            });
        if (!data) {
            console.log('❌ GET /users/:id - Error: User not found');
            return res.status(404).json({ msg: "User not found" });
        }
        console.log('✅ GET /users/:id - Success:', { id: data.id, username: data.username });
        res.json(data);
    } catch (e) {
        console.error('❌ GET /users/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.post("/users", async (req, res) => {
    const { email, username, password } = req.body;
    const userType = req.body?.userType;
    if (!email || !username || !password) {
        console.log('❌ POST /users - Error: Missing required fields');
        return res.status(400).json({ msg: "email, username and password required" });
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        const verificationCode = generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        const hash = await bcrypt.hash(password, 10);
        const userData = {
            email,
            username,
            password: hash,
            userType,
            verified: false,
            verificationCode,
            verificationExpires
        }
        let user;
        if (existingUser && !existingUser.verified) {
            user = await prisma.user.update({
                where: { username },
                data: userData
            });
        } else if (existingUser && existingUser.verified) {
            console.log('❌ POST /users - Error: Username already exists');
            return res.status(400).json({ msg: "Username already exists" });
        } else {
            user = await prisma.user.create({
                data: userData
            });
        }

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verify your ThiSo account',
            html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify your ThiSo account</title>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f9fafb;
                      }
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 40px 20px;
                      }
                      .card {
                        background-color: white;
                        border-radius: 8px;
                        padding: 32px;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                      }
                      .logo {
                        text-align: center;
                        margin-bottom: 24px;
                        color: #4f46e5;
                        font-size: 24px;
                        font-weight: bold;
                      }
                      .title {
                        color: #111827;
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 16px;
                      }
                      .code {
                        background-color: #f3f4f6;
                        border-radius: 6px;
                        padding: 16px;
                        text-align: center;
                        font-size: 32px;
                        font-weight: 600;
                        letter-spacing: 0.1em;
                        color: #4f46e5;
                        margin: 24px 0;
                      }
                      .text {
                        color: #4b5563;
                        margin-bottom: 24px;
                      }
                      .footer {
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                        margin-top: 32px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="card">
                        <div class="logo">ThiSo</div>
                        <div class="title">Verify your email address</div>
                        <p class="text">
                          Thanks for signing up! Please use the verification code below to complete your registration.
                        </p>
                        <div class="code">${verificationCode}</div>
                        <p class="text">
                          This code will expire in 30 minutes. If you didn't create an account, you can safely ignore this email.
                        </p>
                        <div class="footer">
                          © ${new Date().getFullYear()} ThiSo. All rights reserved.
                        </div>
                      </div>
                    </div>
                  </body>
                </html>
            `
        });

        const { password: _, verificationCode: __, ...publicUserData } = user;
        // Only return necessary user data
        const responseData = {
            id: publicUserData.id,
            username: publicUserData.username,
            created: publicUserData.created,
            updatedAt: publicUserData.updatedAt,
        };

        console.log('✅ POST /users - Success:', { username: user.username });
        res.json({ user: responseData, message: 'Verification code sent to email' });
    } catch (e) {
        console.error('❌ POST /users - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/verify", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) {
            console.log('❌ GET /verify - Error: No user found');
            return res.status(401).json({ msg: "Authentication required" });
        }

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: PUBLIC_USER_FIELDS,
        });

        if (!userData) {
            console.log('❌ GET /verify - Error: User not found in database');
            return res.status(401).json({ msg: "User not found" });
        }

        console.log('✅ GET /verify - Success:', { username: userData.username });
        res.json(userData);
    } catch (e) {
        console.error('❌ GET /verify - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.post("/follow/:id", auth, async (req, res) => {
    const user = res.locals.user;
    const { id } = req.params;

    try {
        // Check if user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!targetUser) {
            console.log('❌ POST /follow/:id - Error: Target user not found');
            return res.status(404).json({ msg: "User to follow not found" });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: id,
            }
        });

        if (existingFollow) {
            console.log('❌ POST /follow/:id - Error: Already following');
            return res.status(400).json({ msg: "Already following this user" });
        }

        const data = await prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: id,
            },
        });
        console.log('✅ POST /follow/:id - Success:', { id: data.id, followerId: data.followerId, followingId: data.followingId });
        res.json(data);
    } catch (e) {
        console.error('❌ POST /follow/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.delete("/unfollow/:id", auth, async (req, res) => {
    const user = res.locals.user;
    const { id } = req.params;

    try {
        // Check if user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!targetUser) {
            console.log('❌ DELETE /unfollow/:id - Error: Target user not found');
            return res.status(404).json({ msg: "User to unfollow not found" });
        }

        const result = await prisma.follow.deleteMany({
            where: {
                followerId: user.id,
                followingId: id,
            },
        });

        if (result.count === 0) {
            console.log('❌ DELETE /unfollow/:id - Error: Not following');
            return res.status(400).json({ msg: "Not following this user" });
        }

        console.log('✅ DELETE /unfollow/:id - Success:', { id: Number(id) });
        res.json({ msg: `Unfollowed user ${id}` });
    } catch (e) {
        console.error('❌ DELETE /unfollow/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/users/search", async (req, res) => {
    const { q } = req.query;

    if (!q) {
        console.log('❌ GET /search - Error: Missing search query');
        return res.status(400).json({ msg: "Search query is required" });
    }

    try {
        const data = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ],
            },
            select: PUBLIC_USER_FIELDS,
            take: 20,
        });
        console.log('✅ GET /search - Success:', { users_length: data.length });
        res.json(data);
    } catch (e) {
        console.error('❌ GET /search - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.post("/verify-email", async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ msg: "Email and verification code required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (user.verified) {
            return res.status(400).json({ msg: "Email already verified" });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ msg: "Invalid verification code" });
        }

        if (new Date() > user.verificationExpires) {
            return res.status(400).json({ msg: "Verification code expired" });
        }

        await prisma.user.update({
            where: { email },
            data: {
                verified: true,
                verificationCode: null,
                verificationExpires: null
            }
        });
        console.log('✅ POST /verify-email - Success:');
        res.json({ msg: "Email verified successfully" });
    } catch (e) {
        console.error('❌ POST /verify-email - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
    const { email, frontendBaseUri } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Email is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const resetToken = generateResetToken();
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Reset your ThiSo password',
            html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset your ThiSo password</title>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f9fafb;
                      }
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 40px 20px;
                      }
                      .card {
                        background-color: white;
                        border-radius: 8px;
                        padding: 32px;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                      }
                      .logo {
                        text-align: center;
                        margin-bottom: 24px;
                        color: #4f46e5;
                        font-size: 24px;
                        font-weight: bold;
                      }
                      .title {
                        color: #111827;
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 16px;
                      }
                      .text {
                        color: #4b5563;
                        margin-bottom: 24px;
                      }
                      .button {
                        display: inline-block;
                        background-color: #4f46e5;
                        color: white !important;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        font-weight: 500;
                        margin: 24px 0;
                      }
                      .button:hover {
                        background-color: #4338ca;
                      }
                      .link {
                        color: #4f46e5;
                        word-break: break-all;
                      }
                      .footer {
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                        margin-top: 32px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="card">
                        <div class="logo">ThiSo</div>
                        <div class="title">Reset Your Password</div>
                        <p class="text">
                          You requested to reset your password. Click the button below to set a new password:
                        </p>
                        <a href="${frontendBaseUri}/reset-password?token=${resetToken}" class="button">
                          Reset Password
                        </a>
                        <p class="text">
                          If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p class="link">
                          ${frontendBaseUri}/reset-password?token=${resetToken}
                        </p>
                        <p class="text">
                          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
                        </p>
                        <div class="footer">
                          © ${new Date().getFullYear()} ThiSo. All rights reserved.
                        </div>
                      </div>
                    </div>
                  </body>
                </html>
            `
        });
        console.log('✅ POST /forgot-password - Success: Sent Email: ', {email: email});
        res.json({ msg: "Password reset instructions sent to email" });
    } catch (e) {
        console.error('❌ POST /forgot-password - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Change Password
router.get("/change-password", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const resetToken = generateResetToken();
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        console.log('check toke--> ', resetToken)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires
            }
        });
        console.log('✅ POST /change-password - Success');
        return res.json({token: resetToken});
    } catch (e) {
        console.error('❌ POST /change-password - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Reset password
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ msg: "Token and new password are required" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired reset token" });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hash,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.json({ msg: "Password has been reset successfully" });
    } catch (e) {
        console.error('❌ POST /reset-password - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

module.exports = { userRouter: router };




