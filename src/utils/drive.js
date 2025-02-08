import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Load credentials
const KEYFILEPATH = path.join(__dirname, "your-service-account.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export const uploadToDrive = async (file) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: ["YOUR_FOLDER_ID"], // Replace with your Google Drive folder ID
      },
      media: {
        mimeType: file.mimetype,
        body: Buffer.from(file.buffer),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
};
