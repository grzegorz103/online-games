package chess.api.spock

import chess.api.domain.publicChat.Member
import chess.api.services.PublicChatServiceImpl
import chess.api.utils.MemberComparatorImpl
import spock.lang.Specification

class PublicChatServiceImplTest extends Specification {

    def members = new LinkedList()

    def publicChatService = new PublicChatServiceImpl(new MemberComparatorImpl(), null)

    def setup() {
        members.add(Mock(Member))
        members.add(Mock(Member))
        members.add(Mock(Member))

        def memberComparatorSpy = Spy(MemberComparatorImpl);
        memberComparatorSpy.compare(_ as Member, _ as Member) >> 1

        this.publicChatService = new PublicChatServiceImpl(memberComparatorSpy, members);
    }

    def 'should add new member to member list'() {
        given:
        def member = Mock(Member)

        when:
        def membersAfterAdd = publicChatService.addMember(member)

        then:
        membersAfterAdd != null
        membersAfterAdd == this.members
    }

    def 'should return all members list'() {
        when:
        def members = publicChatService.getMembers();

        then:
        members != null
        members == this.members
    }

}
