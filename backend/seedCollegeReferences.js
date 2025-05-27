const mongoose = require("mongoose");
const College = require("./models/admin/collegemodel");
const Stream = require("./models/admin/streams");
const Ownership = require("./models/admin/ownerShip");
const ExamsAccepted = require("./models/admin/examExpected");
const Approval = require("./models/admin/approvels");
const AffiliatedBy = require("./models/admin/affiliatedBy");

mongoose.connect("mongodb+srv://collegeseekers:517wQnSFKZQsYOdW@collegeseek.5d0wejd.mongodb.net/collegeseeker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function getRandomItems(array, count) {
  return array
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((item) => item._id);
}

async function seedCollegeReferences() {
  try {
    const [streams, ownerships, exams, approvals, affiliatedBys] = await Promise.all([
      Stream.find(),
      Ownership.find(),
      ExamsAccepted.find(),
      Approval.find(),
      AffiliatedBy.find(),
    ]);

    const colleges = await College.find();

    for (const college of colleges) {
      college.stream = getRandomItems(streams, 2);
      college.ownership = getRandomItems(ownerships, 1)[0];
      college.examExpected = getRandomItems(exams, 2);
      college.approvel = getRandomItems(approvals, 2);
      college.affiliatedby = getRandomItems(affiliatedBys, 1)[0];

      await college.save();
      console.log(`✅ Updated college: ${college.name}`);
    }

    console.log("🎉 Seeding completed for existing colleges.");
  } catch (err) {
    console.error("❌ Error seeding college references:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

seedCollegeReferences();
