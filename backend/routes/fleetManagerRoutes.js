import express from "express";
import {
    createFleetManager,
    getAllFleetManagers,
    loginFleetManager,
    logoutCurrentFleetManager,
    getCurrentFleetManagerProfile,
    updateCurrentFleetManagerProfile,
    deleteFleetManagerById,
    getFleetManagerById,
    updateFleetManagerById,
    getFleetManagerServiceAreas,
    addServiceArea,
    removeServiceArea,
} from "../controllers/fleetManagerController.js";

import { authenticate, authenticateFleetManager, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(createFleetManager)
  .get(authenticate, authorizeAdmin, getAllFleetManagers);
router.post("/auth", loginFleetManager);
router.post("/logout", authenticateFleetManager, logoutCurrentFleetManager);

router
  .route("/profile")
  .get(authenticateFleetManager, getCurrentFleetManagerProfile)
  .put(authenticateFleetManager, updateCurrentFleetManagerProfile);

// Service Area Management Routes
router
  .route("/service-areas")
  .get(authenticateFleetManager, getFleetManagerServiceAreas);

router
  .route("/service-areas/:areaId")
  .post(authenticateFleetManager, addServiceArea)
  .delete(authenticateFleetManager, removeServiceArea);

// Administrator Routes
router
  .route("/:id")
  .delete(deleteFleetManagerById)
  .get(authenticate, authorizeAdmin, getFleetManagerById)
  .put(authenticate, authorizeAdmin, updateFleetManagerById);

export default router;
