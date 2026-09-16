import { apiClient } from "./apiClient";

export const AuthApi ={
   register: async (data) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  login : async (data)=>{
    const response = await apiClient.post("/auth/login",data);
    return response.data;
  },
  user : async ()=>{
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
}