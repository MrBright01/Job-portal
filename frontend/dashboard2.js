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


        const activeJobCount =
            employerJobs.filter(function (job) {

                return job.status !== "Closed";

            }).length;


        activeJobs.textContent =
            activeJobCount;


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
            // JOB STATUS
            // ==============================

            const jobStatus =
                job.status || "Active";


            const isClosed =
                jobStatus === "Closed";


            const statusClass =
                isClosed
                    ? "job-status-closed"
                    : "job-status-active";


            const statusIcon =
                isClosed
                    ? "🔴"
                    : "🟢";


            const toggleButtonText =
                isClosed
                    ? "▶️ Reopen Job"
                    : "⏸️ Close Job";


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


                <span
                    class="job-status-badge ${statusClass}"
                >
                    ${statusIcon}
                    ${jobStatus}
                </span>


                <div class="job-actions">

                    <button
                        class="secondary-btn edit-job-btn"
                        data-id="${job._id}"
                        type="button"
                    >
                        ✏️ Edit Job
                    </button>


                    <button
                        class="secondary-btn toggle-job-btn"
                        data-id="${job._id}"
                        data-status="${jobStatus}"
                        type="button"
                    >
                        ${toggleButtonText}
                    </button>


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
                        🗑️ Delete
                    </button>

                </div>

            `;


            employerJobsContainer.appendChild(
                jobCard
            );

        });


        // ==============================
        // EDIT BUTTONS
        // ==============================

        const editButtons =
            employerJobsContainer.querySelectorAll(
                ".edit-job-btn"
            );


        editButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;


                    const selectedJob =
                        employerJobs.find(
                            function (job) {

                                return (
                                    String(job._id) ===
                                    String(jobId)
                                );

                            }
                        );


                    if (!selectedJob) {

                        alert(
                            "Job details could not be found."
                        );

                        return;

                    }


                    openEditJobModal(
                        selectedJob
                    );

                }
            );

        });


        // ==============================
        // CLOSE / REOPEN BUTTONS
        // ==============================

        const toggleButtons =
            employerJobsContainer.querySelectorAll(
                ".toggle-job-btn"
            );


        toggleButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;


                    const currentStatus =
                        button.dataset.status;


                    const newStatus =
                        currentStatus === "Closed"
                            ? "Active"
                            : "Closed";


                    updateJobStatus(
                        jobId,
                        newStatus
                    );

                }
            );

        });


        // ==============================
        // DELETE BUTTONS
        // ==============================

        const deleteButtons =
            employerJobsContainer.querySelectorAll(
                ".delete-job-btn"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;


                    deleteJob(
                        jobId
                    );

                }
            );

        });


        // ==============================
        // APPLICANT BUTTONS
        // ==============================

        const applicantButtons =
            employerJobsContainer.querySelectorAll(
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

    }

}
// ==============================
// EDIT JOB MODAL
// ==============================

const editJobModal =
    document.getElementById(
        "editJobModal"
    );

const editJobOverlay =
    document.getElementById(
        "editJobOverlay"
    );

const closeEditJobModalBtn =
    document.getElementById(
        "closeEditJobModal"
    );

const cancelEditJob =
    document.getElementById(
        "cancelEditJob"
    );

const editJobForm =
    document.getElementById(
        "editJobForm"
    );


// ==============================
// CURRENT EDITING JOB
// ==============================

let editingJobId = null;


// ==============================
// OPEN EDIT MODAL
// ==============================

function openEditJobModal(job) {

    if (!editJobModal) {
        return;
    }


    editingJobId =
        job._id;


    document.getElementById(
        "editJobTitle"
    ).value =
        job.title || "";


    document.getElementById(
        "editJobCompany"
    ).value =
        job.company || "";


    document.getElementById(
        "editJobCategory"
    ).value =
        job.category || "Other";


    document.getElementById(
        "editJobType"
    ).value =
        job.jobType || "Full Time";


    document.getElementById(
        "editJobLocation"
    ).value =
        job.location || "";


    document.getElementById(
        "editJobSalary"
    ).value =
        job.salary || "";


    document.getElementById(
        "editJobSkills"
    ).value =
        Array.isArray(job.skills)
            ? job.skills.join(", ")
            : (job.skills || "");


    document.getElementById(
        "editJobDescription"
    ).value =
        job.description || "";


    editJobModal.classList.add(
        "show"
    );


    document.body.classList.add(
        "edit-job-modal-open"
    );

}


// ==============================
// CLOSE EDIT MODAL
// ==============================

function closeEditJobModal() {

    if (!editJobModal) {
        return;
    }


    editJobModal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "edit-job-modal-open"
    );


    editingJobId = null;


    if (editJobForm) {
        editJobForm.reset();
    }

}


if (closeEditJobModalBtn) {

    closeEditJobModalBtn.addEventListener(
        "click",
        closeEditJobModal
    );

}


if (cancelEditJob) {

    cancelEditJob.addEventListener(
        "click",
        closeEditJobModal
    );

}


if (editJobOverlay) {

    editJobOverlay.addEventListener(
        "click",
        closeEditJobModal
    );

}


// ==============================
// SAVE EDITED JOB
// ==============================

if (editJobForm) {

    editJobForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!editingJobId) {

                alert(
                    "Job ID is missing."
                );

                return;

            }


            const skillsInput =
                document.getElementById(
                    "editJobSkills"
                ).value.trim();


            const skills =
                skillsInput
                    .split(",")
                    .map(function (skill) {

                        return skill.trim();

                    })
                    .filter(function (skill) {

                        return skill !== "";

                    });


            const updatedJobData = {

                title:
                    document.getElementById(
                        "editJobTitle"
                    ).value.trim(),

                company:
                    document.getElementById(
                        "editJobCompany"
                    ).value.trim(),

                location:
                    document.getElementById(
                        "editJobLocation"
                    ).value.trim(),

                salary:
                    document.getElementById(
                        "editJobSalary"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "editJobDescription"
                    ).value.trim(),

                skills:
                    skills,

                jobType:
                    document.getElementById(
                        "editJobType"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        `https://job-portal-1-5gno.onrender.com/api/jobs/${editingJobId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    updatedJobData
                                )
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to update job."
                    );

                }


                alert(
                    "Job updated successfully! ✅"
                );


                closeEditJobModal();


                loadEmployerJobs();

            }

            catch (error) {

                console.error(
                    "Edit job error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to update job."
                );

            }

        }
    );

}


