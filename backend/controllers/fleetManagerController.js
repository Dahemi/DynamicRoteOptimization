import FleetManager from "../models/fleetManagerModel.js";
import Area from "../models/areaModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import { generateToken, generateFleetManagerToken } from "../utils/createToken.js";

/**
 * @route   POST /api/fleet-managers
 * @desc    Create a new fleet manager
 * @access  Public
 * @param   {String} managerName - The name of the fleet manager (required)
 * @param   {String} email - The email of the fleet manager (required)
 * @param   {String} password - The password for the fleet manager (required)
 * @returns {Object} - A JSON object containing the newly created fleet manager data
 * @throws  {400} If the name, email, or password is missing or invalid
 * @throws  {409} If the email is already in use
 * @throws  {500} If a server error occurs
 */
const createFleetManager = asyncHandler(async (req, res) => {
  const { managerName, address, contact, profileImage, authNumber, email, password } =
    req.body;

  // Check the body has necessary attributes
  if (!managerName || !address || !contact || !authNumber || !email || !password) {
    throw new Error("Please fill all the inputs!!!");
  }

  // Check the fleet manager if already exist
  const managerExists = await FleetManager.findOne({ email });

  if (managerExists) {
    res.status(400).send("Fleet Manager already exists!!!");
  }

  // Encrypting the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Creating a fleet manager
  const newFleetManager = new FleetManager({
    managerName,
    address,
    contact,
    profileImage,
    authNumber,
    email,
    password: hashedPassword,
  });

  try {
    await newFleetManager.save();
    generateFleetManagerToken(res, newFleetManager._id);

    res.status(201).json({
      _id: newFleetManager._id,
      managerName: newFleetManager.managerName,
      address: newFleetManager.address,
      contact: newFleetManager.contact,
      profileImage: newFleetManager.profileImage,
      authNumber: newFleetManager.authNumber,
      email: newFleetManager.email,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid fleet manager data");
  }
});

/**
 * @route   POST /api/fleet-managers/auth
 * @desc    Authenticate fleet manager and get token
 * @access  Public
 * @param   {String} email - The email of the fleet manager (required)
 * @param   {String} password - The password of the fleet manager (required)
 * @returns {Object} - A JSON object containing the fleet manager data and the authentication token
 * @throws  {400} If the email or password is missing or invalid
 * @throws  {401} If the email or password is incorrect
 * @throws  {500} If a server error occurs
 */
const loginFleetManager = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if fleet manager exists
  const existingManager = await FleetManager.findOne({ email });

  if (existingManager) {
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, existingManager.password);

    if (isPasswordValid) {
      // Generate token if the fleet manager is valid
      const token = generateFleetManagerToken(res, existingManager._id);

      res.status(201).json({
        _id: existingManager._id,
        managerName: existingManager.managerName,
        address: existingManager.address,
        contact: existingManager.contact,
        profileImage: existingManager.profileImage,
        authNumber: existingManager.authNumber,
        email: existingManager.email,
        token: token,
      });
    } else {
      // Send error response for incorrect password
      res.status(401);
      throw new Error("Invalid password.");
    }
  } else {
    // Send error response if fleet manager is not found
    res.status(404);
    throw new Error("Fleet Manager not found.");
  }
});

/**
 * @route   POST /api/fleet-managers/logout
 * @desc    Log out the current fleet manager
 * @access  Private
 * @header  {String} Authorization - The bearer token of the fleet manager (required)
 * @returns {Object} - A JSON object with a message confirming the logout
 * @throws  {401} If the fleet manager is not authenticated
 * @throws  {500} If a server error occurs
 */
