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
});

router.post(
  "/new/byUser",
  validate(newSchema),
  [authenticationMiddleware],
  async (req, res) => {
    try {
      const { userId, title, exercises } = req.body;
      const parsedExercises = JSON.stringify(exercises);
      await pool.query(
        `INSERT INTO workouts ("fk_userId", "title", "exercises") VALUES ($1, $2, $3)`,
        [userId, title, parsedExercises]
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

export default router;
