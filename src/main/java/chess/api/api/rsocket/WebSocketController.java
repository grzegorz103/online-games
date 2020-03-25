package chess.api.api.rsocket;

import chess.api.domain.Point;
import chess.api.services.MazeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.Map;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private MazeServiceImpl mazeService;

    @MessageMapping("/message/{gameUri}")
    //   @SendTo("/topic/reply")
    // dodac session id
    public void createGame(Message<Point[][]> points,
                           @PathVariable("gameUri") String mazeUri,
                           @Header("simpSessionId") String sessionId) throws Exception {
        System.out.println(sessionId);
        System.out.println(Arrays.deepToString(points.getPayload()));
        mazeService.addGame(mazeUri, points.getPayload());
    }

    @MessageExceptionHandler
    public String handleException(Throwable exception) {
        messagingTemplate.convertAndSend("/errors", exception.getMessage());
        return exception.getMessage();
    }

}
