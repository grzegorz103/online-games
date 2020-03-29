package chess.api.utils;

import chess.api.domain.publicChat.Member;

import java.util.Comparator;

public class MemberComparator implements Comparator<Member> {

    @Override
    public int compare(Member o1, Member o2) {
        return o1.getUsername().compareTo(o2.getUsername());
    }

}
