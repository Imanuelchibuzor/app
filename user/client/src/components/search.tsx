import { useState } from "react";

import { Field } from "./ui/field";
import { Input } from "./ui/input";

const SearchForm = () => {
  const [search, setSearch] = useState("");

  const handleSearch: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // avoid handling Enter during IME composition
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      // use currentTarget.value to get the immediate input value
      console.log("Search:", search);
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
