import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Plan from './Plan.js';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure emails are unique
        trim: true,
        lowercase: true, // Ensure email is lowercase
    },
    password: {
        type: String,
    },
    verificationCode: {
        type: Number,
    },
    verificationCodeTimestamp: { // Add a timestamp field
        type: Date,
    },
    registerType: {
        type: String,
        required: true,
        enum: ['local', 'google'],  // Ensure the register type is either local or google
    },
    googleId: {
        type: String,  // Store Google ID if user logs in via Google
    },
    refreshToken: {
        type: String,
    },
    active: {
        type: Boolean,
        require: true,
        default: false,
    },
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // If password is not modified, skip hashing

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
});

userSchema.methods.isVerificationCodeExpired = function () {
    const expirationTime = 1 * 60 * 1000; // 1 minute in milliseconds
    const currentTime = new Date().getTime();
    const codeGeneratedTime = new Date(this.verificationCodeTimestamp).getTime();

    return (currentTime - codeGeneratedTime) > expirationTime;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password); // Compare the plain password with the hashed password
    } catch (err) {
        throw new Error('Password comparison failed');
    }
};

// userSchema.post('save', async function (doc, next) {
//     try {
//         // Prevent duplicate stat creation on updates
//         const exists = await UserMessageStat.findOne({ userId: doc._id });
//         if (exists) return next();

//         const plan = await Plan.findOne({ value: "starter" });
//         if (!plan) return next(new Error("Starter plan not found"));

//         await UserMessageStat.create({
//             userId: doc._id,
//             planId: plan._id,
//             messageCountInWindow: 0,
//             messageWindowDayIndex: 0,
//         });

//         next();
//     } catch (err) {
//         next(err);
//     }
// });
// Create the User model using the schema
const User = mongoose.model('User', userSchema);

export default User;
