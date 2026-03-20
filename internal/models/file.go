package models

import (
	"database/sql"
	"time"
)

// File represents an uploaded file.
type File struct {
	ID          string         `db:"id" json:"id"`
	UserID      string         `db:"user_id" json:"userId"`
	FileName    string         `db:"file_name" json:"fileName"`
	SizeBytes   int64          `db:"size_bytes" json:"sizeBytes"`
	ContentType sql.NullString `db:"content_type" json:"contentType"`
	URL         string         `db:"url" json:"url"`
	CreatedAt   time.Time      `db:"created_at" json:"createdAt"`
}
