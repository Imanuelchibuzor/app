import { toast } from "sonner";

import { Input } from "./ui/input";
import { Field } from "./ui/field";
import { useAuth } from "@/contexts/auth";
import handleError from "@/utils/handleError";
import type { PublicationProps } from "@/pages/public/Home";
import { useEffect, useRef } from "react";

type SearchProps = {
  setQuery: React.Dispatch<React.SetStateAction<"title" | "category" | "none">>;
  route: string;
  page: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPublications: React.Dispatch<React.SetStateAction<PublicationProps[]>>;
};

const SearchForm = ({
  setQuery,
  route,
  page,
  setTotalPages,
  search,
  setSearch,
  setPublications,
}: SearchProps) => {
  const { axios } = useAuth();

  const didMountRef = useRef(false);

  const performSearch = async (page: number) => {
    try {
      const { data } = await axios.get(`/pub/${route}`, {
        params: { title: search, language: "en", page, limit: 20 },
      });
      if (data.success) {
        setPublications((prev) =>
          page === 1 ? data.pubs : [...prev, ...data.pubs]
        );
        setTotalPages(data.totalPages);
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent, page: number) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      setQuery("title");
      await performSearch(page);
    }
  };

  useEffect(() => {
    // Skip first effect run (mount)
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setQuery("title");
    performSearch(page);
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="w-full md:w-lg flex items-center gap-2">
      <Field>
        <Input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here ..."
          className="shadow-sm text-sm rounded-2xl"
          onKeyDown={(e) => handleSearch(e, page)}
        />
      </Field>
    </div>
  );
};

export default SearchForm;
