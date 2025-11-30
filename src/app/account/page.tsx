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
import { products } from '@/lib/products';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

const dummyOrders = [
  {
    id: 'ORDER-8472',
    date: 'February 20, 2024',
    status: 'Delivered',
    total: 450.0,
    items: [products[1]],
  },
  {
    id: 'ORDER-7139',
    date: 'January 5, 2024',
    status: 'Delivered',
    total: 970.5,
    items: [products[2], products[3]],
  },
];

export default function AccountPage() {
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
              {dummyOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {order.date}
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p>Jane Doe</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p>jane.doe@example.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                <p>123 Future Ave, Neo-Kyoto, 90210, USA</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
