import {  OpenAI } from 'openai'
import 'dotenv/config'

import {prompt1,prompt2} from './prompt.js'


const openai = new OpenAI({apiKey: process.env.OpenAI_APIKEY});
let conversation = [
    {
      role: 'system',
    content: `${prompt1}${prompt2}`
   
    }
  ];

export class medicalController { 
    
    
    medicalAdvisor = async(req, res) => { 
      try {
        const prompt = req.body.prompt;
        conversation.push({
          role: 'user',
          content: prompt
        }) 
         
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens:1000,
        temperature: 0.7,
        top_p: 1,

        frequency_penalty: 0,
        presence_penalty: 0.6,
        messages: conversation
      });
      console.log(response)
          conversation.push({
          role: 'assistant',
          content: response.choices[0].message.content
        })
        console.log(1,conversation)
      res.send({
        bot: response.choices[0].message
      });
      
  
    } catch (error) {
      console.error(error)
      res.status(500).send(error || 'Something went wrong');
    }
  }
    

}