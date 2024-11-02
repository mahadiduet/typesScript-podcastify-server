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
const reaction_1 = __importDefault(require("../models/reaction"));
const router = (0, express_1.Router)();
// Add a Reaction
router.post('/notification-reaction', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { react, postId, name, email } = req.body;
        // Create and save the new reaction
        const reactionData = new reaction_1.default({
            react,
            postId,
            name,
            email,
        });
        const result = yield reactionData.save();
        res.status(200).send({ message: 'Reaction added successfully', data: result });
    }
    catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).send({ error: 'Failed to add reaction' });
    }
}));
// Get Reactions by Post ID
router.get('/notification-reaction/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: postId } = req.params;
        const reactions = yield reaction_1.default.find({ postId }).exec();
        res.status(200).send({ reactions });
    }
    catch (error) {
        console.error('Error fetching reactions:', error);
        res.status(500).send({ error: 'Failed to fetch reactions' });
    }
}));
exports.default = router;
