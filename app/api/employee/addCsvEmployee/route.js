import { IncomingForm } from 'formidable';
import Papa from 'papaparse';
import fs from 'fs';
import prisma from "../../../../utils/connect";
import * as nextConnect from 'next-connect';  // Correct import

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect.default();  // Access default export of nextConnect

// Middleware for handling file upload using formidable
handler.use((req, res, next) => {
  const form = new IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing form data', details: err.message });
    }

    req.files = files;
    req.fields = fields;
    next();
  });
});

handler.post(async (req, res) => {
  try {
    // Ensure a file is uploaded
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file[0]; // If it's a single file upload, it will be in an array, so we access the first element

    // Read the file and parse it using PapaParse
    const fileContent = await readFile(file.filepath);

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        // Now `result.data` contains the parsed CSV data
        const employees = result.data;

        // Validate and filter out any invalid employee data
        const validEmployees = employees.filter(emp =>
          emp.employee_id && emp.name && emp.email && emp.department_id
        );

        try {
          // Insert valid employees into the database
          const createdEmployees = await prisma.employee.createMany({
            data: validEmployees.map(emp => ({
              employee_id: emp.employee_id,
              department_id: Number(emp.department_id),  // Ensure department_id is a number
              name: emp.name,
              email: emp.email,
            })),
          });

          return res.status(201).json(createdEmployees); // Successful creation
        } catch (error) {
          console.error("Error inserting employees:", error);
          return res.status(500).json({ error: "Failed to create employees", details: error.message });
        }
      },
      error: (error) => {
        console.error('PapaParse Error:', error); // Log PapaParse errors
        return res.status(400).json({ error: "Error parsing CSV file", details: error.message });
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Failed to process CSV upload", details: error.message });
  }
});

// Utility function to read file content
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export default handler;
