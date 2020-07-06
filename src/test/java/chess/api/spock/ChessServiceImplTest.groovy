package chess.api.spock

import chess.api.domain.chess.Chess
import chess.api.domain.chess.Player
import chess.api.services.ChessServiceImpl
import spock.lang.Specification

class ChessServiceImplTest extends Specification {

    ChessServiceImpl chessService = new ChessServiceImpl();
    Map<String, Chess> games = new HashMap<>();

    def setup() {
        games.put("test", new Chess(new Player("session", "", false), new Player("session2", "", false), Collections.emptyList(), false, chess.api.domain.chess.State.RUNNING, 100));
        chessService = new ChessServiceImpl(games);
    }

    def 'add new chess game'() {
        given:
        int currentSize = games.size();

        when:
        def game = chessService.addGame("test2", false, "session2", 100)

        then:
        game != null
        (currentSize + 1) == games.size()
    }

    def 'join game should return joining game'() {
        when:
        def game = chessService.joinGame("test", "session")
        def notExistingGame = chessService.joinGame("test100", "session")

        then:
        game != null
        notExistingGame == null
    }

    def 'should return all chess game map'() {
        when:
        def games = chessService.getGames();

        then:
        games != null
        games == this.games
    }

    def 'should return game by players session id'() {
        given:
        def sessionId = "session"

        when:
        def game = chessService.getGameBySessionId("session")

        then:
        game != null
        (game.blackPlayer.sessionId == sessionId || game.whitePlayer.sessionId == sessionId)
    }

    def 'delete should remove game from map'(){
        def game = games.values().first();

        when:
        chessService.delete(game);

        then:
        games.size() == 0
    }

}
