import { supabase } from "./supabase";

/**
 * Upload image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - Folder path in storage (default: 'blog-images')
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = "blog-images"): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      // If bucket doesn't exist or access denied, throw error to trigger fallback
      if (error.message.includes("Bucket not found") || error.message.includes("new row violates")) {
        throw new Error("Storage bucket not configured");
      }
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Convert file to base64 data URL
 * @param file - The file to convert
 * @returns Base64 data URL
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

