import { useEffect, useState } from "react";
import {
  Book,
  ShoppingCart,
  DollarSign,
  Download,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "paid",
    receipt: "here",
  },
  {
    id: 2,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "paid",
    receipt: "here",
  },
  {
    id: 3,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "paid",
    receipt: "here",
  },
  {
    id: 4,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "paid",
    receipt: "here",
  },
  {
    id: 5,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "paid",
    receipt: "here",
  },
];

const Wallet = () => {
  const [products] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  // Calculate totals
  const totalEarnings = 100000;
  const totalWithdrawals = 900000;
  const availableBalance = 100000;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Wallet</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your finances
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <ArrowRight className="mr-2 h-4 w-4" />
            Withddraw Funds
          </Button>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <Book className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalEarnings.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs mt-1">
                  Lifetime revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Withdrawals
                </CardTitle>
                <ShoppingCart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalWithdrawals.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs mt-1"></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Balance
                </CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${availableBalance.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs mt-1"></p>
              </CardContent>
            </Card>
          </div>
        )}
        {loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="w-full h-40 rounded-xl" />
          </div>
        )}

        {/* Products Table */}
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requested Amount</TableHead>
                      <TableHead className="text-center">
                        Payout Amount
                      </TableHead>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium max-w-[200px] md:max-w-none cursor-pointer">
                          {product.requested}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.paid ? (
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              <Download className="h-3 w-3" />
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              N/A
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="text-muted-foreground h-3 w-3" />
                            <span className="font-medium">
                              {product.date}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="text-primary h-3 w-3" />
                            <span className="font-medium">
                              {product.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${product.receipt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        {loading && <Skeleton className="w-full h-100 rounded-xl" />}

        {!loading && <LoadMore />}
        {loading && <Skeleton className="h-10 w-32 mx-auto" />}
      </div>
    </div>
  );
};

export default Wallet;
