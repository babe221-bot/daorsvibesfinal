-- +goose Up
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    lyrics_and_chords TEXT NOT NULL,
    lyrics TEXT,
    simplified_chords TEXT,
    original_chords TEXT,
    transposed_chords TEXT,
    transposed_key VARCHAR(10),
    capo INTEGER,
    tags TEXT[] DEFAULT '{}',
    comments TEXT[] DEFAULT '{}',
    ratings INTEGER[] DEFAULT '{}',
    avg_rating NUMERIC(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_songs_user_id ON songs(user_id);

-- +goose Down
DROP TABLE songs;