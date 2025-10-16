import request from "supertest";
import app from "../index"; // Ensure this points to where your Express app is exported

// Test suite for POST /api/users
describe("POST /api/users", () => {
    // Test case: Should create a new user with valid data
    it("should create a new user", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          username: "Triyo",
          address: "123 Main St",
          area: "6703ffa8c936b7432d667c8e", // Replace with a valid area ID
          contact: "1234567890",
          profileImage: "http://res.cloudinary.com/dg8cpnx1m/image/upload/v1729342006/o3ccxlp1hujojal195bz.jpg",
          email: "Triyo@gmail.com",
          password: "password123",
        });
  
      // Check for successful creation status
      expect(res.statusCode).toBe(201);
  
      // Expect the response to contain a newly created user ID and relevant fields
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("username", "Triyo");
      expect(res.body).toHaveProperty("email", "Triyo@gmail.com");
    });
  
    // Test case: Should fail to create a user if email is already in use
    it("should fail to create a user if email already exists", async () => {
      // Assume a user with this email already exists in the database
      const res = await request(app).post("/api/users").send({
        username: "Triyoooo",
        address: "456 Elm St",
        area: "6703ffa8c936b7432d667c8e", // Replace with a valid area ID
        contact: "0987654321",
        profileImage: "http://res.cloudinary.com/dg8cpnx1m/image/upload/v1729342006/o3ccxlp1hujojal195bz.jpg",
        email: "Triyo@gmail.com", // Duplicate email
        password: "password123",
      });
  
      // Expect a failure due to existing email
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe("User already exists!!!");
    });
  
    // Test case: Should fail to create a user with missing fields
    it("should fail to create a user with missing fields", async () => {
      const res = await request(app).post("/api/users").send({
        address: "789 Maple St",
        area: "6703ffa8c936b7432d667c8e", // Replace with a valid area ID
        email: "missingfields@example.com",
        password: "password123",
      });
  
      // Expect a failure due to missing required fields
      expect(res.statusCode).toBe(500); // Adjust status code if your error handling changes
      expect(res.body).toHaveProperty("message", "Please fill all the inputs!!!");
    });
  
  });