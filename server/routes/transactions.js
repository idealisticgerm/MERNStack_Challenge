import { Router } from "express";
const router = Router();
import {
    SeedController,
    GetAllTransactionController,
    StatisticsController, BarChartController, PieChartController, CombinedAPIController
} from "../controllers/transactionController.js";



router.get('/initialize', SeedController);
router.get('/transactions', GetAllTransactionController);
router.get('/statistics', StatisticsController);
router.get('/bar-chart',BarChartController);
router.get('/pie-chart',PieChartController);
router.get('/combined-api',CombinedAPIController)



export default router;