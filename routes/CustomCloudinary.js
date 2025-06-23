import { deleteAsset } from "../controllers/CustomCloudinary.js";
import express from "express"
import { auth } from "../middleware/auth";

const router = express.Router();


router.post("/deleteAsset", auth, deleteAsset)