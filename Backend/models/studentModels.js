import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    registerNo: {
        type: String,
        unique: true,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    collegename: {
        type: String,
        required: true,
    },
    
});

const Student = mongoose.model("Student", studentSchema);

export default Student;