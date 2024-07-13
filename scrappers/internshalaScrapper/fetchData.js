import puppeteer from "puppeteer"
import Internshala from "../../models/internshala.js"

export async function fetchInternshalaData() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
      "https://internshala.com/internships/front-end-development,software-development,web-development-internship/"
    )

    const jobs = await page.$$eval(
      "#internship_list_container_1 .individual_internship",
      (ele) =>
        ele.map((e) => ({
          title: e.querySelector(".job-internship-name")?.innerText || "",
          companyName: e.querySelector(".company-name")?.innerText || "",
          location: e.querySelector(".locations")?.innerText || "",
          stipend: e.querySelector(".stipend")?.innerText || "",
          jobType: e.querySelector(".status-li")?.innerText || "",
          url: `https://internshala.com${e.getAttribute("data-href")}` || "",
          img: e.querySelector(".internship_logo img")?.src ?? "",
        }))
    )
    // console.log(jobs)
    await Internshala.deleteMany({ jobs })

    // Save new data to MongoDB
    await Internshala.create(jobs)

    console.log("Internshala Data fetched and saved successfully.")
    await browser.close()
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  }
}
