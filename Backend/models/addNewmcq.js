

import mongoose from "mongoose";

const addNewmcq = new mongoose.Schema({
  question: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
 correctOption: { 
  type: String, 
  required: true,
  enum: ["option1", "option2", "option3", "option4"]
}
 
}, { timestamps: true }); 

const Mcq = mongoose.model("Mcq", addNewmcq);

export default Mcq;