const logoutCurrentFleetManager = asyncHandler(async (req, res) => {
  res.cookie("jwt_fleet_manager", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully!" });
});

/**
 * @route   GET /api/fleet-managers
 * @desc    Retrieve a list of all fleet managers
 * @access  Private
 * @header  {String} Authorization - The bearer token of the admin (required)
 * @returns {Array} - A JSON array containing fleet manager objects
 * @throws  {401} If not authenticated
 * @throws  {500} If a server error occurs
 */
const getAllFleetManagers = asyncHandler(async (req, res) => {
  const managers = await FleetManager.find({});
  res.json(managers);
});

/**
 * @route   GET /api/fleet-managers/profile
 * @desc    Retrieve the current fleet manager's profile
 * @access  Private
 * @header  {String} Authorization - The bearer token of the fleet manager (required)
 * @returns {Object} - A JSON object containing the fleet manager's profile data
 * @throws  {401} If the fleet manager is not authenticated
 * @throws  {500} If a server error occurs
 */
const getCurrentFleetManagerProfile = asyncHandler(async (req, res) => {
  const manager = await FleetManager.findById(req.fleetManager._id).populate('servicedAreas');
  if (manager) {
    res.json({
      _id: manager._id,
      managerName: manager.managerName,
      address: manager.address,
      contact: manager.contact,
      profileImage: manager.profileImage,
      authNumber: manager.authNumber,
      email: manager.email,
      servicedAreas: manager.servicedAreas,
    });
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

/**
 * @route   PUT /api/fleet-managers/profile
 * @desc    Update the current fleet manager's profile
 * @access  Private
 * @header  {String} Authorization - The bearer token of the fleet manager (required)
 * @body    {Object} profileData - The updated profile data
 * @returns {Object} - A JSON object containing the updated fleet manager's profile data
 * @throws  {400} If the profile data is invalid
 * @throws  {401} If the fleet manager is not authenticated
 * @throws  {500} If a server error occurs
 */

const updateCurrentFleetManagerProfile = asyncHandler(async (req, res) => {
  console.log(req.body);
  const manager = await FleetManager.findById(req.fleetManager._id);

  if (manager) {
    // Update profile fields (other than password)
    manager.managerName = req.body.managerName || manager.managerName;
    manager.address = req.body.address || manager.address;
    manager.contact = req.body.contact || manager.contact;
    manager.profileImage = req.body.profileImage || manager.profileImage;
    manager.authNumber = req.body.authNumber || manager.authNumber;

    let passwordChanged = false;

    if (req.body.oldPassword && req.body.password && req.body.confirmPassword) {
      // Validate the current password
      const isMatch = await bcrypt.compare(req.body.oldPassword, manager.password);

      if (isMatch) {
        // Check if new password matches the confirm password
        if (req.body.password === req.body.confirmPassword) {
          // Encrypt and update the new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);

          manager.password = hashedPassword;
          passwordChanged = true;
        } else {
          res.status(400);
          throw new Error("New password and confirm password do not match.");
        }
      } else {
        res.status(401);
        throw new Error("Old password is incorrect.");
      }
    }

    const updatedManager = await manager.save();

    res.json({
      _id: updatedManager._id,
      managerName: updatedManager.managerName,
      address: updatedManager.address,
      contact: updatedManager.contact,
      profileImage: updatedManager.profileImage,
      authNumber: updatedManager.authNumber,
      email: updatedManager.email,
      message: passwordChanged
        ? "Password successfully changed!"
        : "Profile updated successfully!",
    });
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});


/**
 * @route   DELETE /api/fleet-managers/:id
 * @desc    Delete a fleet manager by ID
 * @access  Private
 * @header  {String} Authorization - The bearer token of the admin (required)
 * @param   {String} id - The ID of the fleet manager to delete
 * @returns {Object} - A JSON object confirming deletion
 * @throws  {401} If not authenticated
 * @throws  {403} If does not have permission to delete
 * @throws  {404} If the fleet manager is not found
 * @throws  {500} If a server error occurs
 */

const deleteFleetManagerById = asyncHandler(async (req, res) => {
  const manager = await FleetManager.findById(req.params.id);

  if (manager) {
    if (manager.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin fleet manager!");
    }

    await FleetManager.deleteOne({ _id: manager._id });
    res.json({ message: "Fleet Manager removed!" });
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

/**
 * @route   GET /api/admin/fleet-managers/:id
 * @desc    Retrieve a fleet manager by ID (Admin only)
 * @access  Private
 * @header  {String} Authorization - The bearer token of the admin (required)
 * @param   {String} id - The ID of the fleet manager to retrieve
 * @returns {Object} - A JSON object containing the fleet manager's profile data
 * @throws  {401} If not authenticated
 * @throws  {403} If not an admin
 * @throws  {404} If the fleet manager is not found
 * @throws  {500} If a server error occurs
 */

const getFleetManagerById = asyncHandler(async (req, res) => {
  const manager = await FleetManager.findById(req.params.id).select("-password");

  if (manager) {
    res.json(manager);
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

/**
 * @route   PUT /api/fleet-managers/:id
 * @desc    Update a fleet manager by ID (Admin only)
 * @access  Private
 * @header  {String} Authorization - The bearer token of the admin (required)
 * @param   {String} id - The ID of the fleet manager to update
 * @body    {Object} managerData - The updated fleet manager data
 * @returns {Object} - A JSON object containing the updated fleet manager's profile data
 * @throws  {400} If the manager data is invalid
 * @throws  {401} If not authenticated
 * @throws  {403} If not an admin
 * @throws  {404} If the fleet manager is not found
 * @throws  {500} If a server error occurs
 */

const updateFleetManagerById = asyncHandler(async (req, res) => {
  const manager = await FleetManager.findById(req.params.id);

  if (manager) {
    manager.managerName = req.body.managerName || manager.managerName;
    manager.email = req.body.email || manager.email;

    const updatedManager = await manager.save();

    res.json({
      _id: updatedManager._id,
      managerName: updatedManager.managerName,
      email: updatedManager.email,
    });
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

/**
 * @route   GET /api/fleet-managers/service-areas
 * @desc    Get Fleet Manager's serviced areas
 * @access  Private
 */
const getFleetManagerServiceAreas = asyncHandler(async (req, res) => {
  const manager = await FleetManager.findById(req.fleetManager._id).populate('servicedAreas');

  if (manager) {
    res.json(manager.servicedAreas || []);
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

/**
 * @route   POST /api/fleet-managers/service-areas/:areaId
 * @desc    Add an area to Fleet Manager's service areas
 * @access  Private
 */
const addServiceArea = asyncHandler(async (req, res) => {
  const { areaId } = req.params;

  const area = await Area.findById(areaId);
  if (!area) {
    res.status(404);
    throw new Error("Area not found!");
  }

  const manager = await FleetManager.findById(req.fleetManager._id);

  if (manager) {
    // Check if area is already in serviced areas
    if (manager.servicedAreas.includes(areaId)) {
      res.status(400);
      throw new Error("Area already in service areas!");
    }

    manager.servicedAreas.push(areaId);
    await manager.save();

    const updatedManager = await FleetManager.findById(req.fleetManager._id).populate('servicedAreas');
    res.json({
      message: "Service area added successfully!",
      servicedAreas: updatedManager.servicedAreas
    });
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

/**
 * @route   DELETE /api/fleet-managers/service-areas/:areaId
 * @desc    Remove an area from Fleet Manager's service areas
 * @access  Private
 */
const removeServiceArea = asyncHandler(async (req, res) => {
  const { areaId } = req.params;

  const manager = await FleetManager.findById(req.fleetManager._id);

  if (manager) {
    manager.servicedAreas = manager.servicedAreas.filter(
      (area) => area.toString() !== areaId
    );
    await manager.save();

    const updatedManager = await FleetManager.findById(req.fleetManager._id).populate('servicedAreas');
    res.json({
      message: "Service area removed successfully!",
      servicedAreas: updatedManager.servicedAreas
    });
  } else {
    res.status(404);
    throw new Error("Fleet Manager not found!");
  }
});

export {
  createFleetManager,
  loginFleetManager,
  logoutCurrentFleetManager,
  getAllFleetManagers,
  getCurrentFleetManagerProfile,
  updateCurrentFleetManagerProfile,
  deleteFleetManagerById,
  getFleetManagerById,
  updateFleetManagerById,
  getFleetManagerServiceAreas,
  addServiceArea,
  removeServiceArea,
};
