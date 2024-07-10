import { Schema, model } from "mongoose"

const GoogleSchema = new Schema({
  title: { type: String },
  companyName: { type: String },
  location: { type: String },
  jobType: { type: String },
  url: { type: String },
  date: { type: String, default: new Date().toLocaleString("en-IN") },
})

const Google = model("Google", GoogleSchema)

export default Google
