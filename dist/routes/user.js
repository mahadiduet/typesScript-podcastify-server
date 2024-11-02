"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// Get total number of users
router.get('/admin-stats', verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.estimatedDocumentCount();
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving user count' });
    }
}));
// Retrieve all users
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().exec();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
}));
// Get users who requested to be a podcaster
router.get('/request-podcaster', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const podcasterRequests = yield User_1.default.find({ flag: true }).exec();
        res.json(podcasterRequests);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving requests' });
    }
}));
// Update user role and flag
router.put('/users/request/:email', verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { flag, role } = req.body;
    try {
        const result = yield User_1.default.updateOne({ email }, { $set: { flag, role } });
        if (result.modifiedCount > 0) {
            res.json({ message: 'User updated successfully' });
        }
        else {
            res.status(404).json({ message: 'User not found or no changes made' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}));
// Add a user to the database on login
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email: user.email });
        if (existingUser) {
            return res.json({ message: 'User already exists', insertedId: null });
        }
        const newUser = new User_1.default(user);
        const result = yield newUser.save();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving user' });
    }
}));
// Delete a user
router.delete('/users/:id', verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
        const user = yield User_1.default.findById(id);
        const result = yield User_1.default.deleteOne({ _id: id });
        if (user && user.uid) {
            yield admin.auth().deleteUser(user.uid); // Assuming Firebase Admin SDK is configured
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
}));
// Get a single user by email
router.get('/users/email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield User_1.default.findOne({ email });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving user' });
    }
}));
// Update user data by email
router.put('/users/email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const { name, username, phoneNumber } = req.body;
    try {
        const result = yield User_1.default.updateOne({ email }, { $set: { name, username, phoneNumber } });
        if (result.modifiedCount > 0) {
            res.json({ message: 'User updated successfully' });
        }
        else {
            res.status(404).json({ message: 'User not found or no changes made' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}));
exports.default = router;
