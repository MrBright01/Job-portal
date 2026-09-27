// ==============================
// JOB SEEKER DASHBOARD
// ==============================

// ==============================
// LOGIN CHECK
// ==============================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    window.location.href = "index.html";
}


// ==============================
// ROLE CHECK
// ==============================

if (
    loggedInUser &&
    loggedInUser.role === "employer"
) {
    window.location.href = "dashboard2.html";
}

// ==============================
// USER MENU
// ==============================

const userButton =
    document.getElementById("userButton");

const userDropdown =
    document.getElementById("userDropdown");

const loggedInUserName =
    document.getElementById("loggedInUserName");

const dropdownUserName =
    document.getElementById("dropdownUserName");

const dropdownUserRole =
    document.getElementById("dropdownUserRole");


// ==============================
// SHOW USER INFORMATION
// ==============================

if (loggedInUser) {

    if (loggedInUserName) {

        loggedInUserName.textContent =
            loggedInUser.name;

    }

    if (dropdownUserName) {

        dropdownUserName.textContent =
            loggedInUser.name;

    }

    if (dropdownUserRole) {

        dropdownUserRole.textContent =
            loggedInUser.role === "employer"
                ? "Employer"
                : "Job Seeker";

    }

}


// ==============================
// OPEN / CLOSE USER DROPDOWN
// ==============================

if (userButton && userDropdown) {

    userButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            userDropdown.classList.toggle(
                "show"
            );

        }
    );


    // Close when clicking outside

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    "#userMenu"
                )
            ) {

                userDropdown.classList.remove(
                    "show"
                );

            }

        }
    );

}



// ==============================
// LOGOUT
// ==============================

const dropdownLogoutBtn =
    document.getElementById(
        "dropdownLogoutBtn"
    );

if (dropdownLogoutBtn) {

    dropdownLogoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "index.html";

        }
    );

}


// ==============================
// JOB VARIABLES
// ==============================

const jobContainer =
    document.getElementById("jobContainer");

const jobCount =
    document.getElementById("jobCount");

const searchInput =
    document.getElementById("jobSearch");

const searchBtn =
    document.getElementById("searchBtn");


// Store jobs received from backend

let allJobs = [];


// ==============================
// LOAD JOBS FROM BACKEND
// ==============================

async function loadJobs() {

    try {

        jobContainer.innerHTML = `
            <p>Loading jobs...</p>
        `;


        const response =
            await fetch(
                "https://job-portal-1-5gno.onrender.com/api/jobs"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch jobs"
            );

        }


        allJobs =
            await response.json();


        console.log(
            "Jobs received:",
            allJobs
        );


        displayJobs(allJobs);

    }

    catch (error) {

        console.error(
            "Load jobs error:",
            error
        );


        jobContainer.innerHTML = `
            <p>
                Unable to load jobs.
                Make sure the server is running.
            </p>
        `;

    }

}


// ==============================
// DISPLAY JOBS
// ==============================

function displayJobs(jobs) {

    jobContainer.innerHTML = "";


    if (jobs.length === 0) {

        jobContainer.innerHTML = `
            <p>No jobs found.</p>
        `;

        jobCount.textContent =
            "0 Jobs Found";

        return;

    }


    jobCount.textContent =
        `${jobs.length} Jobs Found`;


    jobs.forEach(function (job) {

        const jobCard =
            document.createElement("div");

        jobCard.className =
            "job-card";


        const skills =
            Array.isArray(job.skills)
                ? job.skills.join(", ")
                : job.skills || "";


        jobCard.innerHTML = `

            <h3>
                ${job.title || "Job Title"}
            </h3>

            <p>
                🏢 ${job.company || "Company"}
            </p>

            <p>
                📍 ${job.location || "Location not specified"}
            </p>

            <p>
                💰 ${job.salary || "Salary not specified"}
            </p>

            <p>
                💼 ${job.type || "Full Time"}
            </p>

            <p>
                🛠️ ${skills}
            </p>

            <button
                class="apply-job-btn"
                data-id="${job._id}"
            >
                Apply
            </button>

            <button
                class="save-job-btn"
                data-id="${job._id}"
            >
                🔖 Save
            </button>

        `;


        jobContainer.appendChild(
            jobCard
        );

    });


    attachJobButtons();

}


// ==============================
// APPLY + SAVE BUTTONS
// ==============================

