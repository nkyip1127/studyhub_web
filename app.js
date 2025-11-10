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
let currentStudyRoomTime = 0; // in minutes, default 0

let studyRooms = [];
let resources = [];
let friends = [];
let currentPage = 1;
let itemsPerPage = 10;
let filteredStudyRooms = [];
let isSearchingRooms = false;

let friendRequests = [];
const savedRequests = localStorage.getItem('friendRequests');
if (savedRequests) {
  try {
    friendRequests = JSON.parse(savedRequests);
  } catch (e) {
    // fallback to default if corrupted
    friendRequests = [
      { userId: '5555-5555-6666', username: 'Kevin Lam', status: 'waiting', studyTime: '45h 5m' },
      { userId: '8888-2222-1444', username: 'Maggie Ho', status: 'waiting', studyTime: '25h 5m' }
    ];
  }
} else {
  friendRequests = [
    { userId: '5555-5555-6666-3333', username: 'Kevin Lam', status: 'waiting', studyTime: '5h 8m' },
    { userId: '8888-2222-1444-9999', username: 'Maggie Ho', status: 'waiting', studyTime: '67h 25m' }
  ];
  localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
}

// Initialize mock data
function initMockData() {
    // Load uploaded resources from localStorage
    const savedResources = localStorage.getItem('uploadedResources');
    let uploadedResources = [];
    if (savedResources) {
        try {
            uploadedResources = JSON.parse(savedResources);
        } catch (e) {
            console.error('Error loading uploaded resources:', e);
        }
    }
    
    // Study Rooms (at least 15 examples)
    studyRooms = [
        { id: '123456', name: 'EE4213 Study Group', topic: 'Human Computer Interacton', participants: 15, maxParticipants: 20, isPublic: true, createdTime: '10h 03m', password: null },
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
    
    // Merge uploaded resources with mock data
    // Find the highest ID from mock data to ensure unique IDs
    const maxMockId = resources.length > 0 ? Math.max(...resources.map(r => r.id || 0)) : 0;
    // Update IDs of uploaded resources to be unique (if they don't have IDs or have duplicate IDs)
    let nextId = maxMockId + 1;
    uploadedResources.forEach((resource) => {
        if (!resource.id || resource.id <= maxMockId) {
            resource.id = nextId++;
        } else {
            // Keep existing ID if it's unique
            nextId = Math.max(nextId, resource.id + 1);
        }
    });
    // Combine mock data with uploaded resources
    resources = [...resources, ...uploadedResources];

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

     var requestsBtn = document.getElementById('friendRequestsBtn');
    if (requestsBtn) {
        requestsBtn.onclick = renderFriendRequestsModal;
    }

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
                img.className = 'user-icon';
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
        // Support multi-line messages by converting \n to <br>
        notification.innerHTML = message.replace(/\n/g, '<br>');
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
        // Clear selected files when opening modal
        if (typeof window.selectedFiles !== 'undefined') {
            window.selectedFiles = [];
        }
        const filesListDiv = document.getElementById('uploadedFilesList');
        if (filesListDiv) filesListDiv.innerHTML = '';
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Clear selected files when modal is closed
    if (typeof selectedFiles !== 'undefined' && window.selectedFiles) {
        window.selectedFiles = [];
        const filesListDiv = document.getElementById('uploadedFilesList');
        if (filesListDiv) filesListDiv.innerHTML = '';
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
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
        showNotification('Please upload at least one document.', 'error');
        return;
    }
    
    // Calculate points based on type (once per upload, not per file)
    let points = 0;
    if (type === 'Past Papers') points = 300;
    else if (type === 'Lab Report' || type === 'Lab Report/Tutorial') points = 150;
    else if (type === 'Lecture Notes') points = 100;
    else if (type === 'Homework' || type === 'Homework/Assignment') points = 200;
    else points = 50;
    
    if (solutionAvailable) points += 100;
    
    const totalFiles = fileInput.files.length;
    
    // Award points only once per upload, regardless of number of files
    currentUser.studyPoints += points;
    // Save to localStorage for persistence
    localStorage.setItem('userStudyPoints', currentUser.studyPoints.toString());
    updateUserInfo();
    updateResourceHubStudyPoints();
    
    // Calculate next available ID
    let maxId = resources.length > 0 ? Math.max(...resources.map(r => r.id || 0)) : 0;
    
    // Create a resource for each uploaded file
    const newResources = [];
    const savedResources = localStorage.getItem('uploadedResources');
    let uploadedResources = [];
    if (savedResources) {
        try {
            uploadedResources = JSON.parse(savedResources);
        } catch (e) {
            console.error('Error loading uploaded resources:', e);
        }
    }
    
    // Collect all file names for a single resource entry
    const uploadedFileNames = Array.from(fileInput.files).map(file => file.name);
    
    // Create a single resource entry with all file names
    maxId++;
    const newResource = {
        id: maxId,
        university: university,
        courseCode: courseCode,
        type: type,
        fileName: uploadedFileNames.length === 1 ? uploadedFileNames[0] : uploadedFileNames.join(', '), // Single file name or comma-separated list
        fileNames: uploadedFileNames, // Store as array for multi-file resources
        description: description || 'No description',
        solutionAvailable: solutionAvailable,
        uploadedBy: currentUser.username
    };
    
    resources.push(newResource);
    uploadedResources.push(newResource);
    
    // Save uploaded resources to localStorage for persistence
    localStorage.setItem('uploadedResources', JSON.stringify(uploadedResources));
    
    closeUploadModal();
    
    // Reset form
    document.getElementById('uploadUniversity').value = '';
    document.getElementById('uploadCourseCode').value = '';
    document.getElementById('uploadDescription').value = '';
    document.getElementById('uploadSolution').checked = false;
    document.getElementById('uploadType').value = '';
    fileInput.value = '';
    
    // Clear selected files list
    if (typeof window.selectedFiles !== 'undefined') {
        window.selectedFiles = [];
    }
    const filesListDiv = document.getElementById('uploadedFilesList');
    if (filesListDiv) filesListDiv.innerHTML = '';
    
    // Refresh resources display to show all resources including the newly uploaded ones
    currentPage = 1; // Reset to first page
    if (typeof displayResources === 'function') {
        displayResources();
    }
    
    // Create notification message with all file names
    let notificationMessage = `Congratulations! You got ${points} pts. Resource uploaded successfully!\n\nUploaded files:\n${uploadedFileNames.map((name, idx) => `${idx + 1}. ${name}`).join('\n')}\n\nYou can now search for it using University: ${university} and Course Code: ${courseCode}`;
    
    // Show notification with longer timeout for multiple files
    const notification = document.getElementById('notification');
    if (notification) {
        const currentTime = Date.now();
        if (currentTime - lastNotificationTime < NOTIFICATION_COOLDOWN) {
            const timeToWait = NOTIFICATION_COOLDOWN - (currentTime - lastNotificationTime);
            setTimeout(() => {
                showNotification(notificationMessage, 'success');
            }, timeToWait);
            return;
        }
        
        lastNotificationTime = currentTime;
        // Support multi-line messages by converting \n to <br>
        notification.innerHTML = notificationMessage.replace(/\n/g, '<br>');
        notification.className = 'notification success';
        notification.style.display = 'block';
        
        // Longer timeout for multi-file uploads (5 seconds for multiple files, 3 seconds for single)
        setTimeout(() => {
            notification.style.display = 'none';
        }, totalFiles > 1 ? 5000 : 3000);
    }
}

function showPointRules() {
    const modal = document.getElementById('rulesModal');
    if (modal) {
        modal.style.display = 'block';
        // Re-initialize lucide icons when modal is shown
        if (typeof lucide !== 'undefined') {
            setTimeout(() => {
                lucide.createIcons();
            }, 50);
        }
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
                    <div style="font-weight: 500; margin-bottom: 10px; color: #1565C0;">
                        ${resource.fileNames && Array.isArray(resource.fileNames) && resource.fileNames.length > 1 
                            ? resource.fileNames.map((name) => `• ${name}`).join('<br>')
                            : resource.fileName}
                    </div>
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
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'reportModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Report Resource</h2>
                <button class="close-btn" onclick="closeReportModal()">&times;</button>
            </div>
            <div style="padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 500;">Please select the reason for reporting this resource:</label>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="reportReason" value="no-solution" style="margin-right: 10px;">
                            <span>1. Doesn't have solution</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="reportReason" value="wrong-course" style="margin-right: 10px;">
                            <span>2. Not belongs to the course</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="reportReason" value="repeated" style="margin-right: 10px;">
                            <span>3. Repeated</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="reportReason" value="other" style="margin-right: 10px;">
                            <span>4. Other reasons:</span>
                        </label>
                        <input type="text" id="otherReason" placeholder="Please specify other reasons" style="margin-left: 30px; padding: 8px; border: 1px solid #ddd; border-radius: 5px; width: calc(100% - 30px);" disabled>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="submit-btn" onclick="submitReport(${resourceId})" style="background-color: #4caf50;">Confirm</button>
                    <button class="submit-btn" onclick="closeReportModal()" style="background-color: #666;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Enable/disable other reason input based on radio selection
    const radioButtons = modal.querySelectorAll('input[name="reportReason"]');
    const otherInput = modal.querySelector('#otherReason');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                otherInput.disabled = false;
                otherInput.focus();
            } else {
                otherInput.disabled = true;
                otherInput.value = '';
            }
        });
    });
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

