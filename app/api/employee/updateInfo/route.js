import prisma from "../../../../utils/connect";

export async function POST(req) {
  try {
    const { employee_id, department_id, name, email } = await req.json();

    // Validate required fields
    if (!employee_id || !department_id || !name || !email) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ensure employee_id is a number
    const employeeId = Number(employee_id);
    if (isNaN(employeeId)) {
      return new Response(
        JSON.stringify({ error: "Invalid employee ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update employee in database
    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: employeeId }, 
      data: { name, email, department_id },
    });

    return new Response(JSON.stringify(updatedEmployee), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error updating employee:", error);

    let errorMessage = "Failed to update employee";
    if (error.code === "P2025") {
      errorMessage = "Employee not found";
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle OPTIONS method for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: { Allow: "POST" },
  });
}
