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
import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth";
import { useApp } from "@/contexts/app";
import { toast } from "sonner";
import handleError from "@/utils/handleError";
import Popup from "@/components/pub-popup";
import EmptyContent from "@/components/empty-content";

type publications = {
  id: number;
  title: string;
  link: string;
  cover: string;
  enableDownloads: boolean;
  totalClicks: number;
  uniqueClicks: number;
  conversions: number;
  commissions: number;
};

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { axios, user } = useAuth();
  const { loading, setLoading, formatNGN } = useApp();

  const [pubs, setPubs] = useState<publications[]>([]);
  const [totalPubs, setTotalPubs] = useState<number>(0);
  const [totalConversions, setTotalConversions] = useState<number>(0);
  const [totalCommissions, setTotalCommissions] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const STARTER_LIMIT: number = 10;
  const PRO_LIMIT: number = 50;

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get("/merchant/affiliate-dashboard", {
          params: { page, limit: 20 },
        });

        if (data.success) {
          setPubs((prev) => (page === 1 ? data.pubs : [...prev, ...data.pubs]));
          setTotalPubs(data.totalPubs);
          setTotalConversions(data.toatlConversions);
          setTotalCommissions(data.totalCommissions);
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

  const handlePromote = () => {
    if (!user?.plan) return;
    const message: string =
      "You have reached the maximum number of publications for your plan.";

    if (user?.plan === "starter" && totalPubs >= STARTER_LIMIT) {
      return toast.error(message);
    } else if (user?.plan === "pro" && totalPubs >= PRO_LIMIT) {
      return toast.error(message);
    }

    navigate("/promote");
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
              Affiliate Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your affiliate performance and earnings
            </p>
          </div>
          <Button onClick={handlePromote}>
            <Plus className="mr-1 h-4 w-4" />
            Promote Publication
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
                <div className="text-2xl font-bold">{totalPubs}</div>
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
                <div className="text-2xl font-bold">{totalConversions}</div>
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
                  {formatNGN(totalCommissions)}
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
        {!loading &&
          (totalPubs > 0 ? (
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
                        <TableHead className="text-center">
                          Conversions
                        </TableHead>
                        <TableHead className="text-right">
                          Commissions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pubs?.map((p) => (
                        <TableRow key={p?.id}>
                          <TableCell className="font-medium max-w-[200px] md:max-w-none cursor-pointer">
                            <Popup
                              id={p?.id}
                              title={p?.title}
                              link={p?.link}
                              cover={p?.cover}
                              type="affiliate"
                            />
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
                              <span className="font-medium">
                                {p?.totalClicks}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="text-muted-foreground h-3 w-3" />
                              <span className="font-medium">
                                {p?.uniqueClicks}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <TrendingUp className="text-primary h-3 w-3" />
                              <span className="font-medium">
                                {p?.conversions}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatNGN(p?.commissions)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyContent
              type="data"
              title="No Data"
              description="You don't have any active promotions yet."
            />
          ))}
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
