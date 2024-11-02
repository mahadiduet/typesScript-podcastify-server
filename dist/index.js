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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const User_1 = __importDefault(require("./models/User"));
const podcast_1 = __importDefault(require("./models/podcast"));
const playlist_1 = __importDefault(require("./routes/playlist"));
const announcement_1 = __importDefault(require("./routes/announcement"));
const reaction_1 = __importDefault(require("./routes/reaction"));
const review_1 = __importDefault(require("./routes/review"));
const subscriber_1 = __importDefault(require("./routes/subscriber"));
const contactMessage_1 = __importDefault(require("./routes/contactMessage"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// const app: Application = express();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Express And Typescript Server Running....');
});
const uri = "mongodb+srv://podcastify:XkLFI6W2yCRQ4MoQ@cluster0.lyuai16.mongodb.net/podcastify?retryWrites=true&w=majority";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(uri, {
                serverApi: { version: '1', strict: true, deprecationErrors: true }
            });
            // Check the connection using a ping
            const isConnected = yield mongoose_1.default.connection.db.admin().ping();
            console.log("Pinged your deployment:", isConnected);
        }
        catch (error) {
            console.error("Failed to connect to MongoDB:", error);
        }
        finally {
            // Optionally close the connection here if you need
            // await mongoose.disconnect();
        }
    });
}
run().catch(console.dir);
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        console.log(users);
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Server error");
    }
}));
// ====================Podcast Start====================
app.get("/manage-podcast", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, page = 0, limit = 5 } = req.query;
    if (!userEmail) {
        return res.status(400).send({ message: "Email is required" });
    }
    const skip = parseInt(page) * parseInt(limit);
    try {
        const podcasts = yield podcast_1.default.find({ userEmail })
            .skip(skip)
            .limit(parseInt(limit));
        const total = yield podcast_1.default.countDocuments({ userEmail });
        res.status(200).send({ podcasts, total });
    }
    catch (error) {
        console.error("Error fetching podcasts:", error);
        res.status(500).send({ message: "Failed to fetch podcasts" });
    }
}));
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, musician, description, coverImage, audioFile, releaseDate, category, userEmail, tags } = req.body;
        const tagsArray = Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim());
        const musicData = {
            title,
            musician,
            description,
            coverImageUrl: coverImage,
            audioFileUrl: audioFile,
            releaseDate: new Date(releaseDate),
            category,
            userEmail,
            tags: tagsArray,
        };
        const result = yield podcast_1.default.create(musicData);
        res.status(200).send({ message: "Music uploaded successfully", data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to upload podcast" });
    }
}));
app.delete("/podcast/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const podcastId = req.params.id;
        const result = yield podcast_1.default.findByIdAndDelete(podcastId);
        if (!result)
            return res.status(404).send("Music not found");
        res.send({ message: "Music deleted successfully" });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
app.get("/podcast/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const podcastId = req.params.id;
    try {
        const podcast = yield podcast_1.default.findById(podcastId);
        if (!podcast)
            return res.status(404).json({ error: "Podcast not found" });
        res.json(podcast);
    }
    catch (error) {
        console.error("Error fetching podcast:", error);
        res.status(500).json({ error: "Server error" });
    }
}));
app.put("/podcast/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const podcastId = req.params.id;
    const { title, musician, description, coverImage, audioFile, releaseDate, category, userEmail, tags } = req.body;
    const tagsArray = Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim());
    const updateData = {
        title,
        musician,
        description,
        coverImageUrl: coverImage,
        audioFileUrl: audioFile,
        releaseDate: new Date(releaseDate),
        category,
        userEmail,
        tags: tagsArray,
    };
    try {
        const result = yield podcast_1.default.findByIdAndUpdate(podcastId, updateData, { new: true });
        res.send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to update podcast" });
    }
}));
app.get("/podcast", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category, language } = req.query;
    const query = {};
    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    if (category) {
        query.category = category;
    }
    if (language) {
        query.tags = { $regex: language, $options: "i" };
    }
    try {
        const podcasts = yield podcast_1.default.find(query).sort({ _id: -1 });
        res.status(200).send(podcasts);
    }
    catch (error) {
        console.error("Error fetching podcasts:", error);
        res.status(500).send({ message: "Failed to fetch podcasts" });
    }
}));
app.get("/trendingPodcasts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const podcasts = yield podcast_1.default.find().sort({ upVote: -1 });
        res.send(podcasts);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
// ====================Podcast End======================
app.use('/', playlist_1.default);
app.use('/', announcement_1.default);
app.use('/', reaction_1.default);
app.use('/', review_1.default);
app.use('/', subscriber_1.default);
app.use('/', contactMessage_1.default);
app.use('/', user_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
