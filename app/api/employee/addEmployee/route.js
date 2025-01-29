import prisma from "../../../../utils/connect";

export async function POST(req) {
  try {
    // Parse request body
    const { employee_id, department_id, name, email } = await req.json();

    // Validate required fields
    if (!employee_id || !department_id || !name || !email) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a new employee
    const createdEmployee = await prisma.employee.create({
      data: {
        employee_id,
        department_id,
        name,
        email,
      },
    });

    return new Response(JSON.stringify(createdEmployee), {
      status: 201, // Use 201 for resource creation
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    return new Response(
      JSON.stringify({ error: "Failed to create employee", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
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
