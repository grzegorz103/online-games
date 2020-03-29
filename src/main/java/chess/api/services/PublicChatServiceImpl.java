package chess.api.services;

import chess.api.domain.publicChat.Member;
import chess.api.utils.MemberComparator;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.SortedSet;
import java.util.TreeSet;

@Service
public class PublicChatServiceImpl {

    private SortedSet<Member> members = new TreeSet<>(new MemberComparator());

    public SortedSet<Member> addMember(Member member) {
        if (member != null) {
            members.add(member);
            return members;
        }

        return null;
    }

    public SortedSet<Member> getMembers() {
        return this.members;
    }

    public SortedSet<Member> removeMember(String sessionId) {
        members.removeIf(e -> Objects.equals(e.getSessionId(), sessionId));
        return this.members;
    }

}
