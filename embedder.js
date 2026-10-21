// File handling + capacity check
const MAGIC = [0x52, 0x4d, 0x45, 0x4d];
const HEADER_BYTES = 8;
function fmt(n) {
	if (n < 1024) return n + " B";
	if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
	return (n / 1048576).toFixed(2) + " MB";
}

let imageFile = null,
	pdfFile = null;

function updateCapacity() {
	const cap = document.getElementById("capacity-display");
	if (!imageFile) {
		cap.style.display = "none";
		return;
	}
	cap.style.display = "block";
	const img = new Image();
	img.onload = () => {
		const av = Math.floor((img.width * img.height * 3) / 8) - HEADER_BYTES;
		document.getElementById("cap-value").textContent = fmt(av);
		URL.revokeObjectURL(img.src);
	};
	img.src = URL.createObjectURL(imageFile);
}

function checkReady() {
	document.getElementById("btn-encode").disabled = !(imageFile && pdfFile);
}

document.getElementById("input-image").addEventListener("change", (e) => {
	const f = e.target.files[0];
	if (!f) return;
	imageFile = f;
	document.getElementById("zone-image").classList.add("has-file");
	document.getElementById("hint-image").textContent = f.name;
	updateCapacity();
	checkReady();
});

document.getElementById("input-pdf").addEventListener("change", (e) => {
	const f = e.target.files[0];
	if (!f) return;
	pdfFile = f;
	document.getElementById("zone-pdf").classList.add("has-file");
	document.getElementById("hint-pdf").textContent = f.name;
	updateCapacity();
	checkReady();
});

document.getElementById("btn-encode").addEventListener("click", async () => {
	const status = document.getElementById("enc-status");
	const result = document.getElementById("enc-result");
	const pw = document.getElementById("enc-progress-wrap");
	const pb = document.getElementById("enc-progress-bar");
	result.classList.remove("visible");
	pb.style.width = "0%";
	pw.classList.add("visible");
	status.className = "status info";
	status.textContent = "Reading files…";
	document.getElementById("btn-encode").disabled = true;

	try {
		const pdfBytes = new Uint8Array(await pdfFile.arrayBuffer());
		const header = new Uint8Array(HEADER_BYTES);
		header[0] = MAGIC[0];
		header[1] = MAGIC[1];
		header[2] = MAGIC[2];
		header[3] = MAGIC[3];
		const len = pdfBytes.length;
		header[4] = (len >> 24) & 0xff;
		header[5] = (len >> 16) & 0xff;
		header[6] = (len >> 8) & 0xff;
		header[7] = len & 0xff;
		const payload = new Uint8Array(HEADER_BYTES + len);
		payload.set(header, 0);
		payload.set(pdfBytes, HEADER_BYTES);

		const img = await new Promise((res, rej) => {
			const i = new Image();
			i.onload = () => res(i);
			i.onerror = () => rej(new Error("Could not load image"));
			i.src = URL.createObjectURL(imageFile);
		});

		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		URL.revokeObjectURL(img.src);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		const avBits = Math.floor((pixels.length / 4) * 3);
		if (payload.length * 8 > avBits)
			throw new Error("Image too small for this PDF.");

		status.textContent = "Embedding…";
		pb.style.width = "40%";
		await new Promise((r) => setTimeout(r, 0));

		let bi = 0,
			pp = 0;
		const tb = payload.length * 8;
		while (bi < tb) {
			while (pp % 4 === 3) pp++;
			const byte = Math.floor(bi / 8),
				bit = 7 - (bi % 8);
			pixels[pp] = (pixels[pp] & 0xfe) | ((payload[byte] >> bit) & 1);
			bi++;
			pp++;
		}

		pb.style.width = "90%";
		ctx.putImageData(imageData, 0, 0);
		const dataURL = canvas.toDataURL("image/png");
		pb.style.width = "100%";
		document.getElementById("enc-output-img").src = dataURL;
		document.getElementById("btn-download-enc").onclick = () => {
			const a = document.createElement("a");
			a.href = dataURL;
			a.download = "resume-meme.png";
			a.click();
		};
		result.classList.add("visible");
		status.className = "status success";
		status.textContent = "Done. Save as PNG — never recompress.";
	} catch (err) {
		status.className = "status error";
		status.textContent = err.message;
		pw.classList.remove("visible");
	} finally {
		document.getElementById("btn-encode").disabled = false;
	}
});

let decodeFile = null;
document.getElementById("input-decode").addEventListener("change", (e) => {
	const f = e.target.files[0];
	if (!f) return;
	decodeFile = f;
	document.getElementById("zone-decode").classList.add("has-file");
	document.getElementById("hint-decode").textContent = f.name;
	document.getElementById("btn-decode").disabled = false;
});

document.getElementById("btn-decode").addEventListener("click", async () => {
	const status = document.getElementById("dec-status");
	const pw = document.getElementById("dec-progress-wrap");
	const pb = document.getElementById("dec-progress-bar");
	pb.style.width = "0%";
	pw.classList.add("visible");
	status.className = "status info";
	status.textContent = "Loading image…";
	document.getElementById("btn-decode").disabled = true;

	try {
		const img = await new Promise((res, rej) => {
			const i = new Image();
			i.onload = () => res(i);
			i.onerror = () => rej(new Error("Could not load image"));
			i.src = URL.createObjectURL(decodeFile);
		});
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		URL.revokeObjectURL(img.src);
		const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		pb.style.width = "30%";

		function extractBytes(pd, byteOffset, count) {
			const out = new Uint8Array(count);
			for (let i = 0; i < count; i++) {
				let byte = 0;
				for (let b = 0; b < 8; b++) {
					const gb = (byteOffset + i) * 8 + b,
						p = Math.floor(gb / 3),
						ch = gb % 3;
					byte = (byte << 1) | (pd[p * 4 + ch] & 1);
				}
				out[i] = byte;
			}
			return out;
		}

		const header = extractBytes(pixels, 0, HEADER_BYTES);
		const magic = String.fromCharCode(
			header[0],
			header[1],
			header[2],
			header[3],
		);
		if (magic !== "RMEM") throw new Error("No resume found in this image.");
		const length =
			(header[4] << 24) |
			(header[5] << 16) |
			(header[6] << 8) |
			header[7];
		if (length <= 0 || length > 50 * 1024 * 1024)
			throw new Error("Corrupted header.");

		pb.style.width = "60%";
		const pdfBytes = extractBytes(pixels, HEADER_BYTES, length);
		pb.style.width = "100%";

		if (pdfBytes[0] !== 0x25 || pdfBytes[1] !== 0x50)
			throw new Error("Extracted data is not a valid PDF.");

		const blob = new Blob([pdfBytes], {
			type: "application/pdf",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "extracted-resume.pdf";
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 10000);
		status.className = "status success";
		status.textContent = "Resume extracted successfully.";
	} catch (err) {
		status.className = "status error";
		status.textContent = err.message;
		pw.classList.remove("visible");
	} finally {
		document.getElementById("btn-decode").disabled = false;
	}
});
