import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import UserPlan from "../models/UserPlan.js";
import { MS_PER_DAY } from "../middleware/messagesLimit.js";
import { getUsageMsg } from "../services/profileService.js";

export const getUserPlan = async (req, res) => {
    try {
        const userId = req.user.id;

        const userPlan = await UserPlan.findOne({ userId }).populate('planId').populate('userId');

        const userCreatedTime = userPlan.userId.createdAt;
        const userPlanLimit = userPlan.planId.limit.messages;

        const now = new Date();
        const daysSinceRegistration = Math.floor((now - userCreatedTime) / MS_PER_DAY);

        let count = await getUsageMsg(userId, daysSinceRegistration);

        return res.status(200).json({ usage: parseInt(count) || 0, limit: userPlanLimit });
    } catch (error) {
        console.error('Error fetching user plan:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('_id fullName email').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ data: user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const updateProfile = async (req, res) => {
    const { fullName, password } = req.body;  // Extract new data from the request body

    try {
        // Get the user from the request (assuming user info is stored in req.user after authentication)
        const userId = req.user.id;

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fullName if provided
        if (fullName) {
            user.fullName = fullName;
        }

        // Update password if provided and validate the password
        if (password) {
            // Make sure the password is at least 6 characters long (you can add other validations as needed)
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }

            // Hash the new password before saving it
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user
        await user.save();

        // Return success response
        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};