import { apiService } from "@/lib/apiService";

const loginUser = async (data: object) => {
  return apiService.post("/user/login", data);
};

export const authApi = { loginUser };
