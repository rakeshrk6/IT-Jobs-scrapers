import { Schema, model } from "mongoose"

const AmazonSchema = new Schema({
  title: { type: String },
  companyName: { type: String },
  location: { type: String },
  jobType: { type: String },
  url: { type: String },
  date: { type: String, default: new Date().toLocaleString("en-IN") },
})

const Amazon = model("Amazon", AmazonSchema)

export default Amazon
