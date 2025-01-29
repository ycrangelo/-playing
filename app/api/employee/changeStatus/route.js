import prisma from "../../../../utils/connect"

export async function POST(req) {
 const { employee_id, status } = await req.json();
 console.log(employee_id)
 console.log(status)

  if (!employee_id ||!status) {
  return new Response(JSON.stringify({
   error:"input the fields"
  }), {
     status: 400,
          headers: { "Content-Type": "application/json" },
  })
 }
 
 try {

   const updatedEmployee = await prisma.employee.update({
      where: { employee_id: Number(employee_id) }, // Find by employee_id
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
