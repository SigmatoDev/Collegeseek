const mongoose = require("mongoose");
const College = require("./models/admin/collegemodel"); // Adjust the path as needed

mongoose.connect("mongodb+srv://collegeseekers:517wQnSFKZQsYOdW@collegeseek.5d0wejd.mongodb.net/collegeseeker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleTabs = [
  {
    title: "College Info",
    description:
      "Provides an overview of the college, including its history, mission, and academic offerings.",
  },
  {
    title: "Courses & Fees",
    description:
      "Details the courses available at the college along with their respective fee structures.",
  },
  {
    title: "Admission",
    description:
      "Outlines the admission process, eligibility criteria, and important dates.",
  },
  {
    title: "Placement",
    description:
      "Information about the college's placement statistics, top recruiters, and average salary packages.",
  },
  {
    title: "Infrastructure",
    description:
      "Describes the campus facilities, including libraries, laboratories, and accommodation.",
  },
  {
    title: "Scholarship",
    description:
      "Details about scholarships offered by the college, eligibility, and application procedures.",
  },
];

async function seedCollegeTabs() {
  try {
    const colleges = await College.find();
    console.log(`🔍 Found ${colleges.length} colleges`);

    for (const college of colleges) {
      // Only add tabs if they don't already exist
      if (!college.tabs || college.tabs.length === 0) {
        college.tabs = sampleTabs;
        await college.save();
        console.log(`✅ Tabs added to college: ${college.name}`);
      } else {
        console.log(`⚠️ Tabs already exist for: ${college.name}`);
      }
    }

    console.log("🎉 All college tabs seeded successfully!");
  } catch (error) {
    console.error("❌ Error while seeding tabs:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedCollegeTabs();
