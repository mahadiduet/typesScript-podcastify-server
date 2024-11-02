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
const review_1 = __importDefault(require("../models/review"));
const router = (0, express_1.Router)();
// Add a Review
router.post('/addReview', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedback, rating, podcastId, displayName, email, photoURL } = req.body;
        // Create and save the new review
        const reviewData = new review_1.default({
            feedback,
            rating,
            podcastId,
            displayName,
            email,
            photoURL,
        });
        const result = yield reviewData.save();
        res.status(200).send({ message: 'Review added successfully', data: result });
    }
    catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send({ error: 'Failed to add review' });
    }
}));
// Get All Reviews
router.get('/allReviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_1.default.find().exec();
        res.status(200).send({ reviews });
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send({ error: 'Failed to fetch reviews' });
    }
}));
exports.default = router;
