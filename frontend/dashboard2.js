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

    console.log(
        "Opening applicants for:",
        jobId
    );


    // This will be connected
    // to the employer applicant API
    // in the next backend step.

    alert(
        "Applicant management is being connected..."
    );

}