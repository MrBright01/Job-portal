// ==============================
// JOB SEEKER DASHBOARD
// ==============================

// ==============================
// LOGIN CHECK
// ==============================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    window.location.href = "home.html";
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
// USER NAME
// ==============================

const loggedInUserName =
    document.getElementById("loggedInUserName");

if (loggedInUserName && loggedInUser) {
    loggedInUserName.textContent =
        loggedInUser.name;
}


// ==============================
// LOGOUT
// ==============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "home.html";

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
                "http://localhost:5000/api/jobs"
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


function openApplyModal(job) {

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
        function (event) {

            event.preventDefault();


            alert(
                "Application submitted successfully! 🎉"
            );


            applyForm.reset();


            applyModal.classList.remove(
                "show"
            );

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