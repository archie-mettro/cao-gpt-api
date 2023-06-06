// A express server which will handle api request coming in and respond back with a JSON Object, it will use body parser
import { Configuration, OpenAIApi  } from "openai"


import  { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()
const port = 8000

const configuration = new Configuration({
    organization: "org-FXtNEfkfo7OZtqpQ0pmOdBDQ",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration)

app.use(express.json())
app.use(cors())

app.post('/', async (req, res) => {
    const { message } = req.body

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Hello world"}],
    });


    const response = await openai.createCompletion({
        model: "davinci:ft-mettro-2023-06-01-00-54-06",
        prompt: `Welcome to Carpet One Stafford, Australia. I want carpet products. ${message}`,
        temperature: 0.9,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ["Human", "AI"],
      });
      console.log(response.data.choices)
      if(response.data){
        if(response.data.choices){
            res.json({
                message: response.data.choices[0].text
            })
        }
      }
    
})


app.post('/completions', async (req, res) => {
    let role = req.body.role
    let previousChats = req.body.previousChats
    if(req.body.role === undefined){
        role = "user"
    }

    try {
        // const completion = await openai.createChatCompletion({
        //     model: "gpt-3.5-turbo",
        //     messages: [{ role: role, content: "This is related content for Carpet One Stafford, Australia, " + req.body.message }],
        // });

        // const response = await openai.createCompletion({
        //     model: "davinci:ft-mettro-2023-06-01-00-54-06",
        //     prompt: "This is related content for Carpet One Stafford, Australia, " + req.body.message,
        //     temperature: 1,
        //     max_tokens: 200,
        //     top_p: 1,
        //     frequency_penalty: 0,
        //     presence_penalty: 0,
        // });
        

        //console.log(response.data);
        if(previousChats){
            let prevChats = [];
            for (const chat of previousChats) {
                prevChats.push({role: chat.role.toLowerCase(), content: chat.content});
            }
        }


        const messages =  [
            { role: "user", content: `Training data own dataset into training json form AI: Welcome to Carpet One Stafford, Australia! How can I help you today?
            Human: Do you have charming rainstorm?
            AI: I’m not sure I know that product, I might need some more information from you. Can you tell me more about what you’re looking for? For example, is it a Nylon Carpet or Vinyl Plank?
            Human: Vinyl Plank
            AI: Gotcha. I’m sorry, we don’t carry that particular product. But I have some great products that are very similar and are high quality. They are also priced very competitively as part of our cooperative buying power. \n\n Here are some excellent Vinyl Plank options I would recommend. \n\n Products name: Cushionstone – Casablanca \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2020/11/CST659-SWATCH-500x320.jpg \n\n Products name: Cushionwood – Riverstone Oak \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2020/11/CWM1201-SWATCH-500x320.jpg \n\n Would you like to see our full vinyl plank range? Or I can see Mary from Carpet One Stafford is online at the moment, would you like me to start a call with her?
            Human: Nylon Carpet
            AI: Gotcha. I’m sorry, we don’t carry that particular product. But I have some great products that are very similar and are high quality. They are also priced very competitively as part of our cooperative buying power. \n\n Here are some excellent Nylon Carpet options I would recommend. \n\n Products name: Dream Shadows – Vapar \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2021/02/dream_shadows_vapar.jpg \n\n Products name: Dream Shadows – Buffalo \n Product Image: https://www.carpetone.com.au/stafford/wp-content/uploads/2021/02/dream_shadows_buffalo_0.jpg \n\n Would you like to see our full nylon carpet range? Or I can see Mary from Carpet One Stafford is online at the moment, would you like me to start a call with her?
            Human:I would like to see your full vinyl plank range, please. \nAI:` },
            { role: "assistant", content: "I would like to see your full vinyl plank range, please.\n" }
        ]
        if(previousChats){
            for (const chat of previousChats) {
                messages.push({role: chat.role.toLowerCase(), content: chat.content})
            }
        }
        messages.push( { role: "user", content: "Human: " +req.body.message.toLowerCase() + " AI:"} )

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages
        });

        res.send(response.data)
    } catch (error){
        console.error(error)
    }
})

app.listen(port, () => {
    console.log('Server API is running in port: ' + port)
})