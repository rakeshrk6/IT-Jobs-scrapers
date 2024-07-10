import puppeteer from "puppeteer"
import Amazon from "../../models/amazon.js"

export async function fetchAmazonJobs() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(80000)
    await page.goto(
      "https://www.amazon.jobs/content/en/job-categories/software-development?country%5B%5D=IN"
    )
    await page.waitForSelector(".jobs-module_root__gY8Hp", { visible: true })

    let allJobs = []
    let hasNextPage = true
    let count = 0

    while (hasNextPage) {
      const jobs = await page.$$eval(
        ".jobs-module_root__gY8Hp .job-card-module_root__QYXVA",
        (ele) =>
          ele.map((e) => ({
            title:
              e.querySelector(".header-module_title__9-W3R")?.innerText || "",
            companyName: "Amazon",
            location:
              e.querySelector(".metadatum-module_text__ncKFr")?.innerText || "",
            jobType: "Full Time",
            url: e.querySelector(".header-module_title__9-W3R")?.href || "",
          }))
      )
      // console.log(jobs)
      console.log("count", count)
      allJobs = [...allJobs, ...jobs]

      const nextPageButton = await page.$('button[data-test-id="next-page"]')
      const isDisabled = await nextPageButton.evaluate((btn) => btn.disabled)

      if (!isDisabled) {
        count++
        await nextPageButton.click()
        await page.waitForNavigation()
        await page.waitForSelector(".job-card-module_root__QYXVA", {
          visible: true,
        })
      } else {
        hasNextPage = false
      }
    }

    await browser.close()
    await Amazon.deleteMany({})
    await Amazon.create(allJobs)
    console.log("Amazon Data fetched and saved successfully.")
    return
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  }
}
