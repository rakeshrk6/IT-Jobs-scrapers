import axios from "axios"
import cheerio from "cheerio"
import Amazon from "../../models/amazon.js"

export async function fetchAmazonJobs() {
  try {
    // Fetch HTML content from Amazon job listings page
    const response = await axios.get(
      "https://www.amazon.jobs/content/en/job-categories/software-development?country%5B%5D=IN"
    )

    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data)
    console.log(response.data)
    // Extract job listings using Cheerio selectors
    const jobs = $(".jobs-module_root__gY8Hp .job-card-module_root__QYXVA")
      .map((index, element) => {
        const jobElement = $(element)
        return {
          title: jobElement.find(".header-module_title__9-W3R").text().trim(),
          companyName: "Amazon",
          location: jobElement
            .find(".metadatum-module_text__ncKFr")
            .text()
            .trim(),
          jobType: "Full Time", // Assuming all jobs are full-time at Amazon
          url: jobElement.find(".header-module_title__9-W3R").attr("href"),
        }
      })
      .get()
    console.log(jobs)
    // Clear existing data and insert new job listings into MongoDB
    await Amazon.deleteMany({})
    await Amazon.insertMany(jobs)

    console.log("Amazon Data fetched and saved successfully.")
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  }
}
