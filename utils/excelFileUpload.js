const xlsx = require("xlsx");
const Course = require("../models/course-model"); // Update the path accordingly

async function updateOrCreateCourseFromExcel(
  // filePath
  data
  ) {
  try {
    // Read the Excel file
    // const workbook = xlsx.readFile(filePath);
    // const sheetName = workbook.SheetNames[0];
    // const sheet = workbook.Sheets[sheetName];
    // const data = xlsx.utils.sheet_to_json(sheet);
    // console.log("data", data[0]);
    console.log("inside methdo")
    console.log("data ->",data)
    let currentMainTopic = null;
    const courseName = data[0]["Course Name"];
    console.log("Course name ->", courseName);

    const course = await Course.findOne({ name: courseName });
    if(!course){
      return "Course Not Found"
    }


    for (const row of data) {
      const mainTopic = row["Main Topic"];
      const subTopicString = row["Sub Topic"];


      if (mainTopic) {
        currentMainTopic = { title: mainTopic, subTopics: [] };
       
        if (subTopicString) {
          const subTopics = subTopicString
            .split(",")
            .map((subTopic) => ({ title: subTopic.trim() }));
          currentMainTopic.subTopics = subTopics;
        }
        console.log("Current main topic",currentMainTopic)
       await Course.addMainTopic(course._id,currentMainTopic);
       console.log("Pushed Main topic to db ",currentMainTopic);
      }
    }
   
    console.log("Pushed to db");
    console.log("Course structure ",course.structure);
  
    return "All courses updated or created successfully";
  } catch (error) {
    throw new Error(
      `Error updating or creating courses from Excel: ${error.message}`
    );
  }
}

module.exports = { updateOrCreateCourseFromExcel };
