import { toast } from "sonner";

import { Input } from "./ui/input";
import { Field } from "./ui/field";
import { useAuth } from "@/contexts/auth";
import handleError from "@/utils/handleError";
import type { PublicationProps } from "@/pages/public/Home";

type SearchProps = {
  route: string;
  page: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPublications: React.Dispatch<React.SetStateAction<PublicationProps[]>>;
};

const SearchForm = ({
  route,
  page,
  setTotalPages,
  search,
  setSearch,
  setPublications,
}: SearchProps) => {
  const { axios } = useAuth();
  const handleSearch: React.KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    // avoid handling Enter during IME composition
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      try {
        const { data } = await axios.get(`/pub/${route}`, {
          params: { title: search, language: "en", page: 1, limit: 20 },
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
    }
  };

  return (
    <div className="w-full md:w-lg flex items-center gap-2">
      <Field>
        <Input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search here ..."
          className="shadow-sm text-sm rounded-2xl"
          onKeyDown={handleSearch}
        />
      </Field>
    </div>
  );
};

export default SearchForm;
