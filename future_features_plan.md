# Entwicklungsplan: RecipeManager (SilkSavor)

Hier ist ein strategischer Plan für die Weiterentwicklung der App. Die Features sind darauf ausgelegt, die App von einer reinen Verwaltungs-Software zu einem echten täglichen Begleiter für Kochbegeisterte (im Premium "Artisan"-Design) zu machen.

## Phase 1: Die perfekten Basics (Quick Wins)
*Fokus auf Usability und Kategorisierung, um die Navigation bei wachsender Rezeptanzahl zu erleichtern.*

- [x] **Kategorien-Seite ("Collections"):**
  - Eine dedizierte Seite, die Rezepte nach Themen gruppiert (z.B. "Unter 30 Minuten", "Vegetarisch", "Saisonale Favoriten").
  - Visuell ansprechende Kacheln für jede Kategorie.
- [x] **Erweiterte Such- & Filterfunktion:**
  - Filtern nach Zutaten ("Was habe ich im Kühlschrank?").
  - Filter für maximale Zubereitungszeit und Ernährungsformen (Vegan, Glutenfrei).
- [x] **Druckansicht ("Print Mode"):**
  - Ein spezielles CSS-Stylesheet (`@media print`), das beim Drucken eines Rezepts nur die Zutaten, Mengen und Zubereitungsschritte in einem eleganten, tinte-sparenden Layout ausgibt.

## Phase 2: Personalisierung & Alltagstauglichkeit
*Fokus auf Benutzerkonten und die tägliche Nutzung im Alltag.*

- [ ] **Benutzer-Accounts & Authentifizierung (z.B. via NextAuth):**
  - Registrierung und Login.
  - Eigene Profile, um zu sehen, wer welches Rezept erstellt hat.
- [ ] **"Mein Kochbuch" (Favoriten):**
  - Ein Lesezeichen-Icon (Bookmark) auf den Rezeptkarten, um Rezepte für später zu speichern.
  - Eine private Übersichtsseite mit allen markierten Lieblingsrezepten.
- [ ] **Interaktiver Wochenplaner:**
  - Eine Kalenderansicht, in der man Rezepte per Drag & Drop auf Wochentage ziehen kann.
- [ ] **Automatisierte Einkaufsliste:**
  - Basierend auf dem Wochenplaner werden alle Zutaten intelligent zusammengefasst und als abhakbare Einkaufsliste generiert (mobil optimiert für den Supermarkt).

## Phase 3: Community & "Smart Kitchen"
*Fokus auf Interaktion und moderne Technologie.*

- [ ] **Cooking Mode (Koch-Modus):**
  - Ein Button "Jetzt kochen", der das Rezept im Vollbild öffnet.
  - Riesige Schrift, ein Schritt pro Seite (Swipe-Bedienung) und eine Funktion, die verhindert, dass der Bildschirm des Handys/Tablets sich automatisch abdunkelt (Wake Lock API).
- [ ] **Bewertungen & Kommentare:**
  - Ein Sterne-Rating-System und eine Kommentarfunktion unter den Rezepten, damit Nutzer Abwandlungen ("Habe statt Sahne Kokosmilch genommen") austauschen können.
- [ ] **Echter Bild-Upload:**
  - Statt nur Bild-URLs einzufügen, direkte Integration eines Datei-Uploads (z.B. via Amazon S3 oder Vercel Blob) für lokale Fotos.
- [ ] **KI-Rezept-Generator:**
  - Ein Feature: "Ich habe X, Y und Z im Kühlschrank" – und eine KI generiert daraus ein passendes Rezept im Artisan-Format und speichert es ab.

## Phase 4: Native Experience
- [ ] **PWA (Progressive Web App):**
  - Die App installierbar machen, sodass Nutzer sie wie eine native App auf dem Homescreen ihres Smartphones ablegen können (mit Offline-Support für gespeicherte Rezepte).

## Phase 5: "SilkSavor" Spezialitäten (Nischen- & Premium-Features)
*Ideen, die perfekt zum eleganten "Artisan/Editorial" Vibe der App passen und sie von Standard-Apps abheben.*

- [ ] **Kulinarisches Tagebuch (Recipe Journal):**
  - Statt nur simpler Sternchen-Bewertungen: Ein elegantes Tagebuch für jedes Rezept. Nutzer können Fotos *ihrer eigenen* Versuche hochladen und private Notizen hinterlegen (z.B. "Beim nächsten Mal die Nüsse vorher rösten" oder "Mit Riesling aus 2021 serviert").
- [ ] **Saisonale Zutaten-Matrix & "Zero Waste":**
  - Ein Kalender, der zeigt, welche Gemüsesorten gerade Saison haben. Die App schlägt automatisch Rezepte mit diesen saisonalen (und oft günstigeren/frischeren) Zutaten vor.
  - Ein intelligenter "Resteverwerter": Die App merkt sich, dass für Rezept A nur ein halber Kürbis gebraucht wurde, und schlägt für den nächsten Tag Rezept B vor, das die andere Hälfte nutzt.
- [ ] **Wein- & Getränke-Pairing (Der digitale Sommelier):**
  - Zu Rezepten können passende Weine, Craft-Biere oder alkoholfreie Pairings (Kombucha, Mocktails) vorgeschlagen werden.
  - Nutzer könnten ihren "virtuellen Weinkeller" anlegen und die App sucht Rezepte, die zu den vorhandenen Flaschen passen.
- [ ] **Interaktives Technik-Glossar:**
  - Fachbegriffe in Zubereitungsschritten (z.B. *Deglasieren*, *Julienne*, *Blanchieren*, *Sous-Vide*) werden im Text dezent hervorgehoben. Klickt man darauf, öffnet sich ein elegantes Modal mit einer kurzen Erklärung oder einem kleinen Video der Technik.
- [ ] **Profi-Skalierer & Bäcker-Mathematik (Baker's Math):**
  - Nicht nur simples "Mal 2" bei Portionen: Backrezepte können basierend auf Prozentzahlen (Baker's Percentages) skaliert werden.
  - Automatische Umrechnung von Kuchenformen (z.B. "Ich habe eine 26cm Springform statt der geforderten 20cm – wie ändern sich die Zutatenmengen?").
- [ ] **Integrierte "Smart Timers":**
  - Wenn im Text steht "Für *15 Minuten* köcheln lassen", kann man direkt auf die Zeitangabe tippen, und am Bildschirmrand startet ein unaufdringlicher Timer.
