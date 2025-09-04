document.addEventListener('DOMContentLoaded', () => {
    const generateResumeBtn = document.getElementById('generateResume');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');

    generateResumeBtn.addEventListener('click', updateResume);
    downloadPdfBtn.addEventListener('click', downloadResumeAsPdf);
    downloadHtmlBtn.addEventListener('click', downloadResumeAsHtml);

    // Initial update in case there are default values or for immediate display
    updateResume();
});

let educationCounter = 1;
function addEducationField() {
    educationCounter++;
    const educationInputs = document.getElementById('education-inputs');
    const newItem = document.createElement('div');
    newItem.classList.add('education-item', 'form-group');
    newItem.innerHTML = `
        <label for="degree${educationCounter}">Degree:</label>
        <input type="text" id="degree${educationCounter}" placeholder="Your Degree">
        <label for="university${educationCounter}">University:</label>
        <input type="text" id="university${educationCounter}" placeholder="Your University">
        <label for="gradYear${educationCounter}">Graduation Year:</label>
        <input type="text" id="gradYear${educationCounter}" placeholder="YYYY">
    `;
    educationInputs.appendChild(newItem);
}

let experienceCounter = 1;
function addExperienceField() {
    experienceCounter++;
    const experienceInputs = document.getElementById('experience-inputs');
    const newItem = document.createElement('div');
    newItem.classList.add('experience-item', 'form-group');
    newItem.innerHTML = `
        <label for="jobTitle${experienceCounter}">Job Title:</label>
        <input type="text" id="jobTitle${experienceCounter}" placeholder="Your Job Title">
        <label for="company${experienceCounter}">Company:</label>
        <input type="text" id="company${experienceCounter}" placeholder="Your Company">
        <label for="startDate${experienceCounter}">Start Date:</label>
        <input type="text" id="startDate${experienceCounter}" placeholder="Month YYYY">
        <label for="endDate${experienceCounter}">End Date:</label>
        <input type="text" id="endDate${experienceCounter}" placeholder="Month YYYY or Present">
        <label for="jobDesc${experienceCounter}">Job Responsibilities:</label>
        <textarea id="jobDesc${experienceCounter}" rows="3" placeholder="- Developed X
- Managed Y"></textarea>
    `;
    experienceInputs.appendChild(newItem);
}

function updateResume() {
    // Personal Info
    document.getElementById('display-name').textContent = document.getElementById('name').value || 'Your Name';
    document.getElementById('display-title').textContent = document.getElementById('title').value || 'Your Professional Title';
    document.getElementById('display-email').textContent = document.getElementById('email').value || 'your.email@example.com';
    document.getElementById('display-phone').textContent = document.getElementById('phone').value || '(123) 456-7890';

    const linkedinLink = document.getElementById('display-linkedin');
    const linkedinInput = document.getElementById('linkedin').value;
    if (linkedinInput) {
        linkedinLink.href = linkedinInput;
        linkedinLink.textContent = 'LinkedIn Profile';
    } else {
        linkedinLink.href = '#';
        linkedinLink.textContent = '';
    }

    // Summary
    document.getElementById('display-summary').textContent = document.getElementById('summary').value || 'A brief professional summary will appear here.';

    // Education
    const educationDisplay = document.getElementById('education-display');
    educationDisplay.innerHTML = '<h3>Education</h3>'; // Clear previous content
    for (let i = 1; i <= educationCounter; i++) {
        const degree = document.getElementById(`degree${i}`).value;
        const university = document.getElementById(`university${i}`).value;
        const gradYear = document.getElementById(`gradYear${i}`).value;

        if (degree || university || gradYear) {
            const eduItem = document.createElement('div');
            eduItem.classList.add('resume-item');
            eduItem.innerHTML = `
                <h4>${degree || 'Degree'} at ${university || 'University'}</h4>
                <p>${gradYear || 'Year'}</p>
            `;
            educationDisplay.appendChild(eduItem);
        }
    }

    // Work Experience
    const experienceDisplay = document.getElementById('experience-display');
    experienceDisplay.innerHTML = '<h3>Work Experience</h3>'; // Clear previous content
    for (let i = 1; i <= experienceCounter; i++) {
        const jobTitle = document.getElementById(`jobTitle${i}`).value;
        const company = document.getElementById(`company${i}`).value;
        const startDate = document.getElementById(`startDate${i}`).value;
        const endDate = document.getElementById(`endDate${i}`).value;
        const jobDesc = document.getElementById(`jobDesc${i}`).value;

        if (jobTitle || company || startDate || endDate || jobDesc) {
            const expItem = document.createElement('div');
            expItem.classList.add('resume-item');
            // Format job responsibilities into a proper list
            const jobDescHtml = jobDesc.split('\n')
                                      .map(line => line.trim())
                                      .filter(line => line !== '')
                                      .map(line => `<li>${line}</li>`)
                                      .join('');
            expItem.innerHTML = `
                <h4>${jobTitle || 'Job Title'} at ${company || 'Company'}</h4>
                <p>${startDate || 'Start Date'} - ${endDate || 'End Date'}</p>
                ${jobDescHtml ? `<ul>${jobDescHtml}</ul>` : ''}
            `;
            experienceDisplay.appendChild(expItem);
        }
    }

    // Skills
    const skillsDisplay = document.getElementById('display-skills');
    skillsDisplay.innerHTML = ''; // Clear previous skills
    const skillsInput = document.getElementById('skills').value;
    if (skillsInput) {
        const skillArray = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
        skillArray.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsDisplay.appendChild(li);
        });
    }

    // Trigger animation for displayed sections
    document.querySelectorAll('.animated-section').forEach(section => {
        section.style.opacity = 0; // Reset opacity
        section.style.transform = 'translateY(20px)'; // Reset transform
        // Force reflow to restart animation
        void section.offsetWidth;
        section.style.animation = 'none'; // Clear any previous animation state
        requestAnimationFrame(() => { // Reapply animation after reflow
            section.style.animation = ''; // Re-enable animation
            section.classList.add('animated-section'); // Add the class to trigger animation
        });
    });
}

// Function to download resume as PDF
function downloadResumeAsPdf() {
    const resumeContent = document.getElementById('resume-content-to-download');
    const nameInput = document.getElementById('name').value;
    const filename = (nameInput ? nameInput.replace(/\s+/g, '_') : 'resume') + '.pdf';

    // Options for html2pdf
    const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // Top, Left, Bottom, Right margin in inches
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true }, // Scale for higher resolution, useCORS for images if any
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to generate and download the PDF
    html2pdf().set(opt).from(resumeContent).save();
}

// Function to download resume as HTML
function downloadResumeAsHtml() {
    // It's crucial to generate the resume content first to ensure it's up-to-date
    updateResume();

    const resumeContentElement = document.getElementById('resume-content-to-download');
    const nameInput = document.getElementById('name').value;
    const filename = (nameInput ? nameInput.replace(/\s+/g, '_') : 'resume') + '.html';

    // Create a clone of the resume content to manipulate without affecting the live DOM
    const clonedResumeContent = resumeContentElement.cloneNode(true);

    // Remove animation classes and ensure visibility for the cloned content
    clonedResumeContent.querySelectorAll('.animated-section').forEach(section => {
        section.classList.remove('animated-section'); // Remove the class that causes initial opacity:0
        section.style.opacity = '1'; // Explicitly set opacity to 1
        section.style.transform = 'none'; // Remove any transform for initial state
        section.style.animation = 'none'; // Ensure no animation is active
    });

    // Create a temporary full HTML document with just the resume display content and its styles
    const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nameInput || 'Your Resume'}</title>
    <style>
        /* Include relevant CSS for the resume display directly */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f6;
            color: #333;
            line-height: 1.6;
        }
        .resume-display {
            background-color: #fff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-right: 5px solid #2ecc71;
            max-width: 800px; /* Limit width for better readability */
            margin: auto; /* Center it */
        }
        .resume-display h2 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .resume-display h3 {
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 15px;
            color: #34495e;
        }
        .resume-item {
            margin-bottom: 15px;
        }
        .resume-item h4 {
            margin: 0;
            color: #444;
        }
        .resume-item p {
            margin: 0;
            font-size: 0.95em;
            color: #666;
        }
        .resume-item ul {
            list-style-type: disc;
            margin-left: 20px;
            padding-left: 0;
        }
        .resume-item ul li {
            margin-bottom: 5px;
        }
        #display-skills {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #display-skills li {
            background-color: #ecf0f1;
            display: inline-block;
            padding: 5px 10px;
            margin: 0 8px 8px 0;
            border-radius: 3px;
            font-size: 0.9em;
            color: #555;
        }
        #personal-info-display p,
        #personal-info-display a {
            text-align: center;
        }
        #personal-info-display h3,
        #personal-info-display p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    ${clonedResumeContent.outerHTML}
</body>
</html>
    `;

    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
}