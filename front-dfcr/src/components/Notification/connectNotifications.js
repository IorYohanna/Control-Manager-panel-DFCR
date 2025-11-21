import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export function connectNotifications(userId, onMessage) {
    const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws-message"),
        connectHeaders: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        onConnect: () => {
            client.subscribe(`/user/${userId}/queue/notifications`, (msg) => {
                onMessage(JSON.parse(msg.body));
            });
        },
        debug: (str) => console.log(str),
    });

    client.activate();
    return client;
}
