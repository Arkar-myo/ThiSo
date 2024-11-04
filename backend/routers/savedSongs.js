const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { auth } = require("../middlewares/auth");

// Create a saved song
router.post("/", auth, async (req, res) => {
    const { songId } = req.body;
    const user = res.locals.user;

    if (!songId) {
        return res.status(400).json({ msg: "Song ID is required" });
    }

    try {
        const savedSong = await prisma.savedSong.create({
            data: {
                userId: user.id,
                songId,
            },
        });
        res.status(201).json(savedSong);
    } catch (e) {
        console.error('❌ POST /saved-songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get all saved songs for a user
router.get("/", auth, async (req, res) => {
    const user = res.locals.user;

    try {
        const savedSongs = await prisma.savedSong.findMany({
            where: { userId: user.id },
            include: {
                song: true, // Include song details
            },
        });
        res.json(savedSongs);
    } catch (e) {
        console.error('❌ GET /saved-songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Delete a saved song
router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const user = res.locals.user;

    try {
        const deletedSavedSong = await prisma.savedSong.deleteMany({
            where: {
                songId: id,
                userId: user.id,
            },
        });

        if (deletedSavedSong.count === 0) {
            return res.status(404).json({ msg: "Saved song not found" });
        }

        res.sendStatus(204);
    } catch (e) {
        console.error('❌ DELETE /saved-songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get a specific saved song
router.get("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const user = res.locals.user;

    try {
        const savedSong = await prisma.savedSong.findUnique({
            where: {
                id,
            },
            include: {
                song: true,
            },
        });

        if (!savedSong || savedSong.userId !== user.id) {
            return res.status(404).json({ msg: "Saved song not found" });
        }

        res.json(savedSong);
    } catch (e) {
        console.error('❌ GET /saved-songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

module.exports = { savedSongsRouter: router }; 