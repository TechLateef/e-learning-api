"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_entity_1 = require("../entities/auth.entity");
class AuthService {
    constructor() { }
    /**
     *@description create new user
     * @param userData object- username, email and passord
     * @returns
     */
    async createUser(userData) {
        const newUser = await auth_entity_1.Auth.create({ ...userData });
        await newUser.save();
        return newUser;
    }
    /**
     * @description login user using email and password
     * @param email user email address
     * @param password user 8 digit password
     * @returns Json Web Token
     */
    async login(email, password) {
        try {
            const isUser = await auth_entity_1.Auth.findOne({ email });
            if (!isUser) {
                throw new Error('Invalid email or password');
            }
            const isPassword = await isUser.matchPassword(password);
            if (!isPassword) {
                throw new Error('Invalid email or password');
            }
            return isUser.getSignedToken();
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * @description Create/Edit user profile
     * @param userData user data to be updated
     * @param userId user uniquier Id
     * @returns boolean
     */
    async editProfile(userData, userId) {
        const updatedUser = await auth_entity_1.Auth.findByIdAndUpdate(userId, { ...userData });
        if (!updatedUser) {
            throw new Error('Error updating Profile if this continue please contact our support');
        }
        return true;
    }
    /**
     * @description Fetch user using the provided username
     * @param username userName: string
     * @returns user Data
     */
    async getUserByUsername(username) {
        const isUser = await auth_entity_1.Auth.findOne({ username });
        if (!isUser) {
            throw new Error(`Can not find User with the username: ${username} `);
        }
        return isUser;
    }
    /**
     * @description follow or unfollow user
     * @param userId string
     * @param currentUser Auth
     * @returns
     */
    async followOrUnfollow(userId, currentUser) {
        try {
            // Prevent users from following themselves
            if (userId === currentUser.id) {
                throw new Error("Users cannot follow or unfollow themselves.");
            }
            // Check if the user to be followed/unfollowed exists
            const targetUser = await auth_entity_1.Auth.findById(userId);
            if (!targetUser) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            // Check if the current user exists
            const authUser = await auth_entity_1.Auth.findById(currentUser.id);
            if (!authUser) {
                throw new Error(`Current user with ID ${currentUser.id} not found.`);
            }
            // Determine follow/unfollow action based on existing relationship
            const isFollowing = targetUser.followers.includes(currentUser.id);
            if (!isFollowing) {
                // Add follower to target user and add following to current user
                await Promise.all([
                    targetUser.updateOne({ $push: { followers: currentUser.id } }),
                    authUser.updateOne({ $push: { following: userId } })
                ]);
                return true; // Successfully followed
            }
            else {
                // Remove follower from target user and remove following from current user
                await Promise.all([
                    targetUser.updateOne({ $pull: { followers: currentUser.id } }),
                    authUser.updateOne({ $pull: { following: userId } })
                ]);
                return false; // Successfully unfollowed
            }
        }
        catch (error) {
            console.error("Error in followOrUnfollow:", error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
