import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: string;
  image: string;
  title: string;
  author: string;
  price: string;
  rating: number;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/product/${id}`);
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
          {product.title.length > 25
            ? `${product.title.slice(0, 25)}...`
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
