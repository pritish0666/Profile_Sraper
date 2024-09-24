const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize(
  "linkedin_profiles",
  "linkedin_user",
  "klopp90-=",
  {
    host: "localhost",
    dialect: "mysql",
    logging: console.log,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const Profile = sequelize.define("Profile", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Anonymous",
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "https://www.linkedin.com/",
  },

  bio: {
    type: DataTypes.TEXT,
    defaultValue: "No information available.",
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: "Unknown",
  },
  followerCount: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
  connectionCount: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.post("/api/profiles", async (req, res) => {
  const { name, url, followerCount, connectionCount } = req.body;

  if (
    !name ||
    !url ||
    isNaN(parseInt(followerCount)) ||
    isNaN(parseInt(connectionCount))
  ) {
    return res.status(400).json({ error: "Invalid or missing fields." });
  }

  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/profiles", async (req, res) => {
  try {
    await Profile.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ message: "All profiles deleted." });
  } catch (error) {
    console.error("Error deleting profiles:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/profiles", async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
