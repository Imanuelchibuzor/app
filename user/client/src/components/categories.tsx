import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Categories = () => {
  const [category, setCategory] = useState("");

  useEffect(() => {
    console.log(category);
  }, [category]);

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
