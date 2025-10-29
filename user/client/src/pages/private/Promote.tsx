import Search from "../../components/search";
import Categories from "@/components/categories";
import SkeletonCard from "@/components/skeleton-card";
import PublicationCard from "@/components/publication-card";

import coverImg from "../../assets/covers/books";
import { useEffect, useState } from "react";
// import LoadMore from "@/components/load-more";

const Promote = () => {
  const [loading, setLoading] = useState(true);
  // const products = [
  //   {
  //     id: 1,
  //     image: coverImg.book_1,
  //     author: "Jason Flagler",
  //     title: "This is a long title and I want to see how it works",
  //     price: "$12.99",
  //     commission: 20,
  //     rating: 3.5,
  //   },
  //   {
  //     id: 2,
  //     image: coverImg.book_2,
  //     author: "J.R.R. Tolkien",
  //     title: "The Lord of the Rings",
  //     price: "$19.99",
  //     rating: 4.5,
  //   },
  //   {
  //     id: 3,
  //     image: coverImg.book_3,
  //     author: "J.K. Rowling",
  //     title: "Harry Potter",
  //     price: "$14.99",
  //     rating: 4.0,
  //   },
  //   {
  //     id: 4,
  //     image: coverImg.book_4,
  //     author: "George R.R. Martin",
  //     title: "A Game of Thrones",
  //     price: "$9.99",
  //     rating: 4.2,
  //   },
  //   {
  //     id: 5,
  //     image: coverImg.book_5,
  //     author: "Stephen King",
  //     title: "The Shining",
  //     price: "$11.99",
  //     rating: 4.1,
  //   },
  //   {
  //     id: 6,
  //     image: coverImg.book_6,
  //     author: "Agatha Christie",
  //     title: "Murder on the Orient Express",
  //     price: "$15.99",
  //     rating: 3.8,
  //   },
  //   {
  //     id: 7,
  //     image: coverImg.book_7,
  //     author: "J.K. Rowling",
  //     title: "Harry Potter",
  //     price: "$14.99",
  //     rating: 4.0,
  //   },
  //   {
  //     id: 8,
  //     image: coverImg.book_8,
  //     author: "George R.R. Martin",
  //     title: "A Game of Thrones",
  //     price: "$9.99",
  //     rating: 4.2,
  //   },
  //   {
  //     id: 9,
  //     image: coverImg.book_9,
  //     author: "Stephen King",
  //     title: "The Shining",
  //     price: "$11.99",
  //     rating: 4.1,
  //   },
  //   {
  //     id: 10,
  //     image: coverImg.book_10,
  //     author: "Agatha Christie",
  //     title: "Murder on the Orient Express",
  //     price: "$15.99",
  //     rating: 3.8,
  //   },
  //   {
  //     id: 11,
  //     image: coverImg.book_11,
  //     author: "Jason Flagler",
  //     title: "Lost in Sea",
  //     price: "$12.99",
  //     rating: 3.5,
  //   },
  //   {
  //     id: 12,
  //     image: coverImg.book_12,
  //     author: "J.R.R. Tolkien",
  //     title: "The Lord of the Rings",
  //     price: "$19.99",
  //     rating: 4.5,
  //   },
  //   {
  //     id: 13,
  //     image: coverImg.book_13,
  //     author: "J.K. Rowling",
  //     title: "Harry Potter",
  //     price: "$14.99",
  //     rating: 4.0,
  //   },
  //   {
  //     id: 14,
  //     image: coverImg.book_14,
  //     author: "George R.R. Martin",
  //     title: "A Game of Thrones",
  //     price: "$9.99",
  //     rating: 4.2,
  //   },
  //   {
  //     id: 15,
  //     image: coverImg.book_15,
  //     author: "Stephen King",
  //     title: "The Shining",
  //     price: "$11.99",
  //     rating: 4.1,
  //   },
  //   {
  //     id: 16,
  //     image: coverImg.book_16,
  //     author: "Agatha Christie",
  //     title: "Murder on the Orient Express",
  //     price: "$15.99",
  //     rating: 3.8,
  //   },
  //   {
  //     id: 17,
  //     image: coverImg.book_17,
  //     author: "J.K. Rowling",
  //     title: "Harry Potter",
  //     price: "$14.99",
  //     rating: 4.0,
  //   },
  //   {
  //     id: 18,
  //     image: coverImg.book_18,
  //     author: "George R.R. Martin",
  //     title: "A Game of Thrones",
  //     price: "$9.99",
  //     rating: 4.2,
  //   },
  //   {
  //     id: 19,
  //     image: coverImg.book_19,
  //     author: "Stephen King",
  //     title: "The Shining",
  //     price: "$11.99",
  //     rating: 4.1,
  //   },
  //   {
  //     id: 20,
  //     image: coverImg.book_20,
  //     author: "Agatha Christie",
  //     title: "Murder on the Orient Express",
  //     price: "$15.99",
  //     rating: 3.8,
  //   },
  // ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="mb-16 w-full flex flex-col items-center space-y-4">
          {/* <Search /> */}
          <div>{/* <Categories /> */}</div>
        </div>
        <div className="w-full px-2 md:px-12 grid grid-cols-2 space-y-4 lg:space-y-10 gap-6 md:gap-12 md:grid-cols-3 lg:grid-cols-5 cursor-pointer">
          {/* {!loading &&
            products.map((product) => (
              // <PublicationCard key={product.id} publication={publication} />
            ))} */}

          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
        {/* <LoadMore /> */}
      </div>
    </div>
  );
};

export default Promote;
