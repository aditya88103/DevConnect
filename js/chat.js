// ==================== CHAT FUNCTIONALITY ====================

document.addEventListener('DOMContentLoaded', function () {
    // Messages List Page
    const messagesList = document.getElementById('messagesList');
    if (messagesList) {
        loadConversationsList();
    }

    // Chat Page
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        loadChatPage();
    }
});

function loadConversationsList() {
    const user = getCurrentUser();
    if (!user) return;

    const conversations = getConversations(user.id);
    const messagesList = document.getElementById('messagesList');

    if (conversations.length === 0) {
        messagesList.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 64px; height: 64px; margin: 0 auto 1rem; color: var(--text-muted);">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3 style="margin-bottom: 0.5rem;">No messages yet</h3>
                <p style="color: var(--text-secondary);">Start a conversation with a ${user.role === 'freelancer' ? 'client' : 'freelancer'}!</p>
            </div>
        `;
        return;
    }

    const conversationsHtml = conversations.map(conv => {
        const otherUserId = conv.participants.find(id => id !== user.id);
        const otherUser = getUserById(otherUserId);
        const messages = getMessages(conv.id);
        const unreadMessages = messages.filter(msg => msg.senderId !== user.id && !msg.read);

        const lastMessage = conv.lastMessage || 'No messages yet';
        const lastMessageTime = conv.lastMessageAt ? formatTime(conv.lastMessageAt) : '';

        return `
            <a href="chat.html?conversation=${conv.id}" class="chat-item ${unreadMessages.length > 0 ? 'unread' : ''}">
                <img src="${getUserAvatar(otherUser)}" alt="${otherUser.name}" class="chat-avatar">
                <div class="chat-info">
                    <div class="chat-name">${otherUser.name}</div>
                    <div class="chat-preview">${lastMessage}</div>
                </div>
                <div class="chat-meta">
                    <div class="chat-time">${lastMessageTime}</div>
                    ${unreadMessages.length > 0 ? `<div class="unread-badge">${unreadMessages.length}</div>` : ''}
                </div>
            </a>
        `;
    }).join('');

    messagesList.innerHTML = `<div class="chat-list">${conversationsHtml}</div>`;
}

function loadChatPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversation');
    const otherUserId = urlParams.get('user');

    const user = getCurrentUser();
    if (!user) return;

    let conversation;

    if (conversationId) {
        conversation = getConversations(user.id).find(c => c.id === conversationId);
    } else if (otherUserId) {
        conversation = createConversation(user.id, otherUserId);
        window.history.replaceState({}, '', `chat.html?conversation=${conversation.id}`);
    }

    if (!conversation) {
        alert('Conversation not found!');
        window.location.href = 'messages.html';
        return;
    }

    const otherUserId2 = conversation.participants.find(id => id !== user.id);
    const otherUser = getUserById(otherUserId2);

    // Update chat header
    document.getElementById('chatUserName').textContent = otherUser.name;
    document.getElementById('chatUserAvatar').src = getUserAvatar(otherUser);

    // Load messages
    loadMessages(conversation.id);

    // Mark messages as read
    markMessagesAsRead(conversation.id, user.id);

    // Send message
    const sendMessageForm = document.getElementById('sendMessageForm');
    sendMessageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const content = messageInput.value.trim();

        if (content) {
            sendMessage(conversation.id, user.id, content);
            messageInput.value = '';
            loadMessages(conversation.id);
        }
    });
}

function loadMessages(conversationId) {
    const user = getCurrentUser();
    const messages = getMessages(conversationId);
    const chatMessages = document.getElementById('chatMessages');

    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 2rem;">
                Start the conversation by sending a message!
            </div>
        `;
        return;
    }

    const messagesHtml = messages.map(msg => {
        const isSent = msg.senderId === user.id;
        const time = formatTime(msg.timestamp);

        return `
            <div class="message-bubble ${isSent ? 'sent' : 'received'}">
                <div>${msg.content}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }).join('');

    chatMessages.innerHTML = messagesHtml;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getUserAvatar(user) {
    if (user.role === 'freelancer') {
        const profile = getFreelancerProfile(user.id);
        if (profile && profile.photo) {
            return profile.photo;
        }
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
}
