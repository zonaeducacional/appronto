// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin panel
    initAdminPanel();
});

// Main initialization function
function initAdminPanel() {
    // Check if user is logged in
    checkAuth();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
    
    // Load data
    loadDashboardData();
}

// Authentication functions
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    
    if (isLoggedIn === 'true') {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'flex';
    } else {
        loginScreen.style.display = 'flex';
        adminPanel.style.display = 'none';
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Settings forms
    const siteSettingsForm = document.getElementById('siteSettingsForm');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', handleSiteSettings);
    }
    
    const pwaSettingsForm = document.getElementById('pwaSettingsForm');
    if (pwaSettingsForm) {
        pwaSettingsForm.addEventListener('submit', handlePWASettings);
    }
    
    const securitySettingsForm = document.getElementById('securitySettingsForm');
    if (securitySettingsForm) {
        securitySettingsForm.addEventListener('submit', handleSecuritySettings);
    }
    
    // Export and backup buttons
    const exportBtn = document.getElementById('exportContactsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportContacts);
    }
    
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', createBackup);
    }
    
    const restoreBtn = document.getElementById('restoreBtn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', restoreBackup);
    }
    
    // Date range filter
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', updateAnalytics);
    }
    
    // Contact table buttons
    setupContactTableButtons();
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        
        showToast('Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'flex';
        }, 1000);
    } else {
        showToast('Usuário ou senha incorretos!', 'error');
    }
}

// Logout handler
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    
    showToast('Logout realizado com sucesso!', 'success');
    
    setTimeout(() => {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }, 1000);
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    
    const page = e.currentTarget.getAttribute('data-page');
    const pages = document.querySelectorAll('.page');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
    
    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(page + 'Page');
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update sidebar active state
    sidebarLinks.forEach(link => link.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'contacts': 'Contatos',
            'analytics': 'Análises',
            'settings': 'Configurações'
        };
        pageTitle.textContent = titles[page] || 'Dashboard';
    }
    
    // Load page-specific data
    if (page === 'analytics') {
        loadAnalyticsData();
    } else if (page === 'contacts') {
        loadContactsData();
    }
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Initialize charts
function initializeCharts() {
    // Visitors Chart
    const visitorsCtx = document.getElementById('visitorsChart');
    if (visitorsCtx) {
        new Chart(visitorsCtx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Visitantes',
                    data: [120, 190, 300, 500, 200, 300, 450],
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Contacts Chart
    const contactsCtx = document.getElementById('contactsChart');
    if (contactsCtx) {
        new Chart(contactsCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Contatos',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: '#10B981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate real-time data updates
    updateStats();
    
    // Update every 30 seconds
    setInterval(updateStats, 30000);
}

function updateStats() {
    // Simulate random updates
    const visitors = document.getElementById('visitorsCount');
    const contacts = document.getElementById('contactsCount');
    const projects = document.getElementById('projectsCount');
    const conversion = document.getElementById('conversionRate');
    
    if (visitors) {
        const currentVisitors = parseInt(visitors.textContent.replace(',', ''));
        const newVisitors = currentVisitors + Math.floor(Math.random() * 10);
        visitors.textContent = newVisitors.toLocaleString();
    }
    
    if (contacts) {
        const currentContacts = parseInt(contacts.textContent);
        const newContacts = currentContacts + Math.floor(Math.random() * 3);
        contacts.textContent = newContacts;
    }
    
    if (conversion) {
        const currentConversion = parseFloat(conversion.textContent);
        const newConversion = (currentConversion + (Math.random() * 0.2 - 0.1)).toFixed(1);
        conversion.textContent = newConversion + '%';
    }
}

// Load analytics data
function loadAnalyticsData() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [{
                    label: 'Tráfego',
                    data: [30, 20, 45, 80, 65, 90, 40],
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Source Chart
    const sourceCtx = document.getElementById('sourceChart');
    if (sourceCtx) {
        new Chart(sourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Orgânico', 'Direto', 'Social', 'Email', 'Outros'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#4F46E5',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#8B5CF6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Device Chart
    const deviceCtx = document.getElementById('deviceChart');
    if (deviceCtx) {
        new Chart(deviceCtx, {
            type: 'pie',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [60, 35, 5],
                    backgroundColor: [
                        '#4F46E5',
                        '#10B981',
                        '#F59E0B'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Load contacts data
function loadContactsData() {
    // In a real application, this would fetch data from a server
    // For demo purposes, we'll use the static data in the HTML
    console.log('Contacts data loaded');
}

// Settings handlers
function handleSiteSettings(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('siteTitle').value,
        description: document.getElementById('siteDescription').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value
    };
    
    // Save to localStorage (in real app, this would be saved to server)
    localStorage.setItem('siteSettings', JSON.stringify(formData));
    
    showToast('Configurações do site salvas com sucesso!', 'success');
}

function handlePWASettings(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('pwaName').value,
        shortName: document.getElementById('pwaShortName').value,
        themeColor: document.getElementById('themeColor').value
    };
    
    // Save to localStorage
    localStorage.setItem('pwaSettings', JSON.stringify(formData));
    
    showToast('Configurações do PWA salvas com sucesso!', 'success');
}

function handleSecuritySettings(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('As senhas não coincidem!', 'error');
        return;
    }
    
    // In a real app, this would be validated server-side
    if (currentPassword === 'admin123') {
        showToast('Senha alterada com sucesso!', 'success');
        e.target.reset();
    } else {
        showToast('Senha atual incorreta!', 'error');
    }
}

// Export contacts
function exportContacts() {
    // Simulate export functionality
    const contacts = [
        ['Nome', 'Email', 'Telefone', 'Data', 'Status'],
        ['João Silva', 'joao@email.com', '(11) 9999-9999', '2023-12-01', 'Pendente'],
        ['Maria Santos', 'maria@email.com', '(11) 8888-8888', '2023-12-01', 'Contactado'],
        ['Pedro Oliveira', 'pedro@email.com', '(11) 7777-7777', '2023-11-30', 'Convertido']
    ];
    
    let csvContent = contacts.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contatos.csv';
    a.click();
    
    showToast('Contatos exportados com sucesso!', 'success');
}

// Backup functionality
function createBackup() {
    const backupData = {
        siteSettings: localStorage.getItem('siteSettings'),
        pwaSettings: localStorage.getItem('pwaSettings'),
        contacts: [
            { name: 'João Silva', email: 'joao@email.com', phone: '(11) 9999-9999', date: '2023-12-01', status: 'Pendente' },
            { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 8888-8888', date: '2023-12-01', status: 'Contactado' },
            { name: 'Pedro Oliveira', email: 'pedro@email.com', phone: '(11) 7777-7777', date: '2023-11-30', status: 'Convertido' }
        ],
        backupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    
    showToast('Backup criado com sucesso!', 'success');
}

function restoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const backupData = JSON.parse(event.target.result);
                
                // Restore settings
                if (backupData.siteSettings) {
                    localStorage.setItem('siteSettings', backupData.siteSettings);
                }
                
                if (backupData.pwaSettings) {
                    localStorage.setItem('pwaSettings', backupData.pwaSettings);
                }
                
                showToast('Backup restaurado com sucesso!', 'success');
                
                // Reload page to apply changes
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } catch (error) {
                showToast('Erro ao restaurar backup!', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Update analytics based on date range
function updateAnalytics() {
    const dateRange = document.getElementById('dateRange').value;
    console.log('Updating analytics for range:', dateRange);
    
    // In a real app, this would fetch new data based on the date range
    showToast('Análises atualizadas!', 'success');
}

// Setup contact table buttons
function setupContactTableButtons() {
    // View buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            showToast(`Visualizando contato: ${name}`, 'success');
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.cells[0].textContent;
            showToast(`Editando contato: ${name}`, 'success');
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir este contato?')) {
                const row = this.closest('tr');
                const name = row.cells[0].textContent;
                row.remove();
                showToast(`Contato ${name} excluído com sucesso!`, 'success');
            }
        });
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function generateRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize service worker for admin panel
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Admin ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('Admin ServiceWorker registration failed:', error);
            });
    });
}

// Handle offline/online status
window.addEventListener('online', () => {
    showToast('Conexão restaurada!', 'success');
});

window.addEventListener('offline', () => {
    showToast('Você está offline!', 'warning');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input if exists
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close sidebar on mobile
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }
});

// Auto-save functionality for forms
function setupAutoSave() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Save form data to localStorage
                const formData = new FormData(form);
                const formKey = form.id || 'form';
                localStorage.setItem(formKey + '_data', JSON.stringify(Object.fromEntries(formData)));
            });
        });
        
        // Load saved data on page load
        const savedData = localStorage.getItem((form.id || 'form') + '_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    });
}

// Initialize auto-save
setupAutoSave();
