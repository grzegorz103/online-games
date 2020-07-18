package chess.api.utils;

import org.apache.commons.lang3.RandomStringUtils;

import java.util.Map;

public class URIGenerator {

    public static String getAvailableURI(Map<String, ?> map) {
        String uri;
        do {
            uri = RandomStringUtils.randomAlphanumeric(Constants.MAZE_URI_GAME_LENGTH).toUpperCase();
        } while (map.containsKey(uri));

        return uri;
    }

}
