package chess.api.domain;

import chess.api.domain.maze.Message;
import chess.api.utils.MessageComparator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.SortedSet;
import java.util.TreeSet;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    private UUID id = UUID.randomUUID();

    private SortedSet<Message> messages = new TreeSet<>(new MessageComparator());

    private String uri;


}
