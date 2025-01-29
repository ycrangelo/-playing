import prisma from "../../../../utils/connect";

export async function GET(req) {
  const url = new URL(req.url);
    const employee_id = parseInt(url.searchParams.get("employee_id")); 
 
 try {
  if (!employee_id) {
   return new Response(JSON.stringify({
    error:"please input employee_id"
   }), {
      status: 400,
          headers: { "Content-Type": "application/json" },
   })
  }
 const findEmployee = await prisma.employee.findUnique({
  where: { employee_id }
 });
   return new Response(JSON.stringify(findEmployee), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });
  
 } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({error: 'Failed to retrieve posts'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
 }
}