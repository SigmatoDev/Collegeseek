import BlogAll from "@/components/blogs/blogAll/page";
import BlogList from "@/components/blogs/blogList/blogList";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import NewsletterForm from "@/components/newsletters/page";
import Breadcrumb from "@/components/breadcrumb/breadcrumb"; // 🧩 Import Breadcrumb

const HomePage = () => {
  return (
    <div className="bg-[#fffdff]">
      <Header />

      {/* 🧩 Breadcrumb Section */}
      <div className="py-3 px-6 ml-4 rounded-md mt-3">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },{ label: "LatestUpdate" }
          ]}
        />
      </div>

      <BlogAll />
      <NewsletterForm />
      <Footer />
    </div>
  );
};

export default HomePage;
