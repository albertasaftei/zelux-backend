const express = require("express");
const { db } = require("../firebase");
const router = express.Router();

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

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
