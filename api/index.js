import { Router } from "express";
import db from "../firebase.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const snapshot = await db.collection("zelux").get();
    const documentsData = snapshot.docs.map((doc) => ({
      _id: doc.id,
      data: doc.data(),
    }));

    res.json(documentsData);
  } catch (error) {
    res.json({ error });
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const body = req.body;
    const dbRes = await db.collection("zelux").add(body);

    res.json(dbRes);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

router.delete("/remove", async (req, res, next) => {
  try {
    const { key } = req.body;
    const dbRes = await db.collection("zelux").doc(key).delete();
    console.log(dbRes);

    res.json(dbRes);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

module.exports = router;
