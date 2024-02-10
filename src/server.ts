import express, { Request, Response } from "express";

const app = express();
const port = 8080;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World 🗺️" });
});

app.get("/timeUntil", (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const { dueDate, startDate } = req.query;

    if (!dueDate || !startDate) {
      return res.status(400).json({ error: "You have to provide both a start date and a due date!" });
    }

    const parsedDueDate = new Date(dueDate as string);
    const parsedStartDate = new Date(startDate as string);

    if (isNaN(parsedDueDate.getTime()) || isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format. Please use ISO date format (YYYY-MM-DD)." });
    }

    const currentTimeDiff = parsedDueDate.getTime() - currentDate.getTime();
    const daysLeft = Math.floor(currentTimeDiff / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(currentTimeDiff / (1000 * 60 * 60)) % 24;
    const maxTimeDiff = parsedDueDate.getTime() - parsedStartDate.getTime();
    const elapsedTime = currentDate.getTime() - parsedStartDate.getTime();
    const progressPercentage = ((elapsedTime / maxTimeDiff) * 100).toFixed(2);

    res.status(200).json({
      daysLeft,
      remainingHours,
      progressPercentage,
    });
  } catch (error) {
    console.error("An error occurred while calculating time left: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`🎉 Server listening on port ${port}.`);
  console.log(`Check this: http://localhost:${port}/timeuntil?dueDate=2024-06-14&startDate=2024-01-19`);
});
