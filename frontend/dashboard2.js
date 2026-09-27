// ==============================
// EMPLOYER DASHBOARD
// ==============================


// ==============================
// GET LOGGED-IN USER
// ==============================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));


// ==============================
// CHECK LOGIN
// ==============================

if (!loggedInUser) {

    window.location.href = "index.html";

}


// ==============================
// CHECK EMPLOYER
// ==============================

if (
    loggedInUser &&
    loggedInUser.role !== "employer"
) {

    window.location.href = "dashboard.html";

}


// ==============================
// ELEMENTS
// ==============================

const loggedInUserName =
    document.getElementById("loggedInUserName");

const welcomeName =
    document.getElementById("welcomeName");

const logoutBtn =
    document.getElementById("logoutBtn");

const showPostJobBtn =
    document.getElementById("showPostJobBtn");

const postJobSection =
    document.getElementById("postJobSection");

const postJobForm =
    document.getElementById("postJobForm");

const cancelPostJob =
    document.getElementById("cancelPostJob");

const refreshJobs =
    document.getElementById("refreshJobs");

const employerJobsContainer =
    document.getElementById(
        "employerJobsContainer"
    );

const totalJobs =
    document.getElementById("totalJobs");

const activeJobs =
    document.getElementById("activeJobs");

const totalApplications =
    document.getElementById(
        "totalApplications"
    );


// ==============================
// DISPLAY EMPLOYER NAME
// ==============================

if (loggedInUser) {

    loggedInUserName.textContent =
        loggedInUser.name;

    welcomeName.textContent =
        loggedInUser.name;

}


// ==============================
// LOGOUT
// ==============================

if (logoutBtn) {

    logoutBtn.addEventListener(
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
// SHOW POST JOB FORM
// ==============================

if (showPostJobBtn) {

    showPostJobBtn.addEventListener(
        "click",
        function () {

            postJobSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// ==============================
// CANCEL POST JOB
// ==============================

if (cancelPostJob) {

    cancelPostJob.addEventListener(
        "click",
        function () {

            postJobForm.reset();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


// ==============================
// LOAD EMPLOYER JOBS
// ==============================

async function loadEmployerJobs() {

    employerJobsContainer.innerHTML =
        `<p class="loading">Loading jobs...</p>`;

    try {

        const response =
            await fetch(
                "https://job-portal-1-5gno.onrender.com/api/jobs"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch jobs"
            );

        }


        const jobs =
            await response.json();


        console.log(
            "All jobs:",
            jobs
        );


        // ==============================
        // FILTER ONLY THIS EMPLOYER'S JOBS
        // ==============================

        const employerId =
            loggedInUser.id ||
            loggedInUser._id;


        const employerJobs =
            jobs.filter(function (job) {

                if (!job.postedBy) {
                    return false;
                }


                const postedById =
                    typeof job.postedBy === "object"
                        ? job.postedBy._id
                        : job.postedBy;


                return (
                    String(postedById) ===
                    String(employerId)
                );

            });


        console.log(
            "My employer jobs:",
            employerJobs
        );


        // ==============================
        // UPDATE STATISTICS
        // ==============================

        totalJobs.textContent =
            employerJobs.length;


        activeJobs.textContent =
            employerJobs.length;


        // Applications will be
        // connected in the next step.

        totalApplications.textContent =
            "0";


        // ==============================
        // NO JOBS
        // ==============================

        if (employerJobs.length === 0) {

            employerJobsContainer.innerHTML = `
                <p class="loading">
                    You haven't posted any jobs yet.
                </p>
            `;

            return;

        }


        // ==============================
        // DISPLAY JOBS
        // ==============================

        employerJobsContainer.innerHTML = "";


        employerJobs.forEach(function (job) {

            const jobCard =
                document.createElement("div");

            jobCard.className =
                "job-card";


            // ==============================
            // SKILLS
            // ==============================

            let skillsText = "";

            if (Array.isArray(job.skills)) {

                skillsText =
                    job.skills.join(", ");

            } else {

                skillsText =
                    job.skills || "";

            }


            // ==============================
            // JOB CARD
            // ==============================

            jobCard.innerHTML = `

                <h3>
                    ${job.title || "Untitled Job"}
                </h3>

                <p>
                    <strong>
                        ${job.company || "Company"}
                    </strong>
                </p>

                <p>
                    📍 ${job.location || "Not specified"}
                </p>

                <p>
                    💰 ${job.salary || "Not specified"}
                </p>

                <p>
                    💼 ${job.jobType || "Full-time"}
                </p>

                <p>
                    🛠️ ${skillsText}
                </p>

                <div class="job-actions">

                    <button
                        class="secondary-btn applicants-job-btn"
                        data-id="${job._id}"
                        type="button"
                    >
                        👥 View Applicants
                    </button>

                    <button
                        class="secondary-btn delete-job-btn"
                        data-id="${job._id}"
                        type="button"
                    >
                        Delete
                    </button>

                </div>

            `;


            employerJobsContainer.appendChild(
                jobCard
            );

        });


        // ==============================
        // DELETE BUTTONS
        // ==============================

        const deleteButtons =
            document.querySelectorAll(
                ".delete-job-btn"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;

                    deleteJob(jobId);

                }
            );

        });


        // ==============================
        // APPLICANT BUTTONS
        // ==============================

        const applicantButtons =
            document.querySelectorAll(
                ".applicants-job-btn"
            );


        applicantButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;

                    openApplicants(
                        jobId
                    );

                }
            );

        });

    }

    catch (error) {

        console.error(
            "Load jobs error:",
            error
        );


        employerJobsContainer.innerHTML = `
            <p class="loading">
                Unable to load jobs.
            </p>
        `;
        // =========================================

    }

}
// ==============================
// POST JOB
// ==============================

postJobForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==============================
        // GET FORM DATA
        // ==============================

        const title =
            document
                .getElementById("jobTitle")
                .value
                .trim();


        const company =
            document
                .getElementById("company")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value;


        const jobType =
            document
                .getElementById("jobType")
                .value;


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const salary =
            document
                .getElementById("salary")
                .value
                .trim();


        const skillsInput =
            document
                .getElementById("skills")
                .value
                .trim();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        // ==============================
        // CONVERT SKILLS
        // ==============================

        const skills =
            skillsInput
                .split(",")
                .map(function (skill) {

                    return skill.trim();

                })
                .filter(function (skill) {

                    return skill !== "";

                });


        // ==============================
        // JOB DATA
        // ==============================

        const jobData = {

            title: title,

            company: company,

            location: location,

            salary: salary,

            description: description,

            skills: skills,

            jobType: jobType,

            // IMPORTANT:
            // Connect job to employer

            postedBy:
                loggedInUser.id ||
                loggedInUser._id

        };


        console.log(
            "Posting job:",
            jobData
        );


        try {

            const response =
                await fetch(
                    "https://job-portal-1-5gno.onrender.com/api/jobs",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                jobData
                            )
                    }
                );


            const data =
                await response.json();


            // ==============================
            // SERVER ERROR
            // ==============================

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to post job."
                );

                return;

            }


            // ==============================
            // SUCCESS
            // ==============================

            alert(
                "Job posted successfully! 🎉"
            );


            console.log(
                "Job created:",
                data
            );


            postJobForm.reset();


            // Reload jobs

            loadEmployerJobs();

        }

        catch (error) {

            console.error(
                "Post job error:",
                error
            );


            alert(
                "Unable to connect to the server."
            );

        }

    }
);


// ==============================
// DELETE JOB
// ==============================

