const mongoose = require("mongoose");
const Course = require("./models/admin/courseModel");
const College = require("./models/admin/collegemodel");
const CoursesList = require("./models/admin/coursesList");
const Specialization = require("./models/admin/specialization");
const ProgramMode = require("./models/admin/programMode");

mongoose.connect("mongodb+srv://collegeseekers:517wQnSFKZQsYOdW@collegeseek.5d0wejd.mongodb.net/collegeseeker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getUniqueSlug(baseSlug) {
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  while (await Course.findOne({ slug: uniqueSlug })) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  return uniqueSlug;
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seedCoursesForAllColleges() {
  try {
    const colleges = await College.find();
    const coursesList = await CoursesList.find();
    const allSpecializations = await Specialization.find();
    const programModes = await ProgramMode.find();
    const modes = ["Full-Time", "Part-Time", "Online"];

    if (
      !colleges.length ||
      !coursesList.length ||
      !allSpecializations.length ||
      !programModes.length
    ) {
      throw new Error("❌ Required data missing in DB");
    }

    let programModeIndex = 0;

    for (const college of colleges) {
      const selectedCategories = getRandomItems(coursesList, 3); // 3 categories
      const selectedSpecializations = getRandomItems(allSpecializations, 3); // 3 unique specializations

      for (let i = 0; i < 3; i++) {
        const category = selectedCategories[i];
        const specialization = selectedSpecializations[i];
        const uniqueSlug = await getUniqueSlug(`${college.name.toLowerCase().replace(/\s+/g, "-")}-${category.name.toLowerCase().replace(/\s+/g, "-")}`);
        const programMode = programModes[programModeIndex % programModes.length];
        programModeIndex++;

        const newCourse = new Course({
          slug: uniqueSlug,
          name: category.name,
          specialization: specialization._id,
          description: `Study ${category.name} with specialization in ${specialization.name}`,
          college_id: college._id,
          category: category._id,
          mode: modes[Math.floor(Math.random() * modes.length)],
          programMode: programMode._id,
          duration: "4 Years",
          fees: {
            amount: Math.floor(Math.random() * 100000) + 100000,
            currency: "INR",
            year: 2025,
          },
          eligibility: "10+2 with PCM",
          application_dates: {
            start_date: new Date("2025-01-01"),
            end_date: new Date("2025-06-30"),
          },
          ratings: {
            score: 0,
            reviews_count: 0,
          },
          placements: {
            median_salary: Math.floor(Math.random() * 500000) + 300000,
            currency: "INR",
            placement_rate: Math.floor(Math.random() * 30) + 70,
          },
          intake_capacity: {
            male: 60,
            female: 40,
            total: 100,
          },
          entrance_exam: "JEE Mains",
          enrollmentLink: "http://example.com/enroll",
          brochure_link: "http://example.com/brochure.pdf",
          image: "http://example.com/course-image.jpg",
        });

        await newCourse.save();
        console.log(`✅ Added course: ${newCourse.name} for ${college.name} (Specialization: ${specialization.name})`);
      }
    }

    console.log("\n🎉 Finished seeding all colleges with 3 different specializations.");
  } catch (err) {
    console.error("❌ Error while seeding:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedCoursesForAllColleges();
