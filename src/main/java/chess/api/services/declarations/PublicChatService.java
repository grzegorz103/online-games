package chess.api.services.declarations;

import chess.api.domain.publicChat.Member;

import java.util.List;

public interface PublicChatService {

    List<Member> addMember(Member member);

    List<Member> getMembers();

    List<Member> removeMember(String sessionId);

}
