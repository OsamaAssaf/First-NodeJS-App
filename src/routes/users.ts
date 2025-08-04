import express, { NextFunction, Response, Request } from "express";
import { UserModel, User } from "../models/User";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const router = express.Router();

router.use(logger);

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Show form to create new user
router.get("/new", (req, res) => {
  res.render("users/new");
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // In a real application, you would hash the password here
    const password_hash = password; // TODO: Use bcrypt to hash password

    const newUser = await UserModel.create({
      username,
      email,
      password_hash,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email, password } = req.body;

    const updateData: Partial<User> = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password_hash = password; // TODO: Hash password

    const updatedUser = await UserModel.update(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const deleted = await UserModel.delete(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Middleware to load user by ID
router.param("id", async (req, res, next, id) => {
  try {
    const userId = parseInt(id);
    const user = await UserModel.findById(userId);
    req.user = user || undefined;
    next();
  } catch (error) {
    console.error("Error loading user:", error);
    next(error);
  }
});

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl);
  next();
}

export default router;
