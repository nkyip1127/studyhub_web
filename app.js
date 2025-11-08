// Global state
// Load study points from localStorage if available, otherwise use default
let savedStudyPoints = localStorage.getItem('userStudyPoints');
let initialStudyPoints = savedStudyPoints ? parseInt(savedStudyPoints) : 100;

let currentUser = {
    username: 'John Doe',
    userId: '1234-1234-1234',
    studyPoints: initialStudyPoints,
    totalStudyTime: '128h 20m',
    thisWeekTime: '31h 50m',
    studyStreak: 7
};

// Study room time (adjustable in app.js for demonstration)
let currentStudyRoomTime = 50; // in minutes, default 0

let studyRooms = [];
let resources = [];
let friends = [];
let currentPage = 1;
let itemsPerPage = 10;
let filteredStudyRooms = [];
let isSearchingRooms = false;

// Initialize mock data
function initMockData() {
    // Study Rooms (at least 15 examples)
    studyRooms = [
        { id: '123456', name: 'EE4213 Study Group', topic: 'Human Computer Interaction', participants: 15, maxParticipants: 20, isPublic: true, createdTime: '10h 03m', password: null },
        { id: '234567', name: 'MA1200 Calculus', topic: 'Linear Algebra', participants: 8, maxParticipants: 15, isPublic: true, createdTime: '5h 20m', password: null },
        { id: '345678', name: 'CS101 Programming', topic: 'Python Basics', participants: 20, maxParticipants: 20, isPublic: true, createdTime: '15h 45m', password: null },
        { id: '456789', name: 'Physics Study Room', topic: 'Quantum Mechanics', participants: 12, maxParticipants: 18, isPublic: true, createdTime: '8h 30m', password: null },
        { id: '567890', name: 'Chemistry Lab Prep', topic: 'Organic Chemistry', participants: 6, maxParticipants: 10, isPublic: false, createdTime: '3h 15m', password: '111111' },
        { id: '678901', name: 'Biology Review', topic: 'Cell Biology', participants: 10, maxParticipants: 15, isPublic: true, createdTime: '6h 50m', password: null },
        { id: '789012', name: 'Statistics Study', topic: 'Probability Theory', participants: 14, maxParticipants: 20, isPublic: true, createdTime: '12h 25m', password: null },
        { id: '890123', name: 'Economics Discussion', topic: 'Microeconomics', participants: 9, maxParticipants: 12, isPublic: true, createdTime: '4h 40m', password: null },
        { id: '901234', name: 'History Study Group', topic: 'World History', participants: 7, maxParticipants: 10, isPublic: false, createdTime: '2h 10m', password: '222222' },
        { id: '012345', name: 'Literature Analysis', topic: 'Shakespeare', participants: 5, maxParticipants: 8, isPublic: true, createdTime: '1h 55m', password: null },
        { id: '112233', name: 'Engineering Design', topic: 'CAD Modeling', participants: 11, maxParticipants: 15, isPublic: true, createdTime: '7h 20m', password: null },
        { id: '223344', name: 'Mathematics Advanced', topic: 'Differential Equations', participants: 13, maxParticipants: 20, isPublic: true, createdTime: '9h 45m', password: null },
        { id: '334455', name: 'Computer Networks', topic: 'TCP/IP Protocol', participants: 16, maxParticipants: 20, isPublic: true, createdTime: '11h 30m', password: null },
        { id: '445566', name: 'Database Systems', topic: 'SQL Queries', participants: 8, maxParticipants: 12, isPublic: false, createdTime: '5h 15m', password: '333333' },
        { id: '556677', name: 'Machine Learning', topic: 'Neural Networks', participants: 19, maxParticipants: 20, isPublic: true, createdTime: '14h 20m', password: null },
        { id: '667788', name: 'Web Development', topic: 'React Framework', participants: 12, maxParticipants: 18, isPublic: true, createdTime: '6h 40m', password: null },
        { id: '778899', name: 'Operating Systems', topic: 'Process Scheduling', participants: 10, maxParticipants: 15, isPublic: true, createdTime: '8h 10m', password: null }
    ];

    // Resources (at least 15 examples)
    resources = [
        { id: 1, university: 'City University of Hong Kong', courseCode: 'EE4213', type: 'Past Papers', fileName: 'EE4213_Final_2023.pdf', description: 'Final exam paper from 2023 semester', solutionAvailable: true, uploadedBy: 'user1' },
        { id: 2, university: 'City University of Hong Kong', courseCode: 'EE4213', type: 'Lecture Notes', fileName: 'Lecture_1_Introduction.pdf', description: 'Introduction to Digital Signal Processing', solutionAvailable: false, uploadedBy: 'user2' },
        { id: 3, university: 'The University of Hong Kong', courseCode: 'EE4213', type: 'Homework', fileName: 'HW1_Solution.pdf', description: 'Solution to Homework 1', solutionAvailable: true, uploadedBy: 'user3' },
        { id: 4, university: 'City University of Hong Kong', courseCode: 'MA1200', type: 'Lab Report', fileName: 'Lab_Report_3.pdf', description: 'Lab report on linear transformations', solutionAvailable: true, uploadedBy: 'user4' },
        { id: 5, university: 'The Hong Kong University of Science and Technology', courseCode: 'EE4213', type: 'Past Papers', fileName: 'Midterm_2024.pdf', description: 'Midterm exam from Spring 2024', solutionAvailable: false, uploadedBy: 'user5' },
        { id: 6, university: 'City University of Hong Kong', courseCode: 'EE4213', type: 'Lecture Notes', fileName: 'Lecture_5_Filters.pdf', description: 'Notes on digital filters', solutionAvailable: false, uploadedBy: 'user6' },
        { id: 7, university: 'The University of Hong Kong', courseCode: 'MA1200', type: 'Homework', fileName: 'Assignment_2.pdf', description: 'Assignment 2 questions and solutions', solutionAvailable: true, uploadedBy: 'user7' },
        { id: 8, university: 'The Hong Kong Polytechnic University', courseCode: 'EE4213', type: 'Past Papers', fileName: 'Final_2022_Solution.pdf', description: 'Final exam with complete solutions', solutionAvailable: true, uploadedBy: 'user8' },
        { id: 9, university: 'City University of Hong Kong', courseCode: 'CS101', type: 'Lab Report', fileName: 'Python_Project_Report.pdf', description: 'Python programming project report', solutionAvailable: false, uploadedBy: 'user9' },
        { id: 10, university: 'The Chinese University of Hong Kong', courseCode: 'EE4213', type: 'Lecture Notes', fileName: 'DSP_Complete_Notes.pdf', description: 'Complete lecture notes for the semester', solutionAvailable: false, uploadedBy: 'user10' },
        { id: 11, university: 'City University of Hong Kong', courseCode: 'EE4213', type: 'Homework', fileName: 'HW3_Problems.pdf', description: 'Homework 3 problem set', solutionAvailable: false, uploadedBy: 'user11' },
        { id: 12, university: 'The University of Hong Kong', courseCode: 'MA1200', type: 'Past Papers', fileName: 'Practice_Exam_1.pdf', description: 'Practice exam with solutions', solutionAvailable: true, uploadedBy: 'user12' },
        { id: 13, university: 'Hong Kong Baptist University', courseCode: 'EE4213', type: 'Lab Report', fileName: 'Filter_Design_Lab.pdf', description: 'Lab report on filter design', solutionAvailable: true, uploadedBy: 'user13' },
        { id: 14, university: 'City University of Hong Kong', courseCode: 'EE4213', type: 'Others', fileName: 'Study_Guide.pdf', description: 'Comprehensive study guide', solutionAvailable: false, uploadedBy: 'user14' },
        { id: 15, university: 'The Hong Kong University of Science and Technology', courseCode: 'MA1200', type: 'Lecture Notes', fileName: 'Linear_Algebra_Notes.pdf', description: 'Complete linear algebra notes', solutionAvailable: false, uploadedBy: 'user15' },
        { id: 16, university: 'City University of Hong Kong', courseCode: 'EE4213', type: 'Past Papers', fileName: 'Quiz_1_2024.pdf', description: 'Quiz 1 from 2024', solutionAvailable: true, uploadedBy: 'user16' },
        { id: 17, university: 'The University of Hong Kong', courseCode: 'EE4213', type: 'Homework', fileName: 'HW2_Solutions.pdf', description: 'Complete solutions to Homework 2', solutionAvailable: true, uploadedBy: 'user17' },
        { id: 18, university: 'Lingnan University', courseCode: 'MA1200', type: 'Lab Report', fileName: 'Matrix_Operations_Lab.pdf', description: 'Lab on matrix operations', solutionAvailable: false, uploadedBy: 'user18' }
    ];

    // Friends (default 10 friends)
    friends = [
        { userId: '1111-1111-1111-1111', username: 'Alice Chen', status: 'online', studyTime: '95h 30m' },
        { userId: '2222-2222-2222-2222', username: 'Bob Zhang', status: 'offline', studyTime: '120h 15m' },
        { userId: '3333-3333-3333-3333', username: 'Charlie Wong', status: 'online', studyTime: '88h 45m' },
        { userId: '4444-4444-4444-4444', username: 'Diana Lee', status: 'offline', studyTime: '105h 20m' },
        { userId: '5555-5555-5555-5555', username: 'Eric Liu', status: 'online', studyTime: '112h 10m' },
        { userId: '6666-6666-6666-6666', username: 'Fiona Tan', status: 'offline', studyTime: '98h 55m' },
        { userId: '7777-7777-7777-7777', username: 'George Wang', status: 'online', studyTime: '135h 40m' },
        { userId: '8888-8888-8888-8888', username: 'Helen Ng', status: 'offline', studyTime: '87h 25m' },
        { userId: '9999-9999-9999-9999', username: 'Ivan Chan', status: 'online', studyTime: '110h 50m' },
        { userId: '0000-0000-0000-0000', username: 'Julia Ho', status: 'offline', studyTime: '102h 35m' }
    ];
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    initMockData();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = 'home.html';
        });
    }

    // Update user info on home page
    updateUserInfo();
    
    // Load study rooms
    if (document.getElementById('studyRoomsContainer')) {
        displayStudyRooms();
    }
    
    // Load resources
    if (document.getElementById('resourcesContainer')) {
        displayResources();
    }
    
    // Load friends
    if (document.getElementById('friendsContainer')) {
        displayFriends();
    }
    
    // Load leaderboard
    if (document.getElementById('globalLeaderboard') || document.getElementById('friendsLeaderboard')) {
        displayLeaderboard();
    }
});

