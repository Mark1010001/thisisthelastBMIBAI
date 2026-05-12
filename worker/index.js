export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const { message, metrics, results } = await request.json();

    const systemPrompt = `You are an AI health coach. The user's data: BMI ${results?.bmi}, BAI ${results?.bai}%, Age ${metrics?.age}, Gender ${metrics?.gender}. Give short, helpful health advice.`;

    const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    return Response.json({ response: response.response }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
};
