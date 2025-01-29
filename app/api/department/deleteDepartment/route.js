import prisma from "../../../../utils/connect";

export async function POST(req) {
  const { department_id } = await req.json();

  try {
    // Soft delete the department
    const updatedDepartment = await prisma.department.update({
      where: { department_id }, // Ensure department_id is unique
      data: {
        isDelete: { set: true }, // Explicitly set value
      },
    });

    return new Response(
      JSON.stringify({ message: 'Department deleted successfully', deletedDepartment: updatedDepartment }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred during deletion', details: error.message }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
