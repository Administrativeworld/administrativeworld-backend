import express from 'express';
import { getTeamMembers } from '../controllers/Employess.js';

const router = express.Router();

router.get('/getteam', getTeamMembers);

export default router;
