# Memed**in**™

> *Nobody reads your resume anyways. Just send a meme instead.*

MemedIn is a satirical LinkedIn-clone landing page with a **real, working steganography tool** hidden inside. It lets you secretly embed a PDF resume inside any PNG image using LSB (least-significant-bit) steganography — all client-side, no server, no uploads.

---

## What It Actually Does

The joke is the framing. The tool is real.

| Mode | What it does |
|---|---|
| **Encode** | Takes a cover image (PNG/JPG/WEBP) + a resume PDF, encodes the PDF into the least-significant bits of the image's RGB pixels, and outputs a new PNG that looks identical to the original. |
| **Decode** | Takes an encoded PNG and extracts the hidden PDF, downloading it directly to your browser. |

The output PNG is visually indistinguishable from the original. The hidden data survives as long as the file is **never recompressed** — i.e., always keep it as a lossless PNG.

---

## How It Works (Technical)

The encoding uses **1-bit LSB steganography** across the R, G, and B channels of every pixel (alpha is skipped).

**Payload format:**
```
[ 4-byte magic: "RMEM" ] [ 4-byte length (big-endian u32) ] [ raw PDF bytes ]
```

- **Capacity** = `floor(width x height x 3 / 8) - 8` bytes
- Each bit of the payload overwrites the LSB of one color channel
- On decode, the magic bytes are checked first; if absent, the image is not a MemedIn file

All processing happens in the browser via the Canvas API - no data ever leaves your machine.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Vanilla HTML5 |
| Styling | Vanilla CSS (LinkedIn-faithful design tokens) |
| Logic | Vanilla JavaScript (no frameworks, no dependencies) |
| Steganography | Canvas 2D API (`getImageData` / `putImageData`) |

Zero npm packages. Zero build step. Open `index.html` and it works.

---

## Usage

```
1. Open index.html in any modern browser
2. Scroll to (or click) "Okay, Here's the Actual Tool."
3. Encode tab:
   - Upload a cover image (PNG, JPG, or WEBP)
   - Upload your resume PDF
   - Check the capacity indicator — your PDF must fit
   - Click "Hide Resume in Image"
   - Save the output as PNG (never re-save as JPEG)
4. Decode tab:
   - Upload the exact PNG output from step 3
   - Click "Extract Resume"
   - Your PDF downloads automatically
```

> **Critical:** The output must be saved and shared as a **lossless PNG**. Any JPEG conversion or image re-compression will destroy the hidden data.

---

## Project Structure

```
MemedIn/
+-- index.html      # Entire app - markup, steganography logic, and UI
+-- style.css       # LinkedIn-clone design system (CSS custom properties)
+-- embedding.js    # (placeholder / future module split)
```

---

## Capacity Reference

A rough guide for how large an image needs to be to fit a typical resume:

| Image resolution | Usable capacity |
|---|---|
| 1920 x 1080 | ~760 KB |
| 2560 x 1440 | ~1.35 MB |
| 3840 x 2160 | ~3.04 MB |

Most one-page resume PDFs are under 500 KB, so a standard 1080p image is plenty.

---

## Limitations

- Output **must** stay as PNG - JPEG compression destroys LSB data
- Very large PDFs need very large cover images
- Single-file client-side app; no account system, cloud storage, or backend

---

## Future Plans

### 🔊 Audio Embedding ("Roast Mode")

The next planned feature follows the same steganography concept but with audio as the carrier.

**How it'll work:**

1. You upload your resume PDF
2. An AI generates a spoken roast of your resume — reading your experience back to you with the energy it deserves
3. Your actual resume PDF is embedded into the least-significant bits of the audio file's **PCM samples**, the same way it's currently hidden in image pixels
4. You receive a `.wav` file that plays a perfectly normal (devastating) roast when opened in any audio player — but contains your full resume hidden inside

**Why WAV:**  
Like PNG, WAV stores uncompressed audio (PCM), so the LSB data survives intact. MP3 or AAC would destroy it, same as JPEG destroys image steganography.

**The pitch:**  
Send the roast to a recruiter. They get a laugh. They also unknowingly have your resume. It is simultaneously the worst and most efficient cover letter format ever conceived.

> *Status: planned. The bit pipeline is already proven — it's just a new carrier medium.*

---

## License

Do whatever you want with it. It's a bit.

---

*"We didn't reinvent the wheel. We vibe coded it."*
