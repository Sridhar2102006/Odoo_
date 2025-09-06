import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase not configured, returning mock client")
    // Return a mock client that provides demo functionality
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async (credentials: any) => {
          console.log("[v0] Demo mode: Sign up attempted with", credentials.email)
          return {
            data: {
              user: {
                id: "demo-user",
                email: credentials.email,
                user_metadata: { full_name: credentials.options?.data?.full_name || "Demo User" },
              },
            },
            error: null,
          }
        },
        signInWithPassword: async (credentials: any) => {
          console.log("[v0] Demo mode: Sign in attempted with", credentials.email)
          return {
            data: {
              user: {
                id: "demo-user",
                email: credentials.email,
                user_metadata: { full_name: "Demo User" },
              },
            },
            error: null,
          }
        },
        signOut: async () => {
          console.log("[v0] Demo mode: Sign out")
          return { error: null }
        },
        onAuthStateChange: (callback: any) => {
          // Mock auth state change
          return { data: { subscription: { unsubscribe: () => {} } } }
        },
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            data:
              table === "listings"
                ? [
                    {
                      id: "1",
                      name: "Demo Vintage Jacket",
                      price: 89.99,
                      category: "Fashion",
                      condition: "Good",
                      status: "active",
                      views: 42,
                      image_url: "/vintage-leather-jacket.png",
                      created_at: new Date().toISOString(),
                      user_id: "demo-user",
                    },
                  ]
                : [],
            error: null,
          }),
          order: (column: string, options?: any) => ({
            data:
              table === "listings"
                ? [
                    {
                      id: "1",
                      name: "Demo Vintage Jacket",
                      price: 89.99,
                      category: "Fashion",
                      condition: "Good",
                      status: "active",
                      views: 42,
                      image_url: "/vintage-leather-jacket.png",
                      created_at: new Date().toISOString(),
                      user_id: "demo-user",
                    },
                  ]
                : [],
            error: null,
          }),
        }),
        insert: (data: any) => {
          console.log("[v0] Demo mode: Insert attempted", data)
          return { data: { ...data, id: Math.random().toString() }, error: null }
        },
        update: (data: any) => {
          console.log("[v0] Demo mode: Update attempted", data)
          return { data, error: null }
        },
        delete: () => {
          console.log("[v0] Demo mode: Delete attempted")
          return { data: null, error: null }
        },
      }),
      channel: (name: string) => ({
        on: (event: string, filter: any, callback: any) => ({
          subscribe: () => console.log("[v0] Demo mode: Subscribed to", name, event),
        }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
