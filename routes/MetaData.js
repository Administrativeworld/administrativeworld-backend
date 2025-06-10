import express from "express";
import { getBasicMetaData, getBasicMetaDataOptimized, getMetaDataHandler } from "../controllers/MetaData.js";
const router = express.Router();

router.get('/getBasicMetaData', getBasicMetaData)
router.get('/getBasicMetaDataOptimized', getBasicMetaDataOptimized)
router.get('/getMetaDataHandler', getMetaDataHandler)

export default router;