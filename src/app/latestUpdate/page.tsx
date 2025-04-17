import BlogList from "@/components/blogs/blogList/blogList";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import NewsletterForm from "@/components/newsletters/page";

const HomePage = () => {
 
  
  return (
    <div className="bg-[#fffdff]">
      <Header />
      <BlogList/>
       <NewsletterForm/>
      <Footer />
      
    
    </div>
  );
};

export default HomePage;