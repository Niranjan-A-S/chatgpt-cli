import dotenv from 'dotenv';
import OpenAI from 'openai';
import readLineSync from 'readline-sync';
import colors from 'colors';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const beautifyLogs = (color, text) => { console.log(color(text)) };

const writeBootLogs = () => {
    beautifyLogs(colors.bold.red, "Welcome to the Chatbot developed by Niranjan ♥.");
    beautifyLogs(colors.bold.green, "You can start chatting with the bot.");
}

(async function bootstrap() {
    writeBootLogs();

    const chatHistory = []; // Store chat history in an array

    while (true) {
        const userInput = readLineSync.question(colors.bold.cyan("You: "));
        const messages = chatHistory.map(([role, content]) => ({ role, content }));
        messages.push({ role: "user", content: userInput });
        try {
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages
            });

            const completionText = chatCompletion.choices[0].message.content;
            beautifyLogs(colors.yellow, `Bot: ${completionText}`);
            chatHistory.push(["user", userInput], ["assistant", completionText]);
            if (userInput.toLowerCase() === "exit") {
                return;
            }
        } catch (error) {
            beautifyLogs(colors.red, error);
        }
    }
})();