import { useApp } from "@/contexts/app";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Publication = {
  id: string;
  cover: string;
  title: string;
  author: string;
  price: string;
  commission?: number;
  rating: number;
};

type PublicationtCardProps = {
  publication: Publication;
};

const PublicationCard = ({ publication }: PublicationtCardProps) => {
  const navigate = useNavigate();
  const { formatNGN } = useApp();

  const handleClick = (id: string) => {
    if (publication.commission) {
      navigate(`/promote/${id}`);
    } else {
      navigate(`/pub/${id}`);
    }
  };

  return (
    <div className="space-y-2" onClick={() => handleClick(publication.id)}>
      <img
        src={publication.cover}
        alt={publication.title}
        className=" border w-full rounded-lg object-cover"
      />

      <div>
        <h3 className="font-medium">
          {publication.title.length > 20
            ? `${publication.title.slice(0, 20)}...`
            : publication.title}
        </h3>
        <p className="text-sm text-muted-foreground">{publication.author}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-md font-semibold">
            {formatNGN(parseInt(publication.price))}
          </span>

          <span className="h-4 w-px bg-gray-200" area-hidden="true" />

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {publication.rating.toFixed(1)}
            </span>
          </div>

          {publication?.commission && (
            <span className="h-4 w-px bg-gray-200" area-hidden="true" />
          )}

          {publication?.commission && (
            <span className="text-md font-semibold text-green-500">
              {publication?.commission}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;
