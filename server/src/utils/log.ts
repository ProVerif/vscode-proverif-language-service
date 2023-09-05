import {Connection} from "vscode-languageserver/node";

export type Message = {
    severity: 'info' | 'error'
    content: string
}
export const logMessages = (connection: Connection, messages: Message[]) => {
    messages.forEach(message => {
        switch (message.severity) {
            case "info":
                connection.console.log(message.content);
                break;
            case "error":
                connection.console.error(message.content);
        }
    });
};

export const createErrorMessage = (content: string): Message => ({severity: "error", content});
export const createInfoMessage = (content: string): Message => ({severity: "info", content});

export const createSingleErrorMessage = (content: string)=> ({messages: [createErrorMessage(content)]});
export const createSingleInfoMessage = (content: string)=> ({messages: [createInfoMessage(content)]});
