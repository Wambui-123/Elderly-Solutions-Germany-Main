
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { updateUserProfile } from "@/firebase/users";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contactNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


export default function ProfilePage() {
    const { user, loading } = useUser();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            contactNumber: '',
        }
    });
    
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || '',
                contactNumber: user.contactNumber || '',
            });
        }
    }, [user, form]);

    if (loading) {
        return (
             <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return <p>User not found. Please log in again.</p>
    }

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        try {
            await updateUserProfile(user.id, data);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Could not save your profile changes.",
            });
            console.error("Profile update failed:", error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <h1 className="font-headline text-3xl font-bold mb-6">Profile & Settings</h1>
            <div className="max-w-4xl mx-auto w-full grid gap-6">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal details and photo here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <Avatar className="h-24 w-24">
                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                <AvatarFallback className="text-3xl">{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                                            </Avatar>
                                            <Button variant="outline" size="sm">Change Photo</Button>
                                        </div>
                                        <div className="w-full space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label>Full Name</Label>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" type="email" defaultValue={user.email} readOnly disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <FormField
                                        control={form.control}
                                        name="contactNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Phone Number</Label>
                                                <FormControl>
                                                    <Input placeholder="Your contact phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
                    <Card className="mt-6">
                        <Separator className="my-6" />
                        <CardHeader>
                            <CardTitle>Accessibility</CardTitle>
                            <CardDescription>Customize the app to your needs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="font-size">Font Size</Label>
                                <Select defaultValue="md">
                                    <SelectTrigger id="font-size">
                                        <SelectValue placeholder="Select font size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sm">Small</SelectItem>
                                        <SelectItem value="md">Medium</SelectItem>
                                        <SelectItem value="lg">Large</SelectItem>
                                        <SelectItem value="xl">Extra Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                         <Separator className="my-6" />
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div>
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Receive updates via email.</p>
                                </div>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div>
                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Receive updates on your device.</p>
                                </div>
                                <Switch id="push-notifications" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
