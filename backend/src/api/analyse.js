import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { number, message } = req.body;
  const categories = ["Spam", "Démarchage", "Sondage"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const score = (Math.random()).toFixed(2);

  res.json({
    number,
    message,
    summary: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
    category,
    score
  });
});

export default router;
