// --- Mock Data ---
const equipmentData = [
    {
        name: "Samsung Monitor 15\"",
        employee: "Tejas Modi",
        department: "Admin",
        serial: "MT/125/22778837",
        technician: "Mitchell Admin",
        category: "Monitors",
        company: "My Company (San Francisco)"
    },
    {
        name: "Acer Laptop",
        employee: "Bhaumik P",
        department: "Technician",
        serial: "MT/122/11112222",
        technician: "Marc Demo",
        category: "Computers",
        company: "My Company (San Francisco)"
    },
    {
        name: "Hydraulic Press X2",
        employee: "Sarah Jenkins",
        department: "Production",
        serial: "HP/900/44556677",
        technician: "Robert Brown",
        category: "Machinery",
        company: "My Company (Chicago)"
    },
    {
        name: "Dell Workstation",
        employee: "John Doe",
        department: "Design",
        serial: "DW/333/99887766",
        technician: "Marc Demo",
        category: "Computers",
        company: "My Company (San Francisco)"
    },
    {
        name: "Safety Conveyor Belt",
        employee: "Mike Ross",
        department: "Logistics",
        serial: "SC/555/12345678",
        technician: "Mitchell Admin",
        category: "Machinery",
        company: "My Company (New York)"
    }
];

// --- DOM Elements ---
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const noResultsDiv = document.getElementById('noResults');

let currentData = [...equipmentData]; // Keep track of filtered data for export

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
        // Determine badge color based on category
        let badgeClass = 'badge-computer'; // Default
        if (item.category === 'Monitors') badgeClass = 'badge-monitor';
        if (item.category === 'Machinery') badgeClass = 'badge-machinery';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="equipment-name">${item.name}</td>
            <td>${item.employee}</td>
            <td>${item.department}</td>
            <td style="font-family: monospace;">${item.serial}</td>
            <td>${item.technician}</td>
            <td><span class="badge ${badgeClass}">${item.category}</span></td>
            <td>${item.company}</td>
            <td>
                <button class="action-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 2. Search Functionality
function filterData(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    currentData = equipmentData.filter(item => {
        return (
            item.name.toLowerCase().includes(term) ||
            item.serial.toLowerCase().includes(term) ||
            item.employee.toLowerCase().includes(term) ||
            item.department.toLowerCase().includes(term)
        );
    });

    renderTable(currentData);
}

// 3. Add New Item (Mock)
function addNewItem() {
    alert("This would open a modal to add new equipment.");
}

// 4. Export to Excel (New Function)
function exportToExcel() {
    // 1. Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // 2. Create a worksheet from the current (filtered) data
    // We map the data to make the headers nicer if needed, but raw JSON works fine too.
    const ws = XLSX.utils.json_to_sheet(currentData);

    // 3. Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Equipment Data");

    // 4. Download file
    XLSX.writeFile(wb, "GearGuard_Equipment.xlsx");
}

// --- Event Listeners ---
searchInput.addEventListener('input', (e) => {
    filterData(e.target.value);
});

// --- Initialization ---
renderTable(equipmentData);