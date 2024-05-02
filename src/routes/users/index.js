import { Router } from "express";
import validate from "../../middlewares/validate.js";
import Joi from "joi";
import authenticationMiddleware from "../../middlewares/authentication.js";
import { pool } from "../../../db.js";
import "core-js/stable/atob.js";
import { jwtDecode } from "jwt-decode";

const router = Router();

const getUserByIdSchema = Joi.object({
  userId: Joi.string().required(),
});

const getDateDifference = (date1, date2, divideBy) => {
  const date1Parsed = new Date(date1);
  const date2Parsed = new Date(date2);
  return Math.abs(date1Parsed - date2Parsed) / divideBy;
};

router.post(
  "/byId",
  validate(getUserByIdSchema),
  [authenticationMiddleware],
  async (req, res) => {
    try {
      const { userId, accessToken } = req.body;
      const decoded = jwtDecode(accessToken);
      if (Date.now() >= decoded?.exp * 1000) {
        return res.status(500).send("Access token expired!");
      }
      const result = await pool.query(`SELECT * FROM users WHERE "uid" = $1`, [
        userId,
      ]);

      const finishedSessions = await pool.query(
        'SELECT * FROM finished_workouts WHERE "fk_userId" = $1 ORDER BY created_at ASC',
        [userId]
      );

      const reducedWorkouts = finishedSessions?.rows.reduce((acc, curr) => {
        acc.push({
          createdAt: curr.created_at,
          sessionTime: `${getDateDifference(
            curr.started_at,
            curr.finished_at,
            1000 * 60 * 60
          ).toFixed(2)}`,
          categories: curr.categories,
        });
        return acc;
      }, []);

      if (!result.rows.length) {
        const result = await pool.query(
          `INSERT INTO users ("uid", "nickname", "age", "email") VALUES ($1, $2, $3, $4)`,
          [userId, decoded?.name, 0, decoded?.email]
        );

        return res.json({ ...result?.rows[0], finishedSessions: [] });
      }
      res.json({ ...result?.rows[0], finishedSessions: reducedWorkouts });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
