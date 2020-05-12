package chess.api.api.rest;

import chess.api.domain.maze.Message;
import chess.api.services.MazeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maze")
public class MazeController {

    @Autowired
    private MazeServiceImpl mazeService;

   /* @GetMapping
    @PreAuthorize("isAuthenticated()")
    public Message saveMaze(){
        return new Message("test");
    }*/
}
