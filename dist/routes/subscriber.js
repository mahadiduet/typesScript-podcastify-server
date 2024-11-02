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
const subscriber_1 = __importDefault(require("../models/subscriber"));
const router = (0, express_1.Router)();
// Add a Subscription
router.post('/subscriptions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { podcasterId, podcasterUid, subscriberEmail } = req.body;
        // Check if already subscribed
        const existingSubscription = yield subscriber_1.default.findOne({
            podcasterId,
            subscriberEmail,
        });
        if (existingSubscription) {
            res.status(200).send({ message: 'Already subscribed' });
            return;
        }
        // Create and save the new subscription
        const newSubscriber = new subscriber_1.default({
            podcasterId,
            podcasterUid,
            subscriberEmail,
        });
        const result = yield newSubscriber.save();
        res.status(200).send({ message: 'Subscription added successfully', data: result });
    }
    catch (error) {
        console.error('Error adding subscription:', error);
        res.status(500).send({ error: 'Failed to add subscription' });
    }
}));
// Get Total Subscribers
router.get('/totalSubscriber', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield subscriber_1.default.find().exec();
        res.status(200).send({ subscribers });
    }
    catch (error) {
        console.error('Error fetching total subscribers:', error);
        res.status(500).send({ error: 'Failed to fetch total subscribers' });
    }
}));
// Get My Subscriptions by Email
router.get('/mySubscription/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const subscriptions = yield subscriber_1.default.find({ subscriberEmail: email }).exec();
        res.status(200).send({ subscriptions });
    }
    catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).send({ error: 'Failed to fetch subscriptions' });
    }
}));
exports.default = router;
