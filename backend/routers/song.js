const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { auth, isOwner } = require("../middlewares/auth");
const savedSongs = require("./savedSongs");

const PUBLIC_USER_FIELDS = {
    select: {
        id: true,
        username: true,
    }
};

const SONG_SELECT_FIELDS = {
    select: {
        id: true,
        title: true,
        singer: true,
        writer: true,
        album: true,
        key: true,
        tempo: true,
        viewCount: true,
        created: true,
        updatedAt: true,
        userId: true,
        user: {
            select: {
                id: true,
                username: true
            }
        },
        songLikes: true,
        savedSongs: true
    }
};

// Create a new song
router.post("/songs", auth, async (req, res) => {
    const { title, singer, writer, album, body, key, tempo, userId } = req.body;
    if (!title || !body) {
        return res.status(400).json({ msg: "Title, body, and userId are required" });
    }
    try {
        const song = await prisma.song.create({
            data: {
                title,
                singer,
                writer,
                album,
                body,
                key,
                tempo: tempo ? parseInt(tempo) : null,
                userId,
            },
        });
        console.log('✅ POST /songs - Success:', { id: song.id, title: song.title });
        res.status(201).json(song);
    } catch (e) {
        console.error('❌ POST /songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get all songs with pagination
router.get("/songs", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    try {
        const [songs, totalCount] = await Promise.all([
            prisma.song.findMany({
                select: SONG_SELECT_FIELDS.select,
                orderBy: { created: "desc" },
                take: limit,
                skip: skip,
            }),
            prisma.song.count() // Get total count for pagination
        ]);

        console.log(`✅ GET /songs - Success: Retrieved ${songs.length} songs (page ${page})`);
        res.json({
            songs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalSongs: totalCount,
                hasMore: skip + songs.length < totalCount
            }
        });
    } catch (e) {
        console.error('❌ GET /songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get songs by search query
router.get("/songs/search", async (req, res) => {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!q) {
        return res.json({ songs: [], pagination: { currentPage: 1, totalPages: 0, totalSongs: 0, hasMore: false } });
    }

    try {
        const [songs, totalCount] = await Promise.all([
            prisma.song.findMany({
                where: {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { singer: { contains: q, mode: 'insensitive' } },
                        { writer: { contains: q, mode: 'insensitive' } },
                        { album: { contains: q, mode: 'insensitive' } }
                    ]
                },
                select: SONG_SELECT_FIELDS.select,
                orderBy: {
                    created: 'desc'
                },
                take: limit,
                skip: skip
            }),
            prisma.song.count({
                where: {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { singer: { contains: q, mode: 'insensitive' } },
                        { writer: { contains: q, mode: 'insensitive' } },
                        { album: { contains: q, mode: 'insensitive' } }
                    ]
                }
            })
        ]);

        const formattedSongs = songs.map(song => ({
            ...song,
            user: {
                id: song.user.id,
                username: song.user.username
            },
            likeCount: song.songLikes.length
        }));

        res.json({
            songs: formattedSongs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalSongs: totalCount,
                hasMore: skip + songs.length < totalCount
            }
        });
    } catch (e) {
        console.error('❌ GET /songs/search - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Add this new route for featured songs
router.get("/songs/featured", async (req, res) => {
    try {
        const songs = await prisma.song.findMany({
            select: SONG_SELECT_FIELDS.select,
            orderBy: {
                songLikes: {
                    _count: 'desc'
                },
            },
            take: 6, // Limit to 6 featured songs
        });

        // Add like count to each song
        const songsWithLikeCount = songs.map(song => ({
            ...song,
            likeCount: song.songLikes.length
        }));

        console.log(`✅ GET /songs/featured - Success: Retrieved ${songs.length} featured songs`);
        res.json(songsWithLikeCount);
    } catch (e) {
        console.error('❌ GET /songs/featured - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get popular songs (based on overall engagement)
router.get("/songs/popular", async (req, res) => {
    try {
        const songs = await prisma.song.findMany({
            select: SONG_SELECT_FIELDS.select,
            orderBy: [
                { songLikes: { _count: 'desc' } }
            ],
            take: 10
        });
        console.log(`✅ GET /songs/popular - Success: Retrieved ${songs.length} popular songs`);
        res.json(songs);
    } catch (e) {
        console.error('❌ GET /songs/popular - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get most viewed songs
router.get("/songs/most-viewed", async (req, res) => {
    try {
        const songs = await prisma.song.findMany({
            select: SONG_SELECT_FIELDS.select,
            orderBy: {
                viewCount: 'desc'
            },
            take: 10
        });

        // Format the response to include like count
        const formattedSongs = songs.map(song => ({
            ...song,
            likeCount: song.songLikes.length
        }));

        console.log(`✅ GET /songs/most-viewed - Success: Retrieved ${songs.length} most viewed songs`);
        res.json(formattedSongs);
    } catch (e) {
        console.error('❌ GET /songs/most-viewed - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get most liked songs
router.get("/songs/most-liked", async (req, res) => {
    try {
        const songs = await prisma.song.findMany({
            select: SONG_SELECT_FIELDS.select,
            take: 10
        });

        console.log(`✅ GET /songs/most-liked - Success: Retrieved ${songs.length} most liked songs`);
        res.json(songs);
    } catch (e) {
        console.error('❌ GET /songs/most-liked - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/songs/featured-artists", async (req, res) => {
    try {
        const artists = await prisma.song.groupBy({
            by: ['singer'],
            _count: {
                id: true,
            },
            where: {
                singer: {
                    not: null
                }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 10,
        });

        const formattedArtists = await Promise.all(
            artists.map(async (artist) => {
                const songs = await prisma.song.findMany({
                    where: {
                        singer: artist.singer
                    },
                    select: SONG_SELECT_FIELDS.select,
                    take: 3,
                    orderBy: [
                        {
                            songLikes: {
                                _count: 'desc'
                            }
                        }
                    ]
                });

                const totalLikes = await prisma.songLike.count({
                    where: {
                        song: {
                            singer: artist.singer
                        }
                    }
                });

                return {
                    id: artist.singer,
                    name: artist.singer,
                    songCount: artist._count.id,
                    likeCount: totalLikes,
                    songs: songs.map(song => ({
                        id: song.id,
                        title: song.title,
                        singer: song.singer,
                        writer: song.writer,
                        album: song.album,
                        key: song.key,
                        tempo: song.tempo,
                        viewCount: song.viewCount,
                        created: song.created,
                        updatedAt: song.updatedAt,
                        userId: song.userId,
                        user: song.user,
                        likeCount: song.songLikes.length
                    }))
                };
            })
        );

        res.json(formattedArtists);
    } catch (e) {
        console.error('❌ GET /songs/featured-artists - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/songs/posted-songs", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const songs = await prisma.song.findMany({
            where: {
                userId: user.id,
            },
            select: SONG_SELECT_FIELDS.select,
            orderBy: { created: "desc" },

        });

        console.log(`✅ GET /songs/posted-songs - Success: Retrieved ${songs.length} posted songs`);
        res.json(songs);
    } catch (e) {
        console.error('❌ GET /songs/posted-songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/songs/saved-songs", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const songs = await prisma.song.findMany({
            where: {
                savedSongs: {
                    some: {
                        userId: user.id,
                    },
                },
            },
            select: SONG_SELECT_FIELDS.select,
            orderBy: { created: "desc" },
        });
        console.log(`✅ GET /songs/saved-songs - Success: Retrieved ${songs.length} saved songs`);
        res.json(songs);
    } catch (e) {
        console.error('❌ GET /songs/saved-songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

router.get("/songs/liked-songs", auth, async (req, res) => {
    try {
        const user = res.locals.user;
        const songs = await prisma.song.findMany({
            where: {
                songLikes: {
                    some: {
                        userId: user.id,
                    },
                },
            },
            select: SONG_SELECT_FIELDS.select,
            orderBy: { created: "desc" },
        });

        console.log(`✅ GET /songs/liked-songs - Success: Retrieved ${songs.length} liked songs`);
        res.json(songs);
    } catch (e) {
        console.error('❌ GET /songs/liked-songs - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get a specific song
router.get("/songs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const song = await prisma.song.findUnique({
            where: { id: id }
        });
        const updatedSong = await prisma.song.update({
            where: { id: id },
            data: {
                viewCount: (song.viewCount || 0) + 1
            },
            include: {
                user: PUBLIC_USER_FIELDS,
                songLikes: true,
                savedSongs: true,
            },
        });
        if (!updatedSong) {
            console.log('✅ GET /songs/:id - Success: Song not found');
            return res.status(404).json({ msg: "Song not found" });
        }
        console.log('✅ GET /songs/:id - Success:', { id: updatedSong.id, title: updatedSong.title, viewCount: updatedSong.viewCount });
        res.json(updatedSong);
    } catch (e) {
        console.error('❌ GET /songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Update a song
router.put("/songs/:id", auth, isOwner("song"), async (req, res) => {
    const { id } = req.params;
    const { title, singer, writer, album, body, key, tempo } = req.body;
    try {
        const updatedSong = await prisma.song.update({
            where: { id: id },
            data: {
                title,
                singer,
                writer,
                album,
                body,
                key,
                tempo: tempo ? parseInt(tempo) : null,
            },
        });
        console.log('✅ PUT /songs/:id - Success:', { id: updatedSong.id, title: updatedSong.title });
        res.json(updatedSong);
    } catch (e) {
        console.error('❌ PUT /songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Delete a song
router.delete("/songs/:id", auth, isOwner("song"), async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.song.delete({
            where: { id: id },
        });
        console.log('✅ DELETE /songs/:id - Success:', { id: id });
        res.sendStatus(204);
    } catch (e) {
        console.error('❌ DELETE /songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Like a song
router.post("/like/songs/:id", auth, async (req, res) => {
    const { id } = req.params;
    const user = res.locals.user;
    try {
        const like = await prisma.songLike.create({
            data: {
                songId: id,
                userId: user.id,
            },
        });
        console.log('✅ POST /like/songs/:id - Success:', { id: like.id, songId: like.songId, userId: like.userId });
        res.json({ like });
    } catch (e) {
        console.error('❌ POST /like/songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Unlike a song
router.delete("/unlike/songs/:id", auth, async (req, res) => {
    const { id } = req.params;
    const user = res.locals.user;
    try {
        await prisma.songLike.deleteMany({
            where: {
                songId: id,
                userId: user.id,
            },
        });
        console.log('✅ DELETE /unlike/songs/:id - Success:', { id: id });
        res.json({ msg: `Unliked song ${id}` });
    } catch (e) {
        console.error('❌ DELETE /unlike/songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get likes for a song
router.get("/likes/songs/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const likes = await prisma.songLike.findMany({
            where: {
                songId: id,
            },
            include: {
                user: PUBLIC_USER_FIELDS,
            },
        });
        console.log('✅ GET /likes/songs/:id - Success:', { likes_length: likes.length });
        res.json(likes);
    } catch (e) {
        console.error('❌ GET /likes/songs/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Add this new route for song stats
// router.get("/songs/:id/stats", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const likes = await prisma.songLike.count({
//             where: { songId: id }
//         });

//         const plays = await prisma.songPlay.count({
//             where: { songId: id }
//         });

//         const comments = await prisma.songComment.count({
//             where: { songId: id }
//         });

//         res.json({
//             likeCount: likes,
//             viewCount: plays,
//             commentCount: comments
//         });
//     } catch (e) {
//         console.error('❌ GET /songs/:id/stats - Error:', e.message);
//         res.status(500).json({ error: e.message });
//     }
// });

// Create a song report
router.post("/songs/:id/report", auth, async (req, res) => {
    const { id } = req.params;

    const { reason, description } = req.body;
    const user = res.locals.user;

    if (!reason) {
        return res.status(400).json({ msg: "Reason is required" });
    }

    try {
        // Check if user has already reported this song
        const existingReport = await prisma.songReport.findFirst({
            where: {
                song: { id: id },
                user: { id: user?.id },
                status: "PENDING"
            }
        });

        if (existingReport) {
            return res.status(400).json({ msg: "You have already reported this song" });
        }

        const report = await prisma.songReport.create({
            data: {
                reason,
                description,
                song: {
                    connect: { id: id }
                },
                user: {
                    connect: { id: user?.id }
                }
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                song: {
                    select: {
                        title: true
                    }
                }
            }
        });

        console.log('✅ POST /songs/:id/report - Success:', { id: report.id, songId: id });
        res.status(201).json(report);
    } catch (e) {
        console.error('❌ POST /songs/:id/report - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Get all reports (admin only)
router.get("/reports", auth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'PENDING';

    try {
        const [reports, totalCount] = await Promise.all([
            prisma.songReport.findMany({
                where: {
                    status: status
                },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    },
                    song: {
                        select: {
                            title: true,
                            singer: true
                        }
                    }
                },
                orderBy: { created: "desc" },
                take: limit,
                skip: skip,
            }),
            prisma.songReport.count({
                where: {
                    status: status
                }
            })
        ]);

        console.log(`✅ GET /reports - Success: Retrieved ${reports.length} reports`);
        res.json({
            reports,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalReports: totalCount,
                hasMore: skip + reports.length < totalCount
            }
        });
    } catch (e) {
        console.error('❌ GET /reports - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Update report status (admin only)
router.put("/reports/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'REVIEWED', 'RESOLVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ msg: "Invalid status" });
    }

    try {
        const report = await prisma.songReport.update({
            where: { id },
            data: { status },
            include: {
                song: {
                    select: {
                        title: true
                    }
                }
            }
        });

        console.log('✅ PATCH /reports/:id - Success:', { id, status });
        res.json(report);
    } catch (e) {
        console.error('❌ PATCH /reports/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Delete a report (admin only)
router.delete("/reports/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.songReport.delete({
            where: { id }
        });

        console.log('✅ DELETE /reports/:id - Success:', { id });
        res.sendStatus(204);
    } catch (e) {
        console.error('❌ DELETE /reports/:id - Error:', e.message);
        res.status(500).json({ error: e.message });
    }
});

module.exports = { songRouter: router };