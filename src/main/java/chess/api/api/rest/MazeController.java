package chess.api.api.rest;

import chess.api.domain.maze.Point;
import chess.api.services.MazeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maze")
public class MazeController {

    @Autowired
    private MazeServiceImpl mazeService;

    @PostMapping
    public void saveMaze(@RequestParam("gameUri") String mazeUri,
                         @RequestBody Point[][] points){
        //mazeService.addGame(mazeUri, points);
    }
}
