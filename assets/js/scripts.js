const DEFAULT_SETTINGS = {
    skinAutoRotate: false,
    skinRotationSpped: 0.035,
    skinAnimation: "idle",
    snowballCount: 64,
    instantApplySettings: false,
};

const scrollBtn = document.getElementById("scrollTopBtn");
const body = document.body;
const nav = document.querySelector("nav");
const preloader = document.querySelector(".preloader");
const settingsPopover = document.getElementById("settingsPopover");

scrollBtn.style.display = "none";

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

function initialiseSnowballs(numberOfSnowballs = DEFAULT_SETTINGS.snowballCount) {
    const snowContainer = document.querySelector(".snow-container");

    //while (snowContainer.firstChild) { snowContainer.removeChild(snowContainer.firstChild); }

    for (let i = 0; i < numberOfSnowballs; i++) {
        const snowball = document.createElement("div");
        snowball.classList.add("snowball");

        const size = Math.random() * 20 + 10;
        snowball.style.width = `${size}px`;
        snowball.style.height = `${size}px`;

        const startPosition = Math.random() * 100;
        snowball.style.left = `${startPosition}vw`;

        const animationDuration = Math.random() * 5 + 5;
        snowball.style.animationDuration = `${animationDuration}s`;

        const animationDelay = Math.random() * 5;
        snowball.style.animationDelay = `${animationDelay}s`;

        const swayDistance = (Math.random() - 0.5) * 200;
        snowball.style.setProperty("--sway-distance", `${swayDistance}px`);

        const opacity = Math.random();
        //snowball.style.opacity = opacity;
        snowball.style.setProperty("--max-opacity", opacity);

        snowContainer.appendChild(snowball);
    }
}

document.getElementById("skinImage").src = "https://vzge.me/full/512/Louixch";

