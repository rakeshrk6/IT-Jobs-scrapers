import mongoose from "mongoose"

export async function connect() {
  await mongoose.connect(process.env.ATLAS_URL, {
    dbName: "Job-app",
  })
  console.log("database connected")
}
