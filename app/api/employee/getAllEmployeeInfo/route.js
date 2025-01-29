import prisma from "../../../../utils/connect";


export async function GET() {
 
 try {
     const employee = await prisma.employee.findMany()
    return new Response(JSON.stringify(employee), {
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

// Handle OPTIONS method
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            Allow: 'GET, POST',
        },
    });
}