import { Router } from 'express'
import { medicalController } from './medicalController.js';

const router = Router();


const medicalcontroller = new medicalController();

router.post('/chatbot',medicalcontroller.medicalAdvisor )

//router.post('/chat',medicalcontroller.example)


export const medicalRoutes = router;