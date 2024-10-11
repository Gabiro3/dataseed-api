const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet()); // Adds basic security headers
app.use(
  cors({
    origin: ['https://dataseed.vercel.app', 'http://localhost:3000'], // Allow only this domain
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.use(express.json()); // Parses incoming JSON requests

// Sample route to get all farmers
app.get("/farmers", async (req, res) => {
  const farmers = await prisma.farmer.findMany();
  const totalFarmers = farmers.length;
  const totalCapital = farmers.reduce(
    (sum, farmer) => sum + farmer.capitalRequired,
    0
  );
  const averageCapital = totalCapital / totalFarmers || 0;
  const totalFarmArea = farmers.reduce(
    (sum, farmer) => sum + farmer.totalFarmArea,
    0
  );
  const totalYieldSoldPercentage = farmers.reduce(
    (sum, farmer) => sum + farmer.yieldSoldPercentage,
    0
  );
  const averageYieldSold = totalYieldSoldPercentage / totalFarmers || 0;
  res.json({
    "Total farmers": totalFarmers,
    "Avg Capital": averageCapital,
    "Avg Yield": averageYieldSold,
    "Total farm area": totalFarmArea,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