async function deleteJob(jobId) {

    if (!jobId) {

        alert(
            "Job ID is missing."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this job?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `https://job-portal-1-5gno.onrender.com/api/jobs/${jobId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete job."
            );

            return;

        }


        alert(
            "Job deleted successfully."
        );


        loadEmployerJobs();

    }

    catch (error) {

        console.error(
            "Delete job error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// ==============================
// REFRESH JOBS
// ==============================

if (refreshJobs) {

    refreshJobs.addEventListener(
        "click",
        function () {

            loadEmployerJobs();

        }
    );

}


// ==============================
// INITIAL LOAD
// ==============================

loadEmployerJobs();


// ==============================
// POST JOB NAV BUTTON
// ==============================

const postJobNavBtn =
    document.getElementById(
        "postJobNavBtn"
    );

if (postJobNavBtn) {

    postJobNavBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            postJobSection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// ==============================
// MY JOBS NAV BUTTON
// ==============================

const myJobsNavBtn =
    document.getElementById(
        "myJobsNavBtn"
    );

if (myJobsNavBtn) {

    myJobsNavBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            document
                .querySelector(".jobs-section")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}

// ==============================
// OPEN APPLICANTS
// ==============================

async function openApplicants(jobId) {

    const applicantsContainer =
        document.getElementById("applicantsContainer");

    if (!applicantsContainer) {
        alert("Applicants section not found.");
        return;
    }

    applicantsContainer.innerHTML = `
        <p class="loading">
            Loading applicants...
        </p>
    `;

    document
        .getElementById("applicants")
        .scrollIntoView({
            behavior: "smooth"
        });

    try {

        const response = await fetch(
            `https://job-portal-1-5gno.onrender.com/api/applications/job/${jobId}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to load applicants"
            );
        }

        const applications =
            data.applications || [];


        // ==============================
        // NO APPLICANTS
        // ==============================

        if (applications.length === 0) {

            applicantsContainer.innerHTML = `
                <div class="empty-applicants">

                    <h3>
                        No Applicants Yet
                    </h3>

                    <p>
                        No one has applied for this job yet.
                    </p>

                </div>
            `;

            return;
        }


        // ==============================
        // DISPLAY APPLICANTS
        // ==============================

        applicantsContainer.innerHTML = `

            <div class="applicants-header">

                <h3>
                    Applicants (${applications.length})
                </h3>

            </div>


            <div class="applicants-list">

                ${applications.map(application => {

                    const applicant =
                        application.applicant || {};

                    return `

                        <div class="applicant-card">

                            <div class="applicant-info">

                                <h3>
                                    ${applicant.name ||
                                    "Unknown Applicant"}
                                </h3>

                                <p>
                                    📧
                                    ${applicant.email ||
                                    "No email"}
                                </p>

                                <p>
                                    📞
                                    ${applicant.phone ||
                                    "No phone"}
                                </p>

                                <p>
                                    📍
                                    ${applicant.location ||
                                    "Location not provided"}
                                </p>

                                <p>
                                    🎓
                                    ${applicant.education ||
                                    "Education not provided"}
                                </p>

                                <p>
                                    💼
                                    ${applicant.experience ||
                                    "Education not provided"}
                                </p>

                            </div>


                            <div class="application-status">

                                <span class="status-badge">
                                    ${application.status}
                                </span>

                                <p>
                                    Applied:
                                    ${new Date(
                                        application.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </div>


                            <!-- =========================
                                 ACTION BUTTONS
                            ========================== -->

                            <div class="applicant-actions">

                                <button
                                    class="shortlist-btn"
                                    data-id="${application._id}"
                                >
                                    Shortlist
                                </button>


                                <button
                                    class="accept-btn"
                                    data-id="${application._id}"
                                >
                                    Accept
                                </button>


                                <button
                                    class="reject-btn"
                                    data-id="${application._id}"
                                >
                                    Reject
                                </button>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        `;


        // ==============================
        // SHORTLIST BUTTONS
        // ==============================

        applicantsContainer
            .querySelectorAll(".shortlist-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        updateApplicationStatus(
                            this.dataset.id,
                            "Shortlisted",
                            jobId
                        );

                    }
                );

            });


        // ==============================
        // ACCEPT BUTTONS
        // ==============================

        applicantsContainer
            .querySelectorAll(".accept-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        updateApplicationStatus(
                            this.dataset.id,
                            "Accepted",
                            jobId
                        );

                    }
                );

            });


        // ==============================
        // REJECT BUTTONS
        // ==============================

        applicantsContainer
            .querySelectorAll(".reject-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        updateApplicationStatus(
                            this.dataset.id,
                            "Rejected",
                            jobId
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Load applicants error:",
            error
        );

        applicantsContainer.innerHTML = `
            <div class="error-message">

                <h3>
                    Failed to Load Applicants
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

    }
}
async function updateApplicationStatus(
    applicationId,
    status,
    jobId
) {
    try {

        const confirmed = confirm(
            `Are you sure you want to mark this application as ${status}?`
        );

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `https://job-portal-1-5gno.onrender.com/api/applications/${applicationId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to update application"
            );
        }

        alert(
            `Application ${status.toLowerCase()} successfully!`
        );

        // Reload applicants
        openApplicants(jobId);

    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            "Failed to update application status."
        );
    }
}

// ==============================
// NOTIFICATION UI
// ==============================

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationPanel =
    document.getElementById("notificationPanel");

const markAllRead =
    document.getElementById("markAllRead");

const notificationBadge =
    document.getElementById("notificationBadge");


// OPEN / CLOSE NOTIFICATIONS

if (notificationBtn) {

    notificationBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        notificationPanel.classList.toggle("show");

    });

}


// CLOSE WHEN CLICKING OUTSIDE

document.addEventListener("click", function (event) {

    if (
        notificationPanel &&
        !notificationPanel.contains(event.target) &&
        !notificationBtn.contains(event.target)
    ) {

        notificationPanel.classList.remove("show");

    }

});


// MARK ALL AS READ

if (markAllRead) {

    markAllRead.addEventListener("click", function () {

        const unreadNotifications =
            document.querySelectorAll(".notification.unread");

        unreadNotifications.forEach(function (notification) {

            notification.classList.remove("unread");

        });

        notificationBadge.textContent = "0";

        notificationBadge.style.display = "none";

    });


}
// ==============================
// EMPLOYER PROFILE
// ==============================

const userButton =
    document.getElementById("userButton");

const userDropdown =
    document.getElementById("userDropdown");

const profileBtn =
    document.getElementById("profileBtn");

const editProfileBtn =
    document.getElementById("editProfileBtn");

const editProfileForm =
    document.getElementById("editProfileForm");

const cancelEditProfile =
    document.getElementById("cancelEditProfile");


// ==============================
// PROFILE ELEMENTS
// ==============================

const profileName =
    document.getElementById("profileName");

const profileFullName =
    document.getElementById("profileFullName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");

const profileLocation =
    document.getElementById("profileLocation");

const profileCompany =
    document.getElementById("profileCompany");

const profileAbout =
    document.getElementById("profileAbout");


// ==============================
// EDIT FORM ELEMENTS
// ==============================

const editProfileName =
    document.getElementById("editProfileName");

const editProfileEmail =
    document.getElementById("editProfileEmail");

const editProfilePhone =
    document.getElementById("editProfilePhone");

const editProfileLocation =
    document.getElementById("editProfileLocation");

const editCompanyName =
    document.getElementById("editCompanyName");

const editAbout =
    document.getElementById("editAbout");


// ==============================
// SHOW PROFILE DATA
// ==============================

function loadEmployerProfile() {

    if (!loggedInUser) {
        return;
    }


    profileName.textContent =
        loggedInUser.name || "Employer";


    profileFullName.textContent =
        loggedInUser.name || "Not provided";


    profileEmail.textContent =
        loggedInUser.email || "Not provided";


    profilePhone.textContent =
        loggedInUser.phone ||
        loggedInUser.profile?.phone ||
        "Not provided";


    profileLocation.textContent =
        loggedInUser.location ||
        loggedInUser.profile?.location ||
        "Not provided";


    profileCompany.textContent =
        loggedInUser.company ||
        loggedInUser.companyName ||
        loggedInUser.profile?.company ||
        "Not provided";


    profileAbout.textContent =
        loggedInUser.about ||
        loggedInUser.profile?.about ||
        "No information added yet.";

}


// ==============================
// OPEN USER DROPDOWN
// ==============================

if (userButton && userDropdown) {

    userButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            userDropdown.classList.toggle("show");

        }
    );

}


// ==============================
// CLOSE USER DROPDOWN
// ==============================

document.addEventListener(
    "click",
    function (event) {

        if (
            userDropdown &&
            userButton &&
            !userDropdown.contains(event.target) &&
            !userButton.contains(event.target)
        ) {

            userDropdown.classList.remove("show");

        }

    }
);


// ==============================
// OPEN MY PROFILE
// ==============================

if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        function () {

            if (userDropdown) {
                userDropdown.classList.remove("show");
            }


            const profileSection =
                document.getElementById(
                    "employerProfile"
                );


            if (profileSection) {

                profileSection.scrollIntoView({
                    behavior: "smooth"
                });

            }


            loadEmployerProfile();

        }
    );

}


// ==============================
// OPEN EDIT PROFILE
// ==============================

if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        function () {

            editProfileName.value =
                loggedInUser.name || "";

            editProfileEmail.value =
                loggedInUser.email || "";

            editProfilePhone.value =
                loggedInUser.phone ||
                loggedInUser.profile?.phone ||
                "";

            editProfileLocation.value =
                loggedInUser.location ||
                loggedInUser.profile?.location ||
                "";

            editCompanyName.value =
                loggedInUser.company ||
                loggedInUser.companyName ||
                loggedInUser.profile?.company ||
                "";

            editAbout.value =
                loggedInUser.about ||
                loggedInUser.profile?.about ||
                "";


            editProfileForm.style.display =
                "block";


            editProfileBtn.style.display =
                "none";


            editProfileForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


// ==============================
// CANCEL EDIT
// ==============================

if (cancelEditProfile) {

    cancelEditProfile.addEventListener(
        "click",
        function () {

            editProfileForm.style.display =
                "none";


            editProfileBtn.style.display =
                "inline-block";

        }
    );

}


// ==============================
// SAVE PROFILE
// ==============================

if (editProfileForm) {

    editProfileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const updatedName =
                editProfileName.value.trim();

            const updatedEmail =
                editProfileEmail.value.trim();

            const updatedPhone =
                editProfilePhone.value.trim();

            const updatedLocation =
                editProfileLocation.value.trim();

            const updatedCompany =
                editCompanyName.value.trim();

            const updatedAbout =
                editAbout.value.trim();


            if (!updatedName || !updatedEmail) {

                alert(
                    "Name and email are required."
                );

                return;

            }


            // ==============================
            // UPDATE LOCAL USER
            // ==============================

            loggedInUser.name =
                updatedName;

            loggedInUser.email =
                updatedEmail;

            loggedInUser.phone =
                updatedPhone;

            loggedInUser.location =
                updatedLocation;

            loggedInUser.company =
                updatedCompany;

            loggedInUser.about =
                updatedAbout;


            // Save locally

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(
                    loggedInUser
                )
            );


            // Update navbar

            if (loggedInUserName) {

                loggedInUserName.textContent =
                    updatedName;

            }


            // Update welcome message

            if (welcomeName) {

                welcomeName.textContent =
                    updatedName;

            }


            // Update profile

            loadEmployerProfile();


            // Close edit form

            editProfileForm.style.display =
                "none";


            editProfileBtn.style.display =
                "inline-block";


            alert(
                "Profile updated successfully! 🎉"
            );

        }
    );

}


// ==============================
// INITIAL PROFILE LOAD
// ==============================

loadEmployerProfile();