function attachJobButtons() {

    const applyButtons =
        document.querySelectorAll(
            ".apply-job-btn"
        );


    applyButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;

                    const job =
                        allJobs.find(
                            function (item) {

                                return (
                                    item._id === jobId
                                );

                            }
                        );


                    if (job) {

                        openApplyModal(job);

                    }

                }
            );

        }
    );


    const saveButtons =
        document.querySelectorAll(
            ".save-job-btn"
        );


    saveButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;

                    saveJob(jobId);

                }
            );

        }
    );

}


// ==============================
// SAVE JOB
// ==============================

function saveJob(jobId) {

    let savedJobs =
        JSON.parse(
            localStorage.getItem(
                "savedJobs"
            )
        ) || [];


    if (
        savedJobs.includes(jobId)
    ) {

        alert(
            "Job is already saved."
        );

        return;

    }


    savedJobs.push(jobId);


    localStorage.setItem(
        "savedJobs",
        JSON.stringify(savedJobs)
    );


    alert(
        "Job saved! 🔖"
    );

}


// ==============================
// SEARCH JOBS
// ==============================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchJobs
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                searchJobs();

            }

        }
    );

}


function searchJobs() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    if (searchText === "") {

        displayJobs(allJobs);

        return;

    }


    const filteredJobs =
        allJobs.filter(
            function (job) {

                return (

                    (job.title || "")
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (job.company || "")
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (job.category || "")
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    (job.location || "")
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    JSON.stringify(
                        job.skills || []
                    )
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );


    displayJobs(filteredJobs);

}


// ==============================
// CATEGORY FILTER
// ==============================

const categories =
    document.querySelectorAll(
        ".categories span"
    );


categories.forEach(
    function (category) {

        category.addEventListener(
            "click",
            function () {

                const selectedCategory =
                    category.dataset.category;


                const filteredJobs =
                    allJobs.filter(
                        function (job) {

                            return (
                                job.category &&
                                job.category
                                    .toLowerCase() ===
                                selectedCategory
                                    .toLowerCase()
                            );

                        }
                    );


                displayJobs(
                    filteredJobs
                );

            }
        );

    }
);


// ==============================
// APPLY MODAL
// ==============================

const applyModal =
    document.getElementById(
        "applyModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const applyForm =
    document.getElementById(
        "applyForm"
    );

const selectedJob =
    document.getElementById(
        "selectedJob"
    );
    let selectedJobId = null;


function openApplyModal(job) {

    selectedJobId = job._id;

    console.log(
        "Selected Job ID:",
        selectedJobId
    );


    if (selectedJob) {

        selectedJob.textContent =
            job.title;

    }


    if (applyModal) {

        applyModal.classList.add(
            "show"
        );

    }

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            applyModal.classList.remove(
                "show"
            );

        }
    );

}
// ==============================
// APPLY FORM
// ==============================

if (applyForm) {

    applyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            try {

                const resumeInput =
                    document.getElementById("resume");

                if (!resumeInput || !resumeInput.files[0]) {

                    alert(
                        "Please select your resume PDF."
                    );

                    return;
                }


                const resumeFile =
                    resumeInput.files[0];


                // Check PDF
                if (
                    resumeFile.type !==
                    "application/pdf"
                ) {

                    alert(
                        "Only PDF resumes are allowed."
                    );

                    return;
                }


                // Check 5 MB limit
                if (
                    resumeFile.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "Resume must be smaller than 5 MB."
                    );

                    return;
                }


                // Create FormData
                const formData =
                    new FormData();


                formData.append(
                    "jobId",
                    selectedJobId
                );


                formData.append(
                    "applicantId",
                    loggedInUser.id
                );


                formData.append(
                    "resume",
                    resumeFile
                );


                const response =
                    await fetch(
                        `${API_BASE}/applications`,
                        {
                            method: "POST",

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to submit application."
                    );

                    return;
                }


                alert(
                    "Application submitted successfully! 🎉"
                );


                applyForm.reset();


                applyModal.classList.remove(
                    "show"
                );


            } catch (error) {

                console.error(
                    "Application error:",
                    error
                );

                alert(
                    "Something went wrong. Please try again."
                );

            }

        }
    );

}
// ==============================
// SAVED JOBS
// ==============================

const savedJobsBtn =
    document.getElementById(
        "savedJobsBtn"
    );


if (savedJobsBtn) {

    savedJobsBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const savedIds =
                JSON.parse(
                    localStorage.getItem(
                        "savedJobs"
                    )
                ) || [];


            const saved =
                allJobs.filter(
                    function (job) {

                        return savedIds.includes(
                            job._id
                        );

                    }
                );


            displayJobs(saved);

        }
    );

}


// ==============================
// LOAD JOBS
// ==============================

loadJobs();
// ==============================
// PROFILE MODAL
// ==============================

const profileModal =
    document.getElementById("profileModal");

const openProfileBtn =
    document.getElementById("openProfileBtn");

const closeProfileBtn =
    document.getElementById("closeProfileBtn");

const cancelProfileBtn =
    document.getElementById("cancelProfileBtn");


// OPEN PROFILE

if (openProfileBtn && profileModal) {

    openProfileBtn.addEventListener("click", function () {

        profileModal.classList.add("show");

        // Close user dropdown
        if (userDropdown) {
            userDropdown.classList.remove("show");
        }

    });

}


// CLOSE PROFILE

function closeProfileModal() {

    if (profileModal) {
        profileModal.classList.remove("show");
    }

}


if (closeProfileBtn) {

    closeProfileBtn.addEventListener(
        "click",
        closeProfileModal
    );

}


if (cancelProfileBtn) {

    cancelProfileBtn.addEventListener(
        "click",
        closeProfileModal
    );

}


// CLOSE WHEN CLICKING OUTSIDE

if (profileModal) {

    profileModal.addEventListener("click", function (event) {

        if (event.target === profileModal) {

            closeProfileModal();

        }

    });


}
// ==============================
// LOAD & SAVE PROFILE
// ==============================

const profileForm =
    document.getElementById("profileForm");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");

const profileLocation =
    document.getElementById("profileLocation");

const profileEducation =
    document.getElementById("profileEducation");

const profileExperience =
    document.getElementById("profileExperience");

const profileSkills =
    document.getElementById("profileSkills");

const profileAbout =
    document.getElementById("profileAbout");


// BACKEND URL
const API_BASE =
    "https://job-portal-1-5gno.onrender.com/api";


// LOAD PROFILE
console.log("Logged in user:", loggedInUser);
console.log("User ID:", loggedInUser?.id);

async function loadProfile() {

    if (!loggedInUser || !loggedInUser.id) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/auth/profile/${loggedInUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        const user = data.user;
        updateProfileCompletion(user);


        if (profileName) {
            profileName.value = user.name || "";
        }

        if (profileEmail) {
            profileEmail.value = user.email || "";
        }

        if (profilePhone) {
            profilePhone.value = user.phone || "";
        }

        if (profileLocation) {
            profileLocation.value = user.location || "";
        }

        if (profileEducation) {
            profileEducation.value = user.education || "";
        }

        if (profileExperience) {
            profileExperience.value = user.experience || "";
        }

        if (profileSkills) {
            profileSkills.value =
                Array.isArray(user.skills)
                    ? user.skills.join(", ")
                    : "";
        }

        if (profileAbout) {
            profileAbout.value = user.about || "";
        }


    } catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

    }}
    


// SAVE PROFILE

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!loggedInUser || !loggedInUser.id) {

                alert("Please login again.");

                return;
            }


            const skillsArray =
                profileSkills.value
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "");


            const profileData = {

                name: profileName.value.trim(),

                phone: profilePhone.value.trim(),

                location: profileLocation.value.trim(),

                education: profileEducation.value.trim(),

                skills: skillsArray,

                experience: profileExperience.value.trim(),

                about: profileAbout.value.trim()

            };


            try {

                const response = await fetch(
                    `${API_BASE}/auth/profile/${loggedInUser.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(profileData)
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to update profile."
                    );

                    return;
                }


                // Update local user information

                loggedInUser.name =
                    data.user.name;

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(loggedInUser)
                );


                // Update navbar name

                if (loggedInUserName) {

                    loggedInUserName.textContent =
                        data.user.name;

                }

                if (dropdownUserName) {

                    dropdownUserName.textContent =
                        data.user.name;

                }


                alert(
                    "Profile updated successfully!"
                );


                closeProfileModal();


            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );

                alert(
                    "Unable to connect to server."
                );

            }

        }
    );

}// ==============================
// UPDATE PROFILE COMPLETION
// ==============================

function updateProfileCompletion(user) {

    console.log("PROFILE DATA:", user);

    const fields = [
        user?.name,
        user?.email,
        user?.phone,
        user?.location,
        user?.education,
        user?.experience,
        user?.skills?.length > 0 ? "skills" : "",
        user?.about
    ];

    const completed = fields.filter(field => {

        if (Array.isArray(field)) {
            return field.length > 0;
        }

        return field !== undefined &&
               field !== null &&
               String(field).trim() !== "";

    }).length;

    const percentage =
        Math.round((completed / 8) * 100);

    console.log("PROFILE COMPLETION:", percentage + "%");


    const percentElement =
        document.getElementById(
            "profileCompletionPercent"
        );

    const progressElement =
        document.getElementById(
            "profileProgressBar"
        );

    console.log(
        "Percentage element:",
        percentElement
    );

    console.log(
        "Progress element:",
        progressElement
    );


    if (percentElement) {
        percentElement.textContent =
            percentage + "%";
    }

    if (progressElement) {
        progressElement.style.width =
            percentage + "%";
    }
}
if (profileForm) {

    profileForm.addEventListener("submit", async function (event) {
        // ...
    });

}


// Load profile when dashboard opens
loadProfile();

// ==============================
// MY APPLICATIONS - ISOLATED
// ==============================

(function () {

    const myAppsButton =
        document.getElementById("applicationsMenuBtn");

    const myAppsSection =
        document.getElementById("myApplicationsSection");

    const myAppsBackButton =
        document.getElementById("backToJobsBtn");

    if (!myAppsButton || !myAppsSection) {
        console.log("My Applications elements not found.");
        return;
    }


    // OPEN MY APPLICATIONS

    myAppsButton.addEventListener(
        "click",
        async function (event) {

            // Stop other click handlers
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();


            console.log("My Applications clicked");


            // Show applications section
            myAppsSection.style.display = "block";


            // Hide job cards area
            const jobArea =
                document.querySelector(".jobs-section");

            if (jobArea) {
                jobArea.style.display = "none";
            }


            // Close user dropdown
            const dropdown =
                document.getElementById("userDropdown");

            if (dropdown) {
                dropdown.classList.remove("show");
            }


            // Get logged-in user WITHOUT declaring loggedInUser
            const storedUser =
                localStorage.getItem("loggedInUser");

            if (!storedUser) {

                console.log(
                    "No logged-in user found."
                );

                return;
            }


            const currentUser =
                JSON.parse(storedUser);


            // Load applications
            const applicationsContainer =
                document.getElementById(
                    "applicationsContainer"
                );


            if (!applicationsContainer) {
                return;
            }


            applicationsContainer.innerHTML =
                "<p>Loading applications...</p>";


            try {

                const response =
                    await fetch(
                        `${API_BASE}/applications/user/${currentUser.id}`
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load applications"
                    );

                }


                console.log(
                    "Applications received:",
                    data.applications
                );


                if (
                    !data.applications ||
                    data.applications.length === 0
                ) {

                    applicationsContainer.innerHTML = `
                        <div class="no-applications">
                            <h3>No applications yet</h3>
                            <p>
                                You haven't applied for any jobs yet.
                            </p>
                        </div>
                    `;

                    return;
                }


                applicationsContainer.innerHTML =
                    data.applications
                        .map(function (application) {

                            const job =
                                application.job;

                            return `
                                <div class="application-card">

                                    <div class="application-card-info">

                                        <h3>
                                            ${job?.title || "Job"}
                                        </h3>

                                        <p>
                                            ${job?.company || "Company"}
                                        </p>

                                        <span>
                                            📍 ${job?.location || "Location not available"}
                                        </span>

                                    </div>

                                    <div class="application-card-status">

                                        <span class="application-status">
                                            ${application.status}
                                        </span>

                                        <small>
                                            Applied:
                                            ${new Date(
                                                application.appliedAt
                                            ).toLocaleDateString()}
                                        </small>

                                    </div>

                                </div>
                            `;

                        })
                        .join("");


            } catch (error) {

                console.error(
                    "My Applications error:",
                    error
                );


                applicationsContainer.innerHTML = `
                    <div class="no-applications">
                        <h3>Unable to load applications</h3>
                        <p>
                            Please try again.
                        </p>
                    </div>
                `;

            }
            

        },
        true
    );


    // BACK TO JOBS

    if (myAppsBackButton) {

        myAppsBackButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                myAppsSection.style.display =
                    "none";


                const jobArea =
                    document.querySelector(".jobs-section");


                if (jobArea) {

                    jobArea.style.display =
                        "block";

                }

            }
        );

    }

})();