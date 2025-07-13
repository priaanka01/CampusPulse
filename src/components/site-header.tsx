'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, LogIn, LogOut, User, Settings, PlusCircle, UserCheck, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { User as UserType } from '@/types';


const SiteHeader = () => {
  const { user, login, logout } = useAuth();

  const handleLogin = (role: UserType['role']) => {
    login({
        name: role === 'organizer' ? 'Event Organizer' : 'Alex Doe',
        email: role === 'organizer' ? 'organizer@example.com' : 'alex.doe@example.com',
        role: role,
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg text-primary">
            CampusPulse
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                 {user.role === 'organizer' && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/create-event">
                      <PlusCircle className="mr-2"/>
                      Create Event
                    </Link>
                  </Button>
                 )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                    >
                        <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage
                            src="https://placehold.co/100x100.png"
                            alt="User Avatar"
                            data-ai-hint="user avatar"
                        />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                         <p className="text-xs leading-none text-primary pt-1 capitalize">
                            {user.role}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Choose Your Role</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you here to discover amazing events or to create them? Select your role to continue.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center gap-4 pt-4">
                             <AlertDialogAction onClick={() => handleLogin('participant')} className="w-full sm:w-auto">
                                <Users className="mr-2"/>
                                I'm a Participant
                            </AlertDialogAction>
                            <AlertDialogAction onClick={() => handleLogin('organizer')} className="w-full sm:w-auto">
                                <UserCheck className="mr-2" />
                                I'm an Organizer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
