// ==================== STORAGE UTILITY FUNCTIONS ====================

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==================== USER MANAGEMENT ====================

// Get all users
function getUsers() {
    const users = localStorage.getItem('devconnect_users');
    return users ? JSON.parse(users) : [];
}

// Save users
function saveUsers(users) {
    localStorage.setItem('devconnect_users', JSON.stringify(users));
}

// Get user by ID
function getUserById(userId) {
    const users = getUsers();
    return users.find(u => u.id === userId);
}

// Update user
function updateUser(userId, updates) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveUsers(users);
        return users[index];
    }
    return null;
}

// ==================== DEVELOPER PROFILES ====================

// Get all developer profiles
function getDeveloperProfiles() {
    const profiles = localStorage.getItem('devconnect_developer_profiles');
    return profiles ? JSON.parse(profiles) : [];
}

// Save developer profiles
function saveDeveloperProfiles(profiles) {
    localStorage.setItem('devconnect_developer_profiles', JSON.stringify(profiles));
}

// Get developer profile by user ID
function getDeveloperProfile(userId) {
    const profiles = getDeveloperProfiles();
    return profiles.find(p => p.userId === userId);
}

// Save or update developer profile
function saveDeveloperProfile(userId, profileData) {
    const profiles = getDeveloperProfiles();
    const index = profiles.findIndex(p => p.userId === userId);
    
    const profile = {
        userId,
        ...profileData,
        updatedAt: new Date().toISOString()
    };
    
    if (index !== -1) {
        profiles[index] = profile;
    } else {
        profile.createdAt = new Date().toISOString();
        profiles.push(profile);
    }
    
    saveDeveloperProfiles(profiles);
    return profile;
}

// Calculate profile completion percentage
function calculateProfileCompletion(profile) {
    const fields = [
        'name',
        'bio',
        'skills',
        'github',
        'portfolio',
        'photo',
        'availability',
        'projects'
    ];
    
    let completed = 0;
    
    if (profile.name) completed++;
    if (profile.bio && profile.bio.length > 20) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    if (profile.github) completed++;
    if (profile.portfolio) completed++;
    if (profile.photo) completed++;
    if (profile.availability) completed++;
    if (profile.projects && profile.projects.length > 0) completed++;
    
    return Math.round((completed / fields.length) * 100);
}

// ==================== CLIENT REQUIREMENTS ====================

// Get all client requirements
function getClientRequirements() {
    const requirements = localStorage.getItem('devconnect_client_requirements');
    return requirements ? JSON.parse(requirements) : [];
}

// Save client requirements
function saveClientRequirements(requirements) {
    localStorage.setItem('devconnect_client_requirements', JSON.stringify(requirements));
}

// Get requirements by client ID
function getClientRequirementsByUser(userId) {
    const requirements = getClientRequirements();
    return requirements.filter(r => r.userId === userId);
}

// Add new requirement
function addClientRequirement(userId, requirementData) {
    const requirements = getClientRequirements();
    
    const requirement = {
        id: generateId(),
        userId,
        ...requirementData,
        createdAt: new Date().toISOString()
    };
    
    requirements.push(requirement);
    saveClientRequirements(requirements);
    return requirement;
}

// Update requirement
function updateClientRequirement(requirementId, updates) {
    const requirements = getClientRequirements();
    const index = requirements.findIndex(r => r.id === requirementId);
    
    if (index !== -1) {
        requirements[index] = { ...requirements[index], ...updates, updatedAt: new Date().toISOString() };
        saveClientRequirements(requirements);
        return requirements[index];
    }
    return null;
}

// ==================== BOOKMARKS ====================

// Get bookmarks for a user
function getBookmarks(userId) {
    const bookmarks = localStorage.getItem(`devconnect_bookmarks_${userId}`);
    return bookmarks ? JSON.parse(bookmarks) : [];
}

// Save bookmarks
function saveBookmarks(userId, bookmarks) {
    localStorage.setItem(`devconnect_bookmarks_${userId}`, JSON.stringify(bookmarks));
}

// Toggle bookmark
function toggleBookmark(userId, developerId) {
    const bookmarks = getBookmarks(userId);
    const index = bookmarks.indexOf(developerId);
    
    if (index !== -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(developerId);
    }
    
    saveBookmarks(userId, bookmarks);
    return bookmarks;
}

// Check if bookmarked
function isBookmarked(userId, developerId) {
    const bookmarks = getBookmarks(userId);
    return bookmarks.includes(developerId);
}

// ==================== MESSAGES ====================

// Get all conversations for a user
function getConversations(userId) {
    const conversations = localStorage.getItem('devconnect_conversations');
    const allConversations = conversations ? JSON.parse(conversations) : [];
    
    return allConversations.filter(c => 
        c.participants.includes(userId)
    );
}

// Get conversation between two users
function getConversation(user1Id, user2Id) {
    const conversations = localStorage.getItem('devconnect_conversations');
    const allConversations = conversations ? JSON.parse(conversations) : [];
    
    return allConversations.find(c => 
        c.participants.includes(user1Id) && c.participants.includes(user2Id)
    );
}

// Create or get conversation
function createConversation(user1Id, user2Id) {
    let conversation = getConversation(user1Id, user2Id);
    
    if (!conversation) {
        const conversations = localStorage.getItem('devconnect_conversations');
        const allConversations = conversations ? JSON.parse(conversations) : [];
        
        conversation = {
            id: generateId(),
            participants: [user1Id, user2Id],
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString()
        };
        
        allConversations.push(conversation);
        localStorage.setItem('devconnect_conversations', JSON.stringify(allConversations));
    }
    
    return conversation;
}

