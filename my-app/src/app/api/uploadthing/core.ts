// Resource: https://docs.uploadthing.com/nextjs/appdir#creating-your-first-fileroute
// Above resource shows how to setup uploadthing. Copy paste most of it as it is.
// We're changing a few things in the middleware and configs of the file upload i.e., "media", "maxFileCount"

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";

// Initialize Uploadthing instance
const f = createUploadthing();

// Function to get current user from Clerk
const getUser = async () => {
  const user = await currentUser();
  return user;
};

// Define the file router
export const ourFileRouter = {
  // Define the 'media' file route with image configurations
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Middleware to enforce user authorization
    .middleware(async (req) => {
      const user = await getUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    // Handle post-upload operations
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      // Log the file object to inspect its properties
      console.log("file object:", file);

      // Ensure the property exists or handle the absence
      const fileUrl = (file as any)?.url || 'URL not available';
      console.log("file URL:", fileUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
