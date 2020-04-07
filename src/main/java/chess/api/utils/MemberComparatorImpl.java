package chess.api.utils;

import chess.api.domain.publicChat.Member;
import org.springframework.stereotype.Component;

@Component
public class MemberComparatorImpl implements MemberComparator {

    @Override
    public int compare(Member o1, Member o2) {
        return o1.getUsername().compareTo(o2.getUsername());
    }

}
