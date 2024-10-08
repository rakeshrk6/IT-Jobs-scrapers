import puppeteer from "puppeteer"
import Google from "../../models/google.js"

export async function fetchGoogleJobs() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const baseUrl =
      "https://www.google.com/about/careers/applications/jobs/results"
    const query = "?location=India&q=%22Software%20Engineer%22"
    let pageNumber = 1
    let allJobs = []

    while (true) {
      await page.goto(`${baseUrl}${query}&page=${pageNumber}`)

      const jobsOnPage = await page.$$eval(".spHGqe .lLd3Je", (elements) =>
        elements.map((element) => ({
          title: element.querySelector(".ObfsIf-eEDwDf h3")?.innerText || "",
          location: element.querySelector(".pwO9Dc .r0wTof")?.innerText || "",
          url:
            element.querySelector(".VfPpkd-dgl2Hf-ppHlrf-sM5MNb a")?.href || "",
        }))
      )

      allJobs = [...allJobs, ...jobsOnPage]
      console.log(`Page ${pageNumber}: ${jobsOnPage.length} jobs`)

      // Check if there's a next page button
      const nextPageButton = await page.$(".WpHeLc.VfPpkd-mRLv6")
      if (!nextPageButton) {
        break // Exit the loop if next page button is not found
      }

      pageNumber++
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        nextPageButton.click(),
      ])
    }

    Example: await Google.deleteMany({})
    Example: await Google.create(allJobs)

    console.log("Data fetched and saved successfully.")
    await browser.close()
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  }
}
