import express from "express"
import dotenv from "dotenv"
import { connect } from "./db connection/connection.js"
import { fetchGoogleJobs } from "./scrappers/googleScrapper/fetchData.js"
import { fetchInternshalaData } from "./scrappers/internshalaScrapper/fetchData.js"
import cron from "node-cron"
import { fetchAmazonJobs } from "./scrappers/amazonScrapper/fetchData.js"

dotenv.config({ path: ".env" })
const PORT = process.env.PORT

const app = express()

// cron.schedule("* * * * *", () => {
//   console.log("Task started at 5 AM")
//   // fetchInternshalaData()
//   // fetchGoogleJobs()
//   fetchAmazonJobs()
// })

fetchAmazonJobs()
// fetchInternshalaData()
// fetchGoogleJobs()

app.get("/", async (req, res) => {
  res.send("home route")
})

connect()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log("server started at", PORT)
      })
    } catch (error) {
      console.log("cannot connect to server")
    }
  })
  .catch((error) => {
    console.log("invalid database connection", error)
  })
