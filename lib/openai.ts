import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const chatWithAstra = async (message: string, childName?: string) => {
  const systemMessage = `You are Astra, a kind, wise, slightly playful mentor helping a child learn real-world life skills. Always respond with encouragement, open-ended questions, and emotional intelligence. Keep your responses concise and age-appropriate for kids aged 8-13. Use emojis sparingly but meaningfully. ${childName ? `The child's name is ${childName}.` : ''}`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || "I'm sorry, I didn't understand that. Can you try asking in a different way?"
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    return "I'm having trouble thinking right now. Can you try asking me again in a moment?"
  }
}