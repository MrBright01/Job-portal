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

// For now, anything that is not employer
// will be sent to the job seeker dashboard.

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


// ==============================
// SHOW POST JOB FORM
// ==============================

showPostJobBtn.addEventListener(
    "click",
    function () {

        postJobSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ==============================
// CANCEL POST JOB
// ==============================

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


// ==============================
// LOAD JOBS
// ==============================

async function loadEmployerJobs() {

    employerJobsContainer.innerHTML =
        `<p class="loading">Loading jobs...</p>`;

    try {

        const response =
            await fetch(
                fetch("https://job-portal-1-5gno.onrender.com/api/jobs")
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
        // FILTER EMPLOYER JOBS
        // ==============================

        /*
            This part supports employerId
            if your backend provides it.

            If your current jobs don't have
            employerId yet, all jobs will be
            displayed temporarily.
        */

        let employerJobs = jobs;


        if (loggedInUser.id) {

            const filteredJobs =
                jobs.filter(function (job) {

                    return (
                        job.employerId ===
                        loggedInUser.id ||

                        job.employerId ===
                        loggedInUser._id
                    );

                });


            // Only filter if matching jobs
            // were actually found.
            if (filteredJobs.length > 0) {

                employerJobs =
                    filteredJobs;

            }

        }


        // ==============================
        // UPDATE STATISTICS
        // ==============================

        totalJobs.textContent =
            employerJobs.length;


        activeJobs.textContent =
            employerJobs.length;


        // Applications will be connected
        // later with the application API.

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


            // Skills

            let skillsText = "";

            if (Array.isArray(job.skills)) {

                skillsText =
                    job.skills.join(", ");

            } else {

                skillsText =
                    job.skills || "";

            }


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
                    💼 ${job.type || "Full Time"}
                </p>

                <p>
                    🏷️ ${job.category || "Other"}
                </p>

                <p>
                    🛠️ ${skillsText}
                </p>

                <div class="job-actions">

                    <button
                        class="secondary-btn delete-job-btn"
                        data-id="${job._id || job.id}"
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


        const type =
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

            category: category,

            location: location,

            salary: salary,

            type: type,

            skills: skills,

            description: description,

            // Send employer information
            // if backend supports it.

            employerId:
                loggedInUser.id ||
                loggedInUser._id,

            employerName:
                loggedInUser.name

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

refreshJobs.addEventListener(
    "click",
    function () {

        loadEmployerJobs();

    }
);


// ==============================
// INITIAL LOAD
// ==============================

loadEmployerJobs();

// ==============================
// POST JOB NAV BUTTON
// ==============================

const postJobNavBtn =
    document.getElementById("postJobNavBtn");

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
    document.getElementById("myJobsNavBtn");

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