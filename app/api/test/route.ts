

let counter = 0;

export async function POST() {
  counter++;

  return Response.json({
    success: true,
    message: "Request received",
    count: counter,
    timestamp: new Date().toISOString(),
  });
}
