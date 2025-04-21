import csv

hsk1_words = []
with open("New-HSK-1-Words.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        hsk1_words.append({
            "character": row["Chinese"].strip(),
            "pinyin": row["Pinyin"].strip(),
            "definition": row["English"].strip(),
        })

# Output as Python code for main.py
with open("hsk1_words.py", "w", encoding="utf-8") as f:
    f.write("hsk1_words = [\n")
    for word in hsk1_words:
        f.write(f"    {{'character': '{word['character']}', 'pinyin': '{word['pinyin']}', 'definition': '{word['definition']}'}},\n")
    f.write("]\n")

print(f"Wrote {len(hsk1_words)} words to hsk1_words.py")
