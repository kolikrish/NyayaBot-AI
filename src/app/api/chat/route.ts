import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const processLongResponse = (content: string | null | undefined) => {
  if (content && content.length > 2000) {
    return {
      content,
      isLongResponse: true
    };
  }
  return { content, isLongResponse: false };
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error("GROQ_API_KEY is not defined in environment variables");
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const { messages } = await req.json();
    console.log("Received messages:", JSON.stringify(messages));

    const systemMessage = {
      role: "system",
      content: "You are NyayaSahayak, an AI legal assistant specializing in Indian law. Provide accurate, helpful information about Indian legal matters including the Constitution, IPC, CrPC, civil laws, family laws, property laws, and other Indian legal frameworks. If asked about laws outside India or non-legal topics, politely redirect the conversation to Indian legal matters. Always clarify that your responses are for informational purposes only and do not constitute legal advice. When uncertain, acknowledge limitations and suggest consulting a qualified legal professional in India. IMPORTANT: For complex topics, structure your response with numbered points and clear headings to improve readability."
    };

    const conversationWithSystem = [systemMessage, ...messages];
    
    console.log("Using Groq SDK with model: deepseek-r1-distill-llama-70b");
    
    try {
      const completion = await groq.chat.completions.create({
        messages: conversationWithSystem,
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.7,
        max_tokens: 2048,
      });
      
      console.log("Received response from Groq API");
      
      const message = completion.choices[0].message;
      const processedResponse = processLongResponse(message.content);
      
      return NextResponse.json({
        role: message.role,
        content: processedResponse.content,
        isLongResponse: processedResponse.isLongResponse
      });
    } catch (groqError) {
      console.error("Groq SDK error:", groqError);
      
      console.log("Trying with fetch API as fallback");
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          messages: conversationWithSystem,
          temperature: 0.7,
          max_tokens: 2048
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error with fetch:', errorData);
        return NextResponse.json(
          { error: "Error from Groq API: " + (errorData.error?.message || 'Unknown error') },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      const message = data.choices[0].message;
      const content = typeof message.content === 'string' ? message.content : String(message.content || '');
      const processedResponse = processLongResponse(content);
      
      return NextResponse.json({
        role: message.role,
        content: processedResponse.content,
        isLongResponse: processedResponse.isLongResponse
      });
    }
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request", details: String(error) },
      { status: 500 }
    );
  }
}