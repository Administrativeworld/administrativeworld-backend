import express from "express";
const router = express.Router()
import { generateSignature, generateSignatureOverwrite } from "../controllers/GenerateSignature.js";

router.post("/generateSignature", generateSignature)
router.post("/generateSignatureOverwrite", generateSignatureOverwrite)

export default router;