function submitReport(resourceId) {
    const selectedReason = document.querySelector('input[name="reportReason"]:checked');
    if (!selectedReason) {
        showNotification('Please select a reason for reporting.', 'error');
        return;
    }
    
    let reasonText = '';
    if (selectedReason.value === 'no-solution') {
        reasonText = "Doesn't have solution";
    } else if (selectedReason.value === 'wrong-course') {
        reasonText = "Not belongs to the course";
    } else if (selectedReason.value === 'repeated') {
        reasonText = 'Repeated';
    } else if (selectedReason.value === 'other') {
        const otherInput = document.getElementById('otherReason');
        reasonText = otherInput.value || 'Other reasons';
    }
    
    closeReportModal();
    showNotification('Thanks for your report, the previous used study points for unlock this documentation will be returned once confirmed the reportation', 'success');
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
<button class="remove-btn" style="background-color:#f44336;color:white;border-radius:5px;padding:7px 15px" onclick="removeFriend('${friend.userId}')">Remove</button>
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
        showNotification('Invalid user ID. Please enter 12 digits.', 'error');
        return;
    }
    
    // Valid user: 123456789123, Chris Wong
    const validUserId = '123456789123';
    
    if (userId === validUserId) {
        // Show popup with user info
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'friendSearchModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Search Result</h2>
                    <button class="close-btn" onclick="closeFriendSearchModal()">&times;</button>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #1565C0; color: white; display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 24px; margin: 0 auto 20px;">CW</div>
                    <div style="font-size: 18px; font-weight: 500; margin-bottom: 10px;">Chris Wong</div>
                    <div style="color: #666; margin-bottom: 20px;">User ID: 1234-5678-9123</div>
                    <div style="margin-bottom: 20px;">Do you want to add this person as a friend?</div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="submit-btn" onclick="confirmAddFriend('123456789123', 'Chris Wong')" style="background-color: #4caf50;">Yes</button>
                        <button class="submit-btn" onclick="closeFriendSearchModal()" style="background-color: #666;">No</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    } else {
        // Show "no results found" popup
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'friendSearchModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Search Result</h2>
                    <button class="close-btn" onclick="closeFriendSearchModal()">&times;</button>
                </div>
                <div style="padding: 40px; text-align: center;">
                    <div style="font-size: 18px; color: #666; margin-bottom: 20px;">No results found</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
}

