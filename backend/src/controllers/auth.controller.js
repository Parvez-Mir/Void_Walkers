import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Something went wrong while generating refresh and access token");
    }
}

export const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, username, password } = req.body;

        if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existedUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existedUser) {
            return res.status(409).json({ success: false, message: "User with email or username already exists" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            username: username.toLowerCase()
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ success: false, message: "Something went wrong while registering the user" });
        }

        return res.status(201).json({ success: true, data: createdUser, message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        if (!username && !email) {
            return res.status(400).json({ success: false, message: "username or email is required" });
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid user credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res
            .status(200)
            .json({
                success: true,
                data: { user: loggedInUser, accessToken, refreshToken },
                message: "User logged in successfully"
            });
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        return res
            .status(200)
            .json({ success: true, message: "User logged out" });
    } catch (error) {
        next(error);
    }
};

export const refreshAccessToken = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.body.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!incomingRefreshToken) {
            return res.status(401).json({ success: false, message: "Unauthorized request" });
        }

        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            const user = await User.findById(decodedToken?._id);

            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid refresh token" });
            }

            if (incomingRefreshToken !== user?.refreshToken) {
                return res.status(401).json({ success: false, message: "Refresh token is expired or used" });
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

            return res
                .status(200)
                .json({
                    success: true,
                    data: { accessToken, refreshToken: newRefreshToken },
                    message: "Access token refreshed"
                });

        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        data: req.user,
        message: "Current user fetched successfully"
    });
};
