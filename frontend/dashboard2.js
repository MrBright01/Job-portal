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
// UPDATE APPLICATION STATUS
// =========================================

router.put("/:applicationId/status", async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Accepted",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application =
            await Application.findByIdAndUpdate(
                req.params.applicationId,
                {
                    status: status
                },
                {
                    new: true
                }
            );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: `Application ${status.toLowerCase()} successfully`,
            application
        });

    } catch (error) {

        console.error(
            "Update application status error:",
            error
        );

        res.status(500).json({
            message: "Failed to update application status"
        });
    }
});

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