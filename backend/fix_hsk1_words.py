import csv

# Read the correct CSV
with open("New-HSK-1-Words.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    words = []
    for row in reader:
        character = row["Chinese"].strip()
        pinyin = row["Pinyin"].strip()
        definition = row["English"].strip()
        # Only add if character is not empty and not a header
        if character and character != "Chinese":
            words.append({
                "character": character,
                "pinyin": pinyin,
                "definition": definition
            })

with open("app/hsk1_words.py", "w", encoding="utf-8") as f:
    f.write("hsk1_words = [\n")
    for word in words:
        f.write(f"    {{'character': '{word['character']}', 'pinyin': '{word['pinyin']}', 'definition': '{word['definition']}'}},\n")
    f.write("]\n")

print(f"Wrote {len(words)} words to app/hsk1_words.py")
