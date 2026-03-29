import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 shadow-xs bg-background/80 backdrop-blur-2xl supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-sm shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <span className="font-extrabold sm:inline-block tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 text-lg">Pulse Chat</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              className="hidden md:flex transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              to="/"
              className="hidden md:flex transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">
                Hello, {user.username || user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block">Logout</span>
              </Button>
            </div>
          ) : (
            <nav className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-linear-to-br from-primary to-primary/80 hover:shadow-md hover:shadow-primary/25 transition-all duration-300 rounded-lg">Get Started</Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
