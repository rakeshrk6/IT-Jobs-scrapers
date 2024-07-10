import { Schema, model, models } from "mongoose"

const LinkedinSchema = new Schema({
  title: { type: String },
  companyName: { type: String },
  location: { type: String },
  url: { type: String },
})

const Linkedin = models.Linkedin || model("Linkedin", LinkedinSchema)

export default Linkedin
