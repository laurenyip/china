import PyPDF2
import csv
import re

pdf_path = "New-HSK-1-Words.pdf"
csv_path = "New-HSK-1-Words.csv"

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

# Improved parsing: expect each line to have Number Chinese Pinyin English
# Example: 1 爱 ài love
#          2 爱好 ài hào hobby
# This will grab the Chinese, Pinyin, and the rest as English

def parse_lines(text):
    rows = []
    for line in text.splitlines():
        # Remove leading/trailing whitespace
        line = line.strip()
        # Skip empty lines
        if not line:
            continue
        # Use regex to split: number, chinese, pinyin(s), english (rest)
        # Handles both single and multi-word pinyin
        m = re.match(r"^(\d+)\s+([\u4e00-\u9fff（）｜·]+)\s+([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùüǘǚǜńňḿ\s]+)\s+(.+)$", line)
        if m:
            chinese = m.group(2).strip()
            pinyin = m.group(3).strip()
            english = m.group(4).strip()
            rows.append([chinese, pinyin, english])
    return rows

text = extract_text_from_pdf(pdf_path)
rows = parse_lines(text)

with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['Chinese', 'Pinyin', 'English'])
    for row in rows:
        writer.writerow(row)

print(f"Extracted {len(rows)} rows to {csv_path}")
