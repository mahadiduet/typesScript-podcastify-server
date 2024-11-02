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
const Playlist_1 = require("../models/Playlist");
const router = (0, express_1.Router)();
// Add to Playlist
router.post('/playlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { music_id, title, user_email } = req.body;
        const query = { user_email, music_id };
        const existingPlaylist = yield Playlist_1.Playlist.findOne(query);
        if (existingPlaylist) {
            return res.send({
                message: 'Podcast already exists in playlist.',
                insertedId: null,
            });
        }
        const playlistData = new Playlist_1.Playlist({
            user_email,
            music_id,
            title,
        });
        const result = yield playlistData.save();
        res.status(200).send({ message: 'Playlist added successfully', data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to add playlist' });
    }
}));
// Manage Playlist
router.get('/manage-playlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, page = '0', limit = '5' } = req.query;
    if (!userEmail) {
        return res.status(400).send({ message: 'Email is required' });
    }
    const skip = parseInt(page) * parseInt(limit);
    try {
        const playlist = yield Playlist_1.Playlist.find({ user_email: userEmail })
            .skip(skip)
            .limit(parseInt(limit))
            .exec();
        const total = yield Playlist_1.Playlist.countDocuments({ user_email: userEmail });
        res.status(200).send({ playlist, total });
    }
    catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).send({ message: 'Failed to fetch playlist' });
    }
}));
// Delete Playlist Item
router.delete('/playlist/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item_id = new mongoose_1.default.Types.ObjectId(req.params.id);
        const result = yield Playlist_1.Playlist.deleteOne({ _id: item_id });
        if (!result.deletedCount) {
            return res.status(404).send({ message: 'Playlist item not found' });
        }
        res.send({ message: 'Playlist podcast deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting playlist item:', error);
        res.status(500).send({ message: 'Server error' });
    }
}));
exports.default = router;
