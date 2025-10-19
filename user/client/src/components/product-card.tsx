import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
  commission?: number;
  rating: number;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    if (product.commission) {
      navigate(`/promote/${id}`);
    } else {
      navigate(`/pub/${id}`);
    }
  };

  return (
    <div className="space-y-2" onClick={() => handleClick(product.id)}>
      <img
        src={product.image}
        alt={product.title}
        className=" border w-full rounded-lg object-cover"
      />

      <div>
        <h3 className="font-medium">
          {product.title.length > 20
            ? `${product.title.slice(0, 20)}...`
            : product.title}
        </h3>
        <p className="text-sm text-muted-foreground">{product.author}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {product.price}
          </span>

          <span className="h-4 w-px bg-gray-200" area-hidden="true" />

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {product?.commission && (
            <span className="h-4 w-px bg-gray-200" area-hidden="true" />
          )}

          {product?.commission && (
            <span className="text-lg font-semibold text-green-500">
              {product?.commission}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
