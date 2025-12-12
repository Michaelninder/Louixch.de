const scrollBtn = document.getElementById("scrollTopBtn");
const body = document.body;
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollBtn.style.display = "block";
        body.classList.add("scrolled");
    } else {
        scrollBtn.style.display = "none";
        body.classList.remove("scrolled");
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById('skinImage').src = 'https://visage.surgeplay.com/full/512/Louixch';

document.getElementById('year').textContent = new Date().getFullYear();

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;
    const targetDate = new Date(`January 1, ${nextYear} 00:00:00`);

    const diff = targetDate - now;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `${d}T ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    const birthYear = 2011;
    const ageNextYear = nextYear - birthYear;
    document.getElementById('birthdayText').textContent = `Die Zeit bis zum Alter von ${ageNextYear} Jahren.`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

function copyServer() {
    //const serverAddress = "mc.louixch.de";
    const serverAddress = "louixch.de";
    navigator.clipboard.writeText(serverAddress).then(() => {
        const toast = document.getElementById('toast');
        const closeToast = document.getElementById('toast-close');
        toast.classList.add('show');
        setTimeout(() => {
            //toast.classList.remove('show');
            closeToastFunc();
        }, 3456);

        function closeToastFunc() {
            toast.classList.remove('show');
            closeToast.removeEventListener('click', closeToastFunc);
        }
        closeToast.addEventListener('click', closeToastFunc);
    });
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

async function loadProjects() {
    const container = document.getElementById('modrinthContainer');
    try {
        const response = await fetch('https://api.modrinth.com/v2/user/Louixch/projects');

        if (!response.ok) throw new Error('API Error');

        const projects = await response.json();

        if (projects.length === 0) {
            container.innerHTML = '<div class="card">Keine öffentlichen Projekte gefunden.</div>';
            return;
        }

        container.innerHTML = '';

        projects.forEach(project => {
            const updated = new Date(project.updated).toLocaleDateString('de-DE');
            const description = truncateText(project.description || '', 111); // 123 just better

            const html = `
                <div class="project-card">
                    <div class="project-header">
                        <img src="${project.icon_url}" alt="${project.title}" class="project-icon">
                        <div>
                            <h3 class="card-title" style="margin:0; font-size:1.1rem;">${project.title}</h3>
                            <span class="tag" style="font-size: 0.7rem; color: var(--primary); background: rgba(239,68,68,0.1); padding: 2px 8px; border-radius: 4px; margin-top: 4px; display:inline-block;">${project.project_type}</span>
                        </div>
                    </div>
                    <p class="card-content" style="font-size: 0.9rem; margin-bottom: 15px;">${description}</p>
                    <div style="margin-top:auto;">
                        <a href="https://modrinth.com/project/${project.slug}" target="_blank" class="btn btn-full" style="font-size: 0.9rem; padding: 8px;">Ansehen</a>
                        <div class="project-meta">
                            <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> ${project.downloads}</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg> ${updated}</span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (e) {
        container.innerHTML = '<div class="card error-msg">Projekte konnten nicht geladen werden.</div>';
    }
}


async function loadSkins() {
	const container = document.getElementById("skinContainer");
	if (!container) return;

	const skinFiles = [
		"Blacksuit.png",
		"Ichneumaybeeeeee.png",
		"Markler.png",
		"Ordnungsamt.png",
		"Painter.png",
		"Pirat.png",
		"Police.png",
		"Red-Suit-Rose.png",
		"Schaf.png",
		"Soviet.png",
	];

	const skinBasePath = "assets/minecraft-skins/";
	let cardsHtml = "";

	skinFiles.forEach((fileName, index) => {
		const skinName = fileName.replace(".png", "").replace(/-/g, " ");
		const skinUrl = `${skinBasePath}${fileName}`;
		const canvasId = `skin-canvas-${index}`;

		cardsHtml += `
            <div class="project-card">
                <div class="skin-canvas-container">
                    <canvas id="${canvasId}"></canvas>
                </div>
                <h3 class="card-title" style="margin-top: 15px; text-align: center; text-transform: capitalize;">
                    ${skinName}
                </h3>
                <a href="${skinUrl}" download="${fileName}" class="btn btn-full" style="margin-top: auto; font-size: 0.9rem; padding: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                </a>
            </div>
        `;
	});

	container.innerHTML = cardsHtml;

	skinFiles.forEach((fileName, index) => {
		const canvas = document.getElementById(`skin-canvas-${index}`);
		if (canvas) {
            let skinViewer = new skinview3d.SkinViewer({
                canvas: canvas,
                width: 300,
                height: 400,
                skin: `${skinBasePath}${fileName}`,
            });

            skinViewer.animation = new skinview3d.WalkingAnimation();
            skinViewer.zoom = 0.9;

            let control = new skinview3d.OrbitControls(skinViewer);
            control.enableRotate = true;
            control.enableZoom = false;
            control.enablePan = false;
        }
    });
}

loadProjects();
loadSkins();