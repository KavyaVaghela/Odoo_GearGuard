// --- Configuration & State ---
const scrollStartHour = 6;
let currentDate = new Date(); 
let viewMode = 'week'; // Default view is 'week', options: 'week' or 'day'

// --- DOM Elements ---
const weekHeader = document.getElementById('weekHeader');
const timeLabels = document.getElementById('timeLabels');
const timeGrid = document.getElementById('timeGrid');
const labelDisplay = document.getElementById('currentDateLabel');
const miniCalGrid = document.getElementById('miniCalGrid');
const miniCalTitle = document.getElementById('miniCalTitle');

// Buttons
const weekBtn = document.getElementById('weekViewBtn');
const dayBtn = document.getElementById('dayViewBtn');

// --- Initialization ---
function init() {
    renderTimeLabels();
    renderCalendar();     // Renders the main view (Day or Week)
    renderMiniCalendar(currentDate);
    scrollToStart();
    
    // Navigation Event Listeners
    document.getElementById('prevBtn').onclick = () => navigate(-1);
    document.getElementById('nextBtn').onclick = () => navigate(1);
    
    // Today Button: Resets date to now, keeps current view mode
    document.getElementById('todayBtn').onclick = () => {
        currentDate = new Date();
        renderCalendar();
        renderMiniCalendar(currentDate);
    };

    // View Switching Logic
    weekBtn.onclick = () => switchView('week');
    dayBtn.onclick = () => switchView('day');

    // Update red line every minute
    setInterval(updateCurrentTimeLine, 60000);
}

// --- Logic: Switch Views ---
function switchView(mode) {
    viewMode = mode;
    
    // Update Button Styles
    if (mode === 'week') {
        weekBtn.classList.add('active');
        dayBtn.classList.remove('active');
    } else {
        dayBtn.classList.add('active');
        weekBtn.classList.remove('active');
    }

    // Re-render
    renderCalendar();
}

// --- Logic: Navigation (Next/Prev) ---
function navigate(direction) {
    // If Week view, jump 7 days. If Day view, jump 1 day.
    const jump = viewMode === 'week' ? 7 : 1;
    currentDate.setDate(currentDate.getDate() + (jump * direction));
    
    renderCalendar();
    renderMiniCalendar(currentDate);
}

// --- Logic: Render Main Calendar (Handles both Week and Day) ---
function renderCalendar() {
    // 1. Determine Start Date & Number of Columns
    let loopStartDate = new Date(currentDate);
    let daysToRender = 1; // Default for 'day' view

    if (viewMode === 'week') {
        const day = loopStartDate.getDay(); // 0 (Sun) to 6 (Sat)
        loopStartDate.setDate(loopStartDate.getDate() - day); // Back to Sunday
        daysToRender = 7;
        
        // Update CSS Grid for 7 columns
        weekHeader.style.gridTemplateColumns = "60px repeat(7, 1fr)";
        timeGrid.style.gridTemplateColumns = "60px repeat(7, 1fr)";
    } else {
        // Day view: CSS Grid for 1 column
        weekHeader.style.gridTemplateColumns = "60px 1fr";
        timeGrid.style.gridTemplateColumns = "60px 1fr";
    }

    // 2. Update Header Title
    updateHeaderLabel(loopStartDate, daysToRender);

    // 3. Clear Previous Grid (Keep time labels)
    let headerHTML = '<div class="time-spacer"></div>';
    while (timeGrid.children.length > 1) {
        timeGrid.removeChild(timeGrid.lastChild);
    }

    // 4. Loop to create Columns
    const today = new Date();

    for (let i = 0; i < daysToRender; i++) {
        const currentRenderDay = new Date(loopStartDate);
        currentRenderDay.setDate(loopStartDate.getDate() + i);
        
        const isToday = currentRenderDay.getDate() === today.getDate() && 
                        currentRenderDay.getMonth() === today.getMonth() && 
                        currentRenderDay.getFullYear() === today.getFullYear();

        const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

        // Header HTML
        headerHTML += `
            <div class="day-col-header ${isToday ? 'today' : ''}">
                <div class="day-name">${dayNames[currentRenderDay.getDay()]}</div>
                <div class="day-number">${currentRenderDay.getDate()}</div>
            </div>
        `;

        // Grid Column HTML
        const colDiv = document.createElement('div');
        colDiv.className = 'day-column';
        
        // Add 24 hour cells
        for(let h=0; h<24; h++) {
            const cell = document.createElement('div');
            cell.className = 'hour-cell';
            colDiv.appendChild(cell);
        }

        // Add Red Line if Today
        if (isToday) {
            const line = document.createElement('div');
            line.className = 'current-time-line';
            line.id = 'currentTimeLine';
            colDiv.appendChild(line);
        }

        timeGrid.appendChild(colDiv);
    }
    weekHeader.innerHTML = headerHTML;
    
    updateCurrentTimeLine();
}

// --- Helper: Label Update ---
function updateHeaderLabel(startDate, daysRendered) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    if (viewMode === 'day') {
        // Day View: "December 18, 2025"
        labelDisplay.textContent = `${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
        // Week View: "December 2025" or "Dec - Jan 2026"
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        if (startDate.getMonth() !== endDate.getMonth()) {
            labelDisplay.textContent = `${monthNames[startDate.getMonth()]} - ${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;
        } else {
            labelDisplay.textContent = `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
        }
    }
    
    // Update Mini Calendar Title
    miniCalTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

// --- Logic: Render Time Labels (Static) ---
function renderTimeLabels() {
    let html = '';
    for(let i=0; i<24; i++) {
        html += `<div class="time-slot-label" style="top: ${i * 60}px">${i.toString().padStart(2, '0')}:00</div>`;
    }
    timeLabels.innerHTML = html;
    timeLabels.style.height = `${24 * 60}px`;
}

// --- Logic: Mini Calendar ---
function renderMiniCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let html = '';
    const daysShort = ['S','M','T','W','T','F','S'];
    daysShort.forEach(d => html += `<div class="mini-day-name">${d}</div>`);

    for (let i = 0; i < firstDayOfMonth; i++) {
        html += `<div class="mini-day text-muted">${prevMonthDays - firstDayOfMonth + 1 + i}</div>`;
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        // Highlight the selected day if in Day View, otherwise just highlight today
        let extraClass = '';
        if (viewMode === 'day' && i === currentDate.getDate()) {
            extraClass = 'active'; 
        } else if (isToday) {
            extraClass = 'active'; // Or distinct color for today
        }
        
        html += `<div class="mini-day ${extraClass}">${i}</div>`;
    }
    miniCalGrid.innerHTML = html;
}

// --- Helpers ---
function scrollToStart() {
    const container = document.getElementById('scrollContainer');
    container.scrollTop = scrollStartHour * 60;
}

function updateCurrentTimeLine() {
    const line = document.getElementById('currentTimeLine');
    if (line) {
        const now = new Date();
        const topPos = (now.getHours() * 60) + now.getMinutes();
        line.style.top = `${topPos}px`;
    }
}

// Run
init();