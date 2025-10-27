import { Button } from "./ui/button";

type Props = {
  onClick: () => void;
  loading: boolean;
};

const LoadMore = ({ onClick, loading }: Props) => {
  return (
    <div className="flex justify-center">
      <Button onClick={onClick} disabled={loading}>
        Load More
      </Button>
    </div>
  );
};

export default LoadMore;
