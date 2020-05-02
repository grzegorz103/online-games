package chess.api.domain.ticTacToe;

public enum State {

    NEW,
    RUNNING,
    ABANDONED,
    CLOSED;

    public boolean isRunning() {
        return this == RUNNING;
    }

}
