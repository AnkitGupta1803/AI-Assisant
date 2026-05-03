import Groq from "groq-sdk";
import "dotenv/config";
import { tavily } from "@tavily/core";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
    const messages=[
        
            {
                role: 'system',
                content: `You are a helpful assistant. who answers questions about the world. 
                You have access to a tool called webSearch which you can use to get the latest information about the world. You can use this tool to answer questions about the current weather, news, sports, stock market, etc. You should use this tool whenever you need to get the latest information about the world.
                `
            },
            {
                role: 'user',
                content: 'When was apple 16 launch event held?'
                //When was apple 16 launch event held?
                // 
            }
        
    ]

    while(true)
    {
          const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
            {
                "type": "function",
                "function": {
                    "name": "webSearch",
                    "description": "Serach the latest information and real time information about the world.",
                    "parameters": {
                        // JSON Schema object
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "The Search query to get the latest information about the world. It can be any question about the world. For example, it can be about the current weather, news, sports, stock market, etc."
                            },
                        
                        },
                        "required": ["query"]
                    }
                }
            }
        ],
        tool_choice: "auto"

    });

    messages.push(completion.choices[0].message);
    
    const toolCalls=completion.choices[0].message.tool_calls;

    if(!toolCalls)
    {
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        break;
        return;
    }

    for(const tool of toolCalls)
    {
        console.log('tools' , tool);
        const functionName=tool.function.name;
        const functionParams=tool.function.arguments;



        if(functionName === 'webSearch')
        {
           const toolResult=  await webSearch(JSON.parse(functionParams))
           console.log('toolResult' , toolResult);
              messages.push({
                tool_call_id:tool.id,
                role: 'tool',
                name: functionName,
                content: toolResult
              })
        }



    }





    console.log(JSON.stringify(completion.choices[0].message, null, 2));

}

    }
    
    
  

main();


async function webSearch({ query }) {
    console.log(`webSearch called with query: ${query}`);
    const response = await tvly.search(query);
    console.log('tavily response', response);
    const finalResult=response.results.map(result=>result.content).join('\n\n');
    console.log('finalResult', finalResult);


    return 'Iphone 16 launch event was held on 12th September 2023'
}
