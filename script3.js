// --- Mock Data (From your Sketch) ---
const teamsData = [
    {
        name: "Internal Maintenance",
        member: "Anas Makari",
        company: "My Company (San Francisco)"
    },
    {
        name: "Metrology",
        member: "Marc Demo",
        company: "My Company (San Francisco)"
    },
    {
        name: "Subcontractor",
        member: "Maggie Davidson",
        company: "My Company (San Francisco)"
    }
];

// --- DOM Elements ---
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const noResultsDiv = document.getElementById('noResults');

// --- Functions ---

// 1. Render Table
function renderTable(data) {
    tableBody.innerHTML = ''; // Clear existing rows

    if (data.length === 0) {
        noResultsDiv.style.display = 'block';
        return;
    } else {
        noResultsDiv.style.display = 'none';
    }

    data.forEach(item => {
        // Create initials for avatar (e.g., "Marc Demo" -> "MD")
        const names = item.member.split(' ');
        const initials = names.map(n => n[0]).join('').toUpperCase().substring(0, 2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="team-name">${item.name}</td>
            <td>
                <div class="member-pill">
                    <div class="member-avatar">${initials}</div>
                    <span>${item.member}</span>
                </div>
            </td>
            <td>${item.company}</td>
            <td>
                <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 2. Search Functionality
function filterData(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    const filtered = teamsData.filter(item => {
        return (
            item.name.toLowerCase().includes(term) ||
            item.member.toLowerCase().includes(term) ||
            item.company.toLowerCase().includes(term)
        );
    });

    renderTable(filtered);
}

// 3. Add New Team (Mock)
function addNewTeam() {
    alert("Functionality to create a new team would open here.");
}

// --- Event Listeners ---
searchInput.addEventListener('input', (e) => {
    filterData(e.target.value);
});

// --- Initialization ---
renderTable(teamsData);
