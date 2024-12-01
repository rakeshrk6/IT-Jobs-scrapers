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

// cron.schedule("0 0 * * *", () => {
//   console.log("Task started")
// fetchInternshalaData()
// fetchGoogleJobs()
// fetchAmazonJobs()
// })

async function runJobs() {
  await fetchInternshalaData()
  await fetchGoogleJobs()
  await fetchAmazonJobs()
}
runJobs()

app.get("/", async (req, res) => {
  res.send("home route")
})
app.get("/internshala", async (req, res) => {
  const data = await fetchInternshalaData()
  res.send(data)
})
app.get("/amazon", async (req, res) => {
  const data = await fetchAmazonJobs()
  res.send(data)
})
app.get("/google", async (req, res) => {
  const data = await fetchGoogleJobs()
  res.send(data)
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
