# Tutorial: Simple TypeScript Server
Creates a simple TypeScript server with a REST API using Express, along with two endpoints, a "hello world" one, and another that calculates the time until a set due date (both in days + hours and progress percentage). 

## Initialise project
Create a GitHub repo, clone it and run:
```bash
pnpm init;
mkdir src;
type nul > src/server.ts;
pnpm add express typescript @types/node @types/express;
```

Add a `.gitignore` file:
```bash
# Dependency directories
/node_modules

# Built files
/dist

# Environment variables file
.env
```
## Setup config file and scripts
Create a TypeScript configuration file, `tsconfig.json`:
```json
{
    "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
    },
    "exclude": [
    "node_modules"
    ]
}
```

And add a start script to the `package.json` file. It should look similar to this:
```json
{
  "name": "simple-express-server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "tsc && node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.17",
    "express": "^4.18.2",
    "typescript": "^5.3.3"
  }
}
```

## Add server and API logic
Implement the server and API logic in `src/server.ts`:

```ts
import express, { Request, Response } from "express";

const app = express();
const port = 8080;

/*
 * Handler function for /timeuntil endpoint.
 * Expects two query parameters: dueDate and startDate, both Date objects.
 * Returns the time remaining until the due date, along with the current progress perecentage.
 * Example usage: /timeuntil?dueDate=2024-06-14&startDate=2024-01-19
 */
function timeUntilHandler(req: Request, res: Response) {
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
}

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World 🗺️" });
});

app.get("/timeuntil", timeUntilHandler);

app.listen(port, () => {
  console.log(`🎉 Server listening on port ${port}.`);
  console.log(`Check this: http://localhost:${port}/timeuntil?dueDate=2024-06-14&startDate=2024-01-19`);
});
```

## Compile and start server
```bash
pnpm run start
```

## Access endpoint
Access the endpoint we made at http://localhost:8080 or http://localhost:8080/timeuntil?dueDate=2024-06-14&startDate=2024-01-19, which will return the time until June 14, 2024, in days and hours, along with the progress percentage since January 19, 2024. 
