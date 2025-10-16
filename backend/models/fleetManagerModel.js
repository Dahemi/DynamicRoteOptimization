import mongoose from "mongoose";

const fleetManagerSchema = mongoose.Schema(
  {
    managerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    authNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    servicedAreas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],
    ratePerCollection: {
      type: Number,
      default: 500,
      required: false,
    },
  },
  { timestamps: true }
);
const FleetManager = mongoose.model("FleetManager", fleetManagerSchema);

export default FleetManager;
