package chess.api.utils;


import chess.api.domain.Message;

import java.util.Comparator;

public class MessageComparator implements Comparator<Message> {

    @Override
    public int compare(Message o1, Message o2) {
        return o1.getCreationDate().compareTo(o2.getCreationDate());
    }

}
