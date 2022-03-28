export const WSClient = new WebSocket("ws://localhost:3000/");

export const connSend = async (msg: string): Promise<void> => {
  if (
    WSClient.readyState === WebSocket.CLOSED ||
    WSClient.readyState === WebSocket.CLOSING
  ) {
    throw new Error("websocket closed! cannot send message:\n" + msg);
  }
  if (WSClient.readyState === WebSocket.CONNECTING) {
    return new Promise((res) =>
      WSClient.addEventListener(
        "open",
        () => {
          WSClient.send(msg);
          res();
        },
        { once: true }
      )
    );
  }
  WSClient.send(msg);
};

export const connRec = async (): Promise<string> => {
  if (
    WSClient.readyState === WebSocket.CLOSED ||
    WSClient.readyState === WebSocket.CLOSING
  ) {
    throw new Error(
      "websocket closed! cannot expect to recieve any more messages!"
    );
  }

  return new Promise((res) =>
    WSClient.addEventListener("message", (msg) => res(msg.data), { once: true })
  );
};
