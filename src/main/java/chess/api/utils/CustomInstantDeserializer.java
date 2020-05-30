package chess.api.utils;

import com.fasterxml.jackson.datatype.jsr310.deser.InstantDeserializer;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

public class CustomInstantDeserializer extends InstantDeserializer<OffsetDateTime> {

    public CustomInstantDeserializer() {
        super(OffsetDateTime.class, DateTimeFormatter.ISO_OFFSET_DATE_TIME,
                OffsetDateTime::from,
                a -> OffsetDateTime.ofInstant(Instant.ofEpochMilli(a.value), a.zoneId),
                a -> OffsetDateTime.ofInstant(Instant.ofEpochSecond(a.integer, a.fraction), a.zoneId),
                (d, z) -> d.withOffsetSameInstant(z.getRules().getOffset(d.toLocalDateTime())),
                true);
    }

}
