package chess.api.config;

import chess.api.domain.chess.Chess;
import chess.api.domain.maze.Maze;
import chess.api.domain.publicChat.Member;
import chess.api.domain.ticTacToe.Game;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class GameConfig {

    @Bean
    public Map<String, Chess> getChessGameMap() {
        return new ConcurrentHashMap<>();
    }

    @Bean
    public Map<String, Maze> getMazeGameMap() {
        return new ConcurrentHashMap<>();
    }

    @Bean
    public List<Member> getMemberList() {
        return Collections.synchronizedList(new LinkedList<>());
    }

    @Bean
    public Map<String, Game> getTicTacToeMap() {
        return new ConcurrentHashMap<>();
    }

}
