// import Linkedin from "@/models/linkedin"
// const cron = require("node-cron")
// const puppeteer = require("puppeteer")

// export async function fetchLinkedinJobs() {
//   try {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     await page.goto(
//       "https://www.linkedin.com/jobs/search?keywords=Software%20Development&location=India&geoId=102713980&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0"
//     )

//     const jobs = await page.$$eval("li .base-card", (ele) =>
//       ele.map((e) => ({
//         title: e.querySelector(".base-search-card__title").innerText,
//         companyName: e.querySelectorAll(".base-search-card__subtitle")[0]
//           .innerText,
//         location: e.querySelector(".job-search-card__location").innerText,

//         url: e.querySelector(".base-card__full-link").href,
//       }))
//     )
//     // console.log(jobs)
//     await Linkedin.deleteMany({ jobs })

//     // Save new data to MongoDB
//     await Linkedin.create(jobs)

//     console.log("Data fetched and saved successfully.")
//     await browser.close()
//   } catch (error) {
//     console.error("Error fetching or saving data:", error)
//   }
// }
