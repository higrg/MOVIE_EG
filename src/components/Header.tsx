
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, MessageCircle, ListVideo } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  }

  const getFullName = () => {
    if (!user) return '';
    const { first_name, last_name } = user.user_metadata;
    return [first_name, last_name].filter(Boolean).join(' ') || user.email;
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent">
      <h1 className="text-2xl md:text-3xl font-black text-primary tracking-wider uppercase cursor-pointer" onClick={() => navigate('/')}>Movie EG</h1>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/watchlist')}
              className="text-white hover:text-primary"
            >
              <ListVideo className="h-4 w-4 mr-2" />
              Watchlist
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/community')}
              className="text-white hover:text-primary"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Community
            </Button>
          </>
        )}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata.avatar_url} alt="User avatar" />
                  <AvatarFallback>
                    {getInitials(user.user_metadata.first_name, user.user_metadata.last_name) || user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getFullName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        )}
      </div>
    </header>
  );
};

export default Header;
