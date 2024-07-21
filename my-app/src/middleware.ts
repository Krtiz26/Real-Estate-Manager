import { clerkMiddleware,  } from "@clerk/nextjs/server";
 
export default clerkMiddleware({
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Matches all routes except _next and static files
    '/',                      // Matches the root route
    '/(api|trpc)(.*)',        // Matches api and trpc routes
  ],
};