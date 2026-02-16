// ==================== DEVELOPER PROFILE FORM LOGIC ====================

document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the profile form page
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    const user = getCurrentUser();
    if (!user) return;

    let skills = [];
    let projects = [];

    // Load existing profile if any
    const existingProfile = getDeveloperProfile(user.id);
    if (existingProfile) {
        loadExistingProfile(existingProfile);
    }

    // Bio character count
    const bioInput = document.getElementById('bio');
    const bioCount = document.getElementById('bioCount');

    bioInput.addEventListener('input', function () {
        const count = this.value.length;
        bioCount.textContent = `${count} / 500 characters`;
        if (count > 500) {
            bioCount.style.color = 'var(--accent-orange)';
        } else {
            bioCount.style.color = 'var(--text-muted)';
        }
    });

    // Skills management
    const skillInput = document.getElementById('skillInput');
    const skillsContainer = document.getElementById('skillsContainer');

    skillInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });

    function addSkill() {
        const skill = skillInput.value.trim();
        if (skill && !skills.includes(skill)) {
            skills.push(skill);
            renderSkills();
            skillInput.value = '';
        }
    }

    function removeSkill(skill) {
        skills = skills.filter(s => s !== skill);
        renderSkills();
    }

    function renderSkills() {
        if (skills.length === 0) {
            skillsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No skills added yet. Add your first skill above!</p>';
            return;
        }

        skillsContainer.innerHTML = skills.map(skill => `
            <div class="skill-tag">
                <span>${skill}</span>
                <button type="button" class="remove-skill" data-skill="${skill}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-skill').forEach(btn => {
            btn.addEventListener('click', function () {
                removeSkill(this.dataset.skill);
            });
        });
    }

    // Projects management
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectsContainer = document.getElementById('projectsContainer');

    addProjectBtn.addEventListener('click', addProject);

    function addProject() {
        const projectId = generateId();
        projects.push({
            id: projectId,
            title: '',
            description: '',
            technologies: [],
            link: ''
        });
        renderProjects();
    }

    function removeProject(projectId) {
        projects = projects.filter(p => p.id !== projectId);
        renderProjects();
    }

    function renderProjects() {
        if (projects.length === 0) {
            projectsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No projects added yet. Click "Add Project" to showcase your work!</p>';
            return;
        }

        projectsContainer.innerHTML = projects.map((project, index) => `
            <div class="project-item" data-project-id="${project.id}">
                <div class="project-header">
                    <h3>Project ${index + 1}</h3>
                    <button type="button" class="remove-project-btn" data-project-id="${project.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Remove
                    </button>
                </div>

                <div class="form-group">
                    <label>Project Title *</label>
                    <input type="text" class="project-title" data-project-id="${project.id}" value="${project.title}" required placeholder="My Awesome Project">
                </div>

                <div class="form-group">
                    <label>Description *</label>
                    <textarea class="project-description" data-project-id="${project.id}" rows="3" required placeholder="Describe what you built and the impact it had...">${project.description}</textarea>
                </div>

                <div class="form-group">
                    <label>Technologies (comma-separated)</label>
                    <input type="text" class="project-technologies" data-project-id="${project.id}" value="${project.technologies.join(', ')}" placeholder="React, Node.js, MongoDB">
                </div>

                <div class="form-group">
                    <label>Project Link</label>
                    <input type="url" class="project-link" data-project-id="${project.id}" value="${project.link}" placeholder="https://project-demo.com">
                </div>
            </div>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.remove-project-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                removeProject(this.dataset.projectId);
            });
        });

        // Add input listeners to update project data
        document.querySelectorAll('.project-title').forEach(input => {
            input.addEventListener('input', function () {
                const project = projects.find(p => p.id === this.dataset.projectId);
                if (project) project.title = this.value;
            });
        });

        document.querySelectorAll('.project-description').forEach(input => {
            input.addEventListener('input', function () {
                const project = projects.find(p => p.id === this.dataset.projectId);
                if (project) project.description = this.value;
            });
        });

        document.querySelectorAll('.project-technologies').forEach(input => {
            input.addEventListener('input', function () {
                const project = projects.find(p => p.id === this.dataset.projectId);
                if (project) {
                    project.technologies = this.value.split(',').map(t => t.trim()).filter(t => t);
                }
            });
        });

        document.querySelectorAll('.project-link').forEach(input => {
            input.addEventListener('input', function () {
                const project = projects.find(p => p.id === this.dataset.projectId);
                if (project) project.link = this.value;
            });
        });
    }

    // Load existing profile
    function loadExistingProfile(profile) {
        document.getElementById('name').value = profile.name || '';
        document.getElementById('roleType').value = profile.roleType || '';
        document.getElementById('availability').value = profile.availability || '';
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('github').value = profile.github || '';
        document.getElementById('portfolio').value = profile.portfolio || '';
        document.getElementById('linkedin').value = profile.linkedin || '';

        // Load skills
        if (profile.skills && profile.skills.length > 0) {
            skills = [...profile.skills];
            renderSkills();
        }

        // Load projects
        if (profile.projects && profile.projects.length > 0) {
            projects = profile.projects.map(p => ({
                id: p.id || generateId(),
                title: p.title || '',
                description: p.description || '',
                technologies: p.technologies || [],
                link: p.link || ''
            }));
            renderProjects();
        }

        // Update bio count
        bioInput.dispatchEvent(new Event('input'));
    }

    // Form submission
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate skills
        if (skills.length === 0) {
            alert('Please add at least one skill!');
            return;
        }

        // Validate projects
        const validProjects = projects.filter(p => p.title && p.description);
        if (validProjects.length === 0 && projects.length > 0) {
            alert('Please complete all project fields or remove empty projects!');
            return;
        }

        // Collect form data
        const profileData = {
            name: document.getElementById('name').value,
            roleType: document.getElementById('roleType').value,
            availability: document.getElementById('availability').value,
            bio: document.getElementById('bio').value,
            skills: skills,
            github: document.getElementById('github').value,
            portfolio: document.getElementById('portfolio').value,
            linkedin: document.getElementById('linkedin').value,
            projects: validProjects
        };

        // Save profile
        saveDeveloperProfile(user.id, profileData);

        // Update user name if changed
        if (profileData.name !== user.name) {
            updateUser(user.id, { name: profileData.name });
            updateCurrentUserSession({ name: profileData.name });
        }

        alert('Profile saved successfully!');
        window.location.href = 'developer-dashboard.html';
    });

    // Initialize
    renderSkills();
    renderProjects();
});