document.getElementById("year").textContent = new Date().getFullYear();

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

    document.getElementById("countdown").textContent = `${d}T ${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

    const birthYear = 2011;
    const ageNextYear = nextYear - birthYear;
    document.getElementById("birthdayText").textContent = `Die Zeit bis zum Alter von ${ageNextYear} Jahren.`
}

setInterval(updateCountdown, 1000);
updateCountdown();

function copyServer() {
    //const serverAddress = "mc.louixch.de";
    const serverAddress = "louixch.de";
    navigator.clipboard.writeText(serverAddress).then(() => {
        const toast = document.getElementById("toast");
        const closeToast = document.getElementById("toast-close");
        toast.classList.add("show");
        setTimeout(() => {
            //toast.classList.remove('show');
            closeToastFunc();
        }, 8765);

        function closeToastFunc() {
            toast.classList.remove("show");
            closeToast.removeEventListener("click", closeToastFunc);
        }
        closeToast.addEventListener("click", closeToastFunc);
    });
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
}

async function loadProjects() {
    const container = document.getElementById("modrinthContainer");
    try {
        const response = await fetch(
            "https://api.modrinth.com/v2/user/Louixch/projects"
        );

        if (!response.ok) throw new Error("API Error");

        const projects = await response.json();

        if (projects.length === 0) { container.innerHTML = '<div class="card">Keine öffentlichen Projekte gefunden.</div>'; return; }

        container.innerHTML = "";

        projects.forEach((project) => {
            const updated = new Date(project.updated).toLocaleDateString("de-DE");
            const description = truncateText(project.description || "", 111); // 123 just better

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
    } catch (e) {container.innerHTML ='<div class="card error-msg">Projekte konnten nicht geladen werden.</div>';}
}

function getBoolFromStorage(key, fallback) {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return value === "true";
}

function getNumberFromStorage(key, fallback, min, max) {
    const value = Number(localStorage.getItem(key));
    if (Number.isNaN(value)) return fallback;
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
}

const skinViewerAnimations = {
    idle: skinview3d.IdleAnimation,
    walking: skinview3d.WalkingAnimation,
    wave: skinview3d.WaveAnimation,
    flying: skinview3d.FlyingAnimation,
    running: skinview3d.RunningAnimation,
};

function getSkinViewerAnimationByName(name) {
    return skinViewerAnimations[name] || skinview3d.IdleAnimation;
}

let currentSkinViewer;

async function initSkinGallery() {
    //const skinListContainer = document.getElementById('skin-list');
    const skinListContainer = document.getElementsByClassName("skin-list-grid-inner")[0];
    const mainCanvasContainer = document.getElementById("skin-container-main");
    const nameDisplay = document.getElementById("current-skin-name");
    const downloadBtn = document.getElementById("current-skin-download");

    if (!skinListContainer || !mainCanvasContainer) return;

    const skinFiles = [
        "2025-Winter.png",
        "2025-Blacksuit.png",
        "2025-Ende.png",
        "2025-Markler.png",
        "2025-Ordnungsamt.png",
        "2025-Painter.png",
        "2025-Pirat.png",
        "2025-Police.png",
        "2025-Red-Suit-Rose.png",
        "2025-Schaf.png",
        "2025-Soviet.png",
        "2025-Vintage.png",
        "2025-Zug-Gepaecktraeger.png",

        //"2024-Skin9.png",
        //"2024-Skin11.png",

        //"2025-Base-Skin-smallHands.png",
        //"2025-Base-Skin-largeHands.png",

        //"_dev.png",


        /*
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        "placeholder.png",
        */
    ];
    const basePath = "assets/minecraft-skins/";

    try {
        currentSkinViewer = new skinview3d.SkinViewer({
            canvas: document.createElement("canvas"),
            width: 300,
            height: 400,
            skin: basePath + skinFiles[0],
        });

        mainCanvasContainer.appendChild(currentSkinViewer.canvas);

        //currentSkinViewer.animation = new skinview3d.WalkingAnimation();
        //currentSkinViewer.animation = new skinview3d.IdleAnimation();
        //currentSkinViewer.animation = new skinview3d.WaveAnimation();
        //currentSkinViewer.animation = new skinview3d.FlyingAnimation();
        //currentSkinViewer.animation = new skinview3d.RunningAnimation();

        const storedAnimationName = localStorage.getItem("skinAnimation") || DEFAULT_SETTINGS.skinAnimation;
        const animationClass = getSkinViewerAnimationByName(storedAnimationName);
        currentSkinViewer.animation = new animationClass();

        currentSkinViewer.autoRotate = getBoolFromStorage("skinAutoRotate", DEFAULT_SETTINGS.skinAutoRotate);
        //currentSkinViewer.controls.enableRotate = false;
        currentSkinViewer.controls.enableZoom = false;
        //currentSkinViewer.autoRotateSpeed = localStorage.getItem("skinRotaionSpeed") || 0.1;
        currentSkinViewer.autoRotateSpeed = getNumberFromStorage("skinRotationSpeed", DEFAULT_SETTINGS.skinRotationSpped);
        currentSkinViewer.zoom = 0.8;
        //currentSkinViewer.nameTag = "Louixch";
        //currentSkinViewer.nameTag = new skinview3d.NameTagObject("Louixch", { textStyle: "#ef4444" }); // NOT WANTED

        if (typeof skinview3d.createOrbitControls === "function") { skinview3d.createOrbitControls(currentSkinViewer); }
    } catch (e) {
        mainCanvasContainer.innerHTML = '<p class="error-msg">Viewer Error</p>';
        console.error("SkinViewer initialization error:", e);
    }

    const getHeadUrl = (skinUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext("2d");

                // Draw Head (8,8) width 8, height 8 -> Scale to 64x64
                // Source: x=8, y=8, w=8, h=8
                // Dest: x=0, y=0, w=64, h=64
                ctx.imageSmoothingEnabled = false;
                //ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 64, 64);
                ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 64, 64);
                //ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 64, 64);

                //ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 64, 64);
                ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 64, 64);

                resolve(canvas.toDataURL());
            };
            img.onerror = () => resolve(skinUrl);
            img.src = skinUrl;
        });
    };

    const updateMainView = (fileName, cardElement) => {
        const fullPath = basePath + fileName;
        const displayName = fileName.replace(".png", "").replace(/-/g, " ");

        if (currentSkinViewer) currentSkinViewer.loadSkin(fullPath);

        nameDisplay.textContent = displayName;
        downloadBtn.href = fullPath;
        downloadBtn.download = fileName;

        document.querySelectorAll(".skin-bust-card").forEach((c) => c.classList.remove("active"));
        if (cardElement) cardElement.classList.add("active");
    };

    for (const [index, fileName] of skinFiles.entries()) {
        const fullPath = basePath + fileName;
        const headUrl = await getHeadUrl(fullPath);

        const card = document.createElement("div");
        card.className = "skin-bust-card";
        if (index === 0) card.classList.add("active");

        card.innerHTML = `<img src="${headUrl}" class="skin-bust-img" alt="${fileName}">`;

        card.onclick = () => updateMainView(fileName, card);
        skinListContainer.appendChild(card);
    }

    updateMainView(skinFiles[0], skinListContainer.firstChild);
}

function hidePreloader() {
    preloader.classList.add("hidden");
    body.classList.add("loaded");
}

const scrollOffsetMap = {
    "#info-cards": 40,
};

const handleHashScroll = () => {
    const hash = window.location.hash;

    if (hash) {
        const targetElement = document.querySelector(hash);

        if (targetElement) {
            const offset = scrollOffsetMap[hash] || 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }
};

const bodyIsLoaded = () => body.classList.contains("loaded");

Promise.all([loadProjects(), initSkinGallery()])
    .then(() => {
        hidePreloader();
        if (bodyIsLoaded()) {
            setTimeout(handleHashScroll, 3000);
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                if (bodyIsLoaded()) {
                    setTimeout(handleHashScroll, 3000);
                    obs.disconnect();
                }
            });
            observer.observe(body, {
                attributes: true,
                attributeFilter: ["class"],
            });
        }
    })
    .catch((error) => {
        console.error("Error loading content:", error);
        hidePreloader();
    });

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", handleHashScroll);
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

document.addEventListener("DOMContentLoaded", () => {
    const snowContainer = document.querySelector(".snow-container");
    const numberOfSnowballs = localStorage.getItem("snowballCount") || getRandomArbitrary(30, 60);

    initialiseSnowballs(numberOfSnowballs);
    /*
    for (let i = 0; i < numberOfSnowballs; i++) {
        const snowball = document.createElement("div");
        snowball.classList.add("snowball");

        const size = Math.random() * 20 + 10;
        snowball.style.width = `${size}px`;
        snowball.style.height = `${size}px`;

        const startPosition = Math.random() * 100;
        snowball.style.left = `${startPosition}vw`;

        const animationDuration = Math.random() * 5 + 5;
        snowball.style.animationDuration = `${animationDuration}s`;

        const animationDelay = Math.random() * 5;
        snowball.style.animationDelay = `${animationDelay}s`;

        const swayDistance = (Math.random() - 0.5) * 200;
        snowball.style.setProperty("--sway-distance", `${swayDistance}px`);

        const opacity = Math.random();
        //snowball.style.opacity = opacity;
        snowball.style.setProperty("--max-opacity", opacity);

        snowContainer.appendChild(snowball);
    }*/
});
/*
const settingsBtn = document.getElementById('settingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

/*
settingsBtn.addEventListener('click', () => {
    const popover = document.getElementById('settingsPopover');
    if (popover) {
        popover.toggle();
    }
});
*//*
saveSettingsBtn.addEventListener('click', () => {
    const skinAutoRotate = document.getElementById('toggleSkinAutoRotate').checked;
    const snowballCount = document.getElementById('snowballCount').value;

    localStorage.setItem("skinAutoRotate", skinAutoRotate);
    localStorage.setItem("snowballCount", snowballCount);

    location.reload();
});*/

document.addEventListener("DOMContentLoaded", () => {
    const toggleSkinAutoRotate = document.getElementById("toggleSkinAutoRotate");
    const snowballCountInput = document.getElementById("snowballCount");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    const skinAnimationSelect = document.getElementById("skinAnimation");
    const skinRotationSppedInput = document.getElementById("skinRotationSpeed");
    const instantApplySettingsCheckbox = document.getElementById("instantApplySettings");

    if (
        !toggleSkinAutoRotate ||
        !snowballCountInput ||
        !saveSettingsBtn ||
        !skinAnimationSelect ||
        !skinRotationSppedInput ||
        !instantApplySettingsCheckbox
    ) {
        console.warn("Settings elements missing in DOM");
        return;
    }

    const getFormSettings = () => ({
        skinAutoRotate: toggleSkinAutoRotate.checked,
        skinRotationSpeed: parseFloat(skinRotationSppedInput.value),
        skinAnimation: skinAnimationSelect.value,
        snowballCount: parseInt(snowballCountInput.value),
        instantApplySettings: instantApplySettingsCheckbox.checked,
    });

    const getStoredSettings = () => ({
        skinAutoRotate: getBoolFromStorage("skinAutoRotate", DEFAULT_SETTINGS.skinAutoRotate),
        skinRotationSpeed: getNumberFromStorage("skinRotationSpeed", DEFAULT_SETTINGS.skinRotationSpped),
        skinAnimation: localStorage.getItem("skinAnimation") || DEFAULT_SETTINGS.skinAnimation,
        snowballCount: getNumberFromStorage("snowballCount", DEFAULT_SETTINGS.snowballCount, 0, 256),
        instantApplySettings: getBoolFromStorage("instantApplySettings", DEFAULT_SETTINGS.instantApplySettings),
    });

    const applySettingsToForm = () => {
        const stored = getStoredSettings();
        toggleSkinAutoRotate.checked = stored.skinAutoRotate;
        skinRotationSppedInput.value = stored.skinRotationSpeed;
        snowballCountInput.value = stored.snowballCount;
        skinAnimationSelect.value = stored.skinAnimation;
        instantApplySettingsCheckbox.checked = stored.instantApplySettings;
    };

    applySettingsToForm();

    const isSettingsDirty = () => {
        const form = getFormSettings();
        const stored = getStoredSettings();

        return (
            form.skinAutoRotate !== stored.skinAutoRotate ||
            form.skinRotationSpeed !== stored.skinRotationSpeed ||
            form.skinAnimation !== stored.skinAnimation ||
            form.snowballCount !== stored.snowballCount ||
            form.instantApplySettings !== stored.instantApplySettings
        );
    };

    const applyInstantSettings = () => {
        const settings = getFormSettings();

        if (currentSkinViewer) {
            currentSkinViewer.autoRotate = settings.skinAutoRotate;
            currentSkinViewer.autoRotateSpeed = settings.skinRotationSpeed;
            const animationClass = getSkinViewerAnimationByName(
                settings.skinAnimation
            );
            currentSkinViewer.animation = new animationClass();
        }

        const snowContainer = document.querySelector(".snow-container");
        if (snowContainer) {
            while (snowContainer.firstChild) {
                snowContainer.removeChild(snowContainer.firstChild);
            }
            initialiseSnowballs(settings.snowballCount);
            /*
            for (let i = 0; i < settings.snowballCount; i++) {
                const snowball = document.createElement("div");
                snowball.classList.add("snowball");

                const size = Math.random() * 20 + 10;
                snowball.style.width = `${size-4}px`;
                snowball.style.height = `${size}px`;

                const startPosition = Math.random() * 100;
                snowball.style.left = `${startPosition}vw`;

                const animationDuration = Math.random() * 5 + 5;
                snowball.style.animationDuration = `${animationDuration}s`;

                const animationDelay = Math.random() * 5;
                snowball.style.animationDelay = `${animationDelay}s`;

                const swayDistance = (Math.random() - 0.5) * 200;
                snowball.style.setProperty("--sway-distance", `${swayDistance}px`);

                const opacity = Math.random();
                snowball.style.setProperty("--max-opacity", opacity);

                snowContainer.appendChild(snowball);
            }
            */
        }
    };

    toggleSkinAutoRotate.addEventListener("change", () => { if (getBoolFromStorage("instantApplySettings", DEFAULT_SETTINGS.instantApplySettings)) applyInstantSettings(); });
    skinRotationSppedInput.addEventListener("input", () => { if (getBoolFromStorage("instantApplySettings", DEFAULT_SETTINGS.instantApplySettings)) applyInstantSettings(); });
    skinAnimationSelect.addEventListener("change", () => { if (getBoolFromStorage("instantApplySettings", DEFAULT_SETTINGS.instantApplySettings)) applyInstantSettings(); });
    snowballCountInput.addEventListener("input", () => { if (getBoolFromStorage("instantApplySettings", DEFAULT_SETTINGS.instantApplySettings)) applyInstantSettings(); });

    saveSettingsBtn.addEventListener("click", () => {
        const formSettings = getFormSettings();

        localStorage.setItem("skinAutoRotate", formSettings.skinAutoRotate);
        localStorage.setItem(
            "skinRotationSpeed",
            formSettings.skinRotationSpeed
        );
        localStorage.setItem("skinAnimation", formSettings.skinAnimation);
        localStorage.setItem("snowballCount", formSettings.snowballCount); // nowballCount -> snowballCount
        localStorage.setItem(
            "instantApplySettings",
            formSettings.instantApplySettings
        );

        if (formSettings.instantApplySettings && !isSettingsDirty()) {
            if (settingsPopover) { settingsPopover.hidePopover(); }
        } else if (formSettings.instantApplySettings) {
            applyInstantSettings();
            if (settingsPopover) { settingsPopover.hidePopover(); }
        } else { location.reload(); }
    });
});
/*
    toggleSkinAutoRotate.checked = getBoolFromStorage("SETTING_skinAutoRotate", DEFAULT_SETTINGS.skinAutoRotate);
    skinRotationSppedInput.value = getNumberFromStorage("SETTING_skinRotationSpeed", DEFAULT_SETTINGS.skinRotationSpped);
    snowballCountInput.value = getNumberFromStorage("SETTING_snowballCount", DEFAULT_SETTINGS.snowballCount, 0, 256);
    skinAnimationSelect.value = localStorage.getItem("SETTING_skinAnimation") || DEFAULT_SETTINGS.skinAnimation;

    saveSettingsBtn.addEventListener("click", () => {
        localStorage.setItem("SETTING_skinAutoRotate", toggleSkinAutoRotate.checked);
        localStorage.setItem("SETTING_skinRotationSpeed", skinRotationSppedInput.value);
        localStorage.setItem("SETTING_skinAnimation", skinAnimationSelect.value);
        localStorage.setItem("SETTING_nowballCount", snowballCountInput.value);

        location.reload();
    });
*/

/*
function applySkinViewerAnimation(skinViewer, animationName) {
    const AnimationClass = getSkinViewerAnimationByName(animationName);
    skinViewer.animation = new AnimationClass();
}
*/

/*
function count_up(item, end_amount, start_amount = 0) {
    if (end_amount <= start_amount) { return }

    let current_amount = start_amount;

    const interval = setInterval(() => {
        item.innerHTML = current_amount;
        if (end_amount === current_amount) { clearInterval(interval) }
        current_amount++;
    }, 50);
}
*/

function count_up(item, end_amount, start_amount = 0, interval_time = 50) {
    if (end_amount <= start_amount) {
        return;
    }

    let current_amount = start_amount;

    const interval = setInterval(() => {
        item.innerHTML = current_amount;
        if (end_amount === current_amount) {
        clearInterval(interval);
        }
        current_amount++;
    }, interval_time);
}

function setupIntersectionObserver() {
    const hoursWastedElement = document.getElementById("hoursWasted");

    if (hoursWastedElement) {
        const endAmount = parseInt(hoursWastedElement.dataset.value, 10);
        const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
        };

        const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            count_up(entry.target, endAmount, 0, 543);
            observer.unobserve(entry.target);
            }
        });
        }, observerOptions);

        observer.observe(hoursWastedElement);
    }
}

document.addEventListener("DOMContentLoaded", setupIntersectionObserver);

function wishHappyNewYear() {
    const currentYear = new Date().getFullYear();
    const storageKey = `newYearWish-${currentYear}`;

    if (localStorage.getItem(storageKey)) {
        return;
    }

    const celebration = {
        message: "Frohes neues Jahr " + currentYear + "!",
        fireworks: true,
        launchedAt: new Date().toISOString(),
    };

    //console.log(celebration.message);
    window.alert(celebration.message)
    
    localStorage.setItem(storageKey, "true");
}

document.addEventListener("DOMContentLoaded", wishHappyNewYear);