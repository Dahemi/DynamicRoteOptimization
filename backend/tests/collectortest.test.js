import request from "supertest";
import app from "../index"; // Ensure this points to where your Express app is exported

// Test suite for GET /api/collector/
describe("GET /api/collector/", () => {
  // Test case: Should return all garbage requests
  it("returns the collectors created", async () => {
    const res = await request(app).get("/api/collector/");

    // Check for successful response status
    expect(res.statusCode).toBe(200);

    // Expect a response body (assuming it's a list of collectors)
    expect(res.body); // Add more specific checks based on your API's response structure
  });

  // Test case: Should return 404 for an invalid endpoint
  it("returns 404 for an invalid endpoint", async () => {
    const res = await request(app).get("/api/invalid-endpoint/");

    // Expect 404 Not Found for invalid route
    expect(res.statusCode).toBe(404);
  });
});

// Test suite for POST /api/collector/
describe("POST /api/collector/", () => {
  // Test case: Should create a new collector with valid data
  it("should create a collector", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3bWFJZCI6IjY3MTE0NDJlYzMyOTg2NDMxNzEyYzljMCIsImlhdCI6MTcyOTQwNjY5NiwiZXhwIjoxNzMxOTk4Njk2fQ.gRlO3aEYURSfGZWRYz1eEI7GBOMclpP4sHiaZ0H8AKU"; // Replace with a valid JWT_wma token

    const res = await request(app)
      .post("/api/collector/")
      .set("Authorization", `Bearer ${token}`) // Set Authorization header
      .send({
        wmaId: "6711442ec32986431712c9c0", 
        truckNumber: "TI2424", 
        collectorName: "Saman", 
        collectorNIC: "20012545421",
        contactNo: "0774338424" // Replace with a valid area ID
      });

    // Check for successful creation status
    expect(res.statusCode).toBe(201);

    // Expect the response to contain a newly created garbage request ID
    expect(res.body).toHaveProperty("_id");
  });

  // Test case: Should fail to create a garbage request without a token
  it("should fail to create a collector without a token", async () => {
    const res = await request(app).post("/api/collector/").send({
      wmaId: "6711442ec32986431712c9c0", 
      truckNumber: "KL5498", 
      collectorName: "Saman Ekanayaka", 
      collectorNIC: "204578632148",
      contactNo: "0774345789" // Replace with a valid area ID
    });

    // Expect a failure due to missing authorization token
    expect(res.statusCode).toBe(500); // Adjust the status code based on your error handling (401 Unauthorized would be ideal)
  });

  // Test case: Should fail to create a garbage request with invalid data
  it("should fail to create a collector with invalid data", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3bWFJZCI6IjY3MTE0NDJlYzMyOTg2NDMxNzEyYzljMCIsImlhdCI6MTcyOTM1NTA5MCwiZXhwIjoxNzMxOTQ3MDkwfQ.FLFZRJB-otuLKZr59WbAq5oAZdMMMZNf6bRLTd-0DFg"; // Replace with a valid JWT token

    const res = await request(app)
      .post("/api/collector/")
      .set("Authorization", `Bearer ${token}`) // Set Authorization header
      .send({
        wmaId: "6711442ec32986431712c9c0", 
        truckNumber: "KL5498", 
        collectorName: "Saman Ekanayaka", 
        collectorNIC: 204578632148, //invalide data collectorId should be string
        contactNo: "0774345789" 
      });

    // Expect a failure due to invalid data
    expect(res.statusCode).toBe(500); // Adjust status code based on your validation handling (400 Bad Request might be ideal)
  });
});

// Test suite for DELETE /api/collector/:id
describe("DELETE /api/collector/:id", () => {
  // Test case: Should successfully delete a collector
  it("should delete a collector", async () => {
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3bWFJZCI6IjY3MTE0NDJlYzMyOTg2NDMxNzEyYzljMCIsImlhdCI6MTcyOTM1NTA5MCwiZXhwIjoxNzMxOTQ3MDkwfQ.FLFZRJB-otuLKZr59WbAq5oAZdMMMZNf6bRLTd-0DFg"; // Replace with a valid JWT token
    const collectorId = "671418d0ce9ffd88a80f5f01"; // Replace with a valid collector ID

    const res = await request(app)
      .delete(`/api/collector/${collectorId}`);
      // .set("Authorization", `Bearer ${token}`); // Set Authorization header

    // Expect successful deletion status
    expect(res.statusCode).toBe(200);

    // Expect a success message confirming the deletion
    expect(res.body).toHaveProperty("message", "Collector removed successfully!");
  });

  // Test case: Should fail to delete a collector without a token
  it("should fail to delete a collector without a token", async () => {
    const collectorId = "67141826ce9ffd88a80f5ee2"; // Replace with a valid collector ID

    const res = await request(app).delete(`/api/collector/${collectorId}`);

    // Expect a failure due to missing authorization token
    expect(res.statusCode).toBe(500); // Adjust based on your error handling (401 Unauthorized would be ideal)
  });

  // Test case: Should fail to delete a collector with an invalid ID
  it("should fail to delete a collector with an invalid ID", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3bWFJZCI6IjY3MTE0NDJlYzMyOTg2NDMxNzEyYzljMCIsImlhdCI6MTcyOTM1NTA5MCwiZXhwIjoxNzMxOTQ3MDkwfQ.FLFZRJB-otuLKZr59WbAq5oAZdMMMZNf6bRLTd-0DFg"; // Replace with a valid JWT token

    const invalidId = "67136163761e1471asdasdqed4cd5ce6"; // Invalid garbage ID

    const res = await request(app)
      .delete(`/api/collector/${invalidId}`)
      .set("Authorization", `Bearer ${token}`); // Set Authorization header

    // Expect a failure due to invalid ID (collector not found)
    expect(res.statusCode).toBe(500); // Adjust based on your error handling (404 Not Found might be ideal)
  });
});

describe("POST /api/collector/auth", () => {
  // Test case for logging in a collector with correct credentials
  it("should log in a collector with correct credentials", async () => {
    const res = await request(app).post("/api/collector/auth").send({
      collectorNIC: "204578632148",
      truckNumber: "KL5498",
    });
    expect(res.statusCode).toBe(201); // Expecting a 201 status code for successful login
    expect(res.body).toHaveProperty("token"); // Assuming your API returns a token
  });

  // Test case for handling incorrect login credentials
  it("should return error with incorrect credentials", async () => {
    const res = await request(app).post("/api/collector/auth").send({
        collectorNIC: "200121457801",
        truckNumber: "LK2098",
    });
    expect(res.statusCode).toBe(500); // Assuming 500 for Unauthorized
    expect(res.body).toHaveProperty("message"); // Expecting an error message in the response body
  });
});
