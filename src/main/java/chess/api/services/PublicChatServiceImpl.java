package chess.api.services;

import chess.api.domain.publicChat.Member;
import chess.api.domain.publicChat.Message;
import chess.api.domain.publicChat.MessageType;
import chess.api.services.declarations.PublicChatService;
import chess.api.utils.MemberComparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

@Service
public class PublicChatServiceImpl implements PublicChatService {

    private final List<Member> members;

    private final MemberComparator memberComparator;

    public PublicChatServiceImpl(MemberComparator memberComparator, List<Member> members) {
        this.memberComparator = memberComparator;
        this.members = members;
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

    @Override
    public Member getMemberBySessionId(String sessionId) {
        return members.stream()
                .filter(e -> Objects.equals(e.getSessionId(), sessionId))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }

    @Override
    public Message processMessage(Message message,
                                  String sessionId) {
        Member author = this.getMemberBySessionId(sessionId);
        message.setAuthorUsername(author.getUsername());
        message.setAuthorRandomId(author.getRandomId());
        message.setCreationDate(Instant.now());
        message.setType(MessageType.MESSAGE);
        return message;
    }

}
