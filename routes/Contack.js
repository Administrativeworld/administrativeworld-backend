import express from "express";
const router = express.Router()
import { contactUsController } from "../controllers/Contact.js";

router.post("/contactus", contactUsController)

export default router;
