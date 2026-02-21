// ==================== CLIENT-SIDE LOGIC ====================

document.addEventListener('DOMContentLoaded', function () {
    // Client Requirement Form
    const requirementForm = document.getElementById('requirementForm');
    if (requirementForm) {
        requirementForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const user = getCurrentUser();
            if (!user) return;

            const requirementData = {
                projectType: document.getElementById('projectType').value,
                budget: document.getElementById('budget').value,
                deadline: document.getElementById('deadline').value,
                features: document.getElementById('features').value,
                description: document.getElementById('description').value,
                notes: document.getElementById('notes').value
            };

            addClientRequirement(user.id, requirementData);

            alert('Requirement posted successfully!');
            window.location.href = 'owner-dashboard.html';
        });
    }
});
