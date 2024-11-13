import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
// import { useApp, queryClient } from "./ThemedApp";
import { queryClient } from "@/app/providers";
import useWebSocket, { ReadyState } from "react-use-websocket";
export default function AppSocket() {
    const { user } = useAuth();
    const wsEndpoint = process.env.NEXT_PUBLIC_FRONTEND_WS;
    const { sendJsonMessage, lastJsonMessage, readyState } =
        useWebSocket(wsEndpoint);
    useEffect(() => {
        if (user && readyState === ReadyState.OPEN) {
            sendJsonMessage({
                token: localStorage.getItem("token"),
            });
            console.log("WS: connection ready & token sent");
        }
    }, [readyState, user]);
    useEffect(() => {
        console.log("WS: new message received");
        if (lastJsonMessage && lastJsonMessage.event) {
            queryClient.invalidateQueries(lastJsonMessage.event);
        }
    }, [lastJsonMessage]);
    return <></>;
}