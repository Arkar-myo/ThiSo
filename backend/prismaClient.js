const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}).$extends({
  query: {
    $allOperations({ operation, model, args, query }) {
      return query(args);
    },
  },
});

module.exports = prisma;