// ==============================
// CHANGE JOB STATUS
// ==============================

async function updateJobStatus(
    jobId,
    newStatus
) {

    const actionText =
        newStatus === "Closed"
            ? "close"
            : "reopen";


    const confirmed =
        confirm(
            `Are you sure you want to ${actionText} this job?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://job-portal-1-5gno.onrender.com/api/jobs/${jobId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            status:
                                newStatus
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update job status."
            );

        }


        alert(
            `Job ${newStatus.toLowerCase()} successfully!`
        );


        loadEmployerJobs();

    }

    catch (error) {

        console.error(
            "Job status error:",
            error
        );


        alert(
            error.message ||
            "Unable to update job status."
        );

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
// EMPLOYER PROFILE MODAL
// ==============================

const userButton =
    document.getElementById("userButton");

const userDropdown =
    document.getElementById("userDropdown");

const profileBtn =
    document.getElementById("profileBtn");

const profileModal =
    document.getElementById("employerProfile");

const profileModalOverlay =
    document.getElementById("profileModalOverlay");

const closeProfileModal =
    document.getElementById("closeProfileModal");

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
// LOAD PROFILE FROM SERVER
// ==============================

async function loadEmployerProfile() {

    if (!loggedInUser || !loggedInUser.id) {
        return;
    }

    try {

        const response = await fetch(
            `https://job-portal-1-5gno.onrender.com/api/auth/profile/${loggedInUser.id}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load profile"
            );
        }

        const user = data.user;

        // Update local logged-in user
        Object.assign(loggedInUser, {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || "",
            location: user.location || "",
            company: user.company || "",
            education: user.education || "",
            skills: user.skills || [],
            experience: user.experience || "",
            about: user.about || "",
            profilePhoto: user.profilePhoto || ""
        });

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );


        // ==============================
        // DISPLAY PROFILE
        // ==============================

        profileName.textContent =
            user.name || "Employer";

        profileFullName.textContent =
            user.name || "Not provided";

        profileEmail.textContent =
            user.email || "Not provided";

        profilePhone.textContent =
            user.phone || "Not provided";

        profileLocation.textContent =
            user.location || "Not provided";

        profileCompany.textContent =
            user.company || "Not provided";

        profileAbout.textContent =
            user.about ||
            "No information added yet.";


    } catch (error) {

        console.error(
            "LOAD PROFILE ERROR:",
            error
        );

        alert(
            "Unable to load your profile. Please try again."
        );
    }
}


