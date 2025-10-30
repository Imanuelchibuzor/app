import { MessageCircleOff } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const EmptyReview = () => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleOff />
        </EmptyMedia>
        <EmptyTitle>No Review</EmptyTitle>
        <EmptyDescription>
          There is no review for this publication yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyReview;
