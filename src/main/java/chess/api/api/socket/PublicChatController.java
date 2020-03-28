package chess.api.api.socket;

import chess.api.domain.publicChat.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
public class PublicChatController {

    @SubscribeMapping("/public/{username}/join")
    @SendTo("/queue/public/chat")
    public Message joinChat(@DestinationVariable("username") String username) {
        return new Message(username + " dolacza do chatu", LocalDate.now());
    }

}
