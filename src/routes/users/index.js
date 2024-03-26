import { Router } from "express";
import validate from "../../middlewares/validate.js";
import Joi from "joi";
import authenticationMiddleware from "../../middlewares/authentication.js";
import { pool } from "../../../db.js";
import { jwtDecode } from "jwt-decode";

const router = Router();

const getUserByIdSchema = Joi.object({
  userId: Joi.string().required(),
});

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
      console.log({ decoded });
      const result = await pool.query(`SELECT * FROM users WHERE "uid" = $1`, [
        userId,
      ]);

      if (!result.rows.length) {
        const result = await pool.query(
          `INSERT INTO users () VALUES ($1, $2, $3, $4)`
        );
      }
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
