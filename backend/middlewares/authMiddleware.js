import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import FleetManager from "../models/fleetManagerModel.js";
import Collector from "../models/collectorModel.js";
import asyncHandler from "./asyncHandler.js";

/**
 * Middleware to authenticate a user based on JWT token stored in cookies.
 *
 * This middleware reads the JWT token from the 'jwt' cookie, verifies it, and attaches the user information
 * to the request object if the token is valid. If the token is missing or invalid, it responds with a 401 status code.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @throws {Error} If the token is missing or invalid.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Check JWT in 'Authorization' header or 'jwt' cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt; // Extract token from cookie
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/**
 * Middleware to authenticate Fleet Manager users using JWT.
 *
 * This middleware reads the JWT from the 'jwt_fleet_manager' cookie, verifies it, and attaches
 * the authenticated Fleet Manager user to the request object. If the token is invalid or missing,
 * it responds with a 401 status and an appropriate error message.
 *
 * @function authenticateFleetManager
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if the token is invalid or missing
 */
const authenticateFleetManager = asyncHandler(async (req, res, next) => {
  let token;

  // Check JWT in 'Authorization' header or 'jwt_fleet_manager' cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  } else if (req.cookies.jwt_fleet_manager) {
    token = req.cookies.jwt_fleet_manager; // Extract token from 'jwt_fleet_manager' cookie
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.fleetManager = await FleetManager.findById(decoded.fleetManagerId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no Fleet Manager token");
  }
});


/**
 * Middleware to authenticate collector (Web Management Application) users using JWT.
 *
 * This middleware reads the JWT from the 'jwt_collector' cookie, verifies it, and attaches
 * the authenticated collector user to the request object. If the token is invalid or missing,
 * it responds with a 401 status and an appropriate error message.
 *
 * @function authenticateCollector
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if the token is invalid or missing
 */
const authenticateCollector = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt_collector;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.collector = await Collector.findById(decoded.collectorNIC).select(
        "-truckNumber"
      );
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no Collector token");
  }
});

// Check admin authentication
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as admin!!!");
  }
};

export { authenticate, authenticateFleetManager, authorizeAdmin, authenticateCollector };
