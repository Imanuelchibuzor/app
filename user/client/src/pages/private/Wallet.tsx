import { useEffect, useState } from "react";
import {
  DollarSign,
  Download,
  Wallet,
  ArrowRight,
  Ban,
  TrendingUp,
  BanknoteArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
// import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for demonstration
const mockWithdrawals = [
  {
    id: 1,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "pending",
    receipt: "",
  },
  {
    id: 2,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "paid",
    receipt: "",
  },
  {
    id: 3,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "failed",
    receipt: "here",
  },
  {
    id: 4,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "refunded",
    receipt: "here",
  },
  {
    id: 5,
    requested: 100000,
    paid: 90000,
    date: "24-10-2024",
    status: "failed",
    receipt: "here",
  },
];

const WalletDashboard = () => {
  const navigate = useNavigate();
  const [Withdrawals] = useState(mockWithdrawals);
  const [loading, setLoading] = useState(true);

  // Calculate totals
  const totalEarnings = 100000;
  const totalWithdrawals = 900000;
  const availableBalance = 100000;

  type Status = "pending" | "paid" | "refunded" | "failed";

  const getStatusColor = (status: Status) => {
    const statusColors: Record<Status, string> = {
      pending: "text-yellow-500 border-yellow-500",
      paid: "text-green-500 border-green-500",
      refunded: "text-blue-500 border-blue-500",
      failed: "text-red-500 border-red-500",
    };
    return statusColors[status];
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-background p-2 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row gap-4 justify-between">
          <div className="w-full">
            <h1 className="text-3xl font-bold tracking-tight">Your Wallet</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your finances
            </p>
          </div>
          <div className="w-full flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/account")}
            >
              <Wallet className="mr-1 h-4 w-4" />
              Setup Account
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate("/withdraw")}
            >
              <ArrowRight className="mr-1 h-4 w-4" />
              Withddraw Funds
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
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
                <BanknoteArrowDown className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalWithdrawals.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs mt-1">
                  Amount sent to your bank
                </p>
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
                <p className="text-muted-foreground text-xs mt-1">
                  Amount available for withdrawal
                </p>
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
                    {Withdrawals.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium max-w-[200px] md:max-w-none cursor-pointer">
                          {w.requested}
                        </TableCell>
                        <TableCell className="text-center">{w.paid}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">{w.date}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">
                              {w.status && (
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(w.status as Status)}
                                >
                                  {w.status}
                                </Badge>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {w.receipt ? (
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
                              <Ban className="h-3 w-3" />
                            </Badge>
                          )}
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

        {/* {!loading && <LoadMore />} */}
        {loading && <Skeleton className="h-10 w-32 mx-auto" />}
      </div>
    </div>
  );
};

export default WalletDashboard;
