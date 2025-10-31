import { BookOpen, MessageCircleOff, Database } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  type: "publication" | "review" | "data";
  title: string;
  description: string;
};

const EmptyContent = ({ type, title, description }: Props) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {type === "publication" && <BookOpen />}
          {type === "review" && <MessageCircleOff />}
          {type === "data" && <Database />}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyContent;
