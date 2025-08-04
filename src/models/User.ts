import pool from "../config/database";

export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  // Get all users
  static async findAll(): Promise<User[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM users ORDER BY created_at DESC"
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Get user by ID
  static async findById(id: number): Promise<User | null> {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  // Get user by email
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  // Create new user
  static async create(
    userData: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User> {
    try {
      const { username, email, password_hash } = userData;
      const result = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password_hash]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Update user
  static async update(
    id: number,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const { username, email, password_hash } = userData;
      const result = await pool.query(
        "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), password_hash = COALESCE($3, password_hash), updated_at = NOW() WHERE id = $4 RETURNING *",
        [username, email, password_hash, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}
