import express from "express";
import {
    createSchedule,
    getAllSchedules,
    getTruckSchedules,
    getScheduleById,
    updateSchedule,
    updateScheduleStatus,
    deleteSchedule,
    getSchedulesByWma,
    getActiveSchedules
} from "../controllers/scheduleController.js";
import { authenticateFleetManager, authenticateCollector } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Fleet Manager Schedule Management Routes
router
  .route("/")
  .post(authenticateFleetManager, createSchedule) // Fleet Manager creates schedules
  .get(authenticateFleetManager, getAllSchedules); // Fleet Manager views all their schedules

// Collector Routes
router.route("/collector-schedules").get(authenticateCollector, getTruckSchedules);

// Collector Status Update Route (only status field)
router.route("/:id/status").put(authenticateCollector, updateScheduleStatus);

// Get schedules by WMA ID
router.route("/wma-schedules/:id").get(getSchedulesByWma);

// Get active schedules (In Progress status)
router.route("/active").get(getActiveSchedules);

// Schedule CRUD operations (Fleet Manager authenticated)
router
  .route("/:id")
  .get(getScheduleById)
  .put(authenticateFleetManager, updateSchedule) // Fleet Manager updates schedules
  .delete(authenticateFleetManager, deleteSchedule); // Fleet Manager deletes schedules

export default router;