# Vodič za refaktorisanje

Ovaj vodič pokazuje kako da refaktorišete vašu React komponentu na dva odvojena dela:

1.  **Web Scraper**: Komponenta za dohvatanje i ekstrahovanje sadržaja pesme sa URL-a.
2.  **Biblioteka pesama**: Komponenta za upravljanje (čuvanje, prikaz, brisanje) pesama u vašoj Firebase bazi podataka.

Ovo razdvajanje čini vaš kod organizovanijim, lakšim za održavanje i ponovnu upotrebu.

## Datoteke

*   [`scraper.md`](scraper.md): Detaljno uputstvo za kreiranje komponente za web scraping.
*   [`library.md`](library.md): Detaljno uputstvo za kreiranje komponente biblioteke pesama.
