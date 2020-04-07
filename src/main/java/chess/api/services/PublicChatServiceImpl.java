package chess.api.services;

import chess.api.domain.publicChat.Member;
import chess.api.utils.MemberComparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PublicChatServiceImpl {

    private List<Member> members = new LinkedList<>();

    private final MemberComparator memberComparator;

    public PublicChatServiceImpl(MemberComparator memberComparator) {
        this.memberComparator = memberComparator;
    }

    public List<Member> addMember(Member member) {
        if (member != null) {
            members.add(member);
            members.sort(memberComparator);
        }

        return members;
    }

    public List<Member> getMembers() {
        return this.members;
    }

    public List<Member> removeMember(String sessionId) {
        members.removeIf(e -> Objects.equals(e.getSessionId(), sessionId));
        return this.members;
    }

}
