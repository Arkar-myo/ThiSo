const { PrismaClient } = require("@prisma/client");
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function UserSeeder() {
    const password = await bcrypt.hash("password", 10);
    const adminPassword = await bcrypt.hash("password", 10);

    console.log("User seeding started...");
    await prisma.user.create({
        data: {
            email: "admin@example.com",
            username: "admin1",
            password: adminPassword,
            userType: "admin",
        },
    });

    for (let i = 0; i < 10; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = `${firstName}${lastName[0]}`.toLowerCase();
        const email = faker.internet.email({ firstName, lastName });
        
        await prisma.user.create({
            data: {
                email,
                username,
                password,
                userType: null,
            },
        });
    }
    console.log("User seeding done.");
}

module.exports = { UserSeeder };
