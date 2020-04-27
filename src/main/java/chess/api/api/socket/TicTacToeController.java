package chess.api.api.socket;

import chess.api.api.utils.WebSocketUtils;
import chess.api.domain.ticTacToe.Game;
import chess.api.services.declarations.TicTacToeService;
import chess.api.utils.URIGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class TicTacToeController {

    private final SimpMessageSendingOperations sendingOperations;

    private final TicTacToeService ticTacToeService;

    public TicTacToeController(SimpMessageSendingOperations sendingOperations,
                               TicTacToeService ticTacToeService) {
        this.sendingOperations = sendingOperations;
        this.ticTacToeService = ticTacToeService;
    }

    @MessageMapping("/tic/host")
    public void hostGame(@Header("simpSessionId") String sessionId) {
        String uri = URIGenerator.getAvailableURI(ticTacToeService.getGames());
        Game game = ticTacToeService.hostGame(sessionId, uri);
        sendingOperations.convertAndSendToUser(sessionId, "/queue/tic/id", sessionId, WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(sessionId, "/queue/tic", game, WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(sessionId, "/queue/tic/uri", uri, WebSocketUtils.getMessageHeaders(sessionId));
    }

    @MessageMapping("/tic/join/{uri}")
    public void joinGame(@Header("simpSessionId") String sessionId,
                         @DestinationVariable String uri) {
        Game game = ticTacToeService.joinGame(uri, sessionId);
        sendingOperations.convertAndSendToUser(sessionId, "/queue/tic/id", sessionId, WebSocketUtils.getMessageHeaders(sessionId));
        sendingOperations.convertAndSendToUser(game.getOPlayer().getSessionId(), "/queue/tic", game, WebSocketUtils.getMessageHeaders(game.getOPlayer().getSessionId()));
        sendingOperations.convertAndSendToUser(game.getXPlayer().getSessionId(), "/queue/tic", game, WebSocketUtils.getMessageHeaders(game.getXPlayer().getSessionId()));
    }

    @MessageMapping("/tic/move/{uri}/{move}")
    public void move(@Header("simpSessionId") String sessionId,
                     @DestinationVariable String uri,
                     @DestinationVariable int move) {
        Game game = ticTacToeService.move(uri, sessionId, move);
        sendingOperations.convertAndSendToUser(game.getOPlayer().getSessionId(), "/queue/tic", game, WebSocketUtils.getMessageHeaders(game.getOPlayer().getSessionId()));
        sendingOperations.convertAndSendToUser(game.getXPlayer().getSessionId(), "/queue/tic", game, WebSocketUtils.getMessageHeaders(game.getXPlayer().getSessionId()));
    }

    @MessageMapping("/tic/rematch/{uri}")
    public void rematch(@Header("simpSessionId") String sessionId,
                        @DestinationVariable String uri) {
        Game game = ticTacToeService.rematch(uri, sessionId);
        if (game != null) {
            sendingOperations.convertAndSendToUser(game.getOPlayer().getSessionId(), "/queue/tic", game, WebSocketUtils.getMessageHeaders(game.getOPlayer().getSessionId()));
            sendingOperations.convertAndSendToUser(game.getXPlayer().getSessionId(), "/queue/tic", game, WebSocketUtils.getMessageHeaders(game.getXPlayer().getSessionId()));
        }
    }

}
