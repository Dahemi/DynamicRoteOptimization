import asyncHandler from "../middlewares/asyncHandler.js";
import Garbage from "../models/garbageModel.js";
import Collector from "../models/collectorModel.js";
import Schedule from "../models/scheduleModel.js";

const getFleetManagerOverview = asyncHandler(async (req, res) => {
  try {
    const fleetManagerId = req.fleetManager._id;
    const servicedAreas = req.fleetManager.servicedAreas || [];

    const totalCollectors = await Collector.countDocuments({
      wmaId: fleetManagerId
    });

    const activeSchedules = await Schedule.countDocuments({
      wmaId: fleetManagerId,
      status: { $in: ['pending', 'in-progress'] }
    });

    const fullBins = await Garbage.countDocuments({
      fillLevel: { $gte: 75 }
    });

    const completedCollections = await Garbage.countDocuments({
      collectionStatus: 'collected'
    });

    const averageFillLevel = await Garbage.aggregate([
      {
        $group: {
          _id: null,
          avgFill: { $avg: "$fillLevel" }
        }
      }
    ]);

    const avgFill = averageFillLevel.length > 0
      ? Math.round(averageFillLevel[0].avgFill)
      : 0;

    const pendingRoutes = await Schedule.countDocuments({
      wmaId: fleetManagerId,
      status: 'pending'
    });

    res.json({
      activeBins: fullBins,
      pendingRoutes: pendingRoutes,
      trucksOnline: totalCollectors,
      averageFillLevel: avgFill,
      totalCollectors: totalCollectors,
      activeSchedules: activeSchedules,
      completedCollections: completedCollections,
      servicedAreasCount: servicedAreas.length
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500);
    throw new Error('Failed to fetch analytics overview');
  }
});

export { getFleetManagerOverview };
