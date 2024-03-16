import { Router } from "express";
import validate from "../../middlewares/validate.js";
import Joi from "joi";
import authenticationMiddleware from "../../middlewares/authentication.js";
import { pool } from "../../../db.js";

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
      const { userId } = req.body;
      const result = await pool.query(`SELECT * FROM users WHERE "id" = $1`, [
        id,
      ]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
