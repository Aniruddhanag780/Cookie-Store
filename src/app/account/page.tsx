'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, doc, setDoc } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, UserAccount } from '@/lib/types';
import { useMemoFirebase, useAuth } from '@/firebase/provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

interface Order {
  id: string;
  date: string; // Assuming ISO string date
  status: 'Delivered' | 'Processing' | 'Shipped';
  total: number;
  items: Product[];
}

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email(),
  address: z.string().min(5, { message: 'A valid address is required.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
    },
  });

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    if (user && userProfileRef) {
        const fetchUserProfile = async () => {
            const { getDoc } = await import('firebase/firestore');
            const docSnap = await getDoc(userProfileRef);
            if (docSnap.exists()) {
                const profileData = docSnap.data() as UserAccount;
                setUserProfile(profileData);
                form.reset({
                    fullName: user.displayName || profileData.firstName + ' ' + profileData.lastName || '',
                    email: user.email || '',
                    address: profileData.address || '',
                });
            } else {
                 form.reset({
                    fullName: user.displayName || '',
                    email: user.email || '',
                    address: '',
                });
            }
        }
        fetchUserProfile();
    }
  }, [user, userProfileRef, form]);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) return;

    try {
        // Update Firebase Auth profile
        await updateProfile(user, {
            displayName: data.fullName,
        });

        // Update Firestore profile
        const userDocRef = doc(firestore, 'users', user.uid);
        const [firstName, ...lastNameParts] = data.fullName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        const profileData: Partial<UserAccount> = {
            firstName: firstName,
            lastName: lastName,
            address: data.address,
            email: user.email! // email is non-null for a logged-in user
        };
        await setDoc(userDocRef, profileData, { merge: true });

        toast({
            title: "Profile Updated",
            description: "Your information has been successfully saved.",
        });

    } catch (error: any) {
        toast({
            title: "Update Failed",
            description: error.message || "Could not update your profile.",
            variant: "destructive",
        });
    }
  };


  const renderOrderHistory = () => {
    if (isLoadingOrders || isUserLoading) {
      return (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!orders || orders.length === 0) {
      return <div className="text-center py-8">
        <p className="text-muted-foreground">You have no past orders.</p>
      </div>;
    }

    return (
      <div className="space-y-6">
        {sortedOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-semibold">{order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <p className="text-sm text-green-600">{order.status}</p>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
   const renderProfile = () => {
    if (isUserLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    
    if (!user) {
       return <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123 Future Ave, Neo-Kyoto, 90210, USA" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">
        My Account
      </h1>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View the details of your past purchases.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderOrderHistory()}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                View and manage your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderProfile()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
