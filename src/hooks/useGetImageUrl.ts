import { cloudName, cloudPreset } from "@/lib/config";
import axios, { AxiosResponse } from "axios";

interface CloudinaryResponse {
  secure_url: string;
}

const useGetImageUrl = () => {
  const getImageUrl = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${cloudPreset}`);

      const response: AxiosResponse<CloudinaryResponse> = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return { getImageUrl };
};

export default useGetImageUrl;
