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
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

interface Order {
  id: string;
  date: string; // Assuming ISO string date
  status: 'Delivered' | 'Processing' | 'Shipped';
  total: number;
  items: Product[];
}

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersQuery);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

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
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-1/2" />
           <Skeleton className="h-6 w-1/4 mt-4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      );
    }
    
    if (!user) {
       return <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
    }

    return (
       <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p>{user.displayName || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email Address</p>
          <p>{user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
          <p>123 Future Ave, Neo-Kyoto, 90210, USA</p>
        </div>
      </div>
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
