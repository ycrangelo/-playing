import { NextResponse } from "next/server";
import prisma from "../../../../utils/connect";
import { parse } from "papaparse";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing
  },
};

export async function POST(request) {
  try {
    // Extract the file from the request
    const data = await request.formData();
    const file = data.get("csvFile");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read the file content
    const fileContent = await file.text();

    // Parse the CSV file
    const { data: employees, errors } = parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numeric fields to numbers
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Error parsing CSV file", details: errors },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmployees = employees
      .filter((emp) => emailRegex.test(emp.email))
      .map((emp) => ({
        ...emp,
        employee_id: parseInt(emp.employee_id, 10), // Convert employee_id to integer
        department_id: parseInt(emp.department_id, 10), // Convert department_id to integer
      }));

    // Insert valid employees into the database
    await prisma.employee.createMany({
      data: validEmployees,
    });

    return NextResponse.json(
      { message: "Employees added successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Safeguard: Ensure the error object is valid
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in POST handler:", errorMessage);

    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

// Handle OPTIONS method
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: "POST",
    },
  });
}