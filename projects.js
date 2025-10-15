let projects = [];
console.log("hi");
async function loadProjects() {
    console.log("Loaded projects:", projects);
    const response = await fetch('projects.json?nocache=' + new Date().getTime());
    projects = await response.json();

    const urlParams = new URLSearchParams(window.location.search);
    const currentTag = urlParams.get("tag") || "All";

    const tagSelect = document.getElementById("tag-select");

    if (currentTag) {
        for (const option of tagSelect.options) {
            if (option.value.toLowerCase() === currentTag.toLowerCase()) {
                option.selected = true;
                break;
            }
        }
    }

    updateProjects();

    tagSelect.addEventListener("change", updateProjects);
    document.getElementById("sort-select").addEventListener("change", updateProjects);
}

function updateProjects() {
    const tag = document.getElementById("tag-select").value;
    const sortOption = document.getElementById("sort-select").value;
    const container = document.getElementById("projects2");

    container.innerHTML = "";

    let filtered;
    if (tag === "All") {
        filtered = projects;
    } else {
        filtered = projects.filter(project =>
            project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
    }

    let sorted = [...filtered];

    if (sortOption === "alphabetically") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "newest") {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    if (sorted.length === 0) {
        container.innerHTML = "<p>No Projects Found</p>";
        return;
    }

    sorted.forEach(project => {
        container.innerHTML += `
        <div class="project-card2 hover-increase-size">
            <img src="${project.image}" alt="${project.title}" id="cover_image"/>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.github}" target="_blank">
              <img src="svg/github.svg" width="20px" height="20px" class="svg"/>
            </a>
        </div>`;
    });
}

loadProjects();