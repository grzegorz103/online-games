package chess.api.api.socket;

import chess.api.services.declarations.TicTacToeService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void hostGame(@Header("simpSessionId") String sessionId){
        ticTacToeService.hostGame(sessionId);
    }

}
