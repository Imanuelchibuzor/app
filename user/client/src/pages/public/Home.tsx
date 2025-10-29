import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Search from "../../components/search";
import Categories from "@/components/categories";
import SkeletonCard from "@/components/skeleton-card";
import PublicationCard from "@/components/publication-card";

import LoadMore from "@/components/load-more";
import { useAuth } from "@/contexts/auth";
import { useApp } from "@/contexts/app";
import handleError from "@/utils/handleError";
import { EmptyOutline } from "@/components/empty-publication";

export type PublicationProps = {
  id: string;
  cover: string;
  title: string;
  author: string;
  price: string;
  rating: number;
  commission?: number;
};

const Home = () => {
  const { axios, decodeUser, setUser } = useAuth();
  const { loading, setLoading } = useApp();

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didMountRef = useRef(false);
  const [publications, setPublications] = useState<PublicationProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const user = decodeUser();
    if (user) setUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/pub/fetch", {
        params: { language: "en", page, limit: 20 },
      });
      if (data.success) {
        setPublications((prev) =>
          page === 1 ? data.pubs : [...prev, ...data.pubs]
        );
        setTotalPages(data.totalPages);
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [axios, setLoading, page]);

  useEffect(() => {
    fetchPublications();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    // Skip first effect run (mount)
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    // clear previous debounce if any
    if (searchRef.current) {
      clearTimeout(searchRef.current);
      searchRef.current = null;
    }

    searchRef.current = setTimeout(() => {
      if (search === "") fetchPublications();
    }, 1000);

    // cleanup on unmount / before next run
    return () => {
      if (searchRef.current) {
        clearTimeout(searchRef.current);
        searchRef.current = null;
      }
    };
  }, [search, fetchPublications]);

  useEffect(() => {
    if (category === "al") fetchPublications();
    // eslint-disable-next-line
  }, [category]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="mb-16 w-full flex flex-col items-center space-y-4">
          <Search
            route="search"
            page={page}
            setTotalPages={setTotalPages}
            search={search}
            setSearch={setSearch}
            setPublications={setPublications}
          />

          <div>
            <Categories
              route="filter"
              page={page}
              setTotalPages={setTotalPages}
              category={category}
              setCategory={setCategory}
              setPublications={setPublications}
            />
          </div>
        </div>

        <div className="w-full px-2 md:px-12 grid grid-cols-2 space-y-4 lg:space-y-10 gap-6 md:gap-12 md:grid-cols-3 lg:grid-cols-5 cursor-pointer">
          {!loading &&
            publications?.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}

          {publications?.length === 0 &&
            loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>

        {publications?.length === 0 && !loading && <EmptyOutline />}

        {page < totalPages && (
          <LoadMore onClick={handleLoadMore} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Home;