// Generate user icon abbreviation
function getUserIconAbbreviation(username) {
    const parts = username.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
}

// Update user information
function updateUserInfo() {
    const userIdEl = document.getElementById('userId');
    const studyPointsEl = document.getElementById('studyPoints');
    const totalStudyTimeEl = document.getElementById('totalStudyTime');
    const thisWeekTimeEl = document.getElementById('thisWeekTime');
    const studyStreakEl = document.getElementById('studyStreak');
    const userIconEl = document.getElementById('userIcon');
    const userNameEl = document.getElementById('userName');
    const welcomeMessageEl = document.getElementById('welcomeMessage');
    
    // Load saved username from localStorage
    const savedUsername = localStorage.getItem('currentUsername');
    if (savedUsername) {
        currentUser.username = savedUsername;
    }
    
    // Load saved study points from localStorage
    const savedStudyPoints = localStorage.getItem('userStudyPoints');
    if (savedStudyPoints) {
        currentUser.studyPoints = parseInt(savedStudyPoints);
    }
    
    if (userIdEl) userIdEl.textContent = currentUser.userId;
    if (studyPointsEl) studyPointsEl.textContent = currentUser.studyPoints.toLocaleString();
    if (totalStudyTimeEl) totalStudyTimeEl.textContent = currentUser.totalStudyTime;
    if (thisWeekTimeEl) thisWeekTimeEl.textContent = currentUser.thisWeekTime;
    if (studyStreakEl) studyStreakEl.textContent = currentUser.studyStreak + ' days';
    if (userNameEl) userNameEl.textContent = currentUser.username;
    if (welcomeMessageEl) welcomeMessageEl.textContent = `Welcome to StudyHub! ${currentUser.username}`;

    // <-- new: populate settings username input so saved name shows on settings page
    const settingsUsernameInput = document.getElementById('settingsUsername');
    if (settingsUsernameInput) {
        settingsUsernameInput.value = currentUser.username;
    }
    
    // Load saved profile icon from localStorage, or use abbreviation
    if (userIconEl) {
        const savedIcon = localStorage.getItem('userProfileIcon');
        if (savedIcon) {
            // Use saved image
            if (userIconEl.tagName === 'IMG') {
                userIconEl.src = savedIcon;
            } else {
                // Convert div to img
                const img = document.createElement('img');
                img.src = savedIcon;
                img.className = 'user-icon-img';
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.borderRadius = '50%';
                img.id = 'userIcon';
                userIconEl.parentNode.replaceChild(img, userIconEl);
            }
        } else {
            // Use abbreviation
            if (typeof getUserIconAbbreviation === 'function') {
                const iconAbbr = getUserIconAbbreviation(currentUser.username);
                if (userIconEl.tagName === 'DIV' || userIconEl.tagName === 'SPAN') {
                    userIconEl.textContent = iconAbbr;
                }
            }
        }
    }
    
    // Also update profile icon in settings if page is loaded
    const profileIconEl = document.getElementById('profilePictureIcon');
    const profilePreview = document.getElementById('profilePreview');
    if (profileIconEl && profilePreview) {
        const savedIcon = localStorage.getItem('userProfileIcon');
        if (savedIcon) {
            profileIconEl.style.display = 'none';
            profilePreview.src = savedIcon;
            profilePreview.style.display = 'block';
        }
    }
}

