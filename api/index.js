const router = express.Router();

router.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  console.log("/////////", slug);
  res.json(`Item: ${slug}`);
});
