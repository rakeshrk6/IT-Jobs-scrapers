import puppeteer from "puppeteer"
import Internshala from "../../models/internshala.js"

export async function fetchInternshalaData() {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  })
  try {
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
    await Internshala.deleteMany({})

    // Save new data to MongoDB
    await Internshala.create(jobs)

    console.log("Internshala Data fetched and saved successfully.")
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  } finally {
    await browser.close()
  }
}
