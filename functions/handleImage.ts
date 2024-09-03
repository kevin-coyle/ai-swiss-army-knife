import { z } from "zod";
import fs from "fs";

const handleImageSchema = z.object({
  imagePath: z.string().nonempty(),
});

export const handleImage = async (options) => {
  const { imagePath } = options;
  console.log("Handling Image..." + imagePath);
  if (!fs.existsSync(imagePath)) {
    throw new Error("Image file does not exist.");
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  return {
    base64Image,
  };
};
