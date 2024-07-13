import puppeteer from "puppeteer"

export async function fetchGoogleJobs() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
      "https://www.google.com/about/careers/applications/jobs/results?has_remote=true&location=India"
    )

    const jobs = await page.$$eval(".spHGqe .lLd3Je", (ele) =>
      ele.map((e) => ({
        title: e.querySelector(".ObfsIf-eEDwDf h3").innerText,
        companyName: e.querySelectorAll(".RP7SMd span")[0].innerText,
        location: e.querySelector(".pwO9Dc .r0wTof").innerText,
        jobType: e.querySelectorAll(".RP7SMd span")[1].innerText,
        url: e.querySelector(".VfPpkd-dgl2Hf-ppHlrf-sM5MNb a").href,
      }))
    )
    console.log(jobs)
    // await Google.deleteMany({ jobs })

    // // Save new data to MongoDB
    // await Google.create(jobs)

    console.log("Data fetched and saved successfully.")
    await browser.close()
  } catch (error) {
    console.error("Error fetching or saving data:", error)
  }
}
