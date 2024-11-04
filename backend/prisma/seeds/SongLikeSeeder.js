const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function SongLikeSeeder() {
    console.log("Song like seeding started...");
    const songs = await prisma.song.findMany();
    for (const song of songs) {
        const likeCount = faker.number.int({ min: 0, max: 5 });
        for (let i = 0; i < likeCount; i++) {
            await prisma.songLike.create({
                data: {
                    songId: song.id,
                    userId: "671b8af71ccfd0465aab897c",
                },
            });
        }
    }
    console.log("Song like seeding done.");
}

module.exports = { SongLikeSeeder };
