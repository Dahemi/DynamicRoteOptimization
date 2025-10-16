import ApiHelper from "../helpers/apiHelper";

class FleetManagerAuthService {
  constructor() {
    this.api = new ApiHelper();
  }

  async fleetManagerRegister(managerData) {
    try {
      const response = await this.api.post("fleet-managers", managerData);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      console.error("Fleet Manager Registration error:", error);
      throw error;
    }
  }

  async fleetManagerLogin(credentials) {
    try {
      const response = await this.api.post("fleet-managers/auth", credentials);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("fleetManagerId", response._id);
      }
      return response;
    } catch (error) {
      console.error("Fleet Manager Login error:", error);
      throw error;
    }
  }

  async getCurrentFleetManagerDetails() {
    try {
      const response = await this.api.get(
        "fleet-managers/profile",
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching current fleet manager profile:", error);
      throw error;
    }
  }

  async getAllFleetManagers() {
    try {
      const managers = await this.api.get(
        "fleet-managers",
        {},
        {
          withCredentials: true,
        }
      );
      return managers;
    } catch (error) {
      console.error("Error fetching fleet managers:", error.message);
      throw error;
    }
  }

  async deleteFleetManager(id) {
    try {
      const deletedManager = await this.api.delete(`fleet-managers/${id}`);
      return deletedManager.data;
    } catch (error) {
      console.error("Error deleting fleet manager:", error.message);
      throw error;
    }
  }

  async updateFleetManager(managerProfileData) {
    console.log(managerProfileData);
    try {
      const response = await this.api.put("fleet-managers/profile", managerProfileData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating fleet manager profile:", error);
      throw error;
    }
  }

  async logoutCurrentFleetManager() {
    try {
      const response = await this.api.post("fleet-managers/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("fleetManagerId");
    localStorage.removeItem("userInfo");
  }

  isAuthenticatedFleetManager() {
    return localStorage.getItem("token") !== null;
  }

  getFleetManagerToken() {
    return localStorage.getItem("token");
  }

  getFleetManagerId() {
    return localStorage.getItem("fleetManagerId");
  }

  async getFleetManagerServiceAreas() {
    try {
      const response = await this.api.get("fleet-managers/service-areas", {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching Fleet Manager service areas:", error);
      throw error;
    }
  }

  async addServiceArea(areaId) {
    try {
      const response = await this.api.post(
        `fleet-managers/service-areas/${areaId}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error adding service area:", error);
      throw error;
    }
  }

  async removeServiceArea(areaId) {
    try {
      const response = await this.api.delete(`fleet-managers/service-areas/${areaId}`);
      return response;
    } catch (error) {
      console.error("Error removing service area:", error);
      throw error;
    }
  }

  async getAnalyticsOverview() {
    try {
      const response = await this.api.get("analytics/overview", {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      throw error;
    }
  }
}

export default new FleetManagerAuthService();
