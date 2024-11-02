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
const mongoose_1 = __importDefault(require("mongoose"));
const Announcement_1 = __importDefault(require("../models/Announcement"));
const router = (0, express_1.Router)();
// Add an Announcement
router.post('/announcement', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, email, description } = req.body;
        const announcementData = new Announcement_1.default({
            title,
            email,
            description,
        });
        const result = yield announcementData.save();
        res.status(200).send({ message: 'Announcement added successfully', data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to add announcement' });
    }
}));
// Get All Announcements
router.get('/announcements', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcements = yield Announcement_1.default.find().exec();
        res.status(200).send({ announcements });
    }
    catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).send({ message: 'Failed to fetch announcements' });
    }
}));
// Get Announcement by ID
router.get('/announcement/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const announcement = yield Announcement_1.default.findById(req.params.id).exec();
        if (!announcement) {
            return res.status(404).send({ message: 'Announcement not found' });
        }
        res.status(200).send({ announcement });
    }
    catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).send({ message: 'Failed to fetch announcement' });
    }
}));
// Delete Announcement by ID
router.delete('/announcement/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Announcement_1.default.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Announcement not found' });
        }
        res.status(200).send({ message: 'Announcement deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).send({ message: 'Failed to delete announcement' });
    }
}));
exports.default = router;
