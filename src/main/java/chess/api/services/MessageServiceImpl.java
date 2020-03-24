package chess.api.services;

import chess.api.domain.Message;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class MessageServiceImpl {

    private List<Message> messages = new ArrayList<>();

    public Flux<List<Message>> getMessages() {
        return Flux
                .interval(Duration.ZERO, Duration.ofSeconds(1))
                .map(i -> messages);
    }

    public Message create(Message message) {
        message.setCreationDate(LocalDate.now());
        messages.add(message);
        return message;
    }

}
