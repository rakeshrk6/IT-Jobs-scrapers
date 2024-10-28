import { Schema, model } from "mongoose"

const GoogleSchema = new Schema({
  title: { type: String },
  companyName: { type: String, default: "Google" },
  location: { type: String },
  jobType: { type: String, default: "Full Time" },
  url: { type: String },
  date: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  },
})

const Google = model("Google", GoogleSchema)

export default Google
