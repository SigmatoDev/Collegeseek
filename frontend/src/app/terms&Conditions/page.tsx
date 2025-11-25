"use client";

import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import CallbackForm from "@/components/newsletters/page";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface TermType {
  _id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const TermsAndConditions = () => {
  const [terms, setTerms] = useState<TermType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTerms = async () => {
    try {
      const { data } = await axios.get(`${api_url}terms`);
      setTerms(data);
    } catch (err) {
      setError("Failed to load Terms & Conditions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <main className="flex-1 flex justify-center items-start py-16 px-4">
          <div className="w-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-900 tracking-tight">
              Terms & Conditions
            </h1>

            <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200 p-8 md:p-10 h-[65vh] overflow-y-auto space-y-10 transition-all duration-300">
              {loading && <p className="text-center text-gray-700">Loading...</p>}

              {error && (
                <p className="text-center text-red-500 font-medium">{error}</p>
              )}

              {!loading &&
                !error &&
                terms.map((item, index) => (
                  <section key={item._id}>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                      {index + 1}. {item.title}
                    </h2>

                    <p
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></p>

                    <hr className="border-gray-200 mt-6" />
                  </section>
                ))}

              {!loading && terms.length === 0 && !error && (
                <p className="text-center text-gray-600">
                  No Terms & Conditions found.
                </p>
              )}
            </div>
          </div>
        </main>

        <CallbackForm />
        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
