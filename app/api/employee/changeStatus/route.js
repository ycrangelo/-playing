import prisma from "../../../../utils/connect"

export async function POST(req) {
 const { employee_id, status } = await req.json();
 console.log("here @change status route",employee_id)
 console.log("here @change status route",status)

if (employee_id === undefined || employee_id === null || status === undefined || status === null) {
  return new Response(JSON.stringify({
    error: "input the fields"
  }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
 
 try {

   const updatedEmployee = await prisma.employee.update({
      where: { employee_id:employee_id  }, // Find by employee_id
      data: {
       status: { set: status }
      },
   });
  return new Response(JSON.stringify(updatedEmployee), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
 } catch (error) {
  console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
