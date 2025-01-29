import prisma from "../../../../utils/connect";


export async function POST(req) {
 const { department_id, department_description } = await req.json()
 if (!department_id || !department_description) {
   return new Response(JSON.stringify({error: 'Email and name are required'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'},
        });
 }
try {

 const createDepartment = await prisma.department.create({
  data: {
    department_id,
    department_description,
    isDelete: false, // ensure isDelete is explicitly set
  }
 })
  return new Response(JSON.stringify(createDepartment), {
            status: 201,
            headers: {'Content-Type': 'application/json'},
        });
} catch (error) {
   console.error(error);
        return new Response(JSON.stringify({error: 'Failed to create createDepartment'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
}
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            Allow: 'POST',
        },
    });
}

