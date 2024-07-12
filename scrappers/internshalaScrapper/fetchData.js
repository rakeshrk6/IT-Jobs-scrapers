import axios from "axios"
import cheerio from "cheerio"
import Internshala from "../../models/internshala.js"

export async function fetchInternshalaData() {
  try {
    // Fetch HTML content from Internshala
    const response = await axios.get(
      "https://internshala.com/internships/front-end-development,software-development,web-development-internship/"
    )

    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data)

    // Extract job listings using Cheerio selectors
    const jobs = $("#internship_list_container_1 .individual_internship")
      .map((index, element) => {
        const jobElement = $(element)
        return {
          title: jobElement.find(".job-internship-name").text().trim(),
          companyName: jobElement.find(".company-name").text().trim(),
          location: jobElement.find(".locations").text().trim(),
          stipend: jobElement.find(".stipend").text().trim(),
          jobType: jobElement.find(".status-li").text().trim(),
          url: `https://internshala.com${jobElement.attr("data-href")}`,
          img: jobElement.find(".internship_logo img").attr("src") || "",
        }
      })
      .get()

    // Clear existing jobs and insert new ones
    await Internshala.deleteMany({})
    await Internshala.insertMany(jobs)

    console.log("Internshala Data fetched and saved successfully.")
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  }
}
