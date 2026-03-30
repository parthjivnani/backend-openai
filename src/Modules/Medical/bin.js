router.post('/', (req, res) => {
    const response = openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert.',
          },
          {
            role: 'user',
            content: 'Write a paragraph about no-code tools to build in 2021.',
          },
        ],
      },
      { responseType: 'stream' }
    )
  
    console.log(response)
  
    response.then((resp) => {
      resp.data.on('data', (chunk) => {
              // console.log the buffer value
        console.log('chunk: ', chunk)
              
              // this converts the buffer to a string
        const payloads = chunk.toString().split('\n\n')
  
        console.log('payloads: ', payloads)
  
        for (const payload of payloads) {
                  // if string includes '[DONE]'
          if (payload.includes('[DONE]')) {
            res.end() // Close the connection and return
            return
          }
          if (payload.startsWith('data:')) {
                      // remove 'data: ' and parse the corresponding object
            const data = JSON.parse(payload.replace('data: ', ''))
            try {
              const text = data.choices[0].delta?.content
              if (text) {
                console.log('text: ', text)
                              // send value of text to the client
                res.write(`${text}`)
              }
            } catch (error) {
              console.log(`Error with JSON.parse and ${payload}.\n${error}`)
            }
          }
        }
      })
    })
  })



//working without streaming

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
  
//try valu
medicalAdvisor = async (req, res) => {
       try{
          const prompt = req.body.prompt;
          conversation.push({
            role: 'user',
            content: prompt,
          });
    
          const response = openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            stream:true,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            messages: conversation,
          },{
            responseType: 'stream' 
          });     
          
          response.then((resp) => {
            res?.data?.on('data', (chunk) => {
              // console.log the buffer value
              console.log('chunk: ', chunk)
              
              // this converts the buffer to a string
              const payloads = chunk.toString().split('\n\n')
        
              console.log('payloads: ', payloads)
        
              for (const payload of payloads) {
                // if string includes '[DONE]'
                if (payload.includes('[DONE]')) {
                  res.end() // Close the connection and return
                  return
                }
                if (payload.startsWith('data:')) {
                  // remove 'data: ' and parse the corresponding object
                  const data = JSON.parse(payload.replace('data: ', ''))
                  try {
                    const text = data.choices[0].delta?.content
                    if (text) {
                      console.log('text: ', text)
                      // send value of text to the client
                      res.write(`${text}`)
                    }
                  } catch (error) {
                    console.log(`Error with JSON.parse and ${payload}.\n${error}`)
                  }
                }
              }
            })})}

          res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
          });
          let reply
          for await (const chunk of response) {
         
              // res.write(`${chunk.choices[0].delta.content}`)                       
            console.log(chunk.choices[0].delta.content);
             reply +=  chunk.choices[0].delta.content ;  
          }
          conversation.push({
            role: 'assistant',
            content: reply,
          });
      
        
          res.send('hii')
       
        catch (error) {
          console.error(error);
          res.status(500).send(error.message || 'Something went wrong');
        }
      }
  export default route