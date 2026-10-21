# MemedIn™

Hide your resume inside a meme. Because the job market is a joke anyway.

## What Is This?

MemedIn is a web application that encodes your PDF resume into any image using steganography (LSB encoding). Upload a resume + a meme, get back a PNG that looks like a normal image but contains your entire resume hidden inside the pixels.

Send it anywhere. When someone needs your resume, they decode the image and extract the PDF.

**Why?** Because it's completely unnecessary and over-engineered for a non-problem. That's the entire point.

## How It Works

**Encode:** Resume PDF + Cover Image → PNG with hidden resume  
**Decode:** PNG with hidden resume → Original PDF extracted

The data is embedded in the least significant bits (LSBs) of pixel color channels, making it invisible to the human eye but perfectly recoverable by the decoder.

## Future Plans

- [ ] **DCT-based encoding** — Hide data in the frequency domain (JPEG-resistant)
- [ ] **DFT-based encoding** — Frequency-domain steganography for better robustness
- [ ] **Audio steganography** — Embed resumes in MP3s (with AI-generated roasts)
- [ ] **Capacity optimization** — Support larger files with adaptive encoding
- [ ] **Batch processing** — Encode multiple resumes at once
- [ ] **Web3 integration** — Because everything needs blockchain (optional, mostly a joke)
- [ ] **Mobile app** — iOS/Android version for memeing on the go
- [ ] **Share directly** — Generate shareable links with embedded resumes

## Tech Stack

- **Frontend:** HTML + CSS + Vanilla JavaScript
- **Steganography:** LSB encoding (JavaScript canvas API)
- **Image processing:** Canvas getImageData / putImageData
- **File handling:** Blob API, ArrayBuffer

## Why This Exists

Built for a hackathon with the theme: "Useless Problems. Serious Engineering."

MemedIn is exactly that — unnecessary, over-engineered, completely impractical, but fully functional steganography applied to resume submission.

---

*MemedIn™ — Your career, disrupted.*
