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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/contexts/app";
import { useAuth } from "@/contexts/auth";
import handleError from "@/utils/handleError";
import { toast } from "sonner";
import Popup from "@/components/pub-popup";

type publications = {
  id: number;
  title: string;
  cover: string;
  enableDownloads: boolean;
  affiliates: number;
  unitsSold: number;
  earnings: number;
};

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { axios, user } = useAuth();
  const { loading, setLoading, formatNGN } = useApp();

  const [pubs, setPubs] = useState<publications[]>([]);
  const [totalPubs, setTotalPubs] = useState<number>(0);
  const [totalUnitsSold, setTotalUnitsSold] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const STARTER_LIMIT: number = 5;
  const PRO_LIMIT: number = 25;

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get("/merchant/vendor-dashboard", {
          params: { page, limit: 20 },
        });

        if (data.success) {
          setPubs((prev) => (page === 1 ? data.pubs : [...prev, ...data.pubs]));
          setTotalPubs(data.totalPubs);
          setTotalUnitsSold(data.totalUnitsSold);
          setTotalEarnings(data.totalEarnings);
          setTotalPages(data.totalPages);
        } else toast.error(data.message);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line
  }, [page]);

  const handleAdd = () => {
    if (!user?.plan) return;
    const message: string =
      "You have reached the maximum number of publications for your plan.";

    if (user?.plan === "starter" && totalPubs >= STARTER_LIMIT) {
      return toast.error(message);
    } else if (user?.plan === "pro" && totalPubs >= PRO_LIMIT) {
      return toast.error(message);
    }

    navigate("/add");
  };

  const handleLoadMore = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your publications and track your sales
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Add Publication
          </Button>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Publications
                </CardTitle>
                <Book className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPubs}</div>
                <p className="text-muted-foreground text-xs mt-1">
                  Active publications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Units Sold
                </CardTitle>
                <ShoppingCart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnitsSold}</div>
                <p className="text-muted-foreground text-xs mt-1">
                  Across all publications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNGN(totalEarnings)}
                </div>
                <p className="text-muted-foreground text-xs mt-1">
                  Lifetime revenue
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

        {/* Publications Table */}
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle>Your Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-center">Download</TableHead>
                      <TableHead className="text-center">Affiliates</TableHead>
                      <TableHead className="text-center">Units Sold</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pubs?.map((p) => (
                      <TableRow key={p?.id}>
                        <TableCell className="font-medium max-w-[200px] md:max-w-none cursor-pointer">
                          <Popup id={p?.id} title={p?.title} cover={p?.cover} />
                        </TableCell>
                        <TableCell className="text-center">
                          {p?.enableDownloads ? (
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
                            <span className="font-medium">{p?.affiliates}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="text-primary h-3 w-3" />
                            <span className="font-medium">{p?.unitsSold}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatNGN(p?.earnings)}
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

        {page < totalPages && (
          <LoadMore onClick={handleLoadMore} loading={loading} />
        )}
        {loading && <Skeleton className="h-10 w-32 mx-auto" />}
      </div>
    </div>
  );
};

export default VendorDashboard;
