import { apiService } from "@/lib/apiService";

const registerUser = async (data: object) => {
  return apiService.post("/user/register", data);
};
const loginUser = async (data: object) => {
  return apiService.post("/user/login", data);
};

const logoutUser = async () => {
  return apiService.post("/user/logout");
};

const loggedUser = async () => {
  return apiService.get("/user/logged-user");
};

const allUsers = async () => {
  return apiService.get("/user");
};

const updateUser = async (data:object) => {
  return apiService.patch("/user/update-profile",data);
};

export const authApi = {
  loginUser,
  logoutUser,
  registerUser,
  loggedUser,
  updateUser,
  allUsers,
};
