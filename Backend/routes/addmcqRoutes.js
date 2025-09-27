import express from "express"
import { addMcq, editMcq, deleteMcq, getAllMcqs } from "../controllers/addingNewmcq.js";


const router=express.Router();


router.post("/add",addMcq);
router.get("/alltasks",getAllMcqs);
router.put("/edit/:id",editMcq);
router.delete("/delete/:id",deleteMcq);


export default router;