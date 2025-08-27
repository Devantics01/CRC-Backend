import chat from "../model/chatModel.js";
import { generateChatID } from "../helper/otpGenerator.js";


export const createChat = async(data)=>{
    try {
        await chat.create({
            chatID: generateChatID(),
            personOne: data.person_one,
            personTwo: data.person_two,
            chats: {}
        })
    } catch (err) {
        return {error: err};
    }
};

export const getChat = async(data)=>{
    try {
        const res = await chat.findOne({
            where: {
                chatID: data.chatID
            }
        })
    } catch (err) {
        
    }
}
