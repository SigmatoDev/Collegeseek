const mongoose = require("mongoose");
const Course = require("./models/admin/courseModel"); // Adjust path as needed
const College = require("./models/admin/collegemodel"); // Adjust path as needed
const CoursesList = require("./models/admin/coursesList"); // Adjust path as needed
const { randomInt } = require("crypto"); // For generating random values

// Categories to use for the courses
const categories = [
  new mongoose.Types.ObjectId("67fbed6eee8f2c5042b71c3b"), // BTech
  new mongoose.Types.ObjectId("67fbed6eee8f2c5042b71c3d"), // BE
];

mongoose.connect("mongodb://localhost:27017/collegeinsight", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const baseCourses = [
  {
    name: "Computer Science Engineering",
    slug: "computer-science-engineering",
    description: "Focuses on computing, programming, and software design. Ideal for students passionate about technology.",
  },
  {
    name: "Mechanical Engineering",
    slug: "mechanical-engineering",
    description: "Involves the design and production of mechanical systems. Great for those who enjoy machines and dynamics.",
  },
  {
    name: "Civil Engineering",
    slug: "civil-engineering",
    description: "Deals with infrastructure development like roads and buildings. Perfect for those interested in construction and planning.",
  },
];

async function getUniqueSlug(baseSlug) {
  let counter = 1;
  let uniqueSlug = `${baseSlug}${counter}`;
  // Check if the slug already exists
  while (await Course.findOne({ slug: uniqueSlug })) {
    counter++;
    uniqueSlug = `${baseSlug}${counter}`;
  }
  return uniqueSlug;
}

async function seedCoursesForColleges() {
  try {
    const colleges = await College.find();
    console.log(`Found ${colleges.length} colleges`);

    for (const college of colleges) {
      for (let i = 0; i < baseCourses.length; i++) {
        const course = baseCourses[i];

        // Get a unique slug for each course
        const uniqueSlug = await getUniqueSlug(course.slug);

        // Random fees between 1 lakh and 2 lakh INR
        const randomFees = randomInt(100000, 200000);

        // Select category: alternate between BTech and BE
        const category = categories[i % categories.length];

        // Creating the course
        const newCourse = new Course({
          ...course,
          slug: uniqueSlug, // Use the unique slug
          college_id: college._id,
          category,
          duration: "4 Years", // All courses have 4 years duration
          mode: "Full-Time", // All courses are Full-Time
          fees: {
            amount: randomFees,
            currency: "INR",
            year: 2024,
          },
          eligibility: "10+2 with PCM", // Example eligibility, can be updated as needed
          enrollmentLink: "http://example.com/enroll", // Example enrollment link
        });

        await newCourse.save();
        console.log(`Added course: ${course.name} for college: ${college.name}`);
      }
    }

    console.log("🎉 All courses seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedCoursesForColleges();
