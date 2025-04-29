'use client';

import { useParams } from 'next/navigation';
import BlogDetails from "@/components/blogs/blogDetails/blogDetails";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";

const BlogDetailsPage = () => {
  const { slug } = useParams(); // Use `useParams` directly here
 console.log("siug", slug)
  return (
    <>
      <Header />
      <BlogDetails slug={slug as string} />  {/* Pass the slug to BlogDetails */}
      <Footer />
    </>
  );
};

export default BlogDetailsPage;
