import { NextRequest, NextResponse } from "next/server";
import { withDeveloperAccess } from "@/lib/auth-utils";

// Mock user data for demonstration purposes.
// In a real application, this data would come from a database.
const generateMockUsers = () => [
  {
    id: "1",
    email: "user1@example.com",
    name: "John Doe",
    plan: "free",
    createdAt: "2024-01-15T10:00:00Z",
    lastActive: "2024-01-20T15:30:00Z",
    tasksCompleted: 45,
  },
  {
    id: "2",
    email: "user2@example.com",
    name: "Jane Smith",
    plan: "premium",
    createdAt: "2024-01-10T08:00:00Z",
    lastActive: "2024-01-21T09:15:00Z",
    tasksCompleted: 128,
  },
  {
    id: "3",
    email: "user3@example.com",
    name: "Bob Johnson",
    plan: "pro",
    createdAt: "2024-01-05T12:00:00Z",
    lastActive: "2024-01-21T14:45:00Z",
    tasksCompleted: 267,
  },
];

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieves a list of users
 *     description: Fetches a paginated and filtered list of users. Developer access is required.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of users per page.
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *         description: Filter users by plan (free, premium, pro).
 *     responses:
 *       200:
 *         description: A list of users with pagination and stats.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export const GET = withDeveloperAccess(
  async (user: { id: string; email?: string; isDeveloper?: boolean }, request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const plan = searchParams.get("plan");
      
      // In a real application, you would query your database here.
      let users = generateMockUsers();
      
      // Filter users by plan if the parameter is provided
      if (plan && plan !== "all") {
        users = users.filter(u => u.plan === plan);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = users.slice(startIndex, endIndex);
      
      return NextResponse.json({
        success: true,
        data: {
          users: paginatedUsers,
          pagination: {
            page,
            limit,
            total: users.length,
            totalPages: Math.ceil(users.length / limit),
          },
          stats: {
            totalUsers: users.length,
            planDistribution: {
              free: users.filter(u => u.plan === "free").length,
              premium: users.filter(u => u.plan === "premium").length,
              pro: users.filter(u => u.plan === "pro").length,
            },
          },
        },
        requestedBy: {
          id: user.id,
          email: user.email,
          isDeveloper: user.isDeveloper,
        },
      });
    } catch (error) {
      console.error("Admin users API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }
  }
);

/**
 * @swagger
 * /api/admin/users:
 *   put:
 *     summary: Updates a user's plan
 *     description: Updates a specific user's subscription plan. Developer access is required.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               plan:
 *                 type: string
 *                 enum: [free, premium, pro]
 *     responses:
 *       200:
 *         description: User plan updated successfully.
 *       400:
 *         description: Bad request (e.g., missing userId or invalid plan).
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export const PUT = withDeveloperAccess(
  async (user: { id: string; email?: string; isDeveloper?: boolean }, request: NextRequest) => {
    try {
      const body = await request.json();
      const { userId, plan } = body;
      
      if (!userId || !plan) {
        return NextResponse.json(
          { error: "userId and plan are required" },
          { status: 400 }
        );
      }
      
      if (!["free", "premium", "pro"].includes(plan)) {
        return NextResponse.json(
          { error: "Invalid plan. Must be free, premium, or pro" },
          { status: 400 }
        );
      }
      
      // In a real application, you would update the user in your database here.
      console.log(`Admin ${user.email} updated user ${userId} to plan ${plan}`);
      
      return NextResponse.json({
        success: true,
        message: `User plan updated to ${plan}`,
        updatedBy: user.email,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Admin user update error:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  }
);
