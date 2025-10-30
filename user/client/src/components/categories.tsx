import { useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth";
import handleError from "@/utils/handleError";
import type { PublicationProps } from "@/pages/public/Home";

type CategoryProps = {
  setQuery: React.Dispatch<React.SetStateAction<"title" | "category" | "none">>;
  route: string;
  page: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setPublications: React.Dispatch<React.SetStateAction<PublicationProps[]>>;
};

const Categories = ({
  setQuery,
  route,
  page,
  setTotalPages,
  category,
  setCategory,
  setPublications,
}: CategoryProps) => {
  const { axios } = useAuth();
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return; // skip initial mount
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const handleFilter = async (category: string, page: number = 1) => {
      setQuery("category");

      try {
        const { data } = await axios.get(`/pub/${route}`, {
          params: { category, language: "en", page, limit: 20 },
          signal,
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

    handleFilter(category, page);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, [category, page]);

  return (
    <Select value={category} onValueChange={(v) => setCategory(v)}>
      <SelectTrigger className="shadow-sm">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="al">All</SelectItem>
          <SelectItem value="fl">Fiction and Literature</SelectItem>
          <SelectItem value="cb">Children's Books</SelectItem>
          <SelectItem value="pgw">Personal Growth and Wellbeing</SelectItem>
          <SelectItem value="ah">Arts and Humanities</SelectItem>
          <SelectItem value="bf">Business and Finance</SelectItem>
          <SelectItem value="er">Education and Reference</SelectItem>
          <SelectItem value="hss">History and Social Sciences</SelectItem>
          <SelectItem value="fls">Food and Lifestyle</SelectItem>
          <SelectItem value="st">Science and Technology</SelectItem>
          <SelectItem value="hi">Hobbies and Interests</SelectItem>
          <SelectItem value="ot">Others</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Categories;
