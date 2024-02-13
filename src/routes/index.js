import { Router } from "express";
import db from "../firebase.js";
import Joi from "joi";
import validate from "../middlewares/validate.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const snapshot = await db.collection("zelux").get();
    const documentsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    res.json(documentsData);
  } catch (error) {
    res.json({ error });
  }
});

const newSchema = Joi.object({
  title: Joi.string().required(),
  exercises: Joi.array().required(),
});

router.post("/new", validate(newSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const dbRes = await db.collection("zelux").add(body);

    console.log("NEW WORKOUT SUCCESSFULLY CREATED", JSON.stringify(dbRes));

    res.json(dbRes);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

const removeSchema = Joi.object({
  id: Joi.string().required(),
});

router.delete("/remove", validate(removeSchema), async (req, res, next) => {
  try {
    const { id } = req.body;
    const dbRes = await db.collection("zelux").doc(id).delete();

    console.log("WORKOUT SUCCESSFULLY DELETED", JSON.stringify(dbRes));

    res.json(dbRes);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

export default router;
