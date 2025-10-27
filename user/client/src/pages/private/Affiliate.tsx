import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Book,
  ShoppingCart,
  DollarSign,
  Download,
  Users,
  TrendingUp,
  Info,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    title: "Digital Marketing Mastery",
    allowsDownload: true,
    affiliates: 24,
    unitsSold: 156,
    earnings: 4680.0,
  },
  {
    id: 2,
    title: "Modern Web Development Guide",
    allowsDownload: true,
    affiliates: 18,
    unitsSold: 203,
    earnings: 6090.0,
  },
  {
    id: 3,
    title: "AI & Machine Learning Basics",
    allowsDownload: false,
    affiliates: 31,
    unitsSold: 89,
    earnings: 2670.0,
  },
  {
    id: 4,
    title: "Creative Writing Workshop",
    allowsDownload: true,
    affiliates: 12,
    unitsSold: 67,
    earnings: 2010.0,
  },
  {
    id: 5,
    title: "Photography Fundamentals",
    allowsDownload: true,
    affiliates: 45,
    unitsSold: 312,
    earnings: 9360.0,
  },
];

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [products] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  // Calculate totals
  const totalProducts = products.length;
  const totalUnitsSold = products.reduce((sum, p) => sum + p.unitsSold, 0);
  const totalEarnings = products.reduce((sum, p) => sum + p.earnings, 0);

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
            <h1 className="text-3xl font-bold tracking-tight">
              Affiliate Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your affiliate performance and earnings
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            onClick={() => navigate("/promote")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Promote Product
          </Button>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Book className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-muted-foreground text-xs mt-1">
                  Products you're promoting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Conversions
                </CardTitle>
                <ShoppingCart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnitsSold}</div>
                <p className="text-muted-foreground text-xs mt-1">
                  Successful sales from your links
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Commissions
                </CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs mt-1">
                  Total earnings from your promotions
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
              <CardTitle>Affiliate Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-center">Download</TableHead>
                      <TableHead className="text-center">
                        Total Clicks
                      </TableHead>
                      <TableHead className="flex items-center justify-center gap-2">
                        <TooltipProvider>
                          Unique Clicks
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                These are unique clicks from registered users
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableHead>
                      <TableHead className="text-center">Conversions</TableHead>
                      <TableHead className="text-right">Commissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium max-w-[200px] md:max-w-none cursor-pointer">
                          {product.title.length > 30
                            ? `${product.title.slice(0, 30)}...`
                            : product.title}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.allowsDownload ? (
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
                            <span className="font-medium">
                              {product.affiliates}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="text-muted-foreground h-3 w-3" />
                            <span className="font-medium">
                              {product.affiliates}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="text-primary h-3 w-3" />
                            <span className="font-medium">
                              {product.unitsSold}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${product.earnings.toFixed(2)}
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

export default VendorDashboard;
