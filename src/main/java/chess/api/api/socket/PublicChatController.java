package chess.api.api.socket;

import chess.api.domain.publicChat.Message;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PublicChatController {

    @SubscribeMapping("/public/{username}/join")
    public Message joinChat(){
        new Message().a
    }

}
