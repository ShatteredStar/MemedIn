// Switching title
const titles = [
	"Nobody reads your resume anyways.<br />Just send a meme instead.",
	"Are you an unemployed shitposter?<br />Send a meme as your resume!",
];

let currentIndex = 0;
const titleEl = document.getElementById("bigTitle");

// Wait 10 seconds on page load, then start cycling

setTimeout(() => {
	currentIndex = 1;
	titleEl.innerHTML = titles[currentIndex];

	// Then switch every 10 seconds
	setInterval(() => {
		currentIndex = (currentIndex + 1) % titles.length;
		titleEl.innerHTML = titles[currentIndex];
	}, 10000);
}, 10000);

// Scrolling word animation
(function () {
	const words = Array.from(document.querySelectorAll(".scroll-word"));
	let current = 0;
	function showWord(idx) {
		words.forEach((w, i) => w.classList.toggle("visible", i === idx));
	}
	showWord(0);
	setInterval(() => {
		words[current].classList.remove("visible");
		current = (current + 1) % words.length;
		setTimeout(() => showWord(current), 50);
	}, 2000);
})();

// Tabs
document.querySelectorAll(".tab-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		document
			.querySelectorAll(".tab-btn")
			.forEach((b) => b.classList.remove("active"));
		document
			.querySelectorAll(".panel")
			.forEach((p) => p.classList.remove("active"));
		btn.classList.add("active");
		document
			.getElementById("panel-" + btn.dataset.tab)
			.classList.add("active");
	});
});

/*modal shit */

function openToolModal() {
	document.getElementById("tool-modal").classList.add("open");
	document.body.style.overflow = "hidden";
}

function closeToolModal() {
	document.getElementById("tool-modal").classList.remove("open");
	document.body.style.overflow = "auto";
}

document.querySelectorAll('[onclick*="openToolModal"]').forEach((el) => {
	el.addEventListener("click", openToolModal);
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeToolModal();
});
