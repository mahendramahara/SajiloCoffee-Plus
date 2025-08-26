import { Router } from 'express';
import { getApiDocumentation } from '../controllers/docs.controller.js';

const router = Router();

router.get('/', getApiDocumentation);

export default router;
