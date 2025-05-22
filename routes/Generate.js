import express from "express";
const router = express.Router()
import { generateSignature } from "../controllers/GenerateSignature.js";

router.post("/generateSignature", generateSignature)

export default router;
