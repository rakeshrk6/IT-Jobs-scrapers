import puppeteer from "puppeteer"
import Amazon from "../../models/amazon.js"

// Helper function to add a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchAmazonJobs(res) {
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
    page.setDefaultNavigationTimeout(120000) // Set a longer timeout (e.g., 120 seconds)

    await page.goto(
      "https://www.amazon.jobs/content/en/job-categories/software-development?country%5B%5D=IN&role-type%5B%5D=0"
    )

    await page.waitForSelector(".jobs-module_root__gY8Hp", { visible: true })

    let allJobs = []
    let hasNextPage = true
    let count = 1

    while (hasNextPage) {
      const jobs = await page.$$eval(
        ".jobs-module_root__gY8Hp .job-card-module_root__QYXVA",
        (elements) =>
          elements.map((e) => ({
            title:
              e.querySelector(".header-module_title__9-W3R")?.innerText || "",
            companyName: "Amazon",
            location:
              e.querySelector(".metadatum-module_text__ncKFr")?.innerText || "",
            jobType: "Full Time",
            url: e.querySelector(".header-module_title__9-W3R")?.href || "",
          }))
      )

      console.log(jobs)
      allJobs = [...allJobs, ...jobs]

      const nextPageButtonDisabled = await page.$eval(
        'button[data-test-id="next-page"]',
        (btn) => btn.getAttribute("aria-disabled") === "true"
      )

      if (nextPageButtonDisabled) {
        console.log("Reached the last page. Stopping navigation.")
        hasNextPage = false // Exit the loop if next page button is disabled
        break
      } else {
        // Click the next page button
        // Find the next page button handle
        const nextPageButton = await page.$('button[data-test-id="next-page"]')
        if (nextPageButton) {
          console.log("page ", count)
          count++

          await nextPageButton.click()

          // Wait for new content to load on the next page
          await page.waitForSelector(".job-card-module_root__QYXVA", {
            visible: true,
            timeout: 60000,
          })
          await delay(3000)
        } else {
          console.error("Next page button not found!")
          hasNextPage = false
        }
      }
    }

    // Handle the data after scraping
    // console.log("Data fetched:", allJobs)
    await Amazon.deleteMany({})
    await Amazon.create(allJobs)

    console.log("Data fetched and saved successfully.")
    res.send(allJobs)
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  } finally {
    await browser.close()
  }
}
