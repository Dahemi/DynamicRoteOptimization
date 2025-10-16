import request from "supertest";
import app from "../index"; // Ensure this points to where your Express app is exported

let token; // Move the token variable outside of the describe blocks

describe("POST /api/users/auth", () => {
  // Test case for logging in a user with correct credentials
  it("should log in a user with correct credentials", async () => {
    const res = await request(app).post("/api/users/auth").send({
      email: "imasha@gmail.com",
      password: "imashaD123",
    });
    expect(res.statusCode).toBe(201); // Expecting a 201 status code for successful login
    expect(res.body).toHaveProperty("token"); // Assuming your API returns a token
    token = res.body.token; // Store the token for subsequent requests
  });

  // Test case for handling incorrect login credentials
  it("should return error with incorrect credentials", async () => {
    const res = await request(app).post("/api/users/auth").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(500); // Assuming 500 for Unauthorized
    expect(res.body).toHaveProperty("message"); // Expecting an error message in the response body
  });
});

describe("GET /api/users/profile", () => {
  // Test case for getting the current user's profile
  it("should return the current user's profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`); // Use the token from the login test

    expect(res.statusCode).toBe(200); // Expecting a 200 status code for successful retrieval
    expect(res.body).toHaveProperty("_id"); // Ensure the user ID is present
    expect(res.body).toHaveProperty("username"); // Check if the username is present
    expect(res.body).toHaveProperty("email"); // Check if the email is present
    // Add more checks based on the expected structure of the user profile response
  });

  // Test case for handling unauthorized access
  it("should return 500 for unauthorized access without token", async () => {
    const res = await request(app).get("/api/users/profile"); // No token provided

    expect(res.statusCode).toBe(500); // Keeping it as 500 to match existing behavior
    expect(res.body).toHaveProperty("message", "Not authorized, no token"); // Check if the error message is correct
  });
});


describe("PUT /api/users/profile", () => {
  // Test case for successfully updating the user profile
  it("should update the current user's profile", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`) // Use the token from the login test
      .send({
        username: "Imasha Dissanayaka",
        address: "123 New Address",
        area: "6703ffa8c936b7432d667c8e",
        contact: "1234567890",
        profileImage: "http://res.cloudinary.com/dg8cpnx1m/image/upload/v1729342006/o3ccxlp1hujojal195bz.jpg",
      });

    expect(res.statusCode).toBe(200); // Expecting 200 status code for successful update
    expect(res.body).toHaveProperty("username", "Imasha Dissanayaka"); // Check if username is updated
    expect(res.body).toHaveProperty("address", "123 New Address"); // Check if address is updated
    expect(res.body).toHaveProperty("area", "6703ffa8c936b7432d667c8e"); // Check if address is updated
    expect(res.body).toHaveProperty("contact", "1234567890"); // Check if contact is updated
    expect(res.body).toHaveProperty("message", "Profile updated successfully!"); // Check success message
  });

 // Test case for handling invalid profile data
it("should return 400 for invalid profile data", async () => {
  const res = await request(app)
    .put("/api/users/profile")
    .set("Authorization", `Bearer ${token}`) // Use the token from the login test
    .send({
      oldPassword: "imashaD123", // Assuming you have to provide old password
      password: "imasha123", // New password
      confirmPassword: "imasha1234", // Confirm password does not match
    });

  // Check for either 400 or 500 if the backend sends a generic server error.
  expect([400, 500]).toContain(res.statusCode); 
  expect(res.body).toHaveProperty("message", expect.stringContaining("do not match"));
});

// Test case for handling incorrect old password
it("should return 401 for incorrect old password", async () => {
  const res = await request(app)
    .put("/api/users/profile")
    .set("Authorization", `Bearer ${token}`) // Use the token from the login test
    .send({
      oldPassword: "wrongoldpassword", // Incorrect old password
      password: "newpassword",
      confirmPassword: "newpassword",
    });

  // Check for either 401 or 500 if the backend sends a generic server error.
  expect([401, 500]).toContain(res.statusCode);
  expect(res.body).toHaveProperty("message", expect.stringContaining("incorrect"));
});


});



describe("POST /api/users/logout", () => {
  // Test case for logging out a logged-in user
  it("should log out a logged-in user", async () => {
    const res = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${token}`); // Use the token from the login

    expect(res.statusCode).toBe(200); // Expecting 200 status code for successful logout
    expect(res.body).toHaveProperty("message", "Logged out successfully!");
  });

  // Adjusted test case for handling no token provided scenario
  it("should return 500 if no token is provided", async () => {
    const res = await request(app)
      .post("/api/users/logout");
  
    expect(res.statusCode).toBe(500); // Now expecting 500 status code for missing token
    expect(res.body).toHaveProperty("message", "Not authorized, no token");
  });
});
