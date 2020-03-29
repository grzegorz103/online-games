package chess.api.services;

import chess.api.domain.publicChat.Member;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

@Service
public class PublicChatServiceImpl {

    private Set<Member> members = new TreeSet<>();

}