// Copy User ID
function copyUserId() {
    const userId = currentUser.userId;
    navigator.clipboard.writeText(userId).then(() => {
        showNotification('Successfully copied user ID.', 'success');
    });
}

// Copy Room ID
function copyRoomId(roomId) {
    navigator.clipboard.writeText(roomId).then(() => {
        showNotification('Successfully copied room ID.', 'success');
    });
}

// Copy Room Password
function copyRoomPassword(password) {
    navigator.clipboard.writeText(password).then(() => {
        showNotification('Successfully copied room password.', 'success');
    });
}

// Show notification with throttle to prevent too frequent messages
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 5000; // 5 seconds

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        const currentTime = Date.now();
        // Check if enough time has passed since last notification
        if (currentTime - lastNotificationTime < NOTIFICATION_COOLDOWN) {
            // If too soon, queue the notification to show after cooldown
            const timeToWait = NOTIFICATION_COOLDOWN - (currentTime - lastNotificationTime);
            setTimeout(() => {
                showNotification(message, type);
            }, timeToWait);
            return;
        }
        
        lastNotificationTime = currentTime;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Study Room Functions
function displayStudyRooms() {
    const container = document.getElementById('studyRoomsContainer');
    if (!container) return;
    
    const roomsToDisplay = isSearchingRooms ? filteredStudyRooms : studyRooms;
    container.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const roomsToShow = roomsToDisplay.slice(startIndex, endIndex);
    
    roomsToShow.forEach(room => {
        const isFull = room.participants >= room.maxParticipants;
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <span class="room-status ${room.isPublic ? 'public' : 'private'}">
                ${room.isPublic ? 'Public' : 'Private'}
            </span>
            <div class="room-name">${room.name}</div>
            <div class="room-topic">${room.topic || 'No topic'}</div>
            <div class="room-participants">${room.participants}/${room.maxParticipants} participants</div>
            <div class="room-time">Created: ${room.createdTime} ago</div>
            <button class="join-btn" ${isFull ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="${isFull ? '' : `joinStudyRoom('${room.id}')`}">${isFull ? 'Room Full' : 'Join Room'}</button>
        `;
        container.appendChild(roomCard);
    });
    
    displayPagination('studyRoomsPagination', roomsToDisplay.length);
}

function createStudyRoom() {
    const modal = document.getElementById('createRoomModal');
    if (modal) {
        // Always reset max participants to 1 for quick access
        const maxParticipantsSelect = document.getElementById('maxParticipants');
        if (maxParticipantsSelect) {
            maxParticipantsSelect.value = '1';
        }
        modal.style.display = 'block';
    }
}

function closeCreateRoomModal() {
    const modal = document.getElementById('createRoomModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function submitCreateRoom() {
    const roomNameInput = document.getElementById('roomName');
    const topicInput = document.getElementById('roomTopic');
    const privacyCheckbox = document.getElementById('roomPrivacy');
    const maxParticipantsSelect = document.getElementById('maxParticipants');
    
    const roomName = roomNameInput.value.trim() || `${currentUser.username}'s study room`;
    const topic = topicInput.value.trim() || '';
    // Toggle: unchecked (circle on left/Private) = private, checked (circle on right/Public) = public
    const isPublic = privacyCheckbox ? privacyCheckbox.checked : false;
    const maxParticipants = parseInt(maxParticipantsSelect.value) || 1;
    
    // Generate random 6-digit password for private rooms
    const password = isPublic ? null : Math.floor(100000 + Math.random() * 900000).toString();
    
    // For quick access rooms (maxParticipants = 1), set participants to 0
    // so that when user enters, only they show up
    const participants = maxParticipants === 1 ? 0 : 1;
    
    const newRoom = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        name: roomName,
        topic: topic,
        participants: participants,
        maxParticipants: maxParticipants,
        isPublic: isPublic,
        createdTime: '0m',
        password: password
    };
    
    studyRooms.unshift(newRoom);
    closeCreateRoomModal();
    // Reset form to defaults
    roomNameInput.value = '';
    topicInput.value = '';
    if (privacyCheckbox) privacyCheckbox.checked = false; // Default to private
    maxParticipantsSelect.value = '1';
    
    displayStudyRooms();
    // Skip password check when creating room (user is automatically added)
    joinStudyRoom(newRoom.id, true);
}

function joinStudyRoom(roomId, skipPasswordCheck = false) {
    const room = studyRooms.find(r => r.id === roomId);
    if (!room) return;
    
    // Only ask for password if joining an existing private room (not when creating)
    if (!room.isPublic && !skipPasswordCheck) {
        const password = prompt('Please enter the room password:');
        if (password !== room.password) {
            showNotification('Incorrect password.', 'error');
            return;
        }
    }
    
    // Store current room
    sessionStorage.setItem('currentRoom', JSON.stringify(room));
    window.location.href = 'study-room-interface.html';
}

function searchStudyRooms() {
    const searchInput = document.getElementById('roomSearch').value.toLowerCase().trim();
    
    if (searchInput === '') {
        isSearchingRooms = false;
        filteredStudyRooms = [];
        currentPage = 1;
        displayStudyRooms();
        return;
    }
    
    filteredStudyRooms = studyRooms.filter(room => 
        room.id.includes(searchInput) || 
        room.name.toLowerCase().includes(searchInput) ||
        (room.topic && room.topic.toLowerCase().includes(searchInput))
    );
    
    isSearchingRooms = true;
    currentPage = 1;
    displayStudyRooms();
}

// Resource Hub Functions
function displayResources() {
    const container = document.getElementById('resourcesContainer');
    if (!container) return;
    
    const filteredResources = getFilteredResources();
    // Remove duplicates - only show unique university/courseCode combinations
    const uniqueResources = [];
    const seen = new Set();
    filteredResources.forEach(resource => {
        const key = `${resource.university}|${resource.courseCode}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueResources.push(resource);
        }
    });
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const resourcesToShow = uniqueResources.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    resourcesToShow.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        resourceCard.onclick = () => showResourceDetail(resource);
        resourceCard.innerHTML = `
            <div class="resource-university">${resource.university}</div>
            <div class="resource-code">${resource.courseCode}</div>
        `;
        container.appendChild(resourceCard);
    });
    
    displayPagination('resourcesPagination', uniqueResources.length);
}

function getFilteredResources() {
    const university = document.getElementById('resourceUniversity')?.value || '';
    const courseCode = document.getElementById('resourceCourseCode')?.value.toLowerCase() || '';
    
    return resources.filter(resource => {
        const matchUniversity = !university || resource.university === university;
        const matchCourseCode = !courseCode || resource.courseCode.toLowerCase() === courseCode;
        return matchUniversity && matchCourseCode;
    });
}

function searchResources() {
    currentPage = 1;
    displayResources();
}

function showResourceDetail(resource) {
    sessionStorage.setItem('selectedResource', JSON.stringify(resource));
    window.location.href = 'resource-detail.html';
}

function uploadResource() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function submitUpload() {
    const university = document.getElementById('uploadUniversity').value;
    const courseCode = document.getElementById('uploadCourseCode').value;
    const description = document.getElementById('uploadDescription').value;
    const solutionAvailable = document.getElementById('uploadSolution').checked;
    const type = document.getElementById('uploadType').value;
    const fileInput = document.getElementById('fileInput');
    
    // Validate required fields
    if (!university) {
        showNotification('Please select a university.', 'error');
        return;
    }
    if (!courseCode) {
        showNotification('Please enter a course code.', 'error');
        return;
    }
    if (!type) {
        showNotification('Please select a resource type.', 'error');
        return;
    }
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotification('Please upload a document.', 'error');
        return;
    }
    
    const fileName = fileInput.files[0].name;
    
    // Calculate points based on type
    let points = 0;
    if (type === 'Past Papers') points = 300;
    else if (type === 'Lab Report' || type === 'Lab Report/Tutorial') points = 150;
    else if (type === 'Lecture Notes') points = 100;
    else if (type === 'Homework' || type === 'Homework/Assignment') points = 200;
    else points = 50;
    
    if (solutionAvailable) points += 100;
    
    currentUser.studyPoints += points;
    // Save to localStorage for persistence
    localStorage.setItem('userStudyPoints', currentUser.studyPoints.toString());
    updateUserInfo();
    updateResourceHubStudyPoints();
    
    const newResource = {
        id: resources.length + 1,
        university: university,
        courseCode: courseCode,
        type: type,
        fileName: fileName,
        description: description || 'No description',
        solutionAvailable: solutionAvailable,
        uploadedBy: currentUser.username
    };
    
    resources.push(newResource);
    closeUploadModal();
    // Reset form
    document.getElementById('uploadUniversity').value = '';
    document.getElementById('uploadCourseCode').value = '';
    document.getElementById('uploadDescription').value = '';
    document.getElementById('uploadSolution').checked = false;
    document.getElementById('uploadType').value = '';
    fileInput.value = '';
    const fileNameDiv = document.getElementById('uploadedFileName');
    if (fileNameDiv) fileNameDiv.textContent = '';
    
    showNotification(`Congratulations! You got ${points} pts.`, 'success');
    displayResources();
}

function showPointRules() {
    const modal = document.getElementById('rulesModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeRulesModal() {
    const modal = document.getElementById('rulesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function downloadResource(resourceId) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    let points = 0;
    if (resource.type === 'Past Papers') points = 300;
    else if (resource.type === 'Lab Report' || resource.type === 'Lab Report/Tutorial') points = 150;
    else if (resource.type === 'Lecture Notes') points = 100;
    else if (resource.type === 'Homework' || resource.type === 'Homework/Assignment') points = 200;
    else points = 50;
    
    if (resource.solutionAvailable) points += 100;
    
    // Show download confirmation modal
    showDownloadModal(resource, points);
}

function showDownloadModal(resource, points) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'downloadModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Download Resource</h2>
                <button class="close-btn" onclick="closeDownloadModal()">&times;</button>
            </div>
            <div style="padding: 20px;">
                <p style="margin-bottom: 10px; font-size: 16px;">Are you sure you want to download this resource?</p>
                <p style="margin-bottom: 15px; font-size: 16px;"><strong>${points} pts will be used to unlock this resource</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <div style="font-weight: 500; margin-bottom: 10px; color: #1565C0;">${resource.fileName}</div>
                    <div style="color: #666; font-size: 14px;">${resource.description}</div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="submit-btn" onclick="confirmDownload(${resource.id}, ${points})" style="background-color: #4caf50;">Yes</button>
                    <button class="submit-btn" onclick="closeDownloadModal()" style="background-color: #666;">No</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
        modal.remove();
    }
}

function confirmDownload(resourceId, points) {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    if (currentUser.studyPoints >= points) {
        currentUser.studyPoints -= points;
        // Save to localStorage for persistence
        localStorage.setItem('userStudyPoints', currentUser.studyPoints.toString());
        updateUserInfo();
        updateResourceHubStudyPoints();
        
        // Create download link
        const link = document.createElement('a');
        link.href = '#';
        link.download = resource.fileName;
        link.click();
        
        closeDownloadModal();
        showNotification('Resource downloaded successfully.', 'success');
    } else {
        showNotification('Insufficient study points.', 'error');
    }
}

function reportResource(resourceId) {
    if (confirm('Are you sure you want to report this resource?')) {
        showNotification('Thanks for your report, the previous used study points for unlock this documentation will be returned once confirmed the reportation', 'success');
    }
}

// Leaderboard Functions
function displayLeaderboard() {
    // Mock leaderboard data
    const globalData = [
        { rank: 1, username: 'TopStudent1', time: '45h 30m' },
        { rank: 2, username: 'StudyMaster2', time: '42h 15m' },
        { rank: 3, username: 'AcademicPro3', time: '40h 20m' },
        { rank: 4, username: 'LearningKing4', time: '38h 45m' },
        { rank: 5, username: 'StudyGuru5', time: '37h 10m' },
        { rank: 6, username: 'KnowledgeSeeker6', time: '35h 25m' },
        { rank: 7, username: 'AcademicElite7', time: '34h 50m' },
        { rank: 8, username: 'StudyChampion8', time: '33h 15m' },
        { rank: 9, username: 'LearningHero9', time: '32h 40m' },
        { rank: 10, username: 'StudyLegend10', time: '31h 5m' }
    ];
    
    // Generate top 100 global leaderboard (40-45 hours range, sorted highest to lowest)
    const globalDataFull = [];
    for (let i = 1; i <= 100; i++) {
        // Generate time between 40h and 45h, decreasing from 45h to 40h
        const hours = Math.max(40, 45 - Math.floor((i - 1) / 20)); // Range from 45h to 40h
        const minutes = Math.floor(Math.random() * 60); // Random minutes 0-59
        globalDataFull.push({
            rank: i,
            username: `Student${i}`,
            time: `${hours}h ${minutes}m`,
            timeInMinutes: hours * 60 + minutes
        });
    }
    
    // Sort by time (highest to lowest) and reassign ranks
    globalDataFull.sort((a, b) => b.timeInMinutes - a.timeInMinutes);
    globalDataFull.forEach((item, index) => {
        item.rank = index + 1;
    });
    
    // Friends leaderboard - include all friends plus current user
    // Use this week time for all friends (mock data - in real app would come from database)
    const friendWeekTimes = ['35h 40m', '32h 50m', '30h 20m', '28h 10m', '26h 55m', '25h 30m', '24h 15m', '23h 45m', '22h 20m', '21h 10m'];
    
    const allFriendsData = friends.map((friend, index) => ({
        rank: index + 1,
        username: friend.username,
        time: friendWeekTimes[index] || '20h 0m', // Use this week time, not total time
        isCurrentUser: false
    }));
    
    // Add current user to friends leaderboard (assume user is in top 3 at rank 3)
    // Use saved username from localStorage if available
    const displayUsername = localStorage.getItem('currentUsername') || currentUser.username;
    allFriendsData.push({
        rank: allFriendsData.length + 1,
        username: displayUsername,
        time: currentUser.thisWeekTime,
        isCurrentUser: true
    });
    
    // Sort by time (descending) and assign ranks
    allFriendsData.sort((a, b) => {
        const timeA = parseTimeToMinutes(a.time);
        const timeB = parseTimeToMinutes(b.time);
        return timeB - timeA;
    });
    
    allFriendsData.forEach((item, index) => {
        item.rank = index + 1;
    });
    
    // Ensure user is in top 3 for demonstration (if not already)
    const userIndex = allFriendsData.findIndex(f => f.isCurrentUser);
    if (userIndex >= 3) {
        // Move user to rank 3
        const user = allFriendsData.splice(userIndex, 1)[0];
        allFriendsData.splice(2, 0, user);
        // Reassign ranks
        allFriendsData.forEach((item, index) => {
            item.rank = index + 1;
        });
    }
    
    // Check if user is in top 3
    const userInTop3 = allFriendsData.findIndex(f => f.isCurrentUser) < 3;
    
    const globalContainer = document.getElementById('globalLeaderboard');
    const friendsContainer = document.getElementById('friendsLeaderboard');
    
    if (globalContainer) {
        globalContainer.innerHTML = globalDataFull.map(item => `
            <div class="leaderboard-item">
                <span class="rank">#${item.rank}</span>
                <span class="leaderboard-username">${item.username}</span>
                <span class="leaderboard-time">${item.time}</span>
            </div>
        `).join('');
    }
    
    if (friendsContainer) {
        friendsContainer.innerHTML = allFriendsData.map(item => {
            const isUserInTop3 = item.isCurrentUser && item.rank <= 3;
            return `
            <div class="leaderboard-item ${isUserInTop3 ? 'highlight-user' : ''} ${item.isCurrentUser ? 'current-user' : ''}">
                <span class="rank">#${item.rank}</span>
                <span class="leaderboard-username">${item.username}${item.isCurrentUser ? ' (You)' : ''}</span>
                <span class="leaderboard-time">${item.time}</span>
            </div>
        `;
        }).join('');
    }
}

function parseTimeToMinutes(timeStr) {
    const match = timeStr.match(/(\d+)h\s*(\d+)m/);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
}

// Friends Functions
function displayFriends() {
    const container = document.getElementById('friendsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    friends.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        const iconAbbr = getUserIconAbbreviation(friend.username);
        friendCard.innerHTML = `
            <div class="friend-icon" style="width: 50px; height: 50px; border-radius: 50%; background-color: #1565C0; color: white; display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 18px;">${iconAbbr}</div>
            <div class="friend-info">
                <div class="friend-name">${friend.username}</div>
                <div class="friend-status ${friend.status}">${friend.status === 'online' ? 'Online' : 'Offline'}</div>
                <div class="friend-time">Total Study Time: ${friend.studyTime}</div>
            </div>
        `;
        container.appendChild(friendCard);
    });
}

function addFriend() {
    const modal = document.getElementById('addFriendModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAddFriendModal() {
    const modal = document.getElementById('addFriendModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function searchFriend() {
    const userId = document.getElementById('friendUserId').value.replace(/-/g, '');
    
    if (userId.length !== 12 || !/^\d+$/.test(userId)) {
        showNotification('Invalid user ID.', 'error');
        return;
    }
    
    // Mock adding friend
    const formattedId = userId.match(/.{1,4}/g).join('-');
    const newFriend = {
        userId: formattedId,
        username: 'New Friend',
        status: 'offline',
        studyTime: '0h 0m'
    };
    
    friends.push(newFriend);
    displayFriends();
    closeAddFriendModal();
    showNotification('Friend added successfully.', 'success');
}

// Pagination
function displayPagination(containerId, totalItems) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    container.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            if (document.getElementById('studyRoomsContainer')) displayStudyRooms();
            if (document.getElementById('resourcesContainer')) displayResources();
        };
        container.appendChild(pageBtn);
    }
}

function changePage(page) {
    currentPage = page;
    if (document.getElementById('studyRoomsContainer')) displayStudyRooms();
    if (document.getElementById('resourcesContainer')) displayResources();
}

// Study Room Alert Notification
let studyRoomTimer = null;
let alertTimer = null;

function startStudyRoomTimer() {
    // Simulate 50 minutes
    studyRoomTimer = setTimeout(() => {
        showStudyRoomAlert();
    }, 10000); // 10 seconds for demo (should be 50 minutes)
}

function showStudyRoomAlert() {
    const alert = document.getElementById('studyRoomAlert');
    if (alert) {
        alert.classList.add('show');
        
        // Auto kick after 2 minutes (20 seconds for demo)
        alertTimer = setTimeout(() => {
            kickFromStudyRoom();
        }, 20000);
    }
}

function confirmStillHere() {
    const alert = document.getElementById('studyRoomAlert');
    if (alert) {
        alert.classList.remove('show');
        clearTimeout(alertTimer);
        showNotification('Keep going!', 'success');
        // Reset timer
        startStudyRoomTimer();
    }
}

function kickFromStudyRoom() {
    const alert = document.getElementById('studyRoomAlert');
    if (alert) {
        alert.classList.remove('show');
    }
    showNotification('You have been automatically removed from the study room.', 'error');
    setTimeout(() => {
        window.location.href = 'study-room.html';
    }, 2000);
}

// Settings
function saveProfile() {
    const username = document.getElementById('settingsUsername').value;
    if (username) {
        currentUser.username = username;
        // Save to localStorage for persistence
        localStorage.setItem('currentUsername', username);
        updateUserInfo();
        // Update leaderboard if on leaderboard page
        if (typeof displayLeaderboard === 'function') {
            displayLeaderboard();
        }
        // Update resource hub study points if on that page
        updateResourceHubStudyPoints();
        // Update username in study room if visible
        const userParticipantName = document.getElementById('userParticipantName');
        if (userParticipantName) {
            userParticipantName.textContent = username;
        }
        showNotification('Profile updated successfully.', 'success');
    }
}

function updateResourceHubStudyPoints() {
    const resourceHubPoints = document.getElementById('resourceHubStudyPoints');
    const resourceDetailPoints = document.getElementById('resourceDetailStudyPoints');
    if (resourceHubPoints) {
        resourceHubPoints.textContent = currentUser.studyPoints.toLocaleString();
    }
    if (resourceDetailPoints) {
        resourceDetailPoints.textContent = currentUser.studyPoints.toLocaleString();
    }
}

function updateProfileIcon(file) {
    if (file && file.files && file.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            
            // Persist immediately so other pages reflect change without clicking Save
            localStorage.setItem('userProfileIcon', imageData);
            
            const iconEl = document.getElementById('profilePictureIcon');
            const preview = document.getElementById('profilePreview');
            
            // Hide icon, show image preview
            if (iconEl) {
                iconEl.style.display = 'none';
            }
            if (preview) {
                preview.src = imageData;
                preview.style.display = 'block';
                preview.classList.add('show');
            }
            
            // Update user icon on home page if it exists
            const userIcon = document.getElementById('userIcon');
            if (userIcon) {
                if (userIcon.tagName === 'IMG') {
                    userIcon.src = imageData;
                } else {
                    // Convert div to img (use image class to avoid blue background)
                    const img = document.createElement('img');
                    img.src = imageData;
                    img.className = 'user-icon-img';
                    img.style.width = '50px';
                    img.style.height = '50px';
                    img.style.borderRadius = '50%';
                    img.id = 'userIcon';
                    userIcon.parentNode.replaceChild(img, userIcon);
                }
            }
            
            // Update icon and name in study room participants if visible
            const participantIcons = document.querySelectorAll('.participant-icon');
            const savedUsername = localStorage.getItem('currentUsername') || currentUser.username;
            participantIcons.forEach(icon => {
                const participantBlock = icon.closest('.participant-block');
                if (participantBlock) {
                    const nameEl = participantBlock.querySelector('.participant-name');
                    if (nameEl && nameEl.textContent === savedUsername) {
                        // Update icon
                        if (icon.tagName === 'IMG') {
                            icon.src = imageData;
                        } else {
                            // Convert div to img
                            const img = document.createElement('img');
                            img.src = imageData;
                            img.style.cssText = icon.style.cssText;
                            // ensure uploaded image uses image avatar class (no blue bg)
                            img.className = ((icon.className || '') + ' user-icon-img').trim();
                            img.id = icon.id || '';
                            icon.parentNode.replaceChild(img, icon);
                        }
                    }
                }
            });
            
            // Update user participant icon specifically
            const userParticipantIcon = document.getElementById('userParticipantIcon');
            if (userParticipantIcon) {
                if (userParticipantIcon.tagName === 'IMG') {
                    userParticipantIcon.src = imageData;
                }
            }
            
            showNotification('Profile icon updated successfully.', 'success');
        };
        reader.readAsDataURL(file.files[0]);
    }
}

// Replace resetProfileIcon with single consolidated immediate-reset implementation
function resetProfileIcon() {
    // Remove saved icon from localStorage immediately
    localStorage.removeItem('userProfileIcon');
    
    // Reset to default abbreviation in settings preview
    const iconEl = document.getElementById('profilePictureIcon');
    const preview = document.getElementById('profilePreview');
    const savedUsername = localStorage.getItem('currentUsername') || currentUser.username;
    
    if (iconEl) {
        iconEl.style.display = 'flex';
        if (typeof getUserIconAbbreviation === 'function') {
            iconEl.textContent = getUserIconAbbreviation(savedUsername);
        } else {
            iconEl.textContent = 'JD';
        }
    }
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
        preview.classList.remove('show');
    }
    
    // Update user icon on home page immediately: replace image with abbreviation div
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        if (userIcon.tagName === 'IMG') {
            const div = document.createElement('div');
            div.id = 'userIcon';
            div.className = 'user-icon'; // keeps blue circle style for abbreviation
            if (typeof getUserIconAbbreviation === 'function') {
                div.textContent = getUserIconAbbreviation(savedUsername);
            } else {
                div.textContent = 'JD';
            }
            userIcon.parentNode.replaceChild(div, userIcon);
        } else {
            if (typeof getUserIconAbbreviation === 'function') {
                userIcon.textContent = getUserIconAbbreviation(savedUsername);
            }
        }
    }
    
    // Update participant icons back to abbreviation where applicable
    const participantIcons = document.querySelectorAll('.participant-icon');
    participantIcons.forEach(icon => {
        const participantBlock = icon.closest('.participant-block');
        if (participantBlock) {
            const nameEl = participantBlock.querySelector('.participant-name');
            if (nameEl && nameEl.textContent === savedUsername) {
                if (icon.tagName === 'IMG') {
                    const div = document.createElement('div');
                    div.className = icon.className.replace('user-icon-img', 'user-icon').trim();
                    div.style.cssText = icon.style.cssText;
                    if (typeof getUserIconAbbreviation === 'function') {
                        div.textContent = getUserIconAbbreviation(savedUsername);
                    } else {
                        div.textContent = 'JD';
                    }
                    icon.parentNode.replaceChild(div, icon);
                } else {
                    icon.style.display = 'flex';
                }
            }
        }
    });
    
    // Specific user participant icon
    const userParticipantIcon = document.getElementById('userParticipantIcon');
    if (userParticipantIcon && userParticipantIcon.tagName === 'IMG') {
        const div = document.createElement('div');
        div.className = userParticipantIcon.className.replace('user-icon-img', 'user-icon').trim();
        div.style.cssText = userParticipantIcon.style.cssText;
        div.id = 'userParticipantIcon';
        if (typeof getUserIconAbbreviation === 'function') {
            div.textContent = getUserIconAbbreviation(savedUsername);
        } else {
            div.textContent = 'JD';
        }
        userParticipantIcon.parentNode.replaceChild(div, userParticipantIcon);
    }
    
    showNotification('Profile icon reset to default.', 'success');
}

function saveEmail() {
    showNotification('Email updated successfully.', 'success');
}

function savePassword() {
    showNotification('Password updated successfully.', 'success');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

