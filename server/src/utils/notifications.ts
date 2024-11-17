import {Connection} from "vscode-languageserver/node";
import {NotificationType} from "vscode-languageserver";

const NotifyUserNotification = new NotificationType<string>('custom/notifyUser');

export const sendNotification = async (connection: Connection, message: string) => {
    await connection.sendNotification(NotifyUserNotification, message);
};