// ==============================
// JOB DATA
// ==============================

const jobsData = [

    {
        title: "Frontend Developer",
        company: "Google",
        category: "Frontend",
        location: "Bangalore, India",
        salary: "₹8–12 LPA",
        type: "Full Time",
        logo: "G",
        logoClass: "google",
        skills: ["React", "JavaScript", "CSS"]
    },

    {
        title: "Backend Developer",
        company: "TATA",
        category: "Backend",
        location: "Bangalore, India",
        salary: "₹7–11 LPA",
        type: "Full Time",
        logo: "T",
        logoClass: "tata",
        skills: ["Node.js", "Java", "MongoDB"]
    },

    {
        title: "UI/UX Designer",
        company: "Adobe",
        category: "UI/UX",
        location: "Noida, India",
        salary: "₹6–10 LPA",
        type: "Full Time",
        logo: "A",
        logoClass: "adobe",
        skills: ["Figma", "UI/UX", "Adobe XD"]
    },

    {
        title: "Data Scientist",
        company: "Microsoft",
        category: "Data Science",
        location: "Hyderabad, India",
        salary: "₹10–16 LPA",
        type: "Full Time",
        logo: "M",
        logoClass: "microsoft",
        skills: ["Python", "Machine Learning", "SQL"]
    },

    {
        title: "DevOps Engineer",
        company: "Amazon",
        category: "DevOps",
        location: "Bangalore, India",
        salary: "₹9–15 LPA",
        type: "Full Time",
        logo: "A",
        logoClass: "amazon",
        skills: ["AWS", "Docker", "Linux"]
    },

    {
        title: "Software Engineer",
        company: "Infosys",
        category: "Backend",
        location: "Pune, India",
        salary: "₹5–9 LPA",
        type: "Full Time",
        logo: "I",
        logoClass: "infosys",
        skills: ["Java", "Spring", "SQL"]
    },

    {
        title: "React Developer",
        company: "Wipro",
        category: "Frontend",
        location: "Hyderabad, India",
        salary: "₹6–10 LPA",
        type: "Full Time",
        logo: "W",
        logoClass: "wipro",
        skills: ["React", "JavaScript", "Redux"]
    },

    {
        title: "Python Developer",
        company: "Accenture",
        category: "Backend",
        location: "Mumbai, India",
        salary: "₹7–12 LPA",
        type: "Full Time",
        logo: "A",
        logoClass: "accenture",
        skills: ["Python", "Django", "SQL"]
    },

    {
        title: "Cloud Engineer",
        company: "IBM",
        category: "DevOps",
        location: "Bangalore, India",
        salary: "₹8–14 LPA",
        type: "Full Time",
        logo: "I",
        logoClass: "ibm",
        skills: ["AWS", "Azure", "Cloud"]
    },

    {
        title: "Mobile App Developer",
        company: "Flipkart",
        category: "Frontend",
        location: "Bangalore, India",
        salary: "₹7–13 LPA",
        type: "Full Time",
        logo: "F",
        logoClass: "flipkart",
        skills: ["Flutter", "Dart", "Firebase"]
    },

    {
        title: "Database Administrator",
        company: "Oracle",
        category: "Backend",
        location: "Hyderabad, India",
        salary: "₹7–12 LPA",
        type: "Full Time",
        logo: "O",
        logoClass: "oracle",
        skills: ["Oracle", "SQL", "Database"]
    },

    {
        title: "Cyber Security Analyst",
        company: "HCL",
        category: "DevOps",
        location: "Noida, India",
        salary: "₹6–11 LPA",
        type: "Full Time",
        logo: "H",
        logoClass: "hcl",
        skills: ["Cyber Security", "Linux", "Networking"]
    },

    {
        title: "Machine Learning Engineer",
        company: "NVIDIA",
        category: "Data Science",
        location: "Pune, India",
        salary: "₹10–18 LPA",
        type: "Full Time",
        logo: "N",
        logoClass: "nvidia",
        skills: ["Python", "TensorFlow", "AI"]
    },

    {
        title: "Product Designer",
        company: "Myntra",
        category: "UI/UX",
        location: "Bangalore, India",
        salary: "₹6–11 LPA",
        type: "Full Time",
        logo: "M",
        logoClass: "myntra",
        skills: ["Figma", "Design", "UX"]
    },

    {
        title: "Software Tester",
        company: "Tech Mahindra",
        category: "Backend",
        location: "Pune, India",
        salary: "₹4–8 LPA",
        type: "Full Time",
        logo: "T",
        logoClass: "techmahindra",
        skills: ["Testing", "Selenium", "Java"]
    },

    {
        title: "Full Stack Developer",
        company: "Cognizant",
        category: "Frontend",
        location: "Chennai, India",
        salary: "₹7–12 LPA",
        type: "Full Time",
        logo: "C",
        logoClass: "cognizant",
        skills: ["React", "Node.js", "MongoDB"]
    },

    {
        title: "Business Analyst",
        company: "Deloitte",
        category: "Data Science",
        location: "Mumbai, India",
        salary: "₹6–10 LPA",
        type: "Full Time",
        logo: "D",
        logoClass: "deloitte",
        skills: ["Excel", "SQL", "Analytics"]
    },

    {
        title: "Technical Support Engineer",
        company: "Cisco",
        category: "DevOps",
        location: "Bangalore, India",
        salary: "₹5–9 LPA",
        type: "Full Time",
        logo: "C",
        logoClass: "cisco",
        skills: ["Networking", "Linux", "Support"]
    },

    {
        title: "HR Executive",
        company: "Deloitte",
        category: "Business",
        location: "Delhi, India",
        salary: "₹4–7 LPA",
        type: "Full Time",
        logo: "D",
        logoClass: "deloitte",
        skills: ["HR", "Recruitment", "Communication"]
    },

    {
        title: "Junior Web Developer",
        company: "Zoho",
        category: "Frontend",
        location: "Chennai, India",
        salary: "₹4–7 LPA",
        type: "Full Time",
        logo: "Z",
        logoClass: "zoho",
        skills: ["HTML", "CSS", "JavaScript"]
    }

];


// ==============================
// BASIC ELEMENTS
// ==============================

const jobContainer = document.getElementById("jobContainer");
const jobCount = document.getElementById("jobCount");

const searchInput = document.getElementById("jobSearch");
const searchButton = document.getElementById("searchBtn");

const viewAllBtn = document.getElementById("viewAllBtn");

const categoryButtons =
    document.querySelectorAll(".categories span");


// ==============================
// SAVED JOBS / BOOKMARK
// ==============================

let savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];


// Check if job is saved

function isJobSaved(jobTitle) {

    return savedJobs.includes(jobTitle);

}
// ==============================
// DISPLAY JOB CARDS
// ==============================

async function loadJobs() {

    try {

        const response = await fetch("https://job-portal-1-5gno.onrender.com/api/jobs");

        if (!response.ok) {
            throw new Error("Failed to fetch jobs");
        }

        const jobs = await response.json();

        const jobContainer = document.getElementById("jobContainer");
        const jobCount = document.getElementById("jobCount");

        if (!jobContainer || !jobCount) {
            console.error("Job container or job count not found");
            return;
        }

        // Clear old jobs
        jobContainer.innerHTML = "";

        // Update job count
        jobCount.textContent = `${jobs.length} Jobs Found`;

        // Display jobs
        jobs.forEach(function (job) {

            const jobCard = document.createElement("div");

            jobCard.className = "job-card";

            jobCard.innerHTML = `
                <div class="job-card-header">
                    <div>
                        <h3>${job.title}</h3>
                        <p class="company">${job.company}</p>
                    </div>
                </div>

                <div class="job-info">
                    <span>📍 ${job.location}</span>

                    <span>
                        💰 ${job.salary || "Salary not specified"}
                    </span>

                    <span>
                        💼 ${job.jobType || "Full Time"}
                    </span>
                </div>

                <p class="job-description">
                    ${job.description || "No description available"}
                </p>

                <div class="job-skills">
                    ${(job.skills || [])
                        .map(function (skill) {
                            return `<span>${skill}</span>`;
                        })
                        .join("")}
                </div>

                <button
                    class="apply-btn"
                    data-job-id="${job._id}">
                    Apply Now
                </button>
            `;

            jobContainer.appendChild(jobCard);

        });

    } catch (error) {

        console.error("Error loading jobs:", error);

        const jobCount = document.getElementById("jobCount");

        if (jobCount) {
            jobCount.textContent = "Unable to load jobs";
        }
    }
}


// Keep displayJobs() if other parts of your script call it
function displayJobs(jobList) {

    const jobContainer = document.getElementById("jobContainer");

    if (!jobContainer) {
        console.error("Job container not found");
        return;
    }

    jobContainer.innerHTML = "";

    jobList.forEach(function (job) {

        const jobCard = document.createElement("div");

        jobCard.className = "job-card";

        jobCard.innerHTML = `
            <div class="job-card-header">
                <div>
                    <h3>${job.title}</h3>
                    <p class="company">${job.company}</p>
                </div>
            </div>

            <div class="job-info">
                <span>📍 ${job.location}</span>
                <span>💰 ${job.salary || "Salary not specified"}</span>
                <span>💼 ${job.jobType || "Full Time"}</span>
            </div>

            <p class="job-description">
                ${job.description || "No description available"}
            </p>

            <div class="job-skills">
                ${(job.skills || [])
                    .map(function (skill) {
                        return `<span>${skill}</span>`;
                    })
                    .join("")}
            </div>

            <button
                class="apply-btn"
                data-job-id="${job._id}">
                Apply Now
            </button>
        `;

        jobContainer.appendChild(jobCard);

    });
}


// ==============================
// VIEW DETAILS
// ==============================

jobContainer.addEventListener("click", function(event) {

    if (!event.target.classList.contains("details-btn")) {
        return;
    }

    const jobCard =
        event.target.closest(".job-card");

    if (!jobCard) {
        return;
    }

    const jobTitle =
        jobCard.querySelector("h3").textContent.trim();

    const company =
        jobCard.querySelector(".company").textContent.trim();

    const job =
        jobsData.find(function(item) {

            return item.title === jobTitle &&
                   item.company === company;

        });

    if (!job) {
        return;
    }

    // Find details modal
    const detailsModal =
        document.getElementById("detailsModal");

    const detailsContent =
        document.getElementById("detailsContent");

    if (!detailsModal || !detailsContent) {

        console.error(
            "detailsModal or detailsContent is missing from HTML."
        );

        return;
    }

    // Create popup content
    detailsContent.innerHTML = `

        <button class="close-details" id="closeDetails">
            ×
        </button>

        <div class="details-header">

            <div class="details-logo ${job.logoClass}">
                ${job.logo}
            </div>

            <div>

                <h2>
                    ${job.title}
                </h2>

                <p class="details-company">
                    ${job.company}
                </p>

            </div>

        </div>

        <div class="details-info">

            <div>
                📍 Location
                <strong>${job.location}</strong>
            </div>

            <div>
                💰 Salary
                <strong>${job.salary}</strong>
            </div>

            <div>
                🕒 Job Type
                <strong>${job.type}</strong>
            </div>

            <div>
                💼 Category
                <strong>${job.category}</strong>
            </div>

        </div>

        <div class="details-skills">

            <h4>Required Skills</h4>

            <div class="details-skill-list">

                ${job.skills.map(function(skill) {

                    return `<span>${skill}</span>`;

                }).join("")}

            </div>

        </div>

        <div class="details-description">

            <h4>About this job</h4>

            <p>
                We are looking for a talented
                ${job.title} to join ${job.company}.
                You will work with modern technologies
                and collaborate with a professional team
                to build high-quality solutions.
            </p>

        </div>

        <button class="details-apply">
            Apply Now
        </button>
    `;

    // Show modal
    detailsModal.classList.add("show");


    // Close button
    const closeDetails =
        document.getElementById("closeDetails");

    closeDetails.addEventListener("click", function() {

        detailsModal.classList.remove("show");

    });


    // Apply from details
    const detailsApply =
        detailsContent.querySelector(".details-apply");

    detailsApply.addEventListener("click", function() {

        detailsModal.classList.remove("show");

        selectedJob.textContent = job.title;

        applyModal.classList.add("show");

    });

});
// ==============================
// FILTER SETTINGS
// ==============================

let selectedCategory = "All";

let showingAllJobs = false;


// ==============================
// FILTER JOBS
// ==============================

function filterJobs() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    // Filter jobs

    const filteredJobs =
        jobsData.filter(function(job) {


            // Category

            const categoryMatch =
                selectedCategory === "All" ||
                job.category.toLowerCase() ===
                selectedCategory.toLowerCase();


            // Search

            const jobText = `

                ${job.title}
                ${job.company}
                ${job.category}
                ${job.location}
                ${job.salary}
                ${job.skills.join(" ")}

            `.toLowerCase();


            const searchMatch =
                jobText.includes(searchText);


            return categoryMatch &&
                   searchMatch;

        });


    // ==============================
    // SHOW 3 OR ALL
    // ==============================

    let jobsToDisplay;


    if (showingAllJobs) {

        jobsToDisplay = filteredJobs;

    } else {

        jobsToDisplay =
            filteredJobs.slice(0, 3);

    }


    displayJobs(jobsToDisplay);

    


    // ==============================
    // JOB COUNT
    // ==============================

    jobCount.textContent =
        `${filteredJobs.length} Jobs Found`;


    // ==============================
    // VIEW ALL BUTTON
    // ==============================

    if (filteredJobs.length <= 3) {

        viewAllBtn.style.display = "none";

    } else {

        viewAllBtn.style.display =
            "inline-block";


        if (showingAllJobs) {

            viewAllBtn.textContent =
                "Show Less ↑";

        } else {

            viewAllBtn.textContent =
                "View All →";

        }

    }

}


// ==============================
// CATEGORY FILTER
// ==============================

categoryButtons.forEach(function(category) {

    category.addEventListener(
        "click",
        function() {

            selectedCategory =
                category.dataset.category;

            showingAllJobs = false;

            filterJobs();

        }
    );

});


// ==============================
// SEARCH BUTTON
// ==============================

searchButton.addEventListener(
    "click",
    function() {

        showingAllJobs = false;

        filterJobs();

    }
);


// ==============================
// SEARCH WITH ENTER
// ==============================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            showingAllJobs = false;

            filterJobs();

        }

    }
);


// ==============================
// LIVE SEARCH
// ==============================

searchInput.addEventListener(
    "input",
    function() {

        showingAllJobs = false;

        filterJobs();

    }
);


// ==============================
// VIEW ALL
// ==============================

viewAllBtn.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        showingAllJobs =
            !showingAllJobs;

        filterJobs();

    }
);


// ==============================
// BOOKMARK + APPLY
// ==============================

jobContainer.addEventListener(
    "click",
    function(event) {


        // ==========================
        // BOOKMARK
        // ==========================

        if (
            event.target.classList.contains(
                "bookmark"
            )
        ) {

            const bookmark =
                event.target;


            const jobCard =
                bookmark.closest(".job-card");


            const jobTitle =
                jobCard
                .querySelector("h3")
                .textContent;


            toggleBookmark(jobTitle);


            // Update bookmark

            if (isJobSaved(jobTitle)) {

                bookmark.textContent = "♥";

                bookmark.classList.add(
                    "saved"
                );

            } else {

                bookmark.textContent = "♡";

                bookmark.classList.remove(
                    "saved"
                );

            }
            function toggleBookmark(jobTitle) {

    if (isJobSaved(jobTitle)) {

      let savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

    } else {

        savedJobs.push(jobTitle);
    }

    localStorage.setItem(
        "savedJobs",
        JSON.stringify(savedJobs)
    );
}

        }
        // ==============================
// SAVED JOBS NAVIGATION
// ==============================

const savedJobsBtn =
    document.getElementById("savedJobsBtn");

savedJobsBtn.addEventListener("click", function(event) {

    event.preventDefault();

    // Get currently saved jobs
    const savedJobList = jobsData.filter(function(job) {

        return savedJobs.includes(job.title);

    });

    // Show saved jobs
    showingAllJobs = true;

    displayJobs(savedJobList);

    // Update job count
    jobCount.textContent =
        `${savedJobList.length} Saved Jobs`;

    // Scroll to jobs section
    document.getElementById("jobs").scrollIntoView({
        behavior: "smooth"
    });

});


        // ==========================
        // APPLY BUTTON
        // ==========================

        if (
            event.target.classList.contains(
                "apply-btn"
            )
        ) {

            const button =
                event.target;


            const jobCard =
                button.closest(".job-card");


            const jobTitle =
                jobCard
                .querySelector("h3")
                .textContent;


            selectedJob.textContent =
                jobTitle;


            applyModal.classList.add(
                "show"
            );

        }

    }
);


// ==============================
// APPLY MODAL
// ==============================

const applyModal =
    document.getElementById("applyModal");

const closeModal =
    document.getElementById("closeModal");

const selectedJob =
    document.getElementById("selectedJob");

const applyForm =
    document.getElementById("applyForm");


// Close

closeModal.addEventListener(
    "click",
    function() {

        applyModal.classList.remove(
            "show"
        );

    }
);


// Click outside

applyModal.addEventListener(
    "click",
    function(event) {

        if (event.target === applyModal) {

            applyModal.classList.remove(
                "show"
            );

        }

    }
);


// Submit application

applyForm.addEventListener(
    "submit",
    function(event) {

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


// ==============================
// JOB DETAILS MODAL
// ==============================

const jobDetailsModal =
    document.getElementById("jobDetailsModal");

const closeJobDetails =
    document.getElementById("closeJobDetails");

const detailsTitle =
    document.getElementById("detailsTitle");

const detailsCompany =
    document.getElementById("detailsCompany");

const detailsLocation =
    document.getElementById("detailsLocation");

const detailsSalary =
    document.getElementById("detailsSalary");

const detailsType =
    document.getElementById("detailsType");

const detailsCategory =
    document.getElementById("detailsCategory");

const detailsSkills =
    document.getElementById("detailsSkills");

const detailsLogo =
    document.getElementById("detailsLogo");

const detailsApplyBtn =
    document.getElementById("detailsApplyBtn");


// ==============================
// VIEW DETAILS
// ==============================

jobContainer.addEventListener("click", function(event) {

    if (!event.target.classList.contains("details-btn")) {
        return;
    }

    const jobCard =
        event.target.closest(".job-card");

    if (!jobCard) {
        return;
    }

    const jobTitle =
        jobCard.querySelector("h3").textContent.trim();

    const job =
        jobsData.find(function(item) {

            return item.title === jobTitle;

        });

    if (!job) {
        return;
    }


    // Fill popup

    detailsTitle.textContent =
        job.title;

    detailsCompany.textContent =
        job.company;

    detailsLocation.textContent =
        job.location;

    detailsSalary.textContent =
        job.salary;

    detailsType.textContent =
        job.type;

    detailsCategory.textContent =
        job.category;

    detailsLogo.textContent =
        job.logo;

    detailsLogo.className =
        "details-logo " + job.logoClass;


    // Skills

    detailsSkills.innerHTML = "";

    job.skills.forEach(function(skill) {

        const skillElement =
            document.createElement("span");

        skillElement.textContent =
            skill;

        detailsSkills.appendChild(
            skillElement
        );

    });


    // Save selected job

    detailsApplyBtn.dataset.jobTitle =
        job.title;


    // Open popup

    jobDetailsModal.classList.add("show");

});


// ==============================
// CLOSE DETAILS
// ==============================

closeJobDetails.addEventListener("click", function() {

    jobDetailsModal.classList.remove("show");

});


// Click outside

jobDetailsModal.addEventListener("click", function(event) {

    if (event.target === jobDetailsModal) {

        jobDetailsModal.classList.remove("show");

    }

});


// ==============================
// APPLY FROM DETAILS
// ==============================

detailsApplyBtn.addEventListener("click", function() {

    const jobTitle =
        detailsApplyBtn.dataset.jobTitle;

    if (!jobTitle) {
        return;
    }

    selectedJob.textContent =
        jobTitle;

    jobDetailsModal.classList.remove("show");

    applyModal.classList.add("show");

});
// ==============================
// LOGIN
// ==============================

const loginBtn =
    document.getElementById("loginBtn");

const loginModal =
    document.getElementById("loginModal");

const closeLogin =
    document.getElementById("closeLogin");

const loginForm =
    document.getElementById("loginForm");


// ==============================
// OPEN LOGIN
// ==============================

loginBtn.addEventListener("click", function () {

    loginModal.classList.add("show");

});


// ==============================
// CLOSE LOGIN
// ==============================

closeLogin.addEventListener("click", function () {

    loginModal.classList.remove("show");

});


// ==============================
// CLICK OUTSIDE LOGIN
// ==============================

loginModal.addEventListener("click", function (event) {

    if (event.target === loginModal) {

        loginModal.classList.remove("show");

    }

});


// ==============================
// LOGIN FORM
// ==============================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        loginForm
            .querySelector('input[type="email"]')
            .value
            .trim();

    const password =
        loginForm
            .querySelector('input[type="password"]')
            .value;


    // ==============================
    // VALIDATION
    // ==============================

    if (email === "") {

        alert("Please enter your email.");

        return;

    }

    if (password === "") {

        alert("Please enter your password.");

        return;

    }


    // ==============================
    // LOGIN REQUEST
    // ==============================

    try {

        const response = await fetch("https://job-portal-1-5gno.onrender.com/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // ==============================
        // LOGIN FAILED
        // ==============================

        if (!response.ok) {

            alert(
                data.message || "Login failed."
            );

            return;

        }


        // ==============================
        // CHECK USER
        // ==============================

        console.log(
            "LOGIN USER:",
            data.user
        );


        if (!data.user) {

            alert(
                "Login successful, but user information was not received."
            );

            return;

        }


        // ==============================
        // SAVE USER
        // ==============================

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data.user)
        );


        alert("Login successful! 🎉");


        // ==============================
        // REDIRECT BASED ON ROLE
        // ==============================

       console.log("USER ROLE:", data.user.role);

if (data.user.role === "employer") {

    window.location.href = "dashboard2.html";

} else {

    // Anything other than employer
    // will be treated as Job Seeker

    window.location.href = "dashboard.html";

}

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to the server. Make sure your backend is running."
        );

    }

});


