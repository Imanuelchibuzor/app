import SkeletonCard from "@/components/skeleton-card";
import Search from "../components/search";
import Categories from "@/components/categories";

const Home = () => {
  const products = [
    {
      id: 1,
      author: "Jason Flagler",
      title: "Lost in Sea",
      price: "$12.99",
      rating: 3.5,
    },
    {
      id: 2,
      author: "J.R.R. Tolkien",
      title: "The Lord of the Rings",
      price: "$19.99",
      rating: 4.5,
    },
    {
      id: 3,
      author: "J.K. Rowling",
      title: "Harry Potter",
      price: "$14.99",
      rating: 4.0,
    },
    {
      id: 4,
      author: "George R.R. Martin",
      title: "A Game of Thrones",
      price: "$9.99",
      rating: 4.2,
    },
    {
      id: 5,
      author: "Stephen King",
      title: "The Shining",
      price: "$11.99",
      rating: 4.1,
    },
    {
      id: 6,
      author: "Agatha Christie",
      title: "Murder on the Orient Express",
      price: "$15.99",
      rating: 3.8,
    },
    {
      id: 7,
      author: "J.K. Rowling",
      title: "Harry Potter",
      price: "$14.99",
      rating: 4.0,
    },
    {
      id: 8,
      author: "George R.R. Martin",
      title: "A Game of Thrones",
      price: "$9.99",
      rating: 4.2,
    },
    {
      id: 9,
      author: "Stephen King",
      title: "The Shining",
      price: "$11.99",
      rating: 4.1,
    },
    {
      id: 10,
      author: "Agatha Christie",
      title: "Murder on the Orient Express",
      price: "$15.99",
      rating: 3.8,
    },
    {
      id: 11,
      author: "Jason Flagler",
      title: "Lost in Sea",
      price: "$12.99",
      rating: 3.5,
    },
    {
      id: 12,
      author: "J.R.R. Tolkien",
      title: "The Lord of the Rings",
      price: "$19.99",
      rating: 4.5,
    },
    {
      id: 13,
      author: "J.K. Rowling",
      title: "Harry Potter",
      price: "$14.99",
      rating: 4.0,
    },
    {
      id: 14,
      author: "George R.R. Martin",
      title: "A Game of Thrones",
      price: "$9.99",
      rating: 4.2,
    },
    {
      id: 15,
      author: "Stephen King",
      title: "The Shining",
      price: "$11.99",
      rating: 4.1,
    },
    {
      id: 16,
      author: "Agatha Christie",
      title: "Murder on the Orient Express",
      price: "$15.99",
      rating: 3.8,
    },
    {
      id: 17,
      author: "J.K. Rowling",
      title: "Harry Potter",
      price: "$14.99",
      rating: 4.0,
    },
    {
      id: 18,
      author: "George R.R. Martin",
      title: "A Game of Thrones",
      price: "$9.99",
      rating: 4.2,
    },
    {
      id: 19,
      author: "Stephen King",
      title: "The Shining",
      price: "$11.99",
      rating: 4.1,
    },
    {
      id: 20,
      author: "Agatha Christie",
      title: "Murder on the Orient Express",
      price: "$15.99",
      rating: 3.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center my-12">
        <div className="mb-12 flex flex-col items-center space-y-4">
          <Search />
          <div>
            <Categories />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-5 cursor-pointer">
          {products.map((product) => (
            <SkeletonCard key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
