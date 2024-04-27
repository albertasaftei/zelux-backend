import { Router } from "express";
import validate from "../../middlewares/validate.js";
import Joi from "joi";
import authenticationMiddleware from "../../middlewares/authentication.js";
import { pool } from "../../../db.js";

const router = Router();

const getWorkoutsByUserSchema = Joi.object({
  userId: Joi.string().required(),
});

router.post(
  "/byUser",
  validate(getWorkoutsByUserSchema),
  [authenticationMiddleware],
  async (req, res) => {
    try {
      const { userId } = req.body;
      const result = await pool.query(
        `SELECT * FROM workouts WHERE "fk_userId" = $1`,
        [userId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("There was an error fetching workouts");
    }
  }
);

const newSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  exercises: Joi.array().required(),
  category: Joi.array().required(),
});

router.post(
  "/new/byUser",
  validate(newSchema),
  [authenticationMiddleware],
  async (req, res) => {
    try {
      const { userId, title, exercises, category } = req.body;
      const parsedCategories = JSON.stringify(category);
      const parsedExercises = JSON.stringify(exercises);
      await pool.query(
        `INSERT INTO workouts ("fk_userId", "title", "exercises", "category") VALUES ($1, $2, $3, $4)`,
        [userId, title, parsedExercises, parsedCategories]
      );
      res.json({
        message: `Workout created successfully for user ${userId}`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("There was an error creating the workout");
    }
  }
);

const deleteWorkoutByIdSchema = Joi.object({
  id: Joi.string().required(),
});

router.delete(
  "/byId",
  validate(deleteWorkoutByIdSchema),
  [authenticationMiddleware],
  async (req, res) => {
    try {
      const { id } = req.body;
      await pool.query(`DELETE FROM workouts WHERE "id" = $1`, [id]);

      res.json({
        message: `Workout with id ${id} deleted successfully`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("There was an error deleting the workout");
    }
  }
);

router.get("/categories", [authenticationMiddleware], async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM categories`);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error fetching workout categories");
  }
});

const registerWorkoutSchema = Joi.object({
  userId: Joi.string().required(),
  exercises: Joi.array().required(),
  category: Joi.array().required(),
  startedAt: Joi.date().required(),
  finishedAt: Joi.date().required(),
});

router.post(
  "/registerWorkout",
  validate(registerWorkoutSchema),
  [authenticationMiddleware],
  async (req, res) => {
    try {
      const { userId, exercises, category, startedAt, finishedAt } = req.body;
      const parsedCategories = JSON.stringify(category);
      const parsedExercises = JSON.stringify(exercises);

      console.log({
        userId,
        startedAt,
        finishedAt,
        parsedCategories,
        parsedExercises,
      });

      await pool.query(
        `INSERT INTO finished_workouts ("exercises", "categories", "started_at", "finished_at", "fk_userId") VALUES ($1, $2, $3, $4, $5)`,
        [parsedExercises, parsedCategories, startedAt, finishedAt, userId]
      );
      res.json({
        message: `Workout successfully registered for user ${userId}`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("There was an error registering workout");
    }
  }
);

export default router;