// ==============================
// SIGN UP
// ==============================

const signupBtn =
    document.getElementById("signupBtn");

const signupModal =
    document.getElementById("signupModal");

const closeSignup =
    document.getElementById("closeSignup");

const signupForm =
    document.getElementById("signupForm");


// ==============================
// OPEN SIGNUP
// ==============================

signupBtn.addEventListener("click", function () {

    signupModal.classList.add("show");

});


// ==============================
// CLOSE SIGNUP
// ==============================

closeSignup.addEventListener("click", function () {

    signupModal.classList.remove("show");

});


// ==============================
// CLICK OUTSIDE SIGNUP
// ==============================

signupModal.addEventListener("click", function (event) {

    if (event.target === signupModal) {

        signupModal.classList.remove("show");

    }

});


// ==============================
// SIGNUP FORM
// ==============================

signupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("signupName")
                .value
                .trim();


        const email =
            document
                .getElementById("signupEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("signupPassword")
                .value;


        const confirmPassword =
            document
                .getElementById("signupConfirmPassword")
                .value;


        const role =
            document
                .getElementById("signupRole")
                .value;


        // ==============================
        // VALIDATION
        // ==============================

        if (name.length < 3) {

            alert(
                "Please enter your full name."
            );

            return;

        }


        if (email === "") {

            alert(
                "Please enter your email."
            );

            return;

        }


        if (password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;

        }


        if (role === "") {

            alert(
                "Please select your account type."
            );

            return;

        }


        // ==============================
        // SIGNUP REQUEST
        // ==============================

        try {

            const response = await fetch(
                "https://job-portal-1-5gno.onrender.com/api/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        role: role

                    })
                }
            );


            const data =
                await response.json();


            // ==============================
            // SIGNUP FAILED
            // ==============================

            if (!response.ok) {

                alert(
                    data.message ||
                    "Signup failed."
                );

                return;

            }


            // ==============================
            // SIGNUP SUCCESS
            // ==============================

            alert(
                "Account created successfully! 🎉"
            );


            console.log(
                "Signup successful:",
                data
            );


            signupForm.reset();

            signupModal.classList.remove(
                "show"
            );

        }

        catch (error) {

            console.error(
                "Signup error:",
                error
            );

            alert(
                "Cannot connect to server. Make sure your Node server is running."
            );

        }

    }
);
// ==============================
// LOGIN ↔ SIGN UP
// ==============================

const switchToSignup =
    document.getElementById(
        "switchToSignup"
    );

const switchToLogin =
    document.getElementById(
        "switchToLogin"
    );


switchToSignup.addEventListener(
    "click",
    function() {

        loginModal.classList.remove(
            "show"
        );

        signupModal.classList.add(
            "show"
        );

    }
);


switchToLogin.addEventListener(
    "click",
    function() {

        signupModal.classList.remove(
            "show");});
            filterJobs();

            // ==============================
// COMPANY JOB FILTER
// ==============================

const companyJobButtons =
    document.querySelectorAll(".company-jobs-btn");

companyJobButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedCompany =
            button.dataset.company.toLowerCase();

        // Find jobs from this company
        const companyJobs = jobsData.filter(function(job) {

            return job.company.toLowerCase() === selectedCompany;

        });

        // Reset category/search state
        selectedCategory = "All";
        searchInput.value = "";
        showingAllJobs = true;

        // Display company jobs
        displayJobs(companyJobs);

        // Update count
        jobCount.textContent =
            `${companyJobs.length} Jobs Found`;

        // Scroll to Featured Jobs
        document.getElementById("jobs").scrollIntoView({
            behavior: "smooth"
        });

    });

});
// ==============================
// SHOW LOGGED-IN USER NAME
// ==============================