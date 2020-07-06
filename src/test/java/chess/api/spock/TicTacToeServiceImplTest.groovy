package chess.api.spock

import chess.api.domain.ticTacToe.Game
import chess.api.services.TicTacToeServiceImpl
import spock.lang.Specification

class TicTacToeServiceImplTest extends Specification {

    def games = new HashMap();
    def ticTacToeService = new TicTacToeServiceImpl()

    def setup() {
        games.put("test", new Game())
        ticTacToeService = new TicTacToeServiceImpl(games);
    }

    def 'host game should add new game to games'() {
        given:
        def currentSize = games.size();

        when:
        def game = ticTacToeService.hostGame(null, 'test2');

        then:
        game != null
        games.size() == (currentSize + 1)
    }

    def 'join game should return joining game'(){
        given:
        def uri = 'test'

        when:
        def game = ticTacToeService.joinGame(uri, null)

        then:
        game != null;
    }

    def 'get games should return all games'(){
        given:
        def currentSize = games.size();

        when:
        def games = ticTacToeService.getGames();

        then:
        games != null
        games == this.games
    }

}
