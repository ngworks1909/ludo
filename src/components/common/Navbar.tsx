import { useEffect, useState } from "react";
import {  Image, LayoutDashboard, Menu, Users, UserCog, CreditCard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authTokenState, userRoleState } from "@/store/AuthState";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";

const allNavItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["superadmin", "admin", "employee"] },
  { name: "Admins", href: "/admins", icon: Users, roles: ["superadmin", "admin"] },
  { name: "Banners", href: "/banners", icon: Image, roles: ["superadmin", "admin"] },
  { name: "Users", href: "/users", icon: Users, roles: ["superadmin", "admin"] },
  // { name: "Activity", href: "/activity", icon: Activity, roles: ["superadmin", "admin", "employee"] },
  // { name: "Bots Activity", href: "/bots-activity", icon: Bot, roles: ["superadmin", "admin", "employee"] },
  { name: "Support", href: "/support", icon: UserCog, roles: ["superadmin", "admin", "employee"] },
  // { name: "Notifications", href: "/notifications", icon: Bell, roles: ["superadmin", "admin", "employee"] },
  { name: "Feedback", href: "/feedback", icon: CreditCard, roles: ["superadmin", "admin", "employee"] },
  { name: "Payouts", href: "/payments", icon: CreditCard, roles: ["superadmin", "admin", "employee"] },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authTokenState);
  const { toast } = useToast();
  const location = useLocation();
  const userRole = useRecoilValue(userRoleState);

  const navItems = allNavItems.filter(item => item.roles.includes(userRole || ""));

  const logOut = () => {
    sessionStorage.removeItem('authToken');
    toast({
      title: "Logout Successful!",
      description: "You have successfully logged out.",
      variant: "destructive"
    });
    setAuth(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex h-14 lg:h-[60px] items-center justify-between md:justify-start gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 transition-shadow duration-200 backdrop-saturate-[180%] backdrop-blur-[5px] ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <Link className="flex items-center gap-2 font-semibold" to="/">
        <LayoutDashboard className="h-6 w-6" />
        <span className="">Klik</span>
      </Link>
      <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.name}
            className={`text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              location.pathname === item.href ? "text-gray-900 dark:text-gray-50 font-semibold" : ""
            }`}
            to={item.href}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-4 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  className={`flex items-center gap-2 ${
                    location.pathname === item.href ? "text-gray-900 dark:text-gray-50 font-semibold" : ""
                  }`}
                  to={item.href}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
              size="icon"
              variant="ghost"
            >
              <Avatar className="w-7 h-7">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => {e.preventDefault(); logOut()}} >Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}