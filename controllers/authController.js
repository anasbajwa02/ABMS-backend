const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email }).populate({
      path: "roles",
      populate: { path: "permissions" },
    });
    
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    // create JWT payload
    const payload = {
      id: user._id,
      roles: user.roles.map((r) => r.name),
      permissions: user.roles.flatMap((r) =>
        r.permissions.map((p) => p.name)
      ),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production (https)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: payload.roles,
      },
    });
  } catch (error) {
    next(error);
  }
};


// logout route

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
