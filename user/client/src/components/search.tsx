import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";

const SearchForm = () => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log(search)
  }

  return (
    <div className="sm:w-md md:w-lg flex items-center gap-2">
      <Field>
        <Input onChange={(e) => setSearch(e.target.value)} placeholder="Search here ..." className="shadow-sm" />
      </Field>
      <Button className="rounded-full" onClick={() => handleSearch()}>
        <Search  />
      </Button>
    </div>
  );
};

export default SearchForm;
