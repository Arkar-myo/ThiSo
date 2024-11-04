const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function SongSeeder() {
    const data = [];
    for (let i = 0; i < 5; i++) {
        const song = {
            title: faker.music.songName(),
            singer: faker.person.fullName(),
            writer: faker.person.fullName(),
            album: faker.music.genre(),
            body: faker.lorem.paragraphs(3),
            key: faker.helpers.arrayElement(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
            tempo: faker.number.int({ min: 60, max: 180 }),
            userId: "671b8af71ccfd0465aab897c",
        };
        data.push(song);
    }
    console.log("Song seeding started...");
    await prisma.song.createMany({ data });
    console.log("Song seeding done.");
}

module.exports = { SongSeeder };
