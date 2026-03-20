package models

import (
	"database/sql"
	"time"

	"github.com/lib/pq"
)

// Song represents a musical piece uploaded by a user.
type Song struct {
	ID               string         `db:"id" json:"id"`
	UserID           string         `db:"user_id" json:"userId"`
	Title            string         `db:"title" json:"title"`
	Artist           sql.NullString `db:"artist" json:"artist"`
	LyricsAndChords  string         `db:"lyrics_and_chords" json:"lyricsAndChords"`
	Lyrics           sql.NullString `db:"lyrics" json:"lyrics"`
	SimplifiedChords sql.NullString `db:"simplified_chords" json:"simplifiedChords"`
	OriginalChords   sql.NullString `db:"original_chords" json:"originalChords"`
	TransposedChords sql.NullString `db:"transposed_chords" json:"transposedChords"`
	TransposedKey    sql.NullString `db:"transposed_key" json:"transposedKey"`
	Capo             sql.NullInt32  `db:"capo" json:"capo"`
	Tags             pq.StringArray `db:"tags" json:"tags"`
	Comments         pq.StringArray `db:"comments" json:"comments"`
	Ratings          pq.Int64Array  `db:"ratings" json:"ratings"`
	AvgRating        float64        `db:"avg_rating" json:"avgRating"`
	CreatedAt        time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt        time.Time      `db:"updated_at" json:"updatedAt"`
}
