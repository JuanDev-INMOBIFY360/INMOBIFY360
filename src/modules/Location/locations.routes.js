import { Router } from 'express';
import { getCountriesController } from './country/country.controller.js';
import { getDepartmentsController } from './department/department.controller.js';

const router = Router();

router.get('/countries', getCountriesController);
router.get('/departments', getDepartmentsController);





export default router;