// ==============================
// OPEN USER DROPDOWN
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

            userDropdown.classList.remove(
                "show"
            );

        }

    }
);


// ==============================
// OPEN MY PROFILE MODAL
// ==============================

if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        async function () {

            // Close dropdown
            if (userDropdown) {

                userDropdown.classList.remove(
                    "show"
                );

            }

            // Open modal
            if (profileModal) {

                profileModal.classList.add(
                    "show"
                );

                document.body.classList.add(
                    "profile-modal-open"
                );

            }

            // Load fresh data from MongoDB
            await loadEmployerProfile();

        }
    );

}


// ==============================
// CLOSE PROFILE MODAL
// ==============================

function closeEmployerProfile() {

    if (profileModal) {

        profileModal.classList.remove(
            "show"
        );

    }

    document.body.classList.remove(
        "profile-modal-open"
    );

}


// Close button

if (closeProfileModal) {

    closeProfileModal.addEventListener(
        "click",
        closeEmployerProfile
    );

}


// Close when clicking outside

if (profileModalOverlay) {

    profileModalOverlay.addEventListener(
        "click",
        closeEmployerProfile
    );

}


// Close with Escape key

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            profileModal &&
            profileModal.classList.contains("show")
        ) {

            closeEmployerProfile();

        }

    }
);


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
                loggedInUser.phone || "";

            editProfileLocation.value =
                loggedInUser.location || "";

            editCompanyName.value =
                loggedInUser.company || "";

            editAbout.value =
                loggedInUser.about || "";


            editProfileForm.style.display =
                "block";

            editProfileBtn.style.display =
                "none";


            editProfileForm.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
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
// SAVE PROFILE TO SERVER
// ==============================

if (editProfileForm) {

    editProfileForm.addEventListener(
        "submit",
        async function (event) {

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


            // Required fields

            if (
                !updatedName ||
                !updatedEmail
            ) {

                alert(
                    "Name and email are required."
                );

                return;

            }


            // Disable button while saving

            const saveProfileBtn =
                document.getElementById(
                    "saveProfileBtn"
                );

            if (saveProfileBtn) {

                saveProfileBtn.disabled =
                    true;

                saveProfileBtn.textContent =
                    "Saving...";

            }


            try {

                const response =
                    await fetch(
                        `https://job-portal-1-5gno.onrender.com/api/auth/profile/${loggedInUser.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name:
                                    updatedName,

                                phone:
                                    updatedPhone,

                                location:
                                    updatedLocation,

                                company:
                                    updatedCompany,

                                about:
                                    updatedAbout

                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Profile update failed"
                    );

                }


                // ==============================
                // UPDATE LOCAL STORAGE
                // ==============================

                const updatedUser =
                    data.user;

                Object.assign(
                    loggedInUser,
                    {
                        id:
                            updatedUser._id ||
                            updatedUser.id,

                        name:
                            updatedUser.name,

                        email:
                            updatedUser.email,

                        role:
                            updatedUser.role,

                        phone:
                            updatedUser.phone ||
                            "",

                        location:
                            updatedUser.location ||
                            "",

                        company:
                            updatedUser.company ||
                            "",

                        about:
                            updatedUser.about ||
                            "",

                        education:
                            updatedUser.education ||
                            "",

                        skills:
                            updatedUser.skills ||
                            [],

                        experience:
                            updatedUser.experience ||
                            "",

                        profilePhoto:
                            updatedUser.profilePhoto ||
                            ""
                    }
                );


                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(
                        loggedInUser
                    )
                );


                // ==============================
                // UPDATE SCREEN
                // ==============================

                if (loggedInUserName) {

                    loggedInUserName.textContent =
                        loggedInUser.name;

                }

                if (welcomeName) {

                    welcomeName.textContent =
                        loggedInUser.name;

                }


                // Reload profile from server

                await loadEmployerProfile();


                // Close edit form

                editProfileForm.style.display =
                    "none";

                editProfileBtn.style.display =
                    "inline-block";


                alert(
                    "Profile updated successfully! 🎉"
                );


            } catch (error) {

                console.error(
                    "SAVE PROFILE ERROR:",
                    error
                );

                alert(
                    "Unable to save profile. Please try again."
                );


            } finally {

                if (saveProfileBtn) {

                    saveProfileBtn.disabled =
                        false;

                    saveProfileBtn.textContent =
                        "Save Profile";

                }

            }

        }
    );

}