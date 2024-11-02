import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/User';
import Podcast from './models/podcast';
import playlistRoutes from './routes/playlist';
import announcementRoutes from './routes/announcement';
import reactionRoutes from './routes/reaction';
import reviewRoutes from './routes/review';
import subscriberRoutes from './routes/subscriber';
import contactMessageRoutes from './routes/contactMessage';
import userRoutes from './routes/user';

dotenv.config();

const app: Express = express();
// const app: Application = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Express And Typescript Server Running....');
});

const uri = "mongodb+srv://podcastify:XkLFI6W2yCRQ4MoQ@cluster0.lyuai16.mongodb.net/podcastify?retryWrites=true&w=majority";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            serverApi: { version: '1', strict: true, deprecationErrors: true }
        });

        // Check the connection using a ping
        const isConnected = await mongoose.connection.db.admin().ping();
        console.log("Pinged your deployment:", isConnected);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    } finally {
        // Optionally close the connection here if you need
        // await mongoose.disconnect();
    }
}
run().catch(console.dir);

app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Server error");
    }
});

// ====================Podcast Start====================
app.get("/manage-podcast", async(req: Request, res: Response) => {
    const { userEmail, page = 0, limit = 5 } = req.query;

    if (!userEmail) {
        return res.status(400).send({ message: "Email is required" });
    }
    const skip = parseInt(page as string) * parseInt(limit as string);
    try {
        const podcasts = await Podcast.find({ userEmail })
            .skip(skip)
            .limit(parseInt(limit as string));

        const total = await Podcast.countDocuments({ userEmail });
        res.status(200).send({ podcasts, total });
    } catch (error) {
        console.error("Error fetching podcasts:", error);
        res.status(500).send({ message: "Failed to fetch podcasts" });
    }
});

app.post("/upload", async (req: Request, res: Response) => {
    try {
        const { title, musician, description, coverImage, audioFile, releaseDate, category, userEmail, tags } = req.body;
        const tagsArray = Array.isArray(tags) ? tags : tags.split(",").map((tag: string) => tag.trim());
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
        const result = await Podcast.create(musicData);
        res.status(200).send({ message: "Music uploaded successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to upload podcast" });
    }
});

app.delete("/podcast/:id", async (req: Request, res: Response) => {
    try {
        const podcastId = req.params.id;
        const result = await Podcast.findByIdAndDelete(podcastId);

        if (!result) return res.status(404).send("Music not found");
        res.send({ message: "Music deleted successfully" });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

app.get("/podcast/:id", async (req: Request, res: Response) => {
    const podcastId = req.params.id;

    try {
        const podcast = await Podcast.findById(podcastId);
        if (!podcast) return res.status(404).json({ error: "Podcast not found" });
        res.json(podcast);
    } catch (error) {
        console.error("Error fetching podcast:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.put("/podcast/:id", async (req: Request, res: Response) => {
    const podcastId = req.params.id;
    const { title, musician, description, coverImage, audioFile, releaseDate, category, userEmail, tags } = req.body;

    const tagsArray = Array.isArray(tags) ? tags : tags.split(",").map((tag: string) => tag.trim());

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
        const result = await Podcast.findByIdAndUpdate(podcastId, updateData, { new: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to update podcast" });
    }
});

app.get("/podcast", async (req: Request, res: Response) => {
    const { search, category, language } = req.query;
    const query: any = {};

    if (search) {
        query.title = { $regex: search as string, $options: "i" };
    }

    if (category) {
        query.category = category;
    }

    if (language) {
        query.tags = { $regex: language as string, $options: "i" };
    }

    try {
        const podcasts = await Podcast.find(query).sort({ _id: -1 });
        res.status(200).send(podcasts);
    } catch (error) {
        console.error("Error fetching podcasts:", error);
        res.status(500).send({ message: "Failed to fetch podcasts" });
    }
});

app.get("/trendingPodcasts", async (req: Request, res: Response) => {
    try {
        const podcasts = await Podcast.find().sort({ upVote: -1 });
        res.send(podcasts);
    } catch (error) {
        res.status(500).send("Server error");
    }
});
// ====================Podcast End======================

app.use('/', playlistRoutes);
app.use('/', announcementRoutes);
app.use('/', reactionRoutes);
app.use('/', reviewRoutes);
app.use('/', subscriberRoutes);
app.use('/', contactMessageRoutes);
app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
