import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasPermission } from "@/lib/rbac"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to read users
    const userPermissions = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!userPermissions) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const roles = userPermissions.userRoles.map((ur: any) => ur.role.name)
    const rolePermissions = userPermissions.userRoles.flatMap((ur: any) =>
      ur.role.permissions.map((rp: any) => rp.permission.name)
    )
    const userPermissionsList = userPermissions.permissions
      .filter((up: any) => up.granted)
      .map((up: any) => up.permission.name)

    const allPermissions = [...new Set([...rolePermissions, ...userPermissionsList])]

    if (!allPermissions.includes("user:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Fetch users (with pagination for production)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        userRoles: {
          include: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create users
    const userPermissions = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!userPermissions) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const roles = userPermissions.userRoles.map((ur: any) => ur.role.name)
    const rolePermissions = userPermissions.userRoles.flatMap((ur: any) =>
      ur.role.permissions.map((rp: any) => rp.permission.name)
    )
    const userPermissionsList = userPermissions.permissions
      .filter((up: any) => up.granted)
      .map((up: any) => up.permission.name)

    const allPermissions = [...new Set([...rolePermissions, ...userPermissionsList])]

    if (!allPermissions.includes("user:create")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create user logic would go here
    // For now, just return success
    return NextResponse.json({ message: "User creation endpoint" })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 