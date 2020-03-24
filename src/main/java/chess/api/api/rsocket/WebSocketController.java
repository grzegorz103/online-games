package chess.api.api.rsocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

import java.util.Map;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/message")
    @SendTo("/topic/reply")
    public String processMessageFromClient(@Payload String message,
                                           @Payload String user) throws Exception {
        System.out.println(message);
        return new Gson().fromJson(message, Map.class).get("message").toString() +
                " - " + new Gson().fromJson(user, Map.class).get("user").toString();
    }

    @MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
        return exception.getMessage();
    }

}