function closeFriendSearchModal() {
    const modal = document.getElementById('friendSearchModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

function confirmAddFriend(userId, username) {
    const formattedId = userId.match(/.{1,4}/g).join('-');
    const newFriend = {
        userId: formattedId,
        username: username,
        status: 'offline',
        studyTime: '0h 0m'
    };
    
    // Check if friend already exists
    const exists = friends.some(f => f.userId === formattedId);
    if (exists) {
        showNotification('This friend is already in your list.', 'error');
    } else {
        friends.push(newFriend);
        displayFriends();
        showNotification('Friend added successfully.', 'success');
    }
    
    closeFriendSearchModal();
    closeAddFriendModal();
}

function acceptFriendRequest(userId) {
  friendRequests = friendRequests.filter(f => f.userId !== userId);
  updateRequestCount();
  closeFriendRequestsModal();
  showNotification('Friend accepted!', 'success');
}

function declineFriendRequest(userId) {
  friendRequests = friendRequests.filter(f => f.userId !== userId);
   updateRequestCount();
  closeFriendRequestsModal();
  showNotification('Friend request declined.', 'error');
}

function updateRequestCount() {
  const requestCount = document.getElementById('requestCount');
  if (requestCount) {
    if (friendRequests.length > 0) {
      requestCount.textContent = friendRequests.length;
      requestCount.style.display = 'inline-block';
    } else {
      requestCount.style.display = 'none';
    }
  }
}

function removeFriend(userId) {
  friends = friends.filter(f => f.userId !== userId);
  displayFriends();
  showNotification('Friend removed.', 'success'); // If you use notifications elsewhere
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

// ---------------- Study room alert (configurable, centralized) ----------------
// Change these values anytime to control behavior:
const ALERT_THRESHOLD_SECONDS = 70;        // show alert when >= this many seconds in room
const ALERT_CHECK_INTERVAL_SECONDS = 70;   // how often room page should invoke check (seconds)
const KICK_COUNTDOWN_SECONDS = 10;          // seconds user has to confirm before auto-kick

// expose to pages
window.ALERT_THRESHOLD_SECONDS = ALERT_THRESHOLD_SECONDS;
window.ALERT_CHECK_INTERVAL_SECONDS = ALERT_CHECK_INTERVAL_SECONDS;
window.KICK_COUNTDOWN_SECONDS = KICK_COUNTDOWN_SECONDS;

/**
 * Always-format duration as "Hh Mm Ss" (hours and minutes shown even if zero).
 * Examples:
 *  - 29s => "0h 0m 29s"
 *  - 30m10s => "0h 30m 10s"
 *  - 1h50m2s => "1h 50m 02s"
 */
function formatStudyDurationHMS(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${String(seconds).padStart(2, '0')}s`;
}
window.formatStudyDurationHMS = formatStudyDurationHMS;

// internal countdown state
let __sr_alertTimer = null;
let __sr_countdownInterval = null;
let __sr_countdownRemaining = 0;

/**
 * Called by study-room-interface with current room time in seconds.
 * This function ALWAYS shows the alert when totalSeconds >= threshold.
 * The room page should call this at the desired check interval (default 10s).
 */
function checkStudyTimeAlert(totalSeconds) {
    const alert = document.getElementById('studyRoomAlert');
    const overlay = document.getElementById('alertOverlay');
    if (!alert) return;

    const threshold = window.ALERT_THRESHOLD_SECONDS || ALERT_THRESHOLD_SECONDS;
    if (typeof totalSeconds === 'undefined' || totalSeconds < threshold) {
        // hide and clear any running countdowns
        if (alert) alert.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        if (__sr_alertTimer) { clearTimeout(__sr_alertTimer); __sr_alertTimer = null; }
        if (__sr_countdownInterval) { clearInterval(__sr_countdownInterval); __sr_countdownInterval = null; }
        __sr_countdownRemaining = 0;
        return;
    }

    // restart countdown on every invocation so alert reappears each check
    if (__sr_alertTimer) { clearTimeout(__sr_alertTimer); __sr_alertTimer = null; }
    if (__sr_countdownInterval) { clearInterval(__sr_countdownInterval); __sr_countdownInterval = null; }

    alert.style.display = 'block';
    if (overlay) overlay.style.display = 'block';

    const msgEl = alert.querySelector('.alert-message');
    const kickSeconds = window.KICK_COUNTDOWN_SECONDS || KICK_COUNTDOWN_SECONDS;
    __sr_countdownRemaining = kickSeconds;

    // initial message
    if (msgEl) msgEl.textContent = `You have been in this study room for ${formatStudyDurationHMS(totalSeconds)}. Time left to confirm: ${__sr_countdownRemaining}s`;

    __sr_countdownInterval = setInterval(() => {
        __sr_countdownRemaining--;
        if (msgEl) msgEl.textContent = `You have been in this study room for ${formatStudyDurationHMS(totalSeconds)}. Time left to confirm: ${__sr_countdownRemaining}s`;
        if (__sr_countdownRemaining <= 0) {
            clearInterval(__sr_countdownInterval);
            __sr_countdownInterval = null;
            __sr_alertTimer = null;
            kickFromStudyRoom();
        }
    }, 1000);

    // fallback timer
    __sr_alertTimer = setTimeout(() => {
        if (__sr_countdownInterval) { clearInterval(__sr_countdownInterval); __sr_countdownInterval = null; }
        __sr_alertTimer = null;
        kickFromStudyRoom();
    }, kickSeconds * 1000);
}
window.checkStudyTimeAlert = checkStudyTimeAlert;

/**
 * Confirm button handler: dismiss current alert and countdown.
 * Does NOT suppress future alerts — next scheduled check will show it again.
 */
function confirmStillHere() {
    const alert = document.getElementById('studyRoomAlert');
    const overlay = document.getElementById('alertOverlay');
    if (alert) alert.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (__sr_alertTimer) { clearTimeout(__sr_alertTimer); __sr_alertTimer = null; }
    if (__sr_countdownInterval) { clearInterval(__sr_countdownInterval); __sr_countdownInterval = null; }
    __sr_countdownRemaining = 0;
    showNotification('Keep going!', 'success');
}
window.confirmStillHere = confirmStillHere;

/**
 * Kick logic: clear countdowns, stop room interval, update UI and redirect.
 */
function kickFromStudyRoom() {
    if (__sr_alertTimer) { clearTimeout(__sr_alertTimer); __sr_alertTimer = null; }
    if (__sr_countdownInterval) { clearInterval(__sr_countdownInterval); __sr_countdownInterval = null; }
    __sr_countdownRemaining = 0;

    if (window.studyRoomTimeInterval) {
        clearInterval(window.studyRoomTimeInterval);
        window.studyRoomTimeInterval = null;
    }

    if (window.currentStudyTimeSeconds !== undefined) {
        try { updateStudyTime(window.currentStudyTimeSeconds); } catch (e) {}
    }

    const alert = document.getElementById('studyRoomAlert');
    const overlay = document.getElementById('alertOverlay');
    if (alert) alert.style.display = 'none';
    if (overlay) overlay.style.display = 'none';

    showNotification('You have been automatically removed from the study room.', 'error');

    setTimeout(() => {
        sessionStorage.removeItem('currentRoom');
        window.location.href = 'study-room.html';
    }, 2000);
}
window.kickFromStudyRoom = kickFromStudyRoom;

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
        // Update the username input field to show the saved value
        const usernameInput = document.getElementById('settingsUsername');
        if (usernameInput) {
            usernameInput.value = username;
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
            
            // Store in localStorage for persistence
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
                    // Convert div to img
                    const img = document.createElement('img');
                    img.src = imageData;
                    img.className = 'user-icon';
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
                            img.className = icon.className;
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

function resetProfileIcon() {
    // Remove saved icon from localStorage
    localStorage.removeItem('userProfileIcon');
    
    // Reset to default abbreviation
    const iconEl = document.getElementById('profilePictureIcon');
    const preview = document.getElementById('profilePreview');
    
    if (iconEl) {
        iconEl.style.display = 'flex';
        iconEl.style.alignItems = 'center';
        iconEl.style.justifyContent = 'center';
        iconEl.style.textAlign = 'center';
        const savedUsername = localStorage.getItem('currentUsername') || currentUser.username;
        if (typeof getUserIconAbbreviation === 'function') {
            iconEl.textContent = getUserIconAbbreviation(savedUsername);
        } else {
            iconEl.textContent = 'JD';
        }
    }
    if (preview) {
        preview.style.display = 'none';
    }
    
    // Update user icon on home page
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        if (userIcon.tagName === 'IMG') {
            // Convert back to div with abbreviation
            const div = document.createElement('div');
            div.id = 'userIcon';
            div.className = 'user-icon';
            const savedUsername = localStorage.getItem('currentUsername') || currentUser.username;
            if (typeof getUserIconAbbreviation === 'function') {
                div.textContent = getUserIconAbbreviation(savedUsername);
            } else {
                div.textContent = 'JD';
            }
            userIcon.parentNode.replaceChild(div, userIcon);
        } else {
            const savedUsername = localStorage.getItem('currentUsername') || currentUser.username;
            if (typeof getUserIconAbbreviation === 'function') {
                userIcon.textContent = getUserIconAbbreviation(savedUsername);
            }
        }
    }
    
    // Update icon in study room participants if visible
    const participantIcons = document.querySelectorAll('.participant-icon');
    const savedUsername = localStorage.getItem('currentUsername') || currentUser.username;
    participantIcons.forEach(icon => {
        const participantBlock = icon.closest('.participant-block');
        if (participantBlock) {
            const nameEl = participantBlock.querySelector('.participant-name');
            if (nameEl && nameEl.textContent === savedUsername) {
                if (icon.tagName === 'IMG') {
                    // Convert back to div with abbreviation
                    const div = document.createElement('div');
                    div.className = icon.className;
                    div.style.cssText = icon.style.cssText;
                    div.id = icon.id || '';
                    if (typeof getUserIconAbbreviation === 'function') {
                        div.textContent = getUserIconAbbreviation(savedUsername);
                    } else {
                        div.textContent = 'JD';
                    }
                    icon.parentNode.replaceChild(div, icon);
                }
            }
        }
    });
    
    // Update user participant icon specifically
    const userParticipantIcon = document.getElementById('userParticipantIcon');
    if (userParticipantIcon && userParticipantIcon.tagName === 'IMG') {
        const div = document.createElement('div');
        div.className = userParticipantIcon.className;
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

/* Utilities: parse and format duration strings used in UI */

// Parse strings like "1h 50m 02s", "128h 20m", "30m 10s", "29s" into seconds
function parseDurationToSeconds(str) {
    if (!str || typeof str !== 'string') return 0;
    const hrs = (str.match(/(\d+)\s*h/) || [0,0])[1] || 0;
    const mins = (str.match(/(\d+)\s*m/) || [0,0])[1] || 0;
    const secs = (str.match(/(\d+)\s*s/) || [0,0])[1] || 0;
    return Number(hrs) * 3600 + Number(mins) * 60 + Number(secs);
}

// Format seconds to "Hh Mm" for totals (keeps minutes, drops seconds)
function formatSecondsToHoursMinutes(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

/**
 * Add secondsToAdd to both currentUser.totalStudyTime and currentUser.thisWeekTime,
 * persist raw seconds to localStorage and update DOM if present.
 */
function updateUserStudyTotals(secondsToAdd) {
    secondsToAdd = Math.max(0, Math.floor(Number(secondsToAdd) || 0));
    // Load persisted base values (fallback to currentUser fields)
    const persistedTotal = parseInt(localStorage.getItem('userTotalStudySeconds') || '0', 10) || parseDurationToSeconds(currentUser.totalStudyTime);
    const persistedWeek  = parseInt(localStorage.getItem('userThisWeekSeconds') || '0', 10) || parseDurationToSeconds(currentUser.thisWeekTime);

    const newTotalSeconds = persistedTotal + secondsToAdd;
    const newWeekSeconds  = persistedWeek + secondsToAdd;

    // Persist raw seconds for future accurate arithmetic
    localStorage.setItem('userTotalStudySeconds', String(newTotalSeconds));
    localStorage.setItem('userThisWeekSeconds', String(newWeekSeconds));

    // Update currentUser fields (display format: "Hh Mm")
    currentUser.totalStudyTime = formatSecondsToHoursMinutes(newTotalSeconds);
    currentUser.thisWeekTime = formatSecondsToHoursMinutes(newWeekSeconds);

    // Update any open UI (home.html ids)
    const totalEl = document.getElementById('totalStudyTime');
    if (totalEl) totalEl.textContent = currentUser.totalStudyTime;
    const weekEl = document.getElementById('thisWeekTime');
    if (weekEl) weekEl.textContent = currentUser.thisWeekTime;
}

// If there are persisted values already, initialize currentUser fields on load
(function initPersistedTotals() {
    const savedTotal = parseInt(localStorage.getItem('userTotalStudySeconds') || '', 10);
    const savedWeek = parseInt(localStorage.getItem('userThisWeekSeconds') || '', 10);
    if (!Number.isNaN(savedTotal)) {
        currentUser.totalStudyTime = formatSecondsToHoursMinutes(savedTotal);
    }
    if (!Number.isNaN(savedWeek)) {
        currentUser.thisWeekTime = formatSecondsToHoursMinutes(savedWeek);
    }
})();

/* Restore original Leave behavior for the Leave button (now accumulates study time) */
function leaveStudyRoom() {
    if (!confirm('Are you sure you want to leave this study room?')) return;

    // Calculate seconds to add: prefer live value if available
    const secondsToAdd = Math.max(0, Math.floor(Number(window.currentStudyTimeSeconds || 0)));

    // Update user totals before leaving
    try {
        updateUserStudyTotals(secondsToAdd);
        // Also add to mission progress
        if (typeof updateMissionProgress === 'function') {
            updateMissionProgress(secondsToAdd);
        }
    } catch (e) {
        console.error('Failed to update study totals on leave:', e);
    }

    // Clear the per-second study time interval
    if (window.studyRoomTimeInterval) {
        clearInterval(window.studyRoomTimeInterval);
        window.studyRoomTimeInterval = null;
    }

    // Clear any running alert/countdown timers to avoid stray timers after leaving
    if (typeof __sr_alertTimer !== 'undefined' && __sr_alertTimer) {
        clearTimeout(__sr_alertTimer);
        __sr_alertTimer = null;
    }
    if (typeof __sr_countdownInterval !== 'undefined' && __sr_countdownInterval) {
        clearInterval(__sr_countdownInterval);
        __sr_countdownInterval = null;
    }

    // Remove current room from session and navigate back to room list
    sessionStorage.removeItem('currentRoom');
    window.location.href = 'study-room.html';
}
window.leaveStudyRoom = leaveStudyRoom;

// -------------------- Missions: definitions, persistence, UI --------------------
// Mission templates (edit targets/points anytime)
const DAILY_MISSIONS_TEMPLATE = [
    {
        id: 'daily_enter_room_60m',
        title: 'Enter study room & study each 60 mins',
        targetSeconds: 60 * 60, // 3600s
        points: 15
    },
    {
        id: 'daily_stay_15m_with_friends',
        title: 'Join study room with friends & stay 15 mins',
        targetSeconds: 15 * 60, // 900s
        points: 20
    },
    {
        id: 'daily_login',
        title: 'Login daily',
        targetSeconds: 0,
        points: 10
    }
];

const WEEKLY_MISSIONS_TEMPLATE = [
    {
        id: 'weekly_top100',
        title: 'Enter the first 100 ranking on weekly global leaderboard',
        targetSeconds: 0,
        points: 100
    },
    {
        id: 'weekly_top3_friends',
        title: 'Enter the first 3 ranking on weekly friend leaderboard',
        targetSeconds: 0,
        points: 75
    },
    {
        id: 'weekly_upload_resources',
        title: 'Upload at least 3 useful study resources',
        targetSeconds: 0,
        points: 60
    },
    {
        id: 'weekly_7h_goal',
        title: 'Achieve total study time for seven hours in a week',
        targetSeconds: 7 * 3600, // 25200s
        points: 50
    }
];

function loadMissions(type) {
    const key = type === 'daily' ? 'dailyMissionsState' : 'weeklyMissionsState';
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    const template = type === 'daily' ? DAILY_MISSIONS_TEMPLATE : WEEKLY_MISSIONS_TEMPLATE;
    const initial = template.map(m => ({
        id: m.id,
        title: mtitle,
        targetSeconds: m.targetSeconds || 0,
        points: m.points || 0,
        progressSeconds: 0,
               claimed: false
    }));
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
}

function saveMissions(type, data) {
    const key = type === 'daily' ? 'dailyMissionsState' : 'weeklyMissionsState';
    localStorage.setItem(key, JSON.stringify(data));
}

window.getDailyMissions = () => loadMissions('daily');
window.getWeeklyMissions = () => loadMissions('weekly');

/**
 * Add study seconds to mission progress (called on leaving room).
 * secondsToAdd: integer seconds to add.
 */
function updateMissionProgress(secondsToAdd) {
    secondsToAdd = Math.max(0, Math.floor(Number(secondsToAdd) || 0));

    // DAILY
    const daily = loadMissions('daily');
    let changed = false;
    daily.forEach(m => {
        if (m.targetSeconds > 0) {
            m.progressSeconds = Math.min(m.targetSeconds, (m.progressSeconds || 0) + secondsToAdd);
            if (m.progressSeconds > (m.targetSeconds || 0)) m.progressSeconds = m.targetSeconds;
            changed = true;
        }
    });
    if (changed) saveMissions('daily', daily);

    // WEEKLY
    const weekly = loadMissions('weekly');
    changed = false;
    weekly.forEach(m => {
        if (m.targetSeconds > 0) {
            m.progressSeconds = Math.min(m.targetSeconds, (m.progressSeconds || 0) + secondsToAdd);
            if (m.progressSeconds > (m.targetSeconds || 0)) m.progressSeconds = m.targetSeconds;
            changed = true;
        }
    });
    if (changed) saveMissions('weekly', weekly);

    // Re-render UI if present
    try { renderMissionsUI(); } catch (e) {}
}
window.updateMissionProgress = updateMissionProgress;

/**
 * Claim mission by id and type ('daily'|'weekly').
 */
function claimMission(type, missionId) {
    const list = loadMissions(type);
    const m = list.find(x => x.id === missionId);
    if (!m) return;
    const alreadyClaimed = m.claimed;
    const achieved = (m.targetSeconds === 0) ? true : (m.progressSeconds >= m.targetSeconds);
    if (!achieved || alreadyClaimed) return;
    m.claimed = true;
    saveMissions(type, list);

    // Reward points
    currentUser.studyPoints = (currentUser.studyPoints || 0) + (m.points || 0);
    localStorage.setItem('userStudyPoints', String(currentUser.studyPoints));
    try { updateUserInfo(); } catch (e) {} // update UI if function exists

    // update home UI
    try { renderMissionsUI(); } catch (e) {}
}
window.claimMission = claimMission;

/**
 * Render mission panels in home.html. Expects specific containers to exist:
 * - #dailyMissionsContainer
 * - #weeklyMissionsContainer
 */
function renderMissionsUI() {
    const dailyList = loadMissions('daily');
    const weeklyList = loadMissions('weekly');

    const dailyContainer = document.getElementById('dailyMissionsContainer');
    const weeklyContainer = document.getElementById('weeklyMissionsContainer');

    if (dailyContainer) {
        dailyContainer.innerHTML = dailyList.map(m => {
            const percent = m.targetSeconds > 0 ? Math.round((m.progressSeconds||0) / m.targetSeconds * 100) : (m.claimed ? 100 : 0);
            const progressText = m.targetSeconds > 0
                ? `${formatStudyDurationHMS(m.progressSeconds || 0)} / ${formatStudyDurationHMS(m.targetSeconds)} (${percent}%)`
                : (m.claimed ? 'Completed' : 'Not started');
            const btnDisabled = (!m.targetSeconds && !m.claimed) ? false : !( (m.targetSeconds === 0) || ((m.progressSeconds||0) >= m.targetSeconds) ) ;
            const btnClass = m.claimed ? 'get-btn claimed' : 'get-btn';
            const btnDisabledAttr = m.claimed ? 'disabled' : (btnDisabled ? 'disabled' : '');
            return `
<div class="mission-item ${m.claimed ? 'completed' : ''}">
  <div class="mission-content">
    <div class="mission-text-row">
      <span class="mission-text">${m.title}</span>
      <span class="mission-points">+${m.points} pts</span>
    </div>
    ${m.targetSeconds > 0 ? `
    <div class="progress-bar-container">
      <div class="progress-bar-wrapper">
        <div class="progress-bar-completed" style="width:${percent}%"></div>
        <div class="progress-bar-remaining" style="width:${100-percent}%"></div>
      </div>
      <span class="progress-text">${progressText}</span>
    </div>` : `<div class="progress-text">${progressText}</div>`}
    <div class="mission-actions">
      <button class="${btnClass}" onclick="claimMission('daily','${m.id}')" ${btnDisabledAttr}>${m.claimed ? 'Got' : 'Get'}</button>
    </div>
  </div>
</div>`;
        }).join('');
    }

    if (weeklyContainer) {
        weeklyContainer.innerHTML = weeklyList.map(m => {
            const percent = m.targetSeconds > 0 ? Math.round((m.progressSeconds||0) / m.targetSeconds * 100) : (m.claimed ? 100 : 0);
            const progressText = m.targetSeconds > 0
                ? `${formatStudyDurationHMS(m.progressSeconds || 0)} / ${formatStudyDurationHMS(m.targetSeconds)} (${percent}%)`
                : (m.claimed ? 'Completed' : 'Not started');
            const btnDisabled = (!m.targetSeconds && !m.claimed) ? false : !( (m.targetSeconds === 0) || ((m.progressSeconds||0) >= m.targetSeconds) ) ;
            const btnClass = m.claimed ? 'get-btn claimed' : 'get-btn';
            const btnDisabledAttr = m.claimed ? 'disabled' : (btnDisabled ? 'disabled' : '');
            return `
<div class="mission-item ${m.claimed ? 'completed' : ''}">
  <div class="mission-content">
    <div class="mission-text-row">
      <span class="mission-text">${m.title}</span>
      <span class="mission-points">+${m.points} pts</span>
    </div>
    ${m.targetSeconds > 0 ? `
    <div class="progress-bar-container">
      <div class="progress-bar-wrapper">
        <div class="progress-bar-completed" style="width:${percent}%"></div>
        <div class="progress-bar-remaining" style="width:${100-percent}%"></div>
      </div>
      <span class="progress-text">${progressText}</span>
    </div>` : `<div class="progress-text">${progressText}</div>`}
    <div class="mission-actions">
      <button class="${btnClass}" onclick="claimMission('weekly','${m.id}')" ${btnDisabledAttr}>${m.claimed ? 'Got' : 'Get'}</button>
    </div>
  </div>
</div>`;
        }).join('');
    }

    // Update study points display if present
    const ptsEl = document.getElementById('studyPoints');
    if (ptsEl) ptsEl.textContent = (currentUser.studyPoints || 0).toLocaleString();
}
window.renderMissionsUI = renderMissionsUI;

/** Reset helpers using HK timezone (UTC+8) */
function getHKNow() {
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcMs + (8 * 3600000));
}
function scheduleNextDailyReset() {
    const hkNow = getHKNow();
    const nextMidnightHK = new Date(hkNow.getFullYear(), hkNow.getMonth(), hkNow.getDate() + 1, 0, 0, 0);
    const nextUtcMs = nextMidnightHK.getTime() - (8 * 3600000);
    const delay = Math.max(0, nextUtcMs - Date.now());
    setTimeout(() => { resetDailyMissions(); scheduleNextDailyReset(); }, delay);
}
function scheduleNextWeeklyReset() {
    const hkNow = getHKNow();
    const day = hkNow.getDay(); // 0 Sun ... 1 Mon
    const daysToAdd = (8 - day) % 7 || 7; // next Monday
    const nextMondayHK = new Date(hkNow.getFullYear(), hkNow.getMonth(), hkNow.getDate() + daysToAdd, 0, 0, 0);
    const nextUtcMs = nextMondayHK.getTime() - (8 * 3600000);
    const delay = Math.max(0, nextUtcMs - Date.now());
    setTimeout(() => { resetWeeklyMissions(); scheduleNextWeeklyReset(); }, delay);
}

function resetDailyMissions() {
    const daily = loadMissions('daily');
    daily.forEach(m => {
        m.progressSeconds = 0;
        m.claimed = false;
    });
    saveMissions('daily', daily);
    try { renderMissionsUI(); } catch (e) {}
}
function resetWeeklyMissions() {
    const weekly = loadMissions('weekly');
    weekly.forEach(m => {
        m.progressSeconds = 0;
        m.claimed = false;
    });
    saveMissions('weekly', weekly);
    try { renderMissionsUI(); } catch (e) {}
}

function initMissionsAndSchedules() {
    loadMissions('daily');
    loadMissions('weekly');
    try { renderMissionsUI(); } catch (e) {}
    scheduleNextDailyReset();
    scheduleNextWeeklyReset();
}
window.initMissionsAndSchedules = initMissionsAndSchedules;

// Initialize on load
try { initMissionsAndSchedules(); } catch (e) {}
