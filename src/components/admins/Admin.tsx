
import { Trash2 } from "lucide-react";
import Navbar from "../common/Navbar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

export default function Admin() {
  const adminData = [
    { name: "John Doe", email: "john@example.com", role: "Super Admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "Admin" },
    { name: "Mike Johnson", email: "mike@example.com", role: "Moderator" },
    { name: "Sarah Brown", email: "sarah@example.com", role: "Editor" },
    { name: "Chris Lee", email: "chris@example.com", role: "Viewer" },
    { name: "Alex Wong", email: "alex@example.com", role: "Admin" },
  ]
  return (
    <div className="flex min-h-screen w-full flex-col">
    <Navbar/>
    <main className="flex-1 overflow-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminData.map((admin, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{admin.name}</CardTitle>
                <Badge variant="secondary">{admin.role}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {}}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Admin
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
  </div>
  )
}
