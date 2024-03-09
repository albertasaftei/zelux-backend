import { Router } from "express";
import db from "../firebase.js";
import Joi from "joi";
import validate from "../middlewares/validate.js";
import { getAppCheck } from "firebase-admin/app-check";

const router = Router();

const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    res.status(401);
    return next("Unauthorized");
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);
    // If verifyToken() succeeds, continue with the next middleware
    // function in the stack.
    return next();
  } catch (err) {
    res.status(401);
    return next("Unauthorized");
  }
};

router.get("/authenticate", [appCheckVerification], (req, res, next) => {
  res.json({ message: "Hello from the server!" });
  User;
});

router.get("/", [appCheckVerification], async (req, res, next) => {
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

router.post(
  "/new",
  validate(newSchema),
  [appCheckVerification],
  async (req, res, next) => {
    try {
      const body = req.body;
      const dbRes = await db.collection("zelux").add(body);

      console.log("NEW WORKOUT SUCCESSFULLY CREATED", JSON.stringify(dbRes));

      res.json(dbRes);
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
);

const removeSchema = Joi.object({
  id: Joi.string().required(),
});

router.delete(
  "/remove",
  validate(removeSchema),
  [appCheckVerification],
  async (req, res, next) => {
    try {
      const { id } = req.body;
      const dbRes = await db.collection("zelux").doc(id).delete();

      console.log("WORKOUT SUCCESSFULLY DELETED", JSON.stringify(dbRes));

      res.json(dbRes);
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
);

export default router;
