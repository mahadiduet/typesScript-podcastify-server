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
const contactMessage_1 = __importDefault(require("../models/contactMessage"));
const router = (0, express_1.Router)();
// Save a contact message
router.post('/contact-message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const contactMessage = new contactMessage_1.default(data);
        const result = yield contactMessage.save();
        res.status(201).send({ message: 'Message sent successfully', data: result });
    }
    catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).send({ error: 'Failed to send message' });
    }
}));
// Retrieve all contact messages
router.get('/contact-message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield contactMessage_1.default.find().exec();
        res.status(200).send({ messages });
    }
    catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).send({ error: 'Failed to retrieve messages' });
    }
}));
exports.default = router;