// Get messages in a conversation
function getMessages(conversationId) {
    const messages = localStorage.getItem(`devconnect_messages_${conversationId}`);
    return messages ? JSON.parse(messages) : [];
}

// Send message
function sendMessage(conversationId, senderId, content) {
    const messages = getMessages(conversationId);
    
    const message = {
        id: generateId(),
        conversationId,
        senderId,
        content,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(message);
    localStorage.setItem(`devconnect_messages_${conversationId}`, JSON.stringify(messages));
    
    // Update conversation last message time
    const conversations = localStorage.getItem('devconnect_conversations');
    const allConversations = conversations ? JSON.parse(conversations) : [];
    const convIndex = allConversations.findIndex(c => c.id === conversationId);
    
    if (convIndex !== -1) {
        allConversations[convIndex].lastMessageAt = new Date().toISOString();
        allConversations[convIndex].lastMessage = content;
        localStorage.setItem('devconnect_conversations', JSON.stringify(allConversations));
    }
    
    return message;
}

// Mark messages as read
function markMessagesAsRead(conversationId, userId) {
    const messages = getMessages(conversationId);
    
    messages.forEach(msg => {
        if (msg.senderId !== userId) {
            msg.read = true;
        }
    });
    
    localStorage.setItem(`devconnect_messages_${conversationId}`, JSON.stringify(messages));
}

// Get unread message count
function getUnreadCount(userId) {
    const conversations = getConversations(userId);
    let unreadCount = 0;
    
    conversations.forEach(conv => {
        const messages = getMessages(conv.id);
        const unread = messages.filter(msg => 
            msg.senderId !== userId && !msg.read
        );
        unreadCount += unread.length;
    });
    
    return unreadCount;
}

// ==================== SEARCH & FILTER ====================

// Search developers
function searchDevelopers(query, filters = {}) {
    let profiles = getDeveloperProfiles();
    
    // Text search
    if (query) {
        query = query.toLowerCase();
        profiles = profiles.filter(p => 
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.bio && p.bio.toLowerCase().includes(query)) ||
            (p.skills && p.skills.some(s => s.toLowerCase().includes(query)))
        );
    }
    
    // Filter by skills
    if (filters.skills && filters.skills.length > 0) {
        profiles = profiles.filter(p => 
            p.skills && filters.skills.some(skill => 
                p.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
            )
        );
    }
    
    // Filter by role type
    if (filters.roleType) {
        profiles = profiles.filter(p => 
            p.roleType && p.roleType.toLowerCase() === filters.roleType.toLowerCase()
        );
    }
    
    // Filter by availability
    if (filters.availability) {
        profiles = profiles.filter(p => 
            p.availability && p.availability.toLowerCase() === filters.availability.toLowerCase()
        );
    }
    
    // Sort
    if (filters.sortBy === 'newest') {
        profiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === 'projects') {
        profiles.sort((a, b) => {
            const aProjects = a.projects ? a.projects.length : 0;
            const bProjects = b.projects ? b.projects.length : 0;
            return bProjects - aProjects;
        });
    }
    
    return profiles;
}

// ==================== DEMO DATA INITIALIZATION ====================

// Initialize with demo data (for testing)
function initializeDemoData() {
    // Check if already initialized
    if (localStorage.getItem('devconnect_demo_initialized')) {
        return;
    }
    
    // Create demo users
    const demoUsers = [
        {
            id: 'demo-dev-1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            password: 'demo123',
            role: 'developer',
            createdAt: new Date().toISOString()
        },
        {
            id: 'demo-dev-2',
            name: 'Mike Chen',
            email: 'mike@example.com',
            password: 'demo123',
            role: 'developer',
            createdAt: new Date().toISOString()
        },
        {
            id: 'demo-client-1',
            name: 'Emily Davis',
            email: 'emily@example.com',
            password: 'demo123',
            role: 'client',
            createdAt: new Date().toISOString()
        }
    ];
    
    saveUsers(demoUsers);
    
    // Create demo developer profiles
    const demoProfiles = [
        {
            userId: 'demo-dev-1',
            name: 'Sarah Johnson',
            bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.',
            skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
            roleType: 'Fullstack',
            github: 'https://github.com/sarahjohnson',
            portfolio: 'https://sarahjohnson.dev',
            availability: 'Available',
            photo: '',
            projects: [
                {
                    id: 'proj-1',
                    title: 'E-commerce Platform',
                    description: 'Built a scalable e-commerce platform with React and Node.js',
                    technologies: ['React', 'Node.js', 'MongoDB']
                }
            ],
            createdAt: new Date().toISOString()
        },
        {
            userId: 'demo-dev-2',
            name: 'Mike Chen',
            bio: 'Frontend specialist focused on creating beautiful, responsive user interfaces.',
            skills: ['React', 'Vue.js', 'CSS', 'JavaScript', 'Figma'],
            roleType: 'Frontend',
            github: 'https://github.com/mikechen',
            portfolio: 'https://mikechen.design',
            availability: 'Busy',
            photo: '',
            projects: [
                {
                    id: 'proj-2',
                    title: 'Portfolio Website',
                    description: 'Modern portfolio with smooth animations',
                    technologies: ['React', 'CSS', 'Framer Motion']
                }
            ],
            createdAt: new Date().toISOString()
        }
    ];
    
    saveDeveloperProfiles(demoProfiles);
    
    localStorage.setItem('devconnect_demo_initialized', 'true');
}

// Initialize demo data on load
if (typeof window !== 'undefined') {
    initializeDemoData();
}
