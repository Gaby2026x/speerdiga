serpdigger.api = {};

serpdigger.api.registration = {
    PAID: "paid",
    TRIAL: "trial"
};

serpdigger.api.registration.status = function (username, password, callback) {
    
    var data = new URLSearchParams();
    data.append(serpdigger.config.api.registration.status.keys.username, username);
    data.append(serpdigger.config.api.registration.status.keys.password, password);
    
    fetch(serpdigger.config.api.registration.status.url, {
        method: serpdigger.config.api.registration.status.method,
        headers: {
            "Authorization": "Basic " + btoa(serpdigger.config.api.httpuser + ":" + serpdigger.config.api.httppass),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(function(response) { return response.text(); })
    .then(function(text) {
        callback((text == "VALID|PAID") ? serpdigger.api.registration.PAID : serpdigger.api.registration.TRIAL);
    })
    .catch(function() {
        callback(serpdigger.api.registration.TRIAL);
    });
    
};

serpdigger.api.footprints = {};

function _parseFootprints(str) {
    return str.split(/[\n]+/g).slice(0, -1).map(function (s) {
        var s = s.split(/\*/g);
        return {
            name: s[0],
            value: s[1]
        };
    });
}

var _builtinFootprints = [
    // ── C-Suite & Executive Leadership ──
    { name: "CEO / Chief Executive Officer", value: "\"@\" email CEO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CFO / Chief Financial Officer", value: "\"@\" email CFO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "COO / Chief Operating Officer", value: "\"@\" email COO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CTO / Chief Technology Officer", value: "\"@\" email CTO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CMO / Chief Marketing Officer", value: "\"@\" email CMO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CIO / Chief Information Officer", value: "\"@\" email CIO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CHRO / Chief Human Resources Officer", value: "\"@\" email CHRO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CLO / Chief Legal Officer", value: "\"@\" email CLO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CSO / Chief Security Officer", value: "\"@\" email CSO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CDO / Chief Data Officer", value: "\"@\" email CDO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CPO / Chief Product Officer", value: "\"@\" email CPO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CRO / Chief Revenue Officer", value: "\"@\" email CRO -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "President", value: "\"@\" email President -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Vice President (VP)", value: "\"@\" email \"Vice President\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Managing Director", value: "\"@\" email \"Managing Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Executive Director", value: "\"@\" email \"Executive Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Board Member / Director", value: "\"@\" email \"Board Member\" OR \"Board of Directors\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Partner", value: "\"@\" email Partner -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Founder / Co-Founder", value: "\"@\" email Founder OR \"Co-Founder\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Owner / Proprietor", value: "\"@\" email Owner OR Proprietor -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Senior Management ──
    { name: "Senior Vice President (SVP)", value: "\"@\" email \"Senior Vice President\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "General Manager", value: "\"@\" email \"General Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Director", value: "\"@\" email Director -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Director", value: "\"@\" email \"Senior Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Head of Department", value: "\"@\" email \"Head of\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Principal", value: "\"@\" email Principal -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Sales ──
    { name: "VP of Sales", value: "\"@\" email \"VP of Sales\" OR \"Vice President of Sales\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sales Director", value: "\"@\" email \"Sales Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sales Manager", value: "\"@\" email \"Sales Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Regional Sales Manager", value: "\"@\" email \"Regional Sales Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Account Executive", value: "\"@\" email \"Account Executive\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Account Manager", value: "\"@\" email \"Account Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business Development Manager", value: "\"@\" email \"Business Development Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business Development Representative", value: "\"@\" email \"Business Development Representative\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sales Representative", value: "\"@\" email \"Sales Representative\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Inside Sales", value: "\"@\" email \"Inside Sales\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Outside Sales", value: "\"@\" email \"Outside Sales\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sales Engineer", value: "\"@\" email \"Sales Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Key Account Manager", value: "\"@\" email \"Key Account Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Territory Manager", value: "\"@\" email \"Territory Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Marketing ──
    { name: "VP of Marketing", value: "\"@\" email \"VP of Marketing\" OR \"Vice President of Marketing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketing Director", value: "\"@\" email \"Marketing Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketing Manager", value: "\"@\" email \"Marketing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Digital Marketing Manager", value: "\"@\" email \"Digital Marketing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Content Marketing Manager", value: "\"@\" email \"Content Marketing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Brand Manager", value: "\"@\" email \"Brand Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Product Marketing Manager", value: "\"@\" email \"Product Marketing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SEO Manager / Specialist", value: "\"@\" email \"SEO Manager\" OR \"SEO Specialist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Social Media Manager", value: "\"@\" email \"Social Media Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Communications Manager", value: "\"@\" email \"Communications Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Public Relations Manager", value: "\"@\" email \"Public Relations Manager\" OR \"PR Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Growth Manager", value: "\"@\" email \"Growth Manager\" OR \"Head of Growth\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Demand Generation Manager", value: "\"@\" email \"Demand Generation\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketing Coordinator", value: "\"@\" email \"Marketing Coordinator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Email Marketing Manager", value: "\"@\" email \"Email Marketing\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Information Technology (IT) ──
    { name: "VP of Engineering", value: "\"@\" email \"VP of Engineering\" OR \"Vice President of Engineering\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "IT Director", value: "\"@\" email \"IT Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "IT Manager", value: "\"@\" email \"IT Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Engineering Manager", value: "\"@\" email \"Engineering Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Software Engineer", value: "\"@\" email \"Software Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Software Engineer", value: "\"@\" email \"Senior Software Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Full Stack Developer", value: "\"@\" email \"Full Stack Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Frontend Developer", value: "\"@\" email \"Frontend Developer\" OR \"Front-End Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Backend Developer", value: "\"@\" email \"Backend Developer\" OR \"Back-End Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "DevOps Engineer", value: "\"@\" email \"DevOps Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Cloud Engineer / Architect", value: "\"@\" email \"Cloud Engineer\" OR \"Cloud Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Data Engineer", value: "\"@\" email \"Data Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Data Scientist", value: "\"@\" email \"Data Scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Machine Learning Engineer", value: "\"@\" email \"Machine Learning Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "AI Engineer", value: "\"@\" email \"AI Engineer\" OR \"Artificial Intelligence\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "System Administrator", value: "\"@\" email \"System Administrator\" OR \"Sysadmin\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Network Engineer", value: "\"@\" email \"Network Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Security Engineer", value: "\"@\" email \"Security Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Cybersecurity Analyst", value: "\"@\" email \"Cybersecurity Analyst\" OR \"Cybersecurity\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Database Administrator (DBA)", value: "\"@\" email \"Database Administrator\" OR DBA -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "QA Engineer / Tester", value: "\"@\" email \"QA Engineer\" OR \"Quality Assurance\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Solutions Architect", value: "\"@\" email \"Solutions Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Technical Lead", value: "\"@\" email \"Technical Lead\" OR \"Tech Lead\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Scrum Master", value: "\"@\" email \"Scrum Master\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Product Owner", value: "\"@\" email \"Product Owner\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Product Management ──
    { name: "VP of Product", value: "\"@\" email \"VP of Product\" OR \"Vice President of Product\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Product Director", value: "\"@\" email \"Product Director\" OR \"Director of Product\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Product Manager", value: "\"@\" email \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Product Manager", value: "\"@\" email \"Senior Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Product Analyst", value: "\"@\" email \"Product Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Human Resources (HR) ──
    { name: "VP of Human Resources", value: "\"@\" email \"VP of HR\" OR \"VP of Human Resources\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "HR Director", value: "\"@\" email \"HR Director\" OR \"Human Resources Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "HR Manager", value: "\"@\" email \"HR Manager\" OR \"Human Resources Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Talent Acquisition Manager", value: "\"@\" email \"Talent Acquisition Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Recruiter / Senior Recruiter", value: "\"@\" email Recruiter OR \"Senior Recruiter\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "HR Business Partner", value: "\"@\" email \"HR Business Partner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Compensation & Benefits Manager", value: "\"@\" email \"Compensation\" OR \"Benefits Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Learning & Development Manager", value: "\"@\" email \"Learning and Development\" OR \"L&D Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "People Operations Manager", value: "\"@\" email \"People Operations\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "HR Generalist", value: "\"@\" email \"HR Generalist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "HR Coordinator", value: "\"@\" email \"HR Coordinator\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Finance & Accounting ──
    { name: "VP of Finance", value: "\"@\" email \"VP of Finance\" OR \"Vice President of Finance\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Finance Director", value: "\"@\" email \"Finance Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Finance Manager", value: "\"@\" email \"Finance Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Financial Analyst", value: "\"@\" email \"Financial Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Controller / Financial Controller", value: "\"@\" email Controller OR \"Financial Controller\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Accounting Manager", value: "\"@\" email \"Accounting Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Accountant / CPA", value: "\"@\" email Accountant OR CPA -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Auditor", value: "\"@\" email Auditor -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Treasurer", value: "\"@\" email Treasurer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Tax Manager / Tax Director", value: "\"@\" email \"Tax Manager\" OR \"Tax Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Payroll Manager", value: "\"@\" email \"Payroll Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Investment Analyst", value: "\"@\" email \"Investment Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Risk Manager", value: "\"@\" email \"Risk Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Compliance Officer", value: "\"@\" email \"Compliance Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Operations & Logistics ──
    { name: "VP of Operations", value: "\"@\" email \"VP of Operations\" OR \"Vice President of Operations\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Operations Director", value: "\"@\" email \"Operations Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Operations Manager", value: "\"@\" email \"Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Supply Chain Manager", value: "\"@\" email \"Supply Chain Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Logistics Manager", value: "\"@\" email \"Logistics Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Procurement Manager", value: "\"@\" email \"Procurement Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Purchasing Manager", value: "\"@\" email \"Purchasing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Warehouse Manager", value: "\"@\" email \"Warehouse Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Facilities Manager", value: "\"@\" email \"Facilities Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Project Manager", value: "\"@\" email \"Project Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Program Manager", value: "\"@\" email \"Program Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business Analyst", value: "\"@\" email \"Business Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Process Improvement Manager", value: "\"@\" email \"Process Improvement\" OR \"Continuous Improvement\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Legal ──
    { name: "General Counsel", value: "\"@\" email \"General Counsel\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Legal Director", value: "\"@\" email \"Legal Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Corporate Counsel", value: "\"@\" email \"Corporate Counsel\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Attorney / Lawyer", value: "\"@\" email Attorney OR Lawyer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Paralegal", value: "\"@\" email Paralegal -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Contract Manager", value: "\"@\" email \"Contract Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Intellectual Property (IP) Counsel", value: "\"@\" email \"Intellectual Property\" OR \"IP Counsel\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Customer Success & Support ──
    { name: "VP of Customer Success", value: "\"@\" email \"VP of Customer Success\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Customer Success Director", value: "\"@\" email \"Customer Success Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Customer Success Manager", value: "\"@\" email \"Customer Success Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Customer Support Manager", value: "\"@\" email \"Customer Support Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Customer Service Manager", value: "\"@\" email \"Customer Service Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Technical Support Manager", value: "\"@\" email \"Technical Support Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Client Relations Manager", value: "\"@\" email \"Client Relations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Customer Experience Manager", value: "\"@\" email \"Customer Experience Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Design & Creative ──
    { name: "Creative Director", value: "\"@\" email \"Creative Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Art Director", value: "\"@\" email \"Art Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "UX Designer", value: "\"@\" email \"UX Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "UI Designer", value: "\"@\" email \"UI Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "UX/UI Designer", value: "\"@\" email \"UX/UI Designer\" OR \"UX Designer\" OR \"UI Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Graphic Designer", value: "\"@\" email \"Graphic Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Product Designer", value: "\"@\" email \"Product Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Design Manager", value: "\"@\" email \"Design Manager\" OR \"Head of Design\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "UX Researcher", value: "\"@\" email \"UX Researcher\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Healthcare & Medical ──
    { name: "Medical Director", value: "\"@\" email \"Medical Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Medical Officer (CMO)", value: "\"@\" email \"Chief Medical Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Nursing Officer", value: "\"@\" email \"Chief Nursing Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Hospital Administrator", value: "\"@\" email \"Hospital Administrator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Physician / Doctor", value: "\"@\" email Physician OR Doctor OR MD -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Surgeon", value: "\"@\" email Surgeon -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Nurse Manager", value: "\"@\" email \"Nurse Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Registered Nurse (RN)", value: "\"@\" email \"Registered Nurse\" OR RN -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Pharmacist", value: "\"@\" email Pharmacist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Healthcare Administrator", value: "\"@\" email \"Healthcare Administrator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Clinical Research Manager", value: "\"@\" email \"Clinical Research Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Biotech / Pharmaceutical Researcher", value: "\"@\" email \"Biotech Researcher\" OR \"Pharmaceutical Researcher\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Health Information Manager", value: "\"@\" email \"Health Information Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Dentist", value: "\"@\" email Dentist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Therapist / Counselor", value: "\"@\" email Therapist OR Counselor -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Education & Training ──
    { name: "Dean / Associate Dean", value: "\"@\" email Dean OR \"Associate Dean\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Professor", value: "\"@\" email Professor -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "School Principal", value: "\"@\" email \"School Principal\" OR Principal -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Teacher / Educator", value: "\"@\" email Teacher OR Educator -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Training Manager", value: "\"@\" email \"Training Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Academic Director", value: "\"@\" email \"Academic Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Curriculum Developer", value: "\"@\" email \"Curriculum Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Instructional Designer", value: "\"@\" email \"Instructional Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Education Administrator", value: "\"@\" email \"Education Administrator\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Engineering & Manufacturing ──
    { name: "Engineering Director", value: "\"@\" email \"Engineering Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Mechanical Engineer", value: "\"@\" email \"Mechanical Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Electrical Engineer", value: "\"@\" email \"Electrical Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Civil Engineer", value: "\"@\" email \"Civil Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chemical Engineer", value: "\"@\" email \"Chemical Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Industrial Engineer", value: "\"@\" email \"Industrial Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Manufacturing Manager", value: "\"@\" email \"Manufacturing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Plant Manager", value: "\"@\" email \"Plant Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Production Manager", value: "\"@\" email \"Production Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Quality Manager", value: "\"@\" email \"Quality Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Quality Assurance Manager", value: "\"@\" email \"Quality Assurance Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Environmental Engineer", value: "\"@\" email \"Environmental Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Safety Manager", value: "\"@\" email \"Safety Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Real Estate & Construction ──
    { name: "Real Estate Agent / Broker", value: "\"@\" email \"Real Estate Agent\" OR \"Real Estate Broker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Real Estate Developer", value: "\"@\" email \"Real Estate Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Property Manager", value: "\"@\" email \"Property Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Construction Manager", value: "\"@\" email \"Construction Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Project Engineer (Construction)", value: "\"@\" email \"Project Engineer\" construction -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Architect", value: "\"@\" email Architect -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Consulting & Professional Services ──
    { name: "Management Consultant", value: "\"@\" email \"Management Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Strategy Consultant", value: "\"@\" email \"Strategy Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Consultant", value: "\"@\" email \"Senior Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Principal Consultant", value: "\"@\" email \"Principal Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business Consultant", value: "\"@\" email \"Business Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "IT Consultant", value: "\"@\" email \"IT Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Media, Advertising & Entertainment ──
    { name: "Media Director", value: "\"@\" email \"Media Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Advertising Director", value: "\"@\" email \"Advertising Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Editor / Editor-in-Chief", value: "\"@\" email Editor OR \"Editor-in-Chief\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Journalist / Reporter", value: "\"@\" email Journalist OR Reporter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Content Creator", value: "\"@\" email \"Content Creator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Producer", value: "\"@\" email Producer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Copywriter", value: "\"@\" email Copywriter -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Nonprofit & Government ──
    { name: "Executive Director (Nonprofit)", value: "\"@\" email \"Executive Director\" nonprofit -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Program Director (Nonprofit)", value: "\"@\" email \"Program Director\" nonprofit -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fundraising Manager", value: "\"@\" email \"Fundraising Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Grant Writer", value: "\"@\" email \"Grant Writer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Policy Analyst", value: "\"@\" email \"Policy Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Government Relations", value: "\"@\" email \"Government Relations\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Research & Science ──
    { name: "Research Director", value: "\"@\" email \"Research Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Research Scientist", value: "\"@\" email \"Research Scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "R&D Manager", value: "\"@\" email \"R&D Manager\" OR \"Research and Development\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Lab Manager", value: "\"@\" email \"Lab Manager\" OR \"Laboratory Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Scientist", value: "\"@\" email Scientist -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Retail & E-Commerce ──
    { name: "Retail Manager", value: "\"@\" email \"Retail Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Store Manager", value: "\"@\" email \"Store Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "E-Commerce Manager", value: "\"@\" email \"E-Commerce Manager\" OR \"Ecommerce Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Merchandising Manager", value: "\"@\" email \"Merchandising Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Buyer / Category Manager", value: "\"@\" email Buyer OR \"Category Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Visual Merchandiser", value: "\"@\" email \"Visual Merchandiser\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Insurance & Banking ──
    { name: "Insurance Agent / Broker", value: "\"@\" email \"Insurance Agent\" OR \"Insurance Broker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Underwriter", value: "\"@\" email Underwriter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Claims Manager", value: "\"@\" email \"Claims Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Actuary", value: "\"@\" email Actuary -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Bank Manager", value: "\"@\" email \"Bank Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Loan Officer", value: "\"@\" email \"Loan Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Wealth Manager / Financial Advisor", value: "\"@\" email \"Wealth Manager\" OR \"Financial Advisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Portfolio Manager", value: "\"@\" email \"Portfolio Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Transportation & Automotive ──
    { name: "Fleet Manager", value: "\"@\" email \"Fleet Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Transportation Manager", value: "\"@\" email \"Transportation Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Automotive Manager", value: "\"@\" email \"Automotive Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Dealership Manager", value: "\"@\" email \"Dealership Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Energy & Utilities ──
    { name: "Energy Manager", value: "\"@\" email \"Energy Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Utility Manager", value: "\"@\" email \"Utility Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Renewable Energy Manager", value: "\"@\" email \"Renewable Energy\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Petroleum Engineer", value: "\"@\" email \"Petroleum Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Power Plant Manager", value: "\"@\" email \"Power Plant Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Hospitality & Travel ──
    { name: "Hotel Manager / General Manager", value: "\"@\" email \"Hotel Manager\" OR \"Hotel General Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Restaurant Manager", value: "\"@\" email \"Restaurant Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Food & Beverage Manager", value: "\"@\" email \"Food and Beverage Manager\" OR \"F&B Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Event Manager / Planner", value: "\"@\" email \"Event Manager\" OR \"Event Planner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Travel Manager", value: "\"@\" email \"Travel Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chef / Executive Chef", value: "\"@\" email Chef OR \"Executive Chef\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Agriculture & Environment ──
    { name: "Farm Manager", value: "\"@\" email \"Farm Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Agricultural Manager", value: "\"@\" email \"Agricultural Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Environmental Manager", value: "\"@\" email \"Environmental Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sustainability Manager", value: "\"@\" email \"Sustainability Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Telecommunications ──
    { name: "Telecom Manager", value: "\"@\" email \"Telecom Manager\" OR \"Telecommunications Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Network Operations Manager", value: "\"@\" email \"Network Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "RF Engineer", value: "\"@\" email \"RF Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Sports & Fitness ──
    { name: "Athletic Director", value: "\"@\" email \"Athletic Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sports Manager", value: "\"@\" email \"Sports Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fitness Director", value: "\"@\" email \"Fitness Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Coach / Head Coach", value: "\"@\" email Coach OR \"Head Coach\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ══════════════════════════════════════════════
    // Apollo.io-Style Seniority, Departments & Industries
    // ══════════════════════════════════════════════

    // ── Seniority: Entry & Associate ──
    { name: "Intern", value: "\"@\" email Intern -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Associate", value: "\"@\" email Associate -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Analyst", value: "\"@\" email Analyst -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Junior Developer", value: "\"@\" email \"Junior Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Coordinator", value: "\"@\" email Coordinator -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Assistant", value: "\"@\" email Assistant -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Specialist", value: "\"@\" email Specialist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Technician", value: "\"@\" email Technician -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Representative", value: "\"@\" email Representative -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Administrator", value: "\"@\" email Administrator -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Clerk", value: "\"@\" email Clerk -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Apprentice", value: "\"@\" email Apprentice -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Seniority: Senior & Staff ──
    { name: "Staff Engineer", value: "\"@\" email \"Staff Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Manager", value: "\"@\" email \"Senior Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Lead", value: "\"@\" email Lead -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Team Lead", value: "\"@\" email \"Team Lead\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Supervisor", value: "\"@\" email Supervisor -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Analyst", value: "\"@\" email \"Senior Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Associate", value: "\"@\" email \"Senior Associate\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Specialist", value: "\"@\" email \"Senior Specialist\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Seniority: Executive Variations ──
    { name: "Chief Compliance Officer (CCO)", value: "\"@\" email \"Chief Compliance Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Strategy Officer", value: "\"@\" email \"Chief Strategy Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Growth Officer", value: "\"@\" email \"Chief Growth Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief People Officer", value: "\"@\" email \"Chief People Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Communications Officer", value: "\"@\" email \"Chief Communications Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Innovation Officer", value: "\"@\" email \"Chief Innovation Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Sustainability Officer", value: "\"@\" email \"Chief Sustainability Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Experience Officer", value: "\"@\" email \"Chief Experience Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Digital Officer", value: "\"@\" email \"Chief Digital Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Analytics Officer", value: "\"@\" email \"Chief Analytics Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Procurement Officer", value: "\"@\" email \"Chief Procurement Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Investment Officer", value: "\"@\" email \"Chief Investment Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Architect", value: "\"@\" email \"Chief Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Scientist", value: "\"@\" email \"Chief Scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Chief Evangelist", value: "\"@\" email \"Chief Evangelist\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Data Science & Analytics ──
    { name: "Head of Data", value: "\"@\" email \"Head of Data\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Director of Analytics", value: "\"@\" email \"Director of Analytics\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Analytics Manager", value: "\"@\" email \"Analytics Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Data Analyst", value: "\"@\" email \"Data Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Data Analyst", value: "\"@\" email \"Senior Data Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business Intelligence Analyst", value: "\"@\" email \"Business Intelligence Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "BI Developer", value: "\"@\" email \"BI Developer\" OR \"Business Intelligence Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Data Architect", value: "\"@\" email \"Data Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Statistician", value: "\"@\" email Statistician -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Quantitative Analyst", value: "\"@\" email \"Quantitative Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Revenue Operations ──
    { name: "VP of Revenue Operations", value: "\"@\" email \"VP of Revenue Operations\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Revenue Operations Manager", value: "\"@\" email \"Revenue Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sales Operations Manager", value: "\"@\" email \"Sales Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketing Operations Manager", value: "\"@\" email \"Marketing Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "GTM Strategist", value: "\"@\" email \"Go-To-Market\" OR \"GTM\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Partnerships & Alliances ──
    { name: "VP of Partnerships", value: "\"@\" email \"VP of Partnerships\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Director of Partnerships", value: "\"@\" email \"Director of Partnerships\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Partnerships Manager", value: "\"@\" email \"Partnerships Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Channel Manager", value: "\"@\" email \"Channel Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Alliance Manager", value: "\"@\" email \"Alliance Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Strategic Partnerships", value: "\"@\" email \"Strategic Partnerships\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Developer Relations ──
    { name: "Developer Advocate", value: "\"@\" email \"Developer Advocate\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Developer Relations Manager", value: "\"@\" email \"Developer Relations\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Technical Evangelist", value: "\"@\" email \"Technical Evangelist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Developer Experience Engineer", value: "\"@\" email \"Developer Experience\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Community Manager (Tech)", value: "\"@\" email \"Community Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Information Security ──
    { name: "CISO / Chief Information Security Officer", value: "\"@\" email CISO OR \"Chief Information Security Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "VP of Information Security", value: "\"@\" email \"VP of Information Security\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Information Security Manager", value: "\"@\" email \"Information Security Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Security Architect", value: "\"@\" email \"Security Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Penetration Tester", value: "\"@\" email \"Penetration Tester\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC Analyst", value: "\"@\" email \"SOC Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "GRC Analyst", value: "\"@\" email \"GRC Analyst\" OR \"Governance Risk Compliance\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Threat Intelligence Analyst", value: "\"@\" email \"Threat Intelligence\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Corporate Development & Strategy ──
    { name: "VP of Corporate Development", value: "\"@\" email \"VP of Corporate Development\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Corporate Development Manager", value: "\"@\" email \"Corporate Development\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "M&A Analyst", value: "\"@\" email \"M&A\" OR \"Mergers and Acquisitions\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Strategy Director", value: "\"@\" email \"Strategy Director\" OR \"Director of Strategy\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Strategy Manager", value: "\"@\" email \"Strategy Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Corporate Strategy Analyst", value: "\"@\" email \"Corporate Strategy\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Investor Relations ──
    { name: "VP of Investor Relations", value: "\"@\" email \"VP of Investor Relations\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Investor Relations Manager", value: "\"@\" email \"Investor Relations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Investor Relations Director", value: "\"@\" email \"Investor Relations Director\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Enterprise Architecture ──
    { name: "Enterprise Architect", value: "\"@\" email \"Enterprise Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "IT Architect", value: "\"@\" email \"IT Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Application Architect", value: "\"@\" email \"Application Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Infrastructure Architect", value: "\"@\" email \"Infrastructure Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: ERP & Business Systems ──
    { name: "ERP Manager", value: "\"@\" email \"ERP Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SAP Consultant", value: "\"@\" email \"SAP Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Salesforce Administrator", value: "\"@\" email \"Salesforce Administrator\" OR \"Salesforce Admin\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "CRM Manager", value: "\"@\" email \"CRM Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Supply Chain & Sourcing ──
    { name: "VP of Supply Chain", value: "\"@\" email \"VP of Supply Chain\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Supply Chain Director", value: "\"@\" email \"Supply Chain Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Supply Chain Analyst", value: "\"@\" email \"Supply Chain Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sourcing Manager", value: "\"@\" email \"Sourcing Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Strategic Sourcing Manager", value: "\"@\" email \"Strategic Sourcing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Vendor Manager", value: "\"@\" email \"Vendor Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Inventory Manager", value: "\"@\" email \"Inventory Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Distribution Manager", value: "\"@\" email \"Distribution Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Diversity, Equity & Inclusion ──
    { name: "Chief Diversity Officer", value: "\"@\" email \"Chief Diversity Officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "VP of Diversity & Inclusion", value: "\"@\" email \"VP of Diversity\" OR \"VP of Inclusion\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "DE&I Manager", value: "\"@\" email \"Diversity\" \"Inclusion\" Manager -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Department: Workplace & Office ──
    { name: "Office Manager", value: "\"@\" email \"Office Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Workplace Manager", value: "\"@\" email \"Workplace Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Executive Assistant", value: "\"@\" email \"Executive Assistant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Administrative Manager", value: "\"@\" email \"Administrative Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Receptionist", value: "\"@\" email Receptionist -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: SaaS & Software ──
    { name: "SaaS Sales", value: "\"@\" email SaaS Sales -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SaaS Account Executive", value: "\"@\" email SaaS \"Account Executive\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SaaS Product Manager", value: "\"@\" email SaaS \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SaaS Customer Success", value: "\"@\" email SaaS \"Customer Success\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Software Company - CEO", value: "\"@\" email CEO software -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Software Company - CTO", value: "\"@\" email CTO software -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Software Company - VP Sales", value: "\"@\" email \"VP of Sales\" software -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Fintech ──
    { name: "Fintech CEO", value: "\"@\" email CEO fintech -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fintech Product Manager", value: "\"@\" email \"Product Manager\" fintech -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fintech Engineer", value: "\"@\" email engineer fintech -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Payments Manager", value: "\"@\" email \"Payments Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Blockchain Developer", value: "\"@\" email \"Blockchain Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Crypto / Web3 Manager", value: "\"@\" email \"Crypto\" OR \"Web3\" Manager -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Healthtech & Biotech ──
    { name: "Healthtech CEO", value: "\"@\" email CEO healthtech OR \"health tech\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Healthtech Product Manager", value: "\"@\" email \"Product Manager\" healthtech OR \"health tech\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Bioinformatics Scientist", value: "\"@\" email \"Bioinformatics Scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Clinical Operations Director", value: "\"@\" email \"Clinical Operations Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Regulatory Affairs Manager", value: "\"@\" email \"Regulatory Affairs Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Medical Science Liaison", value: "\"@\" email \"Medical Science Liaison\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Pharmaceutical Sales Rep", value: "\"@\" email \"Pharmaceutical Sales\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: EdTech ──
    { name: "EdTech CEO / Founder", value: "\"@\" email CEO OR Founder edtech OR \"ed tech\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "EdTech Product Manager", value: "\"@\" email \"Product Manager\" edtech -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "EdTech Sales", value: "\"@\" email Sales edtech OR \"education technology\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: CleanTech & Renewable Energy ──
    { name: "CleanTech CEO", value: "\"@\" email CEO cleantech OR \"clean tech\" OR \"clean energy\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Solar Energy Manager", value: "\"@\" email \"Solar Energy Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Wind Energy Engineer", value: "\"@\" email \"Wind Energy Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sustainability Director", value: "\"@\" email \"Sustainability Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "ESG Manager", value: "\"@\" email \"ESG Manager\" OR \"ESG Director\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Aerospace & Defense ──
    { name: "Aerospace Engineer", value: "\"@\" email \"Aerospace Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Defense Program Manager", value: "\"@\" email \"Program Manager\" defense -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Avionics Engineer", value: "\"@\" email \"Avionics Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Space Systems Engineer", value: "\"@\" email \"Space Systems Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Cybersecurity ──
    { name: "Cybersecurity Director", value: "\"@\" email \"Cybersecurity Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Cybersecurity Engineer", value: "\"@\" email \"Cybersecurity Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Cybersecurity Consultant", value: "\"@\" email \"Cybersecurity Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Application Security Engineer", value: "\"@\" email \"Application Security Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Security Operations Manager", value: "\"@\" email \"Security Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: AI & Machine Learning ──
    { name: "AI Research Scientist", value: "\"@\" email \"AI Research Scientist\" OR \"AI Researcher\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NLP Engineer", value: "\"@\" email \"NLP Engineer\" OR \"Natural Language Processing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Computer Vision Engineer", value: "\"@\" email \"Computer Vision Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "ML Ops Engineer", value: "\"@\" email \"MLOps\" OR \"ML Ops\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Deep Learning Engineer", value: "\"@\" email \"Deep Learning Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "AI Product Manager", value: "\"@\" email \"AI Product Manager\" OR \"AI\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Cloud & Infrastructure ──
    { name: "AWS Solutions Architect", value: "\"@\" email \"AWS\" \"Solutions Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Azure Architect", value: "\"@\" email \"Azure\" Architect -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "GCP Engineer", value: "\"@\" email \"GCP\" OR \"Google Cloud\" Engineer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Site Reliability Engineer (SRE)", value: "\"@\" email \"Site Reliability Engineer\" OR SRE -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Platform Engineer", value: "\"@\" email \"Platform Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Infrastructure Engineer", value: "\"@\" email \"Infrastructure Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: E-Commerce & Marketplace ──
    { name: "E-Commerce Director", value: "\"@\" email \"E-Commerce Director\" OR \"Ecommerce Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketplace Manager", value: "\"@\" email \"Marketplace Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "E-Commerce Product Manager", value: "\"@\" email \"E-Commerce\" OR \"Ecommerce\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fulfillment Manager", value: "\"@\" email \"Fulfillment Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Amazon Seller / Vendor Manager", value: "\"@\" email Amazon \"Vendor Manager\" OR \"Seller Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Gaming & Entertainment ──
    { name: "Game Designer", value: "\"@\" email \"Game Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Game Developer / Programmer", value: "\"@\" email \"Game Developer\" OR \"Game Programmer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Game Producer", value: "\"@\" email \"Game Producer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Level Designer", value: "\"@\" email \"Level Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "QA Tester (Gaming)", value: "\"@\" email \"QA Tester\" gaming -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Semiconductor & Hardware ──
    { name: "Chip Design Engineer", value: "\"@\" email \"Chip Design Engineer\" OR \"IC Design\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Hardware Engineer", value: "\"@\" email \"Hardware Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Embedded Systems Engineer", value: "\"@\" email \"Embedded Systems Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "FPGA Engineer", value: "\"@\" email \"FPGA Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Semiconductor Process Engineer", value: "\"@\" email \"Process Engineer\" semiconductor -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: IoT & Robotics ──
    { name: "IoT Engineer", value: "\"@\" email \"IoT Engineer\" OR \"Internet of Things\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "IoT Product Manager", value: "\"@\" email \"IoT\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Robotics Engineer", value: "\"@\" email \"Robotics Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Automation Engineer", value: "\"@\" email \"Automation Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Controls Engineer", value: "\"@\" email \"Controls Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Fashion & Apparel ──
    { name: "Fashion Designer", value: "\"@\" email \"Fashion Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fashion Buyer", value: "\"@\" email \"Fashion Buyer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Fashion Merchandiser", value: "\"@\" email \"Fashion Merchandiser\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Apparel Product Manager", value: "\"@\" email \"Apparel\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Textile Engineer", value: "\"@\" email \"Textile Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Food & Beverage ──
    { name: "Food Scientist", value: "\"@\" email \"Food Scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Food Safety Manager", value: "\"@\" email \"Food Safety Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Beverage Director", value: "\"@\" email \"Beverage Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Supply Chain Manager (F&B)", value: "\"@\" email \"Supply Chain Manager\" food OR beverage -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Mining & Natural Resources ──
    { name: "Mining Engineer", value: "\"@\" email \"Mining Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Geologist", value: "\"@\" email Geologist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Mine Manager", value: "\"@\" email \"Mine Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Exploration Manager", value: "\"@\" email \"Exploration Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Maritime & Shipping ──
    { name: "Maritime Manager", value: "\"@\" email \"Maritime Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Shipping Manager", value: "\"@\" email \"Shipping Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Port Manager", value: "\"@\" email \"Port Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marine Engineer", value: "\"@\" email \"Marine Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: Pharmaceuticals ──
    { name: "Pharmaceutical Director", value: "\"@\" email \"Pharmaceutical Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Drug Development Manager", value: "\"@\" email \"Drug Development Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Pharmacovigilance Manager", value: "\"@\" email \"Pharmacovigilance Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Clinical Trial Manager", value: "\"@\" email \"Clinical Trial Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Medical Affairs Director", value: "\"@\" email \"Medical Affairs Director\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Industry: AR / VR / 3D ──
    { name: "AR/VR Developer", value: "\"@\" email \"AR\" OR \"VR\" OR \"Augmented Reality\" OR \"Virtual Reality\" developer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "3D Artist / Modeler", value: "\"@\" email \"3D Artist\" OR \"3D Modeler\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "XR Product Manager", value: "\"@\" email \"XR\" OR \"Extended Reality\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Blockchain / Crypto / Web3 ──
    { name: "Blockchain / Smart Contract Developer", value: "\"@\" email \"Blockchain Developer\" OR \"Smart Contract Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Crypto Analyst", value: "\"@\" email \"Crypto Analyst\" OR \"Cryptocurrency Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Web3 Developer", value: "\"@\" email \"Web3 Developer\" OR \"DeFi Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Tokenomics Specialist", value: "\"@\" email \"Tokenomics\" OR \"Token Economics\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NFT Project Manager", value: "\"@\" email \"NFT\" \"Project Manager\" OR \"NFT Lead\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Head of Crypto / Blockchain", value: "\"@\" email \"Head of\" crypto OR blockchain -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── LegalTech ──
    { name: "LegalTech Product Manager", value: "\"@\" email \"LegalTech\" OR \"Legal Technology\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Legal Operations Manager", value: "\"@\" email \"Legal Operations Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "E-Discovery Specialist", value: "\"@\" email \"eDiscovery\" OR \"E-Discovery\" specialist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Contract Manager / Analyst", value: "\"@\" email \"Contract Manager\" OR \"Contract Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Compliance Technology Lead", value: "\"@\" email \"Compliance\" technology OR \"RegTech\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── PropTech / Real Estate Tech ──
    { name: "PropTech Founder / CEO", value: "\"@\" email \"PropTech\" OR \"Property Technology\" CEO OR Founder -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Real Estate Technology Manager", value: "\"@\" email \"Real Estate\" technology manager -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Property Management Director", value: "\"@\" email \"Property Management\" Director -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── InsurTech ──
    { name: "InsurTech Product Manager", value: "\"@\" email \"InsurTech\" OR \"Insurance Technology\" \"Product Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Actuarial Data Scientist", value: "\"@\" email \"Actuarial\" OR \"Actuary\" \"Data Scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Insurance Underwriting Manager", value: "\"@\" email \"Underwriting Manager\" insurance -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Additional Roles Across Industries ──
    { name: "Senior Project Manager", value: "\"@\" email \"Senior Project Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Program Manager", value: "\"@\" email \"Senior Program Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Business Analyst", value: "\"@\" email \"Senior Business Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Senior Financial Analyst", value: "\"@\" email \"Senior Financial Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketing Analyst", value: "\"@\" email \"Marketing Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Operations Analyst", value: "\"@\" email \"Operations Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Sales Coordinator", value: "\"@\" email \"Sales Coordinator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Administrative Assistant", value: "\"@\" email \"Administrative Assistant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Receptionist / Front Desk", value: "\"@\" email Receptionist OR \"Front Desk\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Training Manager / Coordinator", value: "\"@\" email \"Training Manager\" OR \"Training Coordinator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Internal Auditor", value: "\"@\" email \"Internal Auditor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Controller / Comptroller", value: "\"@\" email Controller OR Comptroller -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Logistics Coordinator", value: "\"@\" email \"Logistics Coordinator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Communications Director", value: "\"@\" email \"Communications Director\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Scrum Master / Agile Coach", value: "\"@\" email \"Scrum Master\" OR \"Agile Coach\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "DevOps Lead", value: "\"@\" email \"DevOps\" Lead OR Manager -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Cloud Architect", value: "\"@\" email \"Cloud Architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Technical Writer", value: "\"@\" email \"Technical Writer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Content Writer / Copywriter", value: "\"@\" email \"Content Writer\" OR Copywriter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Talent Acquisition Lead", value: "\"@\" email \"Talent Acquisition\" lead OR manager -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "EHS / Safety Manager", value: "\"@\" email \"EHS Manager\" OR \"Safety Manager\" OR \"Health and Safety\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ══════════════════════════════════════════════
    // Self-Employed / Freelancer / Individual
    // ══════════════════════════════════════════════

    // ── Freelancers & Independent Professionals ──
    { name: "Freelance Web Developer", value: "\"@\" email Freelance \"Web Developer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Software Developer", value: "\"@\" email Freelance \"Software Developer\" OR \"Software Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Graphic Designer", value: "\"@\" email Freelance \"Graphic Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance UX/UI Designer", value: "\"@\" email Freelance \"UX Designer\" OR \"UI Designer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Writer / Author", value: "\"@\" email Freelance Writer OR Author -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Copywriter", value: "\"@\" email Freelance Copywriter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Editor / Proofreader", value: "\"@\" email Freelance Editor OR Proofreader -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Photographer", value: "\"@\" email Freelance Photographer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Videographer", value: "\"@\" email Freelance Videographer OR \"Video Editor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Social Media Manager", value: "\"@\" email Freelance \"Social Media Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance SEO Specialist", value: "\"@\" email Freelance \"SEO\" specialist OR consultant -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Digital Marketing", value: "\"@\" email Freelance \"Digital Marketing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Data Scientist", value: "\"@\" email Freelance \"Data Scientist\" OR \"Data Analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Bookkeeper / Accountant", value: "\"@\" email Freelance Bookkeeper OR Accountant -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Virtual Assistant", value: "\"@\" email Freelance \"Virtual Assistant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Translator / Interpreter", value: "\"@\" email Freelance Translator OR Interpreter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Illustrator", value: "\"@\" email Freelance Illustrator -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Motion Designer", value: "\"@\" email Freelance \"Motion Designer\" OR \"Motion Graphics\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Voice Actor", value: "\"@\" email Freelance \"Voice Actor\" OR \"Voice Over\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Freelance Music Producer", value: "\"@\" email Freelance \"Music Producer\" OR \"Audio Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Consultants & Advisors ──
    { name: "Independent Consultant", value: "\"@\" email \"Independent Consultant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Management Consultant (Independent)", value: "\"@\" email \"Management Consultant\" independent OR freelance OR self-employed -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Strategy Consultant (Independent)", value: "\"@\" email \"Strategy Consultant\" independent OR freelance -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "IT Consultant (Independent)", value: "\"@\" email \"IT Consultant\" independent OR freelance -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Marketing Consultant (Independent)", value: "\"@\" email \"Marketing Consultant\" independent OR freelance -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Financial Advisor (Independent)", value: "\"@\" email \"Financial Advisor\" OR \"Financial Planner\" independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Tax Consultant / CPA (Self-Employed)", value: "\"@\" email \"Tax Consultant\" OR CPA self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "HR Consultant (Independent)", value: "\"@\" email \"HR Consultant\" independent OR freelance -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business Coach / Mentor", value: "\"@\" email \"Business Coach\" OR \"Business Mentor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Executive Coach", value: "\"@\" email \"Executive Coach\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Life Coach", value: "\"@\" email \"Life Coach\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Career Coach / Counselor", value: "\"@\" email \"Career Coach\" OR \"Career Counselor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Startup Advisor / Mentor", value: "\"@\" email \"Startup Advisor\" OR \"Startup Mentor\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Solopreneurs & Small Business ──
    { name: "Solopreneur / Solo Founder", value: "\"@\" email Solopreneur OR \"Solo Founder\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Entrepreneur", value: "\"@\" email \"Self-Employed\" Entrepreneur -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Small Business Owner", value: "\"@\" email \"Small Business Owner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Startup Founder (Solo)", value: "\"@\" email Founder \"Startup\" self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "E-Commerce Entrepreneur", value: "\"@\" email \"E-Commerce\" OR Ecommerce Entrepreneur OR Owner -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Amazon / Etsy Seller", value: "\"@\" email Amazon OR Etsy Seller OR Owner -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Dropshipping Business Owner", value: "\"@\" email Dropshipping Owner OR Entrepreneur -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Gig Workers & Contractors ──
    { name: "Independent Contractor", value: "\"@\" email \"Independent Contractor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Contract Software Developer", value: "\"@\" email Contract \"Software Developer\" OR \"Software Engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Contract Project Manager", value: "\"@\" email Contract \"Project Manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Contract Technical Writer", value: "\"@\" email Contract \"Technical Writer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Contract Designer", value: "\"@\" email Contract Designer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Gig Economy / On-Demand Worker", value: "\"@\" email \"Gig Economy\" OR \"On-Demand\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Creative & Personal Brand ──
    { name: "Content Creator / Influencer", value: "\"@\" email \"Content Creator\" OR Influencer OR YouTuber -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Podcaster / Podcast Host", value: "\"@\" email Podcaster OR \"Podcast Host\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Blogger / Online Publisher", value: "\"@\" email Blogger OR \"Online Publisher\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Online Course Creator", value: "\"@\" email \"Course Creator\" OR \"Online Instructor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Digital Nomad", value: "\"@\" email \"Digital Nomad\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Public Speaker / Keynote Speaker", value: "\"@\" email \"Public Speaker\" OR \"Keynote Speaker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Author / Published Writer", value: "\"@\" email Author OR \"Published Writer\" -\"@gmail.com\" -\"@yahoo.com\"" },

    // ── Self-Employed Trades & Services ──
    { name: "Self-Employed Realtor / Agent", value: "\"@\" email \"Real Estate Agent\" OR Realtor self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Insurance Agent", value: "\"@\" email \"Insurance Agent\" self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Attorney / Lawyer", value: "\"@\" email Attorney OR Lawyer \"solo practice\" OR self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Dentist / Doctor", value: "\"@\" email Dentist OR Doctor OR Physician \"private practice\" OR self-employed -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Therapist / Counselor", value: "\"@\" email Therapist OR Counselor \"private practice\" OR self-employed -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Personal Trainer", value: "\"@\" email \"Personal Trainer\" OR \"Fitness Trainer\" self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Tutor / Educator", value: "\"@\" email Tutor OR Educator self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Handyman / Contractor", value: "\"@\" email Handyman OR Contractor self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Chef / Caterer", value: "\"@\" email Chef OR Caterer self-employed OR independent -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Event Planner", value: "\"@\" email \"Event Planner\" self-employed OR independent OR freelance -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Self-Employed Interior Designer", value: "\"@\" email \"Interior Designer\" self-employed OR independent OR freelance -\"@gmail.com\" -\"@yahoo.com\"" },

    // ══════════════════════════════════════════════
    // Office 365 / Microsoft 365 Email Discovery
    // ══════════════════════════════════════════════

    // ── Office 365 Business Email Footprints ──
    { name: "O365: Business emails (onmicrosoft)", value: "\"@\" email \"onmicrosoft.com\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "O365: Company contacts (outlook hosted)", value: "\"@\" email \"mail.protection.outlook.com\" -\"@outlook.com\" -\"@hotmail.com\"" },
    { name: "O365: Business directory emails", value: "\"@\" email \"contact\" OR \"directory\" -\"@gmail.com\" -\"@yahoo.com\" -\"@outlook.com\" -\"@hotmail.com\"" },
    { name: "O365: CEO contact (business domain)", value: "CEO \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@outlook.com\" -\"@hotmail.com\" -\"@aol.com\"" },
    { name: "O365: Staff directory (business domain)", value: "\"staff directory\" OR \"our team\" OR \"leadership\" \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@outlook.com\"" },
    { name: "O365: Company info page emails", value: "\"info@\" OR \"contact@\" OR \"sales@\" -\"@gmail.com\" -\"@yahoo.com\" -\"@outlook.com\" -\"@hotmail.com\"" },

    // ── Google Workspace Email Footprints ──
    { name: "GWS: Business emails (Google-hosted)", value: "\"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@hotmail.com\" \"Google Workspace\" OR \"G Suite\"" },
    { name: "GWS: Company domain contacts", value: "\"@\" email \"contact us\" -\"@gmail.com\" -\"@yahoo.com\" -\"@outlook.com\" -\"@hotmail.com\" -\"@aol.com\"" },

    // ══════════════════════════════════════════════
    // ISP Email Domain Footprints
    // ══════════════════════════════════════════════

    // ── ISP / Webmail Emails ──
    { name: "ISP: Gmail contacts", value: "\"@gmail.com\"" },
    { name: "ISP: Yahoo contacts", value: "\"@yahoo.com\"" },
    { name: "ISP: Outlook contacts", value: "\"@outlook.com\"" },
    { name: "ISP: Hotmail contacts", value: "\"@hotmail.com\"" },
    { name: "ISP: AOL contacts", value: "\"@aol.com\"" },
    { name: "ISP: iCloud contacts", value: "\"@icloud.com\"" },
    { name: "ISP: ProtonMail contacts", value: "\"@protonmail.com\" OR \"@proton.me\"" },
    { name: "ISP: Zoho contacts", value: "\"@zoho.com\"" },
    { name: "ISP: Mail.com contacts", value: "\"@mail.com\"" },
    { name: "ISP: GMX contacts", value: "\"@gmx.com\" OR \"@gmx.net\"" },
    { name: "ISP: Yandex contacts", value: "\"@yandex.com\" OR \"@yandex.ru\"" },
    { name: "ISP: Comcast / Xfinity contacts", value: "\"@comcast.net\" OR \"@xfinity.com\"" },
    { name: "ISP: BellSouth contacts", value: "\"@bellsouth.net\"" },
    { name: "ISP: AT&T contacts", value: "\"@att.net\" OR \"@sbcglobal.net\"" },
    { name: "ISP: Verizon contacts", value: "\"@verizon.net\"" },
    { name: "ISP: Cox contacts", value: "\"@cox.net\"" },
    { name: "ISP: Charter/Spectrum contacts", value: "\"@charter.net\" OR \"@spectrum.net\"" },
    { name: "ISP: CenturyLink / Lumen contacts", value: "\"@centurylink.net\" OR \"@embarqmail.com\"" },
    { name: "ISP: Frontier contacts", value: "\"@frontier.com\" OR \"@frontiernet.net\"" },
    { name: "ISP: Windstream contacts", value: "\"@windstream.net\"" },
    { name: "ISP: EarthLink contacts", value: "\"@earthlink.net\"" },
    { name: "ISP: Optimum / Cablevision contacts", value: "\"@optonline.net\"" },
    { name: "ISP: RCN contacts", value: "\"@rcn.com\"" },
    { name: "ISP: Suddenlink contacts", value: "\"@suddenlink.net\"" },
    { name: "ISP: WOW contacts", value: "\"@wowway.com\"" },
    { name: "ISP: Mediacom contacts", value: "\"@mediacombb.net\"" },
    { name: "ISP: BT contacts (UK)", value: "\"@btinternet.com\"" },
    { name: "ISP: Virgin Media (UK)", value: "\"@virginmedia.com\"" },
    { name: "ISP: Sky contacts (UK)", value: "\"@sky.com\"" },
    { name: "ISP: TalkTalk (UK)", value: "\"@talktalk.net\"" },
    { name: "ISP: Telstra contacts (AU)", value: "\"@bigpond.com\"" },
    { name: "ISP: Optus contacts (AU)", value: "\"@optusnet.com.au\"" },
    { name: "ISP: Rogers contacts (CA)", value: "\"@rogers.com\"" },
    { name: "ISP: Shaw contacts (CA)", value: "\"@shaw.ca\"" },
    { name: "ISP: Bell Canada contacts", value: "\"@bell.net\" OR \"@sympatico.ca\"" },
    { name: "ISP: Telus contacts (CA)", value: "\"@telus.net\"" },
    { name: "ISP: All major ISP emails", value: "\"@gmail.com\" OR \"@yahoo.com\" OR \"@outlook.com\" OR \"@hotmail.com\" OR \"@aol.com\" OR \"@comcast.net\" OR \"@bellsouth.net\" OR \"@att.net\" OR \"@verizon.net\"" },

    // ══════════════════════════════════════════════
    // Business / Company Email Footprints
    // ══════════════════════════════════════════════

    // ── Business Email Patterns ──
    { name: "Business: Company emails (exclude ISP)", value: "\"@\" -\"@gmail.com\" -\"@yahoo.com\" -\"@outlook.com\" -\"@hotmail.com\" -\"@aol.com\" -\"@icloud.com\"" },
    { name: "Business: Company emails (exclude all free)", value: "\"@\" -\"@gmail\" -\"@yahoo\" -\"@outlook\" -\"@hotmail\" -\"@aol\" -\"@icloud\" -\"@protonmail\" -\"@mail.com\" -\"@gmx\"" },
    { name: "Business: CEO email", value: "CEO \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@hotmail.com\"" },
    { name: "Business: CTO email", value: "CTO \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@hotmail.com\"" },
    { name: "Business: CFO email", value: "CFO \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@hotmail.com\"" },
    { name: "Business: HR email", value: "\"Human Resources\" OR HR \"@\" email -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Sales email", value: "Sales \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@hotmail.com\"" },
    { name: "Business: Marketing email", value: "Marketing \"@\" email -\"@gmail.com\" -\"@yahoo.com\" -\"@hotmail.com\"" },
    { name: "Business: IT Department email", value: "\"IT Manager\" OR \"IT Director\" \"@\" email -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Finance Department email", value: "\"Finance\" OR \"Accounting\" \"@\" email -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Procurement email", value: "\"Procurement\" OR \"Purchasing\" \"@\" email -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Legal Department email", value: "\"Legal\" OR \"Counsel\" \"@\" email -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Operations email", value: "\"Operations\" OR \"COO\" \"@\" email -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Contact Us page emails", value: "\"contact us\" \"@\" email" },
    { name: "Business: About page emails", value: "\"about us\" \"@\" email" },
    { name: "Business: Staff directory emails", value: "\"staff directory\" OR \"our team\" \"@\" email" },

    // ── Industry-Specific Business Emails ──
    { name: "Business: Technology companies", value: "\"@\" email technology OR software OR SaaS -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Healthcare companies", value: "\"@\" email healthcare OR medical OR hospital -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Financial services", value: "\"@\" email \"financial services\" OR banking OR insurance -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Manufacturing companies", value: "\"@\" email manufacturing OR industrial -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Retail companies", value: "\"@\" email retail OR ecommerce -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Real estate companies", value: "\"@\" email \"real estate\" OR property -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Education institutions", value: "\"@\" email university OR college OR school OR \".edu\"" },
    { name: "Business: Government agencies", value: "\"@\" email government OR \".gov\"" },
    { name: "Business: Legal firms", value: "\"@\" email \"law firm\" OR attorney OR legal -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Consulting firms", value: "\"@\" email consulting OR consultancy -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Construction companies", value: "\"@\" email construction OR contractor OR builder -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Logistics companies", value: "\"@\" email logistics OR shipping OR freight -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Pharma companies", value: "\"@\" email pharmaceutical OR pharma OR biotech -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Telecom companies", value: "\"@\" email telecom OR telecommunications -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Automotive companies", value: "\"@\" email automotive OR automobile OR dealership -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Energy companies", value: "\"@\" email energy OR oil OR gas OR utility -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Hospitality companies", value: "\"@\" email hotel OR hospitality OR resort -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Agriculture companies", value: "\"@\" email agriculture OR farming OR agribusiness -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Nonprofit organizations", value: "\"@\" email nonprofit OR \"non-profit\" OR NGO OR charity -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "Business: Media & Advertising", value: "\"@\" email media OR advertising OR \"ad agency\" -\"@gmail.com\" -\"@yahoo.com\"" },
    // ── NAICS Industry Codes ──
    { name: "NAICS 11 – Agriculture, Forestry, Fishing & Hunting", value: "\"@\" email agriculture OR forestry OR fishing OR hunting -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 111 – Crop Production", value: "\"@\" email crop OR grain OR vegetable OR fruit OR \"row crop\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 112 – Animal Production & Aquaculture", value: "\"@\" email livestock OR cattle OR poultry OR aquaculture OR dairy -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 113 – Forestry & Logging", value: "\"@\" email forestry OR logging OR timber OR lumber -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 114 – Fishing, Hunting & Trapping", value: "\"@\" email fishing OR hunting OR trapping OR \"commercial fishing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 115 – Support Activities for Agriculture & Forestry", value: "\"@\" email \"farm management\" OR \"crop services\" OR \"soil preparation\" OR \"farm labor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 21 – Mining, Quarrying & Oil/Gas Extraction", value: "\"@\" email mining OR quarrying OR \"oil extraction\" OR \"gas extraction\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 211 – Oil & Gas Extraction", value: "\"@\" email \"oil extraction\" OR \"gas extraction\" OR \"crude petroleum\" OR \"natural gas\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 212 – Mining (except Oil & Gas)", value: "\"@\" email mining OR \"coal mining\" OR \"metal ore\" OR quarry OR \"mineral mining\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 213 – Support Activities for Mining", value: "\"@\" email \"drilling oil\" OR \"well services\" OR \"mining support\" OR \"exploration services\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 22 – Utilities", value: "\"@\" email utility OR \"electric power\" OR \"natural gas distribution\" OR \"water supply\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 221 – Utilities (Electric, Gas, Water)", value: "\"@\" email \"electric utility\" OR \"gas utility\" OR \"water utility\" OR \"power generation\" OR \"sewage treatment\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 23 – Construction", value: "\"@\" email construction OR building OR contractor OR \"general contractor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 236 – Construction of Buildings", value: "\"@\" email \"residential construction\" OR \"commercial construction\" OR \"building construction\" OR \"general contractor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 237 – Heavy & Civil Engineering Construction", value: "\"@\" email \"heavy construction\" OR \"civil engineering\" OR highway OR bridge OR \"infrastructure construction\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 238 – Specialty Trade Contractors", value: "\"@\" email plumbing OR electrical OR HVAC OR roofing OR \"specialty contractor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 31-33 – Manufacturing", value: "\"@\" email manufacturing OR factory OR production OR \"assembly plant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 311 – Food Manufacturing", value: "\"@\" email \"food manufacturing\" OR \"food processing\" OR bakery OR \"meat processing\" OR \"dairy products\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 312 – Beverage & Tobacco Manufacturing", value: "\"@\" email brewery OR winery OR distillery OR \"beverage manufacturing\" OR tobacco -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 313 – Textile Mills", value: "\"@\" email \"textile mill\" OR \"fiber manufacturing\" OR \"yarn spinning\" OR weaving -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 314 – Textile Product Mills", value: "\"@\" email \"textile products\" OR carpet OR curtain OR \"textile furnishings\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 315 – Apparel Manufacturing", value: "\"@\" email \"apparel manufacturing\" OR \"clothing manufacturing\" OR garment OR \"cut and sew\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 316 – Leather & Allied Products", value: "\"@\" email leather OR footwear OR \"leather goods\" OR luggage -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 321 – Wood Product Manufacturing", value: "\"@\" email \"wood product\" OR sawmill OR \"wood preservation\" OR plywood -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 322 – Paper Manufacturing", value: "\"@\" email \"paper manufacturing\" OR \"pulp mill\" OR paperboard OR \"paper products\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 323 – Printing & Related Support", value: "\"@\" email printing OR \"print shop\" OR \"commercial printing\" OR lithography -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 324 – Petroleum & Coal Products", value: "\"@\" email \"petroleum refining\" OR \"coal products\" OR asphalt OR \"lubricating oils\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 325 – Chemical Manufacturing", value: "\"@\" email \"chemical manufacturing\" OR pharmaceutical OR pesticide OR \"industrial chemicals\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 326 – Plastics & Rubber Products", value: "\"@\" email plastics OR rubber OR \"plastic products\" OR \"rubber products\" OR \"injection molding\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 327 – Nonmetallic Mineral Products", value: "\"@\" email glass OR cement OR concrete OR ceramics OR \"mineral products\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 331 – Primary Metal Manufacturing", value: "\"@\" email \"steel manufacturing\" OR \"aluminum manufacturing\" OR smelting OR foundry OR \"primary metal\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 332 – Fabricated Metal Products", value: "\"@\" email \"metal fabrication\" OR forging OR stamping OR \"machine shop\" OR \"metal stamping\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 333 – Machinery Manufacturing", value: "\"@\" email \"machinery manufacturing\" OR \"industrial machinery\" OR turbine OR \"construction machinery\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 334 – Computer & Electronic Products", value: "\"@\" email \"computer manufacturing\" OR semiconductor OR \"electronic components\" OR \"circuit board\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 335 – Electrical Equipment & Appliances", value: "\"@\" email \"electrical equipment\" OR \"household appliances\" OR \"lighting equipment\" OR \"electrical components\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 336 – Transportation Equipment", value: "\"@\" email \"automobile manufacturing\" OR \"aerospace manufacturing\" OR \"ship building\" OR \"railroad rolling stock\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 337 – Furniture & Related Products", value: "\"@\" email \"furniture manufacturing\" OR \"office furniture\" OR \"kitchen cabinet\" OR mattress -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 339 – Miscellaneous Manufacturing", value: "\"@\" email \"medical device\" OR jewelry OR \"sporting goods manufacturing\" OR \"toy manufacturing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 42 – Wholesale Trade", value: "\"@\" email wholesale OR distributor OR \"wholesale trade\" OR \"merchant wholesaler\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 423 – Durable Goods Wholesalers", value: "\"@\" email \"durable goods\" OR \"wholesale electronics\" OR \"wholesale machinery\" OR \"wholesale lumber\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 424 – Nondurable Goods Wholesalers", value: "\"@\" email \"nondurable goods\" OR \"wholesale grocery\" OR \"wholesale apparel\" OR \"wholesale chemicals\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 425 – Wholesale Trade Agents & Brokers", value: "\"@\" email \"wholesale agent\" OR \"wholesale broker\" OR \"trade agent\" OR \"merchandise broker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 44-45 – Retail Trade", value: "\"@\" email retail OR \"retail store\" OR \"retail sales\" OR retailer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 441 – Motor Vehicle & Parts Dealers", value: "\"@\" email \"auto dealer\" OR \"car dealership\" OR \"auto parts\" OR \"motor vehicle dealer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 442 – Furniture & Home Furnishings", value: "\"@\" email \"furniture store\" OR \"home furnishings\" OR \"floor covering\" OR \"window treatment\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 443 – Electronics & Appliance Stores", value: "\"@\" email \"electronics store\" OR \"appliance store\" OR \"computer store\" OR \"consumer electronics\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 444 – Building Material & Garden Equipment", value: "\"@\" email \"building materials\" OR \"hardware store\" OR \"garden center\" OR \"home improvement\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 445 – Food & Beverage Retailers", value: "\"@\" email \"grocery store\" OR supermarket OR \"food retailer\" OR \"specialty food\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 446 – Health & Personal Care Retailers", value: "\"@\" email pharmacy OR drugstore OR \"health store\" OR \"personal care store\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 447 – Gasoline Stations", value: "\"@\" email \"gas station\" OR \"fuel station\" OR \"convenience store\" OR \"gasoline station\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 448 – Clothing & Accessories Stores", value: "\"@\" email \"clothing store\" OR \"apparel store\" OR \"shoe store\" OR \"jewelry store\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 451 – Sporting Goods, Hobby, Book & Music", value: "\"@\" email \"sporting goods\" OR \"hobby shop\" OR bookstore OR \"music store\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 452 – General Merchandise Retailers", value: "\"@\" email \"department store\" OR \"general merchandise\" OR \"warehouse club\" OR \"variety store\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 453 – Miscellaneous Store Retailers", value: "\"@\" email \"gift shop\" OR \"pet store\" OR \"office supply\" OR \"used merchandise\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 454 – Nonstore Retailers", value: "\"@\" email \"e-commerce\" OR \"online retailer\" OR \"mail order\" OR \"vending machine\" OR \"direct selling\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 48-49 – Transportation & Warehousing", value: "\"@\" email transportation OR warehousing OR logistics OR freight OR carrier -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 481 – Air Transportation", value: "\"@\" email airline OR \"air cargo\" OR \"air transportation\" OR \"charter flights\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 482 – Rail Transportation", value: "\"@\" email railroad OR \"rail transportation\" OR \"freight rail\" OR \"passenger rail\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 483 – Water Transportation", value: "\"@\" email \"water transportation\" OR shipping OR \"marine cargo\" OR ferry -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 484 – Truck Transportation", value: "\"@\" email trucking OR \"truck transportation\" OR \"freight trucking\" OR \"long haul\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 485 – Transit & Ground Passenger Transportation", value: "\"@\" email transit OR \"bus service\" OR taxi OR \"ground transportation\" OR \"ride service\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 486 – Pipeline Transportation", value: "\"@\" email pipeline OR \"pipeline transportation\" OR \"natural gas pipeline\" OR \"petroleum pipeline\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 487 – Scenic & Sightseeing Transportation", value: "\"@\" email \"sightseeing\" OR \"scenic tours\" OR \"tour boat\" OR \"excursion train\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 488 – Support Activities for Transportation", value: "\"@\" email \"freight handling\" OR \"marine terminal\" OR \"air traffic\" OR \"transportation support\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 491 – Postal Service", value: "\"@\" email \"postal service\" OR \"mail delivery\" OR \"post office\" OR courier -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 492 – Couriers & Messengers", value: "\"@\" email courier OR messenger OR \"express delivery\" OR \"parcel delivery\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 493 – Warehousing & Storage", value: "\"@\" email warehousing OR \"self storage\" OR \"cold storage\" OR \"warehouse storage\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 51 – Information", value: "\"@\" email publishing OR broadcasting OR telecommunications OR \"data processing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 511 – Publishing Industries", value: "\"@\" email publishing OR \"book publisher\" OR \"newspaper publisher\" OR \"software publisher\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 512 – Motion Picture & Sound Recording", value: "\"@\" email \"motion picture\" OR \"film production\" OR \"sound recording\" OR \"music production\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 515 – Broadcasting (except Internet)", value: "\"@\" email broadcasting OR \"radio station\" OR \"television station\" OR \"cable network\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 517 – Telecommunications", value: "\"@\" email telecommunications OR telecom OR \"wireless carrier\" OR \"internet service provider\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 518 – Data Processing & Hosting", value: "\"@\" email \"data processing\" OR \"web hosting\" OR \"data center\" OR \"cloud hosting\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 519 – Web Search Portals, Libraries & Archives", value: "\"@\" email \"web portal\" OR \"search engine\" OR library OR archive OR \"information services\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 52 – Finance & Insurance", value: "\"@\" email finance OR insurance OR banking OR \"financial services\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 521 – Monetary Authorities", value: "\"@\" email \"central bank\" OR \"monetary authority\" OR \"federal reserve\" OR \"reserve bank\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 522 – Credit Intermediation", value: "\"@\" email \"commercial bank\" OR \"credit union\" OR \"savings institution\" OR \"mortgage lender\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 523 – Securities & Commodity Contracts", value: "\"@\" email \"securities broker\" OR \"investment banking\" OR \"commodity contracts\" OR \"stock exchange\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 524 – Insurance Carriers", value: "\"@\" email \"insurance carrier\" OR \"insurance agency\" OR \"insurance broker\" OR underwriting -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 525 – Funds, Trusts & Other Financial Vehicles", value: "\"@\" email \"pension fund\" OR \"trust fund\" OR \"mutual fund\" OR \"investment fund\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 53 – Real Estate & Rental/Leasing", value: "\"@\" email \"real estate\" OR rental OR leasing OR property -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 531 – Real Estate", value: "\"@\" email \"real estate agent\" OR \"real estate broker\" OR \"property management\" OR \"real estate appraiser\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 532 – Rental & Leasing Services", value: "\"@\" email \"equipment rental\" OR \"car rental\" OR \"consumer goods rental\" OR leasing -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 533 – Lessors of Nonfinancial Intangible Assets", value: "\"@\" email \"franchise\" OR \"trademark licensing\" OR \"patent licensing\" OR \"intellectual property leasing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 54 – Professional, Scientific & Technical Services", value: "\"@\" email consulting OR \"professional services\" OR \"technical services\" OR \"scientific research\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 541 – Professional, Scientific & Technical Services", value: "\"@\" email \"law firm\" OR accounting OR consulting OR engineering OR \"research and development\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 55 – Management of Companies", value: "\"@\" email \"holding company\" OR \"corporate office\" OR \"management company\" OR \"head office\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 551 – Management of Companies & Enterprises", value: "\"@\" email \"holding company\" OR \"corporate headquarters\" OR \"management office\" OR \"enterprise management\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 56 – Administrative & Support Services", value: "\"@\" email \"administrative services\" OR \"staffing agency\" OR \"waste management\" OR \"security services\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 561 – Administrative & Support Services", value: "\"@\" email \"staffing agency\" OR \"temporary help\" OR \"janitorial services\" OR \"call center\" OR \"document preparation\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 562 – Waste Management & Remediation", value: "\"@\" email \"waste management\" OR \"waste collection\" OR remediation OR \"hazardous waste\" OR recycling -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 61 – Educational Services", value: "\"@\" email education OR school OR university OR college OR training -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 611 – Educational Services", value: "\"@\" email \"elementary school\" OR \"secondary school\" OR university OR \"trade school\" OR \"educational support\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 62 – Health Care & Social Assistance", value: "\"@\" email healthcare OR hospital OR \"social assistance\" OR \"medical practice\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 621 – Ambulatory Health Care Services", value: "\"@\" email \"physician office\" OR \"dental office\" OR \"outpatient care\" OR \"medical laboratory\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 622 – Hospitals", value: "\"@\" email hospital OR \"medical center\" OR \"surgical hospital\" OR \"psychiatric hospital\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 623 – Nursing & Residential Care", value: "\"@\" email \"nursing home\" OR \"assisted living\" OR \"residential care\" OR \"continuing care\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 624 – Social Assistance", value: "\"@\" email \"child care\" OR \"social services\" OR \"community food\" OR \"vocational rehabilitation\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 71 – Arts, Entertainment & Recreation", value: "\"@\" email entertainment OR recreation OR \"performing arts\" OR museum -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 711 – Performing Arts & Spectator Sports", value: "\"@\" email theater OR \"performing arts\" OR \"spectator sports\" OR \"sports team\" OR promoter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 712 – Museums, Historical Sites & Similar", value: "\"@\" email museum OR \"historical site\" OR \"botanical garden\" OR \"nature park\" OR zoo -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 713 – Amusement, Gambling & Recreation", value: "\"@\" email \"amusement park\" OR casino OR \"golf course\" OR \"fitness center\" OR \"ski resort\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 72 – Accommodation & Food Services", value: "\"@\" email hotel OR restaurant OR \"food service\" OR accommodation -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 721 – Accommodation", value: "\"@\" email hotel OR motel OR \"bed and breakfast\" OR \"RV park\" OR resort -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 722 – Food Services & Drinking Places", value: "\"@\" email restaurant OR \"fast food\" OR catering OR bar OR \"drinking place\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 81 – Other Services", value: "\"@\" email repair OR \"personal care\" OR \"religious organization\" OR \"civic organization\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 811 – Repair & Maintenance", value: "\"@\" email \"auto repair\" OR \"appliance repair\" OR \"electronic repair\" OR \"equipment repair\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 812 – Personal & Laundry Services", value: "\"@\" email \"hair salon\" OR \"dry cleaning\" OR \"funeral home\" OR \"pet care\" OR laundry -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 813 – Religious, Civic & Professional Organizations", value: "\"@\" email church OR \"civic organization\" OR \"professional association\" OR \"labor union\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 814 – Private Households", value: "\"@\" email \"private household\" OR \"household employer\" OR \"domestic worker\" OR \"personal employee\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 92 – Public Administration", value: "\"@\" email government OR \"public administration\" OR federal OR municipal -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 921 – Executive & Legislative Government", value: "\"@\" email \"executive office\" OR legislature OR \"city council\" OR \"governor office\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 922 – Justice, Public Order & Safety", value: "\"@\" email \"police department\" OR \"fire department\" OR court OR \"corrections facility\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 923 – Human Resource Programs Administration", value: "\"@\" email \"social security\" OR \"unemployment insurance\" OR \"public health program\" OR \"veterans affairs\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 924 – Environmental Quality Programs", value: "\"@\" email \"environmental agency\" OR \"air quality\" OR \"water quality\" OR \"environmental regulation\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 925 – Housing & Community Development", value: "\"@\" email \"housing authority\" OR \"community development\" OR \"urban planning\" OR \"rural development\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 926 – Economic Programs Administration", value: "\"@\" email \"economic development\" OR \"trade regulation\" OR \"transportation program\" OR \"utility regulation\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 927 – Space Research & Technology", value: "\"@\" email \"space research\" OR \"space technology\" OR NASA OR \"aerospace agency\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "NAICS 928 – National Security & International Affairs", value: "\"@\" email \"national security\" OR \"defense department\" OR \"international affairs\" OR \"intelligence agency\" -\"@gmail.com\" -\"@yahoo.com\"" },
    // ── SOC Occupation Codes ──
    { name: "SOC 11-0000 – Management Occupations", value: "\"@\" email manager OR director OR executive OR CEO OR \"vice president\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 11-1000 – Top Executives", value: "\"@\" email CEO OR COO OR CFO OR \"chief executive\" OR \"general manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 11-2000 – Advertising, Marketing, PR & Sales Managers", value: "\"@\" email \"marketing manager\" OR \"advertising manager\" OR \"PR manager\" OR \"sales manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 11-3000 – Operations Specialties Managers", value: "\"@\" email \"operations manager\" OR \"IT manager\" OR \"financial manager\" OR \"compensation manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 11-9000 – Other Management Occupations", value: "\"@\" email \"construction manager\" OR \"education administrator\" OR \"food service manager\" OR \"property manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 13-0000 – Business & Financial Operations", value: "\"@\" email analyst OR accountant OR auditor OR \"business operations\" OR \"financial analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 13-1000 – Business Operations Specialists", value: "\"@\" email \"project manager\" OR \"management analyst\" OR \"compliance officer\" OR \"meeting planner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 13-2000 – Financial Specialists", value: "\"@\" email accountant OR auditor OR \"financial analyst\" OR \"budget analyst\" OR \"tax examiner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 15-0000 – Computer & Mathematical", value: "\"@\" email developer OR programmer OR \"software engineer\" OR \"data scientist\" OR mathematician -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 15-1200 – Computer Occupations", value: "\"@\" email \"software developer\" OR \"systems administrator\" OR \"database administrator\" OR \"web developer\" OR \"network architect\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 15-2000 – Mathematical Science", value: "\"@\" email mathematician OR statistician OR actuary OR \"operations research analyst\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 17-0000 – Architecture & Engineering", value: "\"@\" email architect OR engineer OR surveyor OR drafter -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 17-1000 – Architects, Surveyors & Cartographers", value: "\"@\" email architect OR \"landscape architect\" OR surveyor OR cartographer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 17-2000 – Engineers", value: "\"@\" email \"civil engineer\" OR \"mechanical engineer\" OR \"electrical engineer\" OR \"chemical engineer\" OR \"industrial engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 17-3000 – Drafters, Engineering Technicians", value: "\"@\" email drafter OR \"engineering technician\" OR \"surveying technician\" OR \"CAD technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 19-0000 – Life, Physical & Social Science", value: "\"@\" email scientist OR researcher OR biologist OR chemist OR physicist OR sociologist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 19-1000 – Life Scientists", value: "\"@\" email biologist OR microbiologist OR zoologist OR \"conservation scientist\" OR epidemiologist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 19-2000 – Physical Scientists", value: "\"@\" email physicist OR chemist OR astronomer OR geoscientist OR \"atmospheric scientist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 19-3000 – Social Scientists", value: "\"@\" email economist OR psychologist OR sociologist OR \"political scientist\" OR \"urban planner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 19-4000 – Life, Physical & Social Science Technicians", value: "\"@\" email \"lab technician\" OR \"chemical technician\" OR \"biological technician\" OR \"environmental technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 21-0000 – Community & Social Service", value: "\"@\" email counselor OR \"social worker\" OR \"community health\" OR \"substance abuse\" OR \"probation officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 21-1000 – Counselors, Social Workers & Community Workers", value: "\"@\" email \"social worker\" OR counselor OR \"mental health counselor\" OR \"community health worker\" OR \"probation officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 21-2000 – Religious Workers", value: "\"@\" email clergy OR pastor OR chaplain OR \"religious director\" OR minister -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 23-0000 – Legal", value: "\"@\" email lawyer OR attorney OR judge OR paralegal OR \"legal assistant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 23-1000 – Lawyers, Judges & Related", value: "\"@\" email lawyer OR attorney OR judge OR magistrate OR \"administrative law judge\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 23-2000 – Legal Support Workers", value: "\"@\" email paralegal OR \"legal assistant\" OR \"court reporter\" OR \"title examiner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 25-0000 – Educational Instruction & Library", value: "\"@\" email teacher OR professor OR instructor OR librarian OR tutor -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 25-1000 – Postsecondary Teachers", value: "\"@\" email professor OR \"associate professor\" OR \"assistant professor\" OR lecturer OR \"postsecondary instructor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 25-2000 – Primary, Secondary & Special Ed Teachers", value: "\"@\" email \"elementary teacher\" OR \"middle school teacher\" OR \"high school teacher\" OR \"special education teacher\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 25-3000 – Other Teachers & Instructors", value: "\"@\" email tutor OR \"substitute teacher\" OR \"adult education\" OR \"self-enrichment teacher\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 25-4000 – Librarians, Curators & Archivists", value: "\"@\" email librarian OR curator OR archivist OR \"museum technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 25-9000 – Other Educational Workers", value: "\"@\" email \"teaching assistant\" OR \"instructional coordinator\" OR \"education aide\" OR \"school counselor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 27-0000 – Arts, Design, Entertainment, Sports & Media", value: "\"@\" email designer OR artist OR writer OR reporter OR musician OR athlete -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 27-1000 – Art & Design Workers", value: "\"@\" email \"graphic designer\" OR \"interior designer\" OR \"industrial designer\" OR \"floral designer\" OR illustrator -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 27-2000 – Entertainers, Performers & Sports", value: "\"@\" email actor OR musician OR dancer OR athlete OR coach OR choreographer -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 27-3000 – Media & Communication Workers", value: "\"@\" email reporter OR editor OR \"public relations\" OR writer OR author OR \"technical writer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 27-4000 – Media & Communication Equipment Workers", value: "\"@\" email photographer OR \"camera operator\" OR \"film editor\" OR \"sound engineer\" OR \"broadcast technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 29-0000 – Healthcare Practitioners & Technical", value: "\"@\" email physician OR nurse OR pharmacist OR therapist OR \"registered nurse\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 29-1000 – Health Diagnosing & Treating Practitioners", value: "\"@\" email physician OR surgeon OR dentist OR optometrist OR \"physician assistant\" OR \"nurse practitioner\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 29-2000 – Health Technologists & Technicians", value: "\"@\" email \"medical technologist\" OR \"radiologic technician\" OR \"dental hygienist\" OR \"pharmacy technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 29-9000 – Other Healthcare Practitioners", value: "\"@\" email \"health information\" OR dietitian OR audiologist OR \"athletic trainer\" OR \"occupational health\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 31-0000 – Healthcare Support", value: "\"@\" email \"nursing assistant\" OR \"home health aide\" OR \"medical assistant\" OR \"physical therapy aide\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 31-1000 – Nursing Assistants, Orderlies & Psychiatric Aides", value: "\"@\" email \"nursing assistant\" OR orderly OR \"psychiatric aide\" OR CNA -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 31-9000 – Other Healthcare Support", value: "\"@\" email \"medical assistant\" OR phlebotomist OR \"physical therapy aide\" OR \"massage therapist\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 33-0000 – Protective Service", value: "\"@\" email \"police officer\" OR firefighter OR \"security guard\" OR detective OR \"correctional officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 33-1000 – Supervisors of Protective Service", value: "\"@\" email \"police sergeant\" OR \"fire captain\" OR \"security supervisor\" OR \"corrections supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 33-2000 – Firefighting & Prevention", value: "\"@\" email firefighter OR \"fire inspector\" OR \"fire investigator\" OR \"forest firefighter\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 33-3000 – Law Enforcement", value: "\"@\" email \"police officer\" OR detective OR \"criminal investigator\" OR sheriff OR \"transit police\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 33-9000 – Other Protective Service", value: "\"@\" email \"security guard\" OR \"crossing guard\" OR \"lifeguard\" OR \"TSA officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 35-0000 – Food Preparation & Serving", value: "\"@\" email chef OR cook OR \"food server\" OR bartender OR \"food preparation\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 35-1000 – Supervisors of Food Preparation", value: "\"@\" email \"head chef\" OR \"kitchen manager\" OR \"food service supervisor\" OR \"executive chef\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 35-2000 – Cooks & Food Preparation", value: "\"@\" email cook OR \"prep cook\" OR \"line cook\" OR \"short order cook\" OR \"food preparation worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 35-3000 – Food & Beverage Serving", value: "\"@\" email waiter OR waitress OR bartender OR barista OR \"food server\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 35-9000 – Other Food Preparation & Serving", value: "\"@\" email \"dining room attendant\" OR dishwasher OR \"food runner\" OR \"cafeteria attendant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 37-0000 – Building & Grounds Cleaning/Maintenance", value: "\"@\" email janitor OR custodian OR \"grounds keeper\" OR maid OR \"pest control\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 37-1000 – Supervisors of Building & Grounds", value: "\"@\" email \"janitorial supervisor\" OR \"housekeeping supervisor\" OR \"grounds maintenance supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 37-2000 – Building Cleaning & Pest Control", value: "\"@\" email janitor OR custodian OR maid OR \"pest control technician\" OR housekeeper -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 37-3000 – Grounds Maintenance", value: "\"@\" email landscaper OR \"groundskeeper\" OR \"tree trimmer\" OR \"lawn service\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-0000 – Personal Care & Service", value: "\"@\" email hairdresser OR \"fitness trainer\" OR \"child care\" OR \"personal care aide\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-1000 – Supervisors of Personal Care", value: "\"@\" email \"personal care supervisor\" OR \"spa manager\" OR \"salon manager\" OR \"recreation supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-2000 – Animal Care & Service", value: "\"@\" email \"animal trainer\" OR \"veterinary assistant\" OR \"dog groomer\" OR \"animal caretaker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-3000 – Entertainment Attendants", value: "\"@\" email \"usher\" OR \"amusement attendant\" OR \"recreation attendant\" OR \"locker room attendant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-4000 – Funeral Service", value: "\"@\" email \"funeral director\" OR mortician OR embalmer OR \"funeral attendant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-5000 – Personal Appearance", value: "\"@\" email hairdresser OR barber OR \"makeup artist\" OR \"skin care specialist\" OR manicurist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 39-9000 – Other Personal Care & Service", value: "\"@\" email \"personal care aide\" OR \"fitness trainer\" OR \"tour guide\" OR \"child care worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 41-0000 – Sales & Related", value: "\"@\" email \"sales representative\" OR \"sales associate\" OR \"account executive\" OR cashier -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 41-1000 – Supervisors of Sales", value: "\"@\" email \"sales manager\" OR \"sales supervisor\" OR \"retail manager\" OR \"store manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 41-2000 – Retail Sales", value: "\"@\" email \"retail sales\" OR cashier OR \"sales associate\" OR \"sales clerk\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 41-3000 – Sales Representatives, Services", value: "\"@\" email \"insurance agent\" OR \"real estate agent\" OR \"travel agent\" OR \"advertising sales\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 41-4000 – Sales Representatives, Wholesale/Manufacturing", value: "\"@\" email \"sales representative\" OR \"account manager\" OR \"territory manager\" OR \"wholesale sales\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 41-9000 – Other Sales & Related", value: "\"@\" email telemarketer OR \"door to door\" OR \"sales engineer\" OR \"parts salesperson\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-0000 – Office & Administrative Support", value: "\"@\" email \"administrative assistant\" OR secretary OR clerk OR receptionist OR \"office manager\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-1000 – Supervisors of Office & Administrative Support", value: "\"@\" email \"office manager\" OR \"administrative supervisor\" OR \"clerical supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-2000 – Communications Equipment Operators", value: "\"@\" email \"switchboard operator\" OR \"telephone operator\" OR dispatcher OR \"communications operator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-3000 – Financial Clerks", value: "\"@\" email \"billing clerk\" OR bookkeeper OR \"payroll clerk\" OR teller OR \"accounting clerk\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-4000 – Information & Record Clerks", value: "\"@\" email receptionist OR \"file clerk\" OR \"court clerk\" OR \"medical records\" OR \"customer service representative\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-5000 – Material Recording & Dispatching", value: "\"@\" email dispatcher OR \"shipping clerk\" OR \"stock clerk\" OR \"production clerk\" OR \"order clerk\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-6000 – Secretaries & Administrative Assistants", value: "\"@\" email secretary OR \"administrative assistant\" OR \"executive assistant\" OR \"legal secretary\" OR \"medical secretary\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 43-9000 – Other Office & Administrative Support", value: "\"@\" email \"data entry\" OR \"mail clerk\" OR \"office clerk\" OR \"proofreader\" OR \"statistical assistant\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 45-0000 – Farming, Fishing & Forestry", value: "\"@\" email farmer OR rancher OR fisherman OR \"logging worker\" OR \"agricultural worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 45-1000 – Supervisors of Farming, Fishing & Forestry", value: "\"@\" email \"farm supervisor\" OR \"ranch foreman\" OR \"logging supervisor\" OR \"agricultural supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 45-2000 – Agricultural Workers", value: "\"@\" email \"farm worker\" OR \"crop worker\" OR \"nursery worker\" OR \"agricultural inspector\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 45-3000 – Fishing & Hunting Workers", value: "\"@\" email fisherman OR \"fishing vessel\" OR hunter OR trapper -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 45-4000 – Forest, Conservation & Logging", value: "\"@\" email \"log grader\" OR \"forest worker\" OR \"conservation worker\" OR \"logging equipment operator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 47-0000 – Construction & Extraction", value: "\"@\" email carpenter OR electrician OR plumber OR \"construction worker\" OR welder -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 47-1000 – Supervisors of Construction & Extraction", value: "\"@\" email \"construction supervisor\" OR \"construction foreman\" OR \"site superintendent\" OR \"extraction supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 47-2000 – Construction Trades", value: "\"@\" email carpenter OR electrician OR plumber OR bricklayer OR roofer OR \"iron worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 47-3000 – Helpers, Construction Trades", value: "\"@\" email \"construction helper\" OR \"electrician helper\" OR \"plumber helper\" OR \"carpenter helper\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 47-4000 – Other Construction", value: "\"@\" email \"fence erector\" OR \"hazmat worker\" OR \"rail-track worker\" OR \"septic tank servicer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 47-5000 – Extraction Workers", value: "\"@\" email \"mining machine operator\" OR \"oil derrick\" OR \"rotary drill\" OR \"explosives worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 49-0000 – Installation, Maintenance & Repair", value: "\"@\" email technician OR mechanic OR installer OR \"maintenance worker\" OR \"repair technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 49-1000 – Supervisors of Installation & Maintenance", value: "\"@\" email \"maintenance supervisor\" OR \"installation supervisor\" OR \"repair supervisor\" OR \"mechanic supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 49-2000 – Electrical & Electronic Equipment Mechanics", value: "\"@\" email \"electronics technician\" OR \"avionics technician\" OR \"electrical repairer\" OR \"telecom installer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 49-3000 – Vehicle & Mobile Equipment Mechanics", value: "\"@\" email \"auto mechanic\" OR \"diesel mechanic\" OR \"aircraft mechanic\" OR \"bus mechanic\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 49-9000 – Other Installation, Maintenance & Repair", value: "\"@\" email \"HVAC technician\" OR locksmith OR \"maintenance worker\" OR \"appliance repairer\" OR millwright -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-0000 – Production", value: "\"@\" email \"machine operator\" OR assembler OR welder OR \"production worker\" OR machinist -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-1000 – Supervisors of Production", value: "\"@\" email \"production supervisor\" OR \"manufacturing supervisor\" OR \"plant foreman\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-2000 – Assemblers & Fabricators", value: "\"@\" email assembler OR fabricator OR \"electrical assembler\" OR \"team assembler\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-3000 – Food Processing", value: "\"@\" email \"food batchmaker\" OR \"meat cutter\" OR baker OR \"food processing worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-4000 – Metal Workers & Plastic Workers", value: "\"@\" email machinist OR welder OR \"CNC operator\" OR \"tool and die maker\" OR \"metal fabricator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-5000 – Printing Workers", value: "\"@\" email \"printing press operator\" OR \"prepress technician\" OR \"print binding\" OR \"digital printing\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-6000 – Textile, Apparel & Furnishings", value: "\"@\" email \"sewing machine operator\" OR tailor OR upholsterer OR \"textile worker\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-7000 – Woodworkers", value: "\"@\" email cabinetmaker OR \"woodworking machine\" OR \"sawing machine operator\" OR woodworker -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-8000 – Plant & System Operators", value: "\"@\" email \"power plant operator\" OR \"water treatment operator\" OR \"chemical plant operator\" OR \"stationary engineer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 51-9000 – Other Production", value: "\"@\" email inspector OR \"packaging operator\" OR \"painting worker\" OR \"jewelry maker\" OR \"dental lab technician\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-0000 – Transportation & Material Moving", value: "\"@\" email driver OR pilot OR \"truck driver\" OR \"forklift operator\" OR \"material handler\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-1000 – Supervisors of Transportation & Material Moving", value: "\"@\" email \"transportation supervisor\" OR \"warehouse supervisor\" OR \"logistics supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-2000 – Air Transportation Workers", value: "\"@\" email pilot OR \"airline pilot\" OR \"flight engineer\" OR \"air traffic controller\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-3000 – Motor Vehicle Operators", value: "\"@\" email \"truck driver\" OR \"bus driver\" OR \"delivery driver\" OR \"taxi driver\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-4000 – Rail Transportation Workers", value: "\"@\" email \"locomotive engineer\" OR \"rail yard worker\" OR \"train conductor\" OR \"subway operator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-5000 – Water Transportation Workers", value: "\"@\" email \"ship captain\" OR \"ship engineer\" OR sailor OR \"boat operator\" OR mate -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-6000 – Other Transportation Workers", value: "\"@\" email \"parking attendant\" OR \"traffic technician\" OR \"bridge tender\" OR \"transportation inspector\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 53-7000 – Material Moving Workers", value: "\"@\" email \"forklift operator\" OR \"crane operator\" OR \"material handler\" OR \"conveyor operator\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 55-0000 – Military Specific", value: "\"@\" email military OR \"armed forces\" OR veteran OR \"military officer\" OR \"enlisted military\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 55-1000 – Military Officer Special & Tactical Operations", value: "\"@\" email \"military officer\" OR \"special operations\" OR \"tactical officer\" OR \"infantry officer\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 55-2000 – First-Line Enlisted Military Supervisors", value: "\"@\" email sergeant OR \"staff sergeant\" OR \"master sergeant\" OR \"first sergeant\" OR \"military supervisor\" -\"@gmail.com\" -\"@yahoo.com\"" },
    { name: "SOC 55-3000 – Military Enlisted Tactical Operations", value: "\"@\" email \"infantry\" OR \"combat engineer\" OR \"military intelligence\" OR \"special forces enlisted\" -\"@gmail.com\" -\"@yahoo.com\"" }
];

serpdigger.api.footprints.get = function (callback) {
    fetch(serpdigger.config.api.footprints.url, {
        method: serpdigger.config.api.footprints.method,
        cache: 'no-cache'
    })
    .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var ct = (response.headers.get('content-type') || '').toLowerCase();
        if (ct.indexOf('text/html') !== -1) throw new Error('Expected text/plain footprints but received text/html');
        return response.text();
    })
    .then(function(data) {
        var trimmed = data.trimStart();
        if (trimmed.charAt(0) === '<' || trimmed.indexOf('<!DOCTYPE') !== -1) {
            throw new Error('Response body contains HTML markup instead of footprints data');
        }
        var parsed = _parseFootprints(data).filter(function (f) {
            return f.name && f.value;
        });
        callback(parsed.length > 0 ? parsed : _builtinFootprints);
    })
    .catch(function() {
        callback(_builtinFootprints);
    });
};