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
    { name: "CEO / Chief Executive Officer", value: "site:linkedin.com/in/ CEO" },
    { name: "CFO / Chief Financial Officer", value: "site:linkedin.com/in/ CFO" },
    { name: "COO / Chief Operating Officer", value: "site:linkedin.com/in/ COO" },
    { name: "CTO / Chief Technology Officer", value: "site:linkedin.com/in/ CTO" },
    { name: "CMO / Chief Marketing Officer", value: "site:linkedin.com/in/ CMO" },
    { name: "CIO / Chief Information Officer", value: "site:linkedin.com/in/ CIO" },
    { name: "CHRO / Chief Human Resources Officer", value: "site:linkedin.com/in/ CHRO" },
    { name: "CLO / Chief Legal Officer", value: "site:linkedin.com/in/ CLO" },
    { name: "CSO / Chief Security Officer", value: "site:linkedin.com/in/ CSO" },
    { name: "CDO / Chief Data Officer", value: "site:linkedin.com/in/ CDO" },
    { name: "CPO / Chief Product Officer", value: "site:linkedin.com/in/ CPO" },
    { name: "CRO / Chief Revenue Officer", value: "site:linkedin.com/in/ CRO" },
    { name: "President", value: "site:linkedin.com/in/ President" },
    { name: "Vice President (VP)", value: "site:linkedin.com/in/ \"Vice President\"" },
    { name: "Managing Director", value: "site:linkedin.com/in/ \"Managing Director\"" },
    { name: "Executive Director", value: "site:linkedin.com/in/ \"Executive Director\"" },
    { name: "Board Member / Director", value: "site:linkedin.com/in/ \"Board Member\" OR \"Board of Directors\"" },
    { name: "Partner", value: "site:linkedin.com/in/ Partner" },
    { name: "Founder / Co-Founder", value: "site:linkedin.com/in/ Founder OR \"Co-Founder\"" },
    { name: "Owner / Proprietor", value: "site:linkedin.com/in/ Owner OR Proprietor" },

    // ── Senior Management ──
    { name: "Senior Vice President (SVP)", value: "site:linkedin.com/in/ \"Senior Vice President\"" },
    { name: "General Manager", value: "site:linkedin.com/in/ \"General Manager\"" },
    { name: "Director", value: "site:linkedin.com/in/ Director" },
    { name: "Senior Director", value: "site:linkedin.com/in/ \"Senior Director\"" },
    { name: "Head of Department", value: "site:linkedin.com/in/ \"Head of\"" },
    { name: "Principal", value: "site:linkedin.com/in/ Principal" },

    // ── Sales ──
    { name: "VP of Sales", value: "site:linkedin.com/in/ \"VP of Sales\" OR \"Vice President of Sales\"" },
    { name: "Sales Director", value: "site:linkedin.com/in/ \"Sales Director\"" },
    { name: "Sales Manager", value: "site:linkedin.com/in/ \"Sales Manager\"" },
    { name: "Regional Sales Manager", value: "site:linkedin.com/in/ \"Regional Sales Manager\"" },
    { name: "Account Executive", value: "site:linkedin.com/in/ \"Account Executive\"" },
    { name: "Account Manager", value: "site:linkedin.com/in/ \"Account Manager\"" },
    { name: "Business Development Manager", value: "site:linkedin.com/in/ \"Business Development Manager\"" },
    { name: "Business Development Representative", value: "site:linkedin.com/in/ \"Business Development Representative\"" },
    { name: "Sales Representative", value: "site:linkedin.com/in/ \"Sales Representative\"" },
    { name: "Inside Sales", value: "site:linkedin.com/in/ \"Inside Sales\"" },
    { name: "Outside Sales", value: "site:linkedin.com/in/ \"Outside Sales\"" },
    { name: "Sales Engineer", value: "site:linkedin.com/in/ \"Sales Engineer\"" },
    { name: "Key Account Manager", value: "site:linkedin.com/in/ \"Key Account Manager\"" },
    { name: "Territory Manager", value: "site:linkedin.com/in/ \"Territory Manager\"" },

    // ── Marketing ──
    { name: "VP of Marketing", value: "site:linkedin.com/in/ \"VP of Marketing\" OR \"Vice President of Marketing\"" },
    { name: "Marketing Director", value: "site:linkedin.com/in/ \"Marketing Director\"" },
    { name: "Marketing Manager", value: "site:linkedin.com/in/ \"Marketing Manager\"" },
    { name: "Digital Marketing Manager", value: "site:linkedin.com/in/ \"Digital Marketing Manager\"" },
    { name: "Content Marketing Manager", value: "site:linkedin.com/in/ \"Content Marketing Manager\"" },
    { name: "Brand Manager", value: "site:linkedin.com/in/ \"Brand Manager\"" },
    { name: "Product Marketing Manager", value: "site:linkedin.com/in/ \"Product Marketing Manager\"" },
    { name: "SEO Manager / Specialist", value: "site:linkedin.com/in/ \"SEO Manager\" OR \"SEO Specialist\"" },
    { name: "Social Media Manager", value: "site:linkedin.com/in/ \"Social Media Manager\"" },
    { name: "Communications Manager", value: "site:linkedin.com/in/ \"Communications Manager\"" },
    { name: "Public Relations Manager", value: "site:linkedin.com/in/ \"Public Relations Manager\" OR \"PR Manager\"" },
    { name: "Growth Manager", value: "site:linkedin.com/in/ \"Growth Manager\" OR \"Head of Growth\"" },
    { name: "Demand Generation Manager", value: "site:linkedin.com/in/ \"Demand Generation\"" },
    { name: "Marketing Coordinator", value: "site:linkedin.com/in/ \"Marketing Coordinator\"" },
    { name: "Email Marketing Manager", value: "site:linkedin.com/in/ \"Email Marketing\"" },

    // ── Information Technology (IT) ──
    { name: "VP of Engineering", value: "site:linkedin.com/in/ \"VP of Engineering\" OR \"Vice President of Engineering\"" },
    { name: "IT Director", value: "site:linkedin.com/in/ \"IT Director\"" },
    { name: "IT Manager", value: "site:linkedin.com/in/ \"IT Manager\"" },
    { name: "Engineering Manager", value: "site:linkedin.com/in/ \"Engineering Manager\"" },
    { name: "Software Engineer", value: "site:linkedin.com/in/ \"Software Engineer\"" },
    { name: "Senior Software Engineer", value: "site:linkedin.com/in/ \"Senior Software Engineer\"" },
    { name: "Full Stack Developer", value: "site:linkedin.com/in/ \"Full Stack Developer\"" },
    { name: "Frontend Developer", value: "site:linkedin.com/in/ \"Frontend Developer\" OR \"Front-End Developer\"" },
    { name: "Backend Developer", value: "site:linkedin.com/in/ \"Backend Developer\" OR \"Back-End Developer\"" },
    { name: "DevOps Engineer", value: "site:linkedin.com/in/ \"DevOps Engineer\"" },
    { name: "Cloud Engineer / Architect", value: "site:linkedin.com/in/ \"Cloud Engineer\" OR \"Cloud Architect\"" },
    { name: "Data Engineer", value: "site:linkedin.com/in/ \"Data Engineer\"" },
    { name: "Data Scientist", value: "site:linkedin.com/in/ \"Data Scientist\"" },
    { name: "Machine Learning Engineer", value: "site:linkedin.com/in/ \"Machine Learning Engineer\"" },
    { name: "AI Engineer", value: "site:linkedin.com/in/ \"AI Engineer\" OR \"Artificial Intelligence\"" },
    { name: "System Administrator", value: "site:linkedin.com/in/ \"System Administrator\" OR \"Sysadmin\"" },
    { name: "Network Engineer", value: "site:linkedin.com/in/ \"Network Engineer\"" },
    { name: "Security Engineer", value: "site:linkedin.com/in/ \"Security Engineer\"" },
    { name: "Cybersecurity Analyst", value: "site:linkedin.com/in/ \"Cybersecurity Analyst\" OR \"Cybersecurity\"" },
    { name: "Database Administrator (DBA)", value: "site:linkedin.com/in/ \"Database Administrator\" OR DBA" },
    { name: "QA Engineer / Tester", value: "site:linkedin.com/in/ \"QA Engineer\" OR \"Quality Assurance\"" },
    { name: "Solutions Architect", value: "site:linkedin.com/in/ \"Solutions Architect\"" },
    { name: "Technical Lead", value: "site:linkedin.com/in/ \"Technical Lead\" OR \"Tech Lead\"" },
    { name: "Scrum Master", value: "site:linkedin.com/in/ \"Scrum Master\"" },
    { name: "Product Owner", value: "site:linkedin.com/in/ \"Product Owner\"" },

    // ── Product Management ──
    { name: "VP of Product", value: "site:linkedin.com/in/ \"VP of Product\" OR \"Vice President of Product\"" },
    { name: "Product Director", value: "site:linkedin.com/in/ \"Product Director\" OR \"Director of Product\"" },
    { name: "Product Manager", value: "site:linkedin.com/in/ \"Product Manager\"" },
    { name: "Senior Product Manager", value: "site:linkedin.com/in/ \"Senior Product Manager\"" },
    { name: "Product Analyst", value: "site:linkedin.com/in/ \"Product Analyst\"" },

    // ── Human Resources (HR) ──
    { name: "VP of Human Resources", value: "site:linkedin.com/in/ \"VP of HR\" OR \"VP of Human Resources\"" },
    { name: "HR Director", value: "site:linkedin.com/in/ \"HR Director\" OR \"Human Resources Director\"" },
    { name: "HR Manager", value: "site:linkedin.com/in/ \"HR Manager\" OR \"Human Resources Manager\"" },
    { name: "Talent Acquisition Manager", value: "site:linkedin.com/in/ \"Talent Acquisition Manager\"" },
    { name: "Recruiter / Senior Recruiter", value: "site:linkedin.com/in/ Recruiter OR \"Senior Recruiter\"" },
    { name: "HR Business Partner", value: "site:linkedin.com/in/ \"HR Business Partner\"" },
    { name: "Compensation & Benefits Manager", value: "site:linkedin.com/in/ \"Compensation\" OR \"Benefits Manager\"" },
    { name: "Learning & Development Manager", value: "site:linkedin.com/in/ \"Learning and Development\" OR \"L&D Manager\"" },
    { name: "People Operations Manager", value: "site:linkedin.com/in/ \"People Operations\"" },
    { name: "HR Generalist", value: "site:linkedin.com/in/ \"HR Generalist\"" },
    { name: "HR Coordinator", value: "site:linkedin.com/in/ \"HR Coordinator\"" },

    // ── Finance & Accounting ──
    { name: "VP of Finance", value: "site:linkedin.com/in/ \"VP of Finance\" OR \"Vice President of Finance\"" },
    { name: "Finance Director", value: "site:linkedin.com/in/ \"Finance Director\"" },
    { name: "Finance Manager", value: "site:linkedin.com/in/ \"Finance Manager\"" },
    { name: "Financial Analyst", value: "site:linkedin.com/in/ \"Financial Analyst\"" },
    { name: "Controller / Financial Controller", value: "site:linkedin.com/in/ Controller OR \"Financial Controller\"" },
    { name: "Accounting Manager", value: "site:linkedin.com/in/ \"Accounting Manager\"" },
    { name: "Accountant / CPA", value: "site:linkedin.com/in/ Accountant OR CPA" },
    { name: "Auditor", value: "site:linkedin.com/in/ Auditor" },
    { name: "Treasurer", value: "site:linkedin.com/in/ Treasurer" },
    { name: "Tax Manager / Tax Director", value: "site:linkedin.com/in/ \"Tax Manager\" OR \"Tax Director\"" },
    { name: "Payroll Manager", value: "site:linkedin.com/in/ \"Payroll Manager\"" },
    { name: "Investment Analyst", value: "site:linkedin.com/in/ \"Investment Analyst\"" },
    { name: "Risk Manager", value: "site:linkedin.com/in/ \"Risk Manager\"" },
    { name: "Compliance Officer", value: "site:linkedin.com/in/ \"Compliance Officer\"" },

    // ── Operations & Logistics ──
    { name: "VP of Operations", value: "site:linkedin.com/in/ \"VP of Operations\" OR \"Vice President of Operations\"" },
    { name: "Operations Director", value: "site:linkedin.com/in/ \"Operations Director\"" },
    { name: "Operations Manager", value: "site:linkedin.com/in/ \"Operations Manager\"" },
    { name: "Supply Chain Manager", value: "site:linkedin.com/in/ \"Supply Chain Manager\"" },
    { name: "Logistics Manager", value: "site:linkedin.com/in/ \"Logistics Manager\"" },
    { name: "Procurement Manager", value: "site:linkedin.com/in/ \"Procurement Manager\"" },
    { name: "Purchasing Manager", value: "site:linkedin.com/in/ \"Purchasing Manager\"" },
    { name: "Warehouse Manager", value: "site:linkedin.com/in/ \"Warehouse Manager\"" },
    { name: "Facilities Manager", value: "site:linkedin.com/in/ \"Facilities Manager\"" },
    { name: "Project Manager", value: "site:linkedin.com/in/ \"Project Manager\"" },
    { name: "Program Manager", value: "site:linkedin.com/in/ \"Program Manager\"" },
    { name: "Business Analyst", value: "site:linkedin.com/in/ \"Business Analyst\"" },
    { name: "Process Improvement Manager", value: "site:linkedin.com/in/ \"Process Improvement\" OR \"Continuous Improvement\"" },

    // ── Legal ──
    { name: "General Counsel", value: "site:linkedin.com/in/ \"General Counsel\"" },
    { name: "Legal Director", value: "site:linkedin.com/in/ \"Legal Director\"" },
    { name: "Corporate Counsel", value: "site:linkedin.com/in/ \"Corporate Counsel\"" },
    { name: "Attorney / Lawyer", value: "site:linkedin.com/in/ Attorney OR Lawyer" },
    { name: "Paralegal", value: "site:linkedin.com/in/ Paralegal" },
    { name: "Contract Manager", value: "site:linkedin.com/in/ \"Contract Manager\"" },
    { name: "Intellectual Property (IP) Counsel", value: "site:linkedin.com/in/ \"Intellectual Property\" OR \"IP Counsel\"" },

    // ── Customer Success & Support ──
    { name: "VP of Customer Success", value: "site:linkedin.com/in/ \"VP of Customer Success\"" },
    { name: "Customer Success Director", value: "site:linkedin.com/in/ \"Customer Success Director\"" },
    { name: "Customer Success Manager", value: "site:linkedin.com/in/ \"Customer Success Manager\"" },
    { name: "Customer Support Manager", value: "site:linkedin.com/in/ \"Customer Support Manager\"" },
    { name: "Customer Service Manager", value: "site:linkedin.com/in/ \"Customer Service Manager\"" },
    { name: "Technical Support Manager", value: "site:linkedin.com/in/ \"Technical Support Manager\"" },
    { name: "Client Relations Manager", value: "site:linkedin.com/in/ \"Client Relations Manager\"" },
    { name: "Customer Experience Manager", value: "site:linkedin.com/in/ \"Customer Experience Manager\"" },

    // ── Design & Creative ──
    { name: "Creative Director", value: "site:linkedin.com/in/ \"Creative Director\"" },
    { name: "Art Director", value: "site:linkedin.com/in/ \"Art Director\"" },
    { name: "UX Designer", value: "site:linkedin.com/in/ \"UX Designer\"" },
    { name: "UI Designer", value: "site:linkedin.com/in/ \"UI Designer\"" },
    { name: "UX/UI Designer", value: "site:linkedin.com/in/ \"UX/UI Designer\" OR \"UX Designer\" OR \"UI Designer\"" },
    { name: "Graphic Designer", value: "site:linkedin.com/in/ \"Graphic Designer\"" },
    { name: "Product Designer", value: "site:linkedin.com/in/ \"Product Designer\"" },
    { name: "Design Manager", value: "site:linkedin.com/in/ \"Design Manager\" OR \"Head of Design\"" },
    { name: "UX Researcher", value: "site:linkedin.com/in/ \"UX Researcher\"" },

    // ── Healthcare & Medical ──
    { name: "Medical Director", value: "site:linkedin.com/in/ \"Medical Director\"" },
    { name: "Chief Medical Officer (CMO)", value: "site:linkedin.com/in/ \"Chief Medical Officer\"" },
    { name: "Chief Nursing Officer", value: "site:linkedin.com/in/ \"Chief Nursing Officer\"" },
    { name: "Hospital Administrator", value: "site:linkedin.com/in/ \"Hospital Administrator\"" },
    { name: "Physician / Doctor", value: "site:linkedin.com/in/ Physician OR Doctor OR MD" },
    { name: "Surgeon", value: "site:linkedin.com/in/ Surgeon" },
    { name: "Nurse Manager", value: "site:linkedin.com/in/ \"Nurse Manager\"" },
    { name: "Registered Nurse (RN)", value: "site:linkedin.com/in/ \"Registered Nurse\" OR RN" },
    { name: "Pharmacist", value: "site:linkedin.com/in/ Pharmacist" },
    { name: "Healthcare Administrator", value: "site:linkedin.com/in/ \"Healthcare Administrator\"" },
    { name: "Clinical Research Manager", value: "site:linkedin.com/in/ \"Clinical Research Manager\"" },
    { name: "Biotech / Pharmaceutical Researcher", value: "site:linkedin.com/in/ \"Biotech Researcher\" OR \"Pharmaceutical Researcher\"" },
    { name: "Health Information Manager", value: "site:linkedin.com/in/ \"Health Information Manager\"" },
    { name: "Dentist", value: "site:linkedin.com/in/ Dentist" },
    { name: "Therapist / Counselor", value: "site:linkedin.com/in/ Therapist OR Counselor" },

    // ── Education & Training ──
    { name: "Dean / Associate Dean", value: "site:linkedin.com/in/ Dean OR \"Associate Dean\"" },
    { name: "Professor", value: "site:linkedin.com/in/ Professor" },
    { name: "School Principal", value: "site:linkedin.com/in/ \"School Principal\" OR Principal" },
    { name: "Teacher / Educator", value: "site:linkedin.com/in/ Teacher OR Educator" },
    { name: "Training Manager", value: "site:linkedin.com/in/ \"Training Manager\"" },
    { name: "Academic Director", value: "site:linkedin.com/in/ \"Academic Director\"" },
    { name: "Curriculum Developer", value: "site:linkedin.com/in/ \"Curriculum Developer\"" },
    { name: "Instructional Designer", value: "site:linkedin.com/in/ \"Instructional Designer\"" },
    { name: "Education Administrator", value: "site:linkedin.com/in/ \"Education Administrator\"" },

    // ── Engineering & Manufacturing ──
    { name: "Engineering Director", value: "site:linkedin.com/in/ \"Engineering Director\"" },
    { name: "Mechanical Engineer", value: "site:linkedin.com/in/ \"Mechanical Engineer\"" },
    { name: "Electrical Engineer", value: "site:linkedin.com/in/ \"Electrical Engineer\"" },
    { name: "Civil Engineer", value: "site:linkedin.com/in/ \"Civil Engineer\"" },
    { name: "Chemical Engineer", value: "site:linkedin.com/in/ \"Chemical Engineer\"" },
    { name: "Industrial Engineer", value: "site:linkedin.com/in/ \"Industrial Engineer\"" },
    { name: "Manufacturing Manager", value: "site:linkedin.com/in/ \"Manufacturing Manager\"" },
    { name: "Plant Manager", value: "site:linkedin.com/in/ \"Plant Manager\"" },
    { name: "Production Manager", value: "site:linkedin.com/in/ \"Production Manager\"" },
    { name: "Quality Manager", value: "site:linkedin.com/in/ \"Quality Manager\"" },
    { name: "Quality Assurance Manager", value: "site:linkedin.com/in/ \"Quality Assurance Manager\"" },
    { name: "Environmental Engineer", value: "site:linkedin.com/in/ \"Environmental Engineer\"" },
    { name: "Safety Manager", value: "site:linkedin.com/in/ \"Safety Manager\"" },

    // ── Real Estate & Construction ──
    { name: "Real Estate Agent / Broker", value: "site:linkedin.com/in/ \"Real Estate Agent\" OR \"Real Estate Broker\"" },
    { name: "Real Estate Developer", value: "site:linkedin.com/in/ \"Real Estate Developer\"" },
    { name: "Property Manager", value: "site:linkedin.com/in/ \"Property Manager\"" },
    { name: "Construction Manager", value: "site:linkedin.com/in/ \"Construction Manager\"" },
    { name: "Project Engineer (Construction)", value: "site:linkedin.com/in/ \"Project Engineer\" construction" },
    { name: "Architect", value: "site:linkedin.com/in/ Architect" },

    // ── Consulting & Professional Services ──
    { name: "Management Consultant", value: "site:linkedin.com/in/ \"Management Consultant\"" },
    { name: "Strategy Consultant", value: "site:linkedin.com/in/ \"Strategy Consultant\"" },
    { name: "Senior Consultant", value: "site:linkedin.com/in/ \"Senior Consultant\"" },
    { name: "Principal Consultant", value: "site:linkedin.com/in/ \"Principal Consultant\"" },
    { name: "Business Consultant", value: "site:linkedin.com/in/ \"Business Consultant\"" },
    { name: "IT Consultant", value: "site:linkedin.com/in/ \"IT Consultant\"" },

    // ── Media, Advertising & Entertainment ──
    { name: "Media Director", value: "site:linkedin.com/in/ \"Media Director\"" },
    { name: "Advertising Director", value: "site:linkedin.com/in/ \"Advertising Director\"" },
    { name: "Editor / Editor-in-Chief", value: "site:linkedin.com/in/ Editor OR \"Editor-in-Chief\"" },
    { name: "Journalist / Reporter", value: "site:linkedin.com/in/ Journalist OR Reporter" },
    { name: "Content Creator", value: "site:linkedin.com/in/ \"Content Creator\"" },
    { name: "Producer", value: "site:linkedin.com/in/ Producer" },
    { name: "Copywriter", value: "site:linkedin.com/in/ Copywriter" },

    // ── Nonprofit & Government ──
    { name: "Executive Director (Nonprofit)", value: "site:linkedin.com/in/ \"Executive Director\" nonprofit" },
    { name: "Program Director (Nonprofit)", value: "site:linkedin.com/in/ \"Program Director\" nonprofit" },
    { name: "Fundraising Manager", value: "site:linkedin.com/in/ \"Fundraising Manager\"" },
    { name: "Grant Writer", value: "site:linkedin.com/in/ \"Grant Writer\"" },
    { name: "Policy Analyst", value: "site:linkedin.com/in/ \"Policy Analyst\"" },
    { name: "Government Relations", value: "site:linkedin.com/in/ \"Government Relations\"" },

    // ── Research & Science ──
    { name: "Research Director", value: "site:linkedin.com/in/ \"Research Director\"" },
    { name: "Research Scientist", value: "site:linkedin.com/in/ \"Research Scientist\"" },
    { name: "R&D Manager", value: "site:linkedin.com/in/ \"R&D Manager\" OR \"Research and Development\"" },
    { name: "Lab Manager", value: "site:linkedin.com/in/ \"Lab Manager\" OR \"Laboratory Manager\"" },
    { name: "Scientist", value: "site:linkedin.com/in/ Scientist" },

    // ── Retail & E-Commerce ──
    { name: "Retail Manager", value: "site:linkedin.com/in/ \"Retail Manager\"" },
    { name: "Store Manager", value: "site:linkedin.com/in/ \"Store Manager\"" },
    { name: "E-Commerce Manager", value: "site:linkedin.com/in/ \"E-Commerce Manager\" OR \"Ecommerce Manager\"" },
    { name: "Merchandising Manager", value: "site:linkedin.com/in/ \"Merchandising Manager\"" },
    { name: "Buyer / Category Manager", value: "site:linkedin.com/in/ Buyer OR \"Category Manager\"" },
    { name: "Visual Merchandiser", value: "site:linkedin.com/in/ \"Visual Merchandiser\"" },

    // ── Insurance & Banking ──
    { name: "Insurance Agent / Broker", value: "site:linkedin.com/in/ \"Insurance Agent\" OR \"Insurance Broker\"" },
    { name: "Underwriter", value: "site:linkedin.com/in/ Underwriter" },
    { name: "Claims Manager", value: "site:linkedin.com/in/ \"Claims Manager\"" },
    { name: "Actuary", value: "site:linkedin.com/in/ Actuary" },
    { name: "Bank Manager", value: "site:linkedin.com/in/ \"Bank Manager\"" },
    { name: "Loan Officer", value: "site:linkedin.com/in/ \"Loan Officer\"" },
    { name: "Wealth Manager / Financial Advisor", value: "site:linkedin.com/in/ \"Wealth Manager\" OR \"Financial Advisor\"" },
    { name: "Portfolio Manager", value: "site:linkedin.com/in/ \"Portfolio Manager\"" },

    // ── Transportation & Automotive ──
    { name: "Fleet Manager", value: "site:linkedin.com/in/ \"Fleet Manager\"" },
    { name: "Transportation Manager", value: "site:linkedin.com/in/ \"Transportation Manager\"" },
    { name: "Automotive Manager", value: "site:linkedin.com/in/ \"Automotive Manager\"" },
    { name: "Dealership Manager", value: "site:linkedin.com/in/ \"Dealership Manager\"" },

    // ── Energy & Utilities ──
    { name: "Energy Manager", value: "site:linkedin.com/in/ \"Energy Manager\"" },
    { name: "Utility Manager", value: "site:linkedin.com/in/ \"Utility Manager\"" },
    { name: "Renewable Energy Manager", value: "site:linkedin.com/in/ \"Renewable Energy\"" },
    { name: "Petroleum Engineer", value: "site:linkedin.com/in/ \"Petroleum Engineer\"" },
    { name: "Power Plant Manager", value: "site:linkedin.com/in/ \"Power Plant Manager\"" },

    // ── Hospitality & Travel ──
    { name: "Hotel Manager / General Manager", value: "site:linkedin.com/in/ \"Hotel Manager\" OR \"Hotel General Manager\"" },
    { name: "Restaurant Manager", value: "site:linkedin.com/in/ \"Restaurant Manager\"" },
    { name: "Food & Beverage Manager", value: "site:linkedin.com/in/ \"Food and Beverage Manager\" OR \"F&B Manager\"" },
    { name: "Event Manager / Planner", value: "site:linkedin.com/in/ \"Event Manager\" OR \"Event Planner\"" },
    { name: "Travel Manager", value: "site:linkedin.com/in/ \"Travel Manager\"" },
    { name: "Chef / Executive Chef", value: "site:linkedin.com/in/ Chef OR \"Executive Chef\"" },

    // ── Agriculture & Environment ──
    { name: "Farm Manager", value: "site:linkedin.com/in/ \"Farm Manager\"" },
    { name: "Agricultural Manager", value: "site:linkedin.com/in/ \"Agricultural Manager\"" },
    { name: "Environmental Manager", value: "site:linkedin.com/in/ \"Environmental Manager\"" },
    { name: "Sustainability Manager", value: "site:linkedin.com/in/ \"Sustainability Manager\"" },

    // ── Telecommunications ──
    { name: "Telecom Manager", value: "site:linkedin.com/in/ \"Telecom Manager\" OR \"Telecommunications Manager\"" },
    { name: "Network Operations Manager", value: "site:linkedin.com/in/ \"Network Operations Manager\"" },
    { name: "RF Engineer", value: "site:linkedin.com/in/ \"RF Engineer\"" },

    // ── Sports & Fitness ──
    { name: "Athletic Director", value: "site:linkedin.com/in/ \"Athletic Director\"" },
    { name: "Sports Manager", value: "site:linkedin.com/in/ \"Sports Manager\"" },
    { name: "Fitness Director", value: "site:linkedin.com/in/ \"Fitness Director\"" },
    { name: "Coach / Head Coach", value: "site:linkedin.com/in/ Coach OR \"Head Coach\"" },

    // ══════════════════════════════════════════════
    // Apollo.io-Style Seniority, Departments & Industries
    // ══════════════════════════════════════════════

    // ── Seniority: Entry & Associate ──
    { name: "Intern", value: "site:linkedin.com/in/ Intern" },
    { name: "Associate", value: "site:linkedin.com/in/ Associate" },
    { name: "Analyst", value: "site:linkedin.com/in/ Analyst" },
    { name: "Junior Developer", value: "site:linkedin.com/in/ \"Junior Developer\"" },
    { name: "Coordinator", value: "site:linkedin.com/in/ Coordinator" },
    { name: "Assistant", value: "site:linkedin.com/in/ Assistant" },
    { name: "Specialist", value: "site:linkedin.com/in/ Specialist" },
    { name: "Technician", value: "site:linkedin.com/in/ Technician" },
    { name: "Representative", value: "site:linkedin.com/in/ Representative" },
    { name: "Administrator", value: "site:linkedin.com/in/ Administrator" },
    { name: "Clerk", value: "site:linkedin.com/in/ Clerk" },
    { name: "Apprentice", value: "site:linkedin.com/in/ Apprentice" },

    // ── Seniority: Senior & Staff ──
    { name: "Staff Engineer", value: "site:linkedin.com/in/ \"Staff Engineer\"" },
    { name: "Senior Manager", value: "site:linkedin.com/in/ \"Senior Manager\"" },
    { name: "Lead", value: "site:linkedin.com/in/ Lead" },
    { name: "Team Lead", value: "site:linkedin.com/in/ \"Team Lead\"" },
    { name: "Supervisor", value: "site:linkedin.com/in/ Supervisor" },
    { name: "Senior Analyst", value: "site:linkedin.com/in/ \"Senior Analyst\"" },
    { name: "Senior Associate", value: "site:linkedin.com/in/ \"Senior Associate\"" },
    { name: "Senior Specialist", value: "site:linkedin.com/in/ \"Senior Specialist\"" },

    // ── Seniority: Executive Variations ──
    { name: "Chief Compliance Officer (CCO)", value: "site:linkedin.com/in/ \"Chief Compliance Officer\"" },
    { name: "Chief Strategy Officer", value: "site:linkedin.com/in/ \"Chief Strategy Officer\"" },
    { name: "Chief Growth Officer", value: "site:linkedin.com/in/ \"Chief Growth Officer\"" },
    { name: "Chief People Officer", value: "site:linkedin.com/in/ \"Chief People Officer\"" },
    { name: "Chief Communications Officer", value: "site:linkedin.com/in/ \"Chief Communications Officer\"" },
    { name: "Chief Innovation Officer", value: "site:linkedin.com/in/ \"Chief Innovation Officer\"" },
    { name: "Chief Sustainability Officer", value: "site:linkedin.com/in/ \"Chief Sustainability Officer\"" },
    { name: "Chief Experience Officer", value: "site:linkedin.com/in/ \"Chief Experience Officer\"" },
    { name: "Chief Digital Officer", value: "site:linkedin.com/in/ \"Chief Digital Officer\"" },
    { name: "Chief Analytics Officer", value: "site:linkedin.com/in/ \"Chief Analytics Officer\"" },
    { name: "Chief Procurement Officer", value: "site:linkedin.com/in/ \"Chief Procurement Officer\"" },
    { name: "Chief Investment Officer", value: "site:linkedin.com/in/ \"Chief Investment Officer\"" },
    { name: "Chief Architect", value: "site:linkedin.com/in/ \"Chief Architect\"" },
    { name: "Chief Scientist", value: "site:linkedin.com/in/ \"Chief Scientist\"" },
    { name: "Chief Evangelist", value: "site:linkedin.com/in/ \"Chief Evangelist\"" },

    // ── Department: Data Science & Analytics ──
    { name: "Head of Data", value: "site:linkedin.com/in/ \"Head of Data\"" },
    { name: "Director of Analytics", value: "site:linkedin.com/in/ \"Director of Analytics\"" },
    { name: "Analytics Manager", value: "site:linkedin.com/in/ \"Analytics Manager\"" },
    { name: "Data Analyst", value: "site:linkedin.com/in/ \"Data Analyst\"" },
    { name: "Senior Data Analyst", value: "site:linkedin.com/in/ \"Senior Data Analyst\"" },
    { name: "Business Intelligence Analyst", value: "site:linkedin.com/in/ \"Business Intelligence Analyst\"" },
    { name: "BI Developer", value: "site:linkedin.com/in/ \"BI Developer\" OR \"Business Intelligence Developer\"" },
    { name: "Data Architect", value: "site:linkedin.com/in/ \"Data Architect\"" },
    { name: "Statistician", value: "site:linkedin.com/in/ Statistician" },
    { name: "Quantitative Analyst", value: "site:linkedin.com/in/ \"Quantitative Analyst\"" },

    // ── Department: Revenue Operations ──
    { name: "VP of Revenue Operations", value: "site:linkedin.com/in/ \"VP of Revenue Operations\"" },
    { name: "Revenue Operations Manager", value: "site:linkedin.com/in/ \"Revenue Operations Manager\"" },
    { name: "Sales Operations Manager", value: "site:linkedin.com/in/ \"Sales Operations Manager\"" },
    { name: "Marketing Operations Manager", value: "site:linkedin.com/in/ \"Marketing Operations Manager\"" },
    { name: "GTM Strategist", value: "site:linkedin.com/in/ \"Go-To-Market\" OR \"GTM\"" },

    // ── Department: Partnerships & Alliances ──
    { name: "VP of Partnerships", value: "site:linkedin.com/in/ \"VP of Partnerships\"" },
    { name: "Director of Partnerships", value: "site:linkedin.com/in/ \"Director of Partnerships\"" },
    { name: "Partnerships Manager", value: "site:linkedin.com/in/ \"Partnerships Manager\"" },
    { name: "Channel Manager", value: "site:linkedin.com/in/ \"Channel Manager\"" },
    { name: "Alliance Manager", value: "site:linkedin.com/in/ \"Alliance Manager\"" },
    { name: "Strategic Partnerships", value: "site:linkedin.com/in/ \"Strategic Partnerships\"" },

    // ── Department: Developer Relations ──
    { name: "Developer Advocate", value: "site:linkedin.com/in/ \"Developer Advocate\"" },
    { name: "Developer Relations Manager", value: "site:linkedin.com/in/ \"Developer Relations\"" },
    { name: "Technical Evangelist", value: "site:linkedin.com/in/ \"Technical Evangelist\"" },
    { name: "Developer Experience Engineer", value: "site:linkedin.com/in/ \"Developer Experience\"" },
    { name: "Community Manager (Tech)", value: "site:linkedin.com/in/ \"Community Manager\"" },

    // ── Department: Information Security ──
    { name: "CISO / Chief Information Security Officer", value: "site:linkedin.com/in/ CISO OR \"Chief Information Security Officer\"" },
    { name: "VP of Information Security", value: "site:linkedin.com/in/ \"VP of Information Security\"" },
    { name: "Information Security Manager", value: "site:linkedin.com/in/ \"Information Security Manager\"" },
    { name: "Security Architect", value: "site:linkedin.com/in/ \"Security Architect\"" },
    { name: "Penetration Tester", value: "site:linkedin.com/in/ \"Penetration Tester\"" },
    { name: "SOC Analyst", value: "site:linkedin.com/in/ \"SOC Analyst\"" },
    { name: "GRC Analyst", value: "site:linkedin.com/in/ \"GRC Analyst\" OR \"Governance Risk Compliance\"" },
    { name: "Threat Intelligence Analyst", value: "site:linkedin.com/in/ \"Threat Intelligence\"" },

    // ── Department: Corporate Development & Strategy ──
    { name: "VP of Corporate Development", value: "site:linkedin.com/in/ \"VP of Corporate Development\"" },
    { name: "Corporate Development Manager", value: "site:linkedin.com/in/ \"Corporate Development\"" },
    { name: "M&A Analyst", value: "site:linkedin.com/in/ \"M&A\" OR \"Mergers and Acquisitions\"" },
    { name: "Strategy Director", value: "site:linkedin.com/in/ \"Strategy Director\" OR \"Director of Strategy\"" },
    { name: "Strategy Manager", value: "site:linkedin.com/in/ \"Strategy Manager\"" },
    { name: "Corporate Strategy Analyst", value: "site:linkedin.com/in/ \"Corporate Strategy\"" },

    // ── Department: Investor Relations ──
    { name: "VP of Investor Relations", value: "site:linkedin.com/in/ \"VP of Investor Relations\"" },
    { name: "Investor Relations Manager", value: "site:linkedin.com/in/ \"Investor Relations Manager\"" },
    { name: "Investor Relations Director", value: "site:linkedin.com/in/ \"Investor Relations Director\"" },

    // ── Department: Enterprise Architecture ──
    { name: "Enterprise Architect", value: "site:linkedin.com/in/ \"Enterprise Architect\"" },
    { name: "IT Architect", value: "site:linkedin.com/in/ \"IT Architect\"" },
    { name: "Application Architect", value: "site:linkedin.com/in/ \"Application Architect\"" },
    { name: "Infrastructure Architect", value: "site:linkedin.com/in/ \"Infrastructure Architect\"" },

    // ── Department: ERP & Business Systems ──
    { name: "ERP Manager", value: "site:linkedin.com/in/ \"ERP Manager\"" },
    { name: "SAP Consultant", value: "site:linkedin.com/in/ \"SAP Consultant\"" },
    { name: "Salesforce Administrator", value: "site:linkedin.com/in/ \"Salesforce Administrator\" OR \"Salesforce Admin\"" },
    { name: "CRM Manager", value: "site:linkedin.com/in/ \"CRM Manager\"" },

    // ── Department: Supply Chain & Sourcing ──
    { name: "VP of Supply Chain", value: "site:linkedin.com/in/ \"VP of Supply Chain\"" },
    { name: "Supply Chain Director", value: "site:linkedin.com/in/ \"Supply Chain Director\"" },
    { name: "Supply Chain Analyst", value: "site:linkedin.com/in/ \"Supply Chain Analyst\"" },
    { name: "Sourcing Manager", value: "site:linkedin.com/in/ \"Sourcing Manager\"" },
    { name: "Strategic Sourcing Manager", value: "site:linkedin.com/in/ \"Strategic Sourcing\"" },
    { name: "Vendor Manager", value: "site:linkedin.com/in/ \"Vendor Manager\"" },
    { name: "Inventory Manager", value: "site:linkedin.com/in/ \"Inventory Manager\"" },
    { name: "Distribution Manager", value: "site:linkedin.com/in/ \"Distribution Manager\"" },

    // ── Department: Diversity, Equity & Inclusion ──
    { name: "Chief Diversity Officer", value: "site:linkedin.com/in/ \"Chief Diversity Officer\"" },
    { name: "VP of Diversity & Inclusion", value: "site:linkedin.com/in/ \"VP of Diversity\" OR \"VP of Inclusion\"" },
    { name: "DE&I Manager", value: "site:linkedin.com/in/ \"Diversity\" \"Inclusion\" Manager" },

    // ── Department: Workplace & Office ──
    { name: "Office Manager", value: "site:linkedin.com/in/ \"Office Manager\"" },
    { name: "Workplace Manager", value: "site:linkedin.com/in/ \"Workplace Manager\"" },
    { name: "Executive Assistant", value: "site:linkedin.com/in/ \"Executive Assistant\"" },
    { name: "Administrative Manager", value: "site:linkedin.com/in/ \"Administrative Manager\"" },
    { name: "Receptionist", value: "site:linkedin.com/in/ Receptionist" },

    // ── Industry: SaaS & Software ──
    { name: "SaaS Sales", value: "site:linkedin.com/in/ SaaS Sales" },
    { name: "SaaS Account Executive", value: "site:linkedin.com/in/ SaaS \"Account Executive\"" },
    { name: "SaaS Product Manager", value: "site:linkedin.com/in/ SaaS \"Product Manager\"" },
    { name: "SaaS Customer Success", value: "site:linkedin.com/in/ SaaS \"Customer Success\"" },
    { name: "Software Company - CEO", value: "site:linkedin.com/in/ CEO software" },
    { name: "Software Company - CTO", value: "site:linkedin.com/in/ CTO software" },
    { name: "Software Company - VP Sales", value: "site:linkedin.com/in/ \"VP of Sales\" software" },

    // ── Industry: Fintech ──
    { name: "Fintech CEO", value: "site:linkedin.com/in/ CEO fintech" },
    { name: "Fintech Product Manager", value: "site:linkedin.com/in/ \"Product Manager\" fintech" },
    { name: "Fintech Engineer", value: "site:linkedin.com/in/ engineer fintech" },
    { name: "Payments Manager", value: "site:linkedin.com/in/ \"Payments Manager\"" },
    { name: "Blockchain Developer", value: "site:linkedin.com/in/ \"Blockchain Developer\"" },
    { name: "Crypto / Web3 Manager", value: "site:linkedin.com/in/ \"Crypto\" OR \"Web3\" Manager" },

    // ── Industry: Healthtech & Biotech ──
    { name: "Healthtech CEO", value: "site:linkedin.com/in/ CEO healthtech OR \"health tech\"" },
    { name: "Healthtech Product Manager", value: "site:linkedin.com/in/ \"Product Manager\" healthtech OR \"health tech\"" },
    { name: "Bioinformatics Scientist", value: "site:linkedin.com/in/ \"Bioinformatics Scientist\"" },
    { name: "Clinical Operations Director", value: "site:linkedin.com/in/ \"Clinical Operations Director\"" },
    { name: "Regulatory Affairs Manager", value: "site:linkedin.com/in/ \"Regulatory Affairs Manager\"" },
    { name: "Medical Science Liaison", value: "site:linkedin.com/in/ \"Medical Science Liaison\"" },
    { name: "Pharmaceutical Sales Rep", value: "site:linkedin.com/in/ \"Pharmaceutical Sales\"" },

    // ── Industry: EdTech ──
    { name: "EdTech CEO / Founder", value: "site:linkedin.com/in/ CEO OR Founder edtech OR \"ed tech\"" },
    { name: "EdTech Product Manager", value: "site:linkedin.com/in/ \"Product Manager\" edtech" },
    { name: "EdTech Sales", value: "site:linkedin.com/in/ Sales edtech OR \"education technology\"" },

    // ── Industry: CleanTech & Renewable Energy ──
    { name: "CleanTech CEO", value: "site:linkedin.com/in/ CEO cleantech OR \"clean tech\" OR \"clean energy\"" },
    { name: "Solar Energy Manager", value: "site:linkedin.com/in/ \"Solar Energy Manager\"" },
    { name: "Wind Energy Engineer", value: "site:linkedin.com/in/ \"Wind Energy Engineer\"" },
    { name: "Sustainability Director", value: "site:linkedin.com/in/ \"Sustainability Director\"" },
    { name: "ESG Manager", value: "site:linkedin.com/in/ \"ESG Manager\" OR \"ESG Director\"" },

    // ── Industry: Aerospace & Defense ──
    { name: "Aerospace Engineer", value: "site:linkedin.com/in/ \"Aerospace Engineer\"" },
    { name: "Defense Program Manager", value: "site:linkedin.com/in/ \"Program Manager\" defense" },
    { name: "Avionics Engineer", value: "site:linkedin.com/in/ \"Avionics Engineer\"" },
    { name: "Space Systems Engineer", value: "site:linkedin.com/in/ \"Space Systems Engineer\"" },

    // ── Industry: Cybersecurity ──
    { name: "Cybersecurity Director", value: "site:linkedin.com/in/ \"Cybersecurity Director\"" },
    { name: "Cybersecurity Engineer", value: "site:linkedin.com/in/ \"Cybersecurity Engineer\"" },
    { name: "Cybersecurity Consultant", value: "site:linkedin.com/in/ \"Cybersecurity Consultant\"" },
    { name: "Application Security Engineer", value: "site:linkedin.com/in/ \"Application Security Engineer\"" },
    { name: "Security Operations Manager", value: "site:linkedin.com/in/ \"Security Operations Manager\"" },

    // ── Industry: AI & Machine Learning ──
    { name: "AI Research Scientist", value: "site:linkedin.com/in/ \"AI Research Scientist\" OR \"AI Researcher\"" },
    { name: "NLP Engineer", value: "site:linkedin.com/in/ \"NLP Engineer\" OR \"Natural Language Processing\"" },
    { name: "Computer Vision Engineer", value: "site:linkedin.com/in/ \"Computer Vision Engineer\"" },
    { name: "ML Ops Engineer", value: "site:linkedin.com/in/ \"MLOps\" OR \"ML Ops\"" },
    { name: "Deep Learning Engineer", value: "site:linkedin.com/in/ \"Deep Learning Engineer\"" },
    { name: "AI Product Manager", value: "site:linkedin.com/in/ \"AI Product Manager\" OR \"AI\" \"Product Manager\"" },

    // ── Industry: Cloud & Infrastructure ──
    { name: "AWS Solutions Architect", value: "site:linkedin.com/in/ \"AWS\" \"Solutions Architect\"" },
    { name: "Azure Architect", value: "site:linkedin.com/in/ \"Azure\" Architect" },
    { name: "GCP Engineer", value: "site:linkedin.com/in/ \"GCP\" OR \"Google Cloud\" Engineer" },
    { name: "Site Reliability Engineer (SRE)", value: "site:linkedin.com/in/ \"Site Reliability Engineer\" OR SRE" },
    { name: "Platform Engineer", value: "site:linkedin.com/in/ \"Platform Engineer\"" },
    { name: "Infrastructure Engineer", value: "site:linkedin.com/in/ \"Infrastructure Engineer\"" },

    // ── Industry: E-Commerce & Marketplace ──
    { name: "E-Commerce Director", value: "site:linkedin.com/in/ \"E-Commerce Director\" OR \"Ecommerce Director\"" },
    { name: "Marketplace Manager", value: "site:linkedin.com/in/ \"Marketplace Manager\"" },
    { name: "E-Commerce Product Manager", value: "site:linkedin.com/in/ \"E-Commerce\" OR \"Ecommerce\" \"Product Manager\"" },
    { name: "Fulfillment Manager", value: "site:linkedin.com/in/ \"Fulfillment Manager\"" },
    { name: "Amazon Seller / Vendor Manager", value: "site:linkedin.com/in/ Amazon \"Vendor Manager\" OR \"Seller Manager\"" },

    // ── Industry: Gaming & Entertainment ──
    { name: "Game Designer", value: "site:linkedin.com/in/ \"Game Designer\"" },
    { name: "Game Developer / Programmer", value: "site:linkedin.com/in/ \"Game Developer\" OR \"Game Programmer\"" },
    { name: "Game Producer", value: "site:linkedin.com/in/ \"Game Producer\"" },
    { name: "Level Designer", value: "site:linkedin.com/in/ \"Level Designer\"" },
    { name: "QA Tester (Gaming)", value: "site:linkedin.com/in/ \"QA Tester\" gaming" },

    // ── Industry: Semiconductor & Hardware ──
    { name: "Chip Design Engineer", value: "site:linkedin.com/in/ \"Chip Design Engineer\" OR \"IC Design\"" },
    { name: "Hardware Engineer", value: "site:linkedin.com/in/ \"Hardware Engineer\"" },
    { name: "Embedded Systems Engineer", value: "site:linkedin.com/in/ \"Embedded Systems Engineer\"" },
    { name: "FPGA Engineer", value: "site:linkedin.com/in/ \"FPGA Engineer\"" },
    { name: "Semiconductor Process Engineer", value: "site:linkedin.com/in/ \"Process Engineer\" semiconductor" },

    // ── Industry: IoT & Robotics ──
    { name: "IoT Engineer", value: "site:linkedin.com/in/ \"IoT Engineer\" OR \"Internet of Things\"" },
    { name: "IoT Product Manager", value: "site:linkedin.com/in/ \"IoT\" \"Product Manager\"" },
    { name: "Robotics Engineer", value: "site:linkedin.com/in/ \"Robotics Engineer\"" },
    { name: "Automation Engineer", value: "site:linkedin.com/in/ \"Automation Engineer\"" },
    { name: "Controls Engineer", value: "site:linkedin.com/in/ \"Controls Engineer\"" },

    // ── Industry: Fashion & Apparel ──
    { name: "Fashion Designer", value: "site:linkedin.com/in/ \"Fashion Designer\"" },
    { name: "Fashion Buyer", value: "site:linkedin.com/in/ \"Fashion Buyer\"" },
    { name: "Fashion Merchandiser", value: "site:linkedin.com/in/ \"Fashion Merchandiser\"" },
    { name: "Apparel Product Manager", value: "site:linkedin.com/in/ \"Apparel\" \"Product Manager\"" },
    { name: "Textile Engineer", value: "site:linkedin.com/in/ \"Textile Engineer\"" },

    // ── Industry: Food & Beverage ──
    { name: "Food Scientist", value: "site:linkedin.com/in/ \"Food Scientist\"" },
    { name: "Food Safety Manager", value: "site:linkedin.com/in/ \"Food Safety Manager\"" },
    { name: "Beverage Director", value: "site:linkedin.com/in/ \"Beverage Director\"" },
    { name: "Supply Chain Manager (F&B)", value: "site:linkedin.com/in/ \"Supply Chain Manager\" food OR beverage" },

    // ── Industry: Mining & Natural Resources ──
    { name: "Mining Engineer", value: "site:linkedin.com/in/ \"Mining Engineer\"" },
    { name: "Geologist", value: "site:linkedin.com/in/ Geologist" },
    { name: "Mine Manager", value: "site:linkedin.com/in/ \"Mine Manager\"" },
    { name: "Exploration Manager", value: "site:linkedin.com/in/ \"Exploration Manager\"" },

    // ── Industry: Maritime & Shipping ──
    { name: "Maritime Manager", value: "site:linkedin.com/in/ \"Maritime Manager\"" },
    { name: "Shipping Manager", value: "site:linkedin.com/in/ \"Shipping Manager\"" },
    { name: "Port Manager", value: "site:linkedin.com/in/ \"Port Manager\"" },
    { name: "Marine Engineer", value: "site:linkedin.com/in/ \"Marine Engineer\"" },

    // ── Industry: Pharmaceuticals ──
    { name: "Pharmaceutical Director", value: "site:linkedin.com/in/ \"Pharmaceutical Director\"" },
    { name: "Drug Development Manager", value: "site:linkedin.com/in/ \"Drug Development Manager\"" },
    { name: "Pharmacovigilance Manager", value: "site:linkedin.com/in/ \"Pharmacovigilance Manager\"" },
    { name: "Clinical Trial Manager", value: "site:linkedin.com/in/ \"Clinical Trial Manager\"" },
    { name: "Medical Affairs Director", value: "site:linkedin.com/in/ \"Medical Affairs Director\"" },

    // ── Industry: AR / VR / 3D ──
    { name: "AR/VR Developer", value: "site:linkedin.com/in/ \"AR\" OR \"VR\" OR \"Augmented Reality\" OR \"Virtual Reality\" developer" },
    { name: "3D Artist / Modeler", value: "site:linkedin.com/in/ \"3D Artist\" OR \"3D Modeler\"" },
    { name: "XR Product Manager", value: "site:linkedin.com/in/ \"XR\" OR \"Extended Reality\" \"Product Manager\"" },

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
    { name: "Business: Media & Advertising", value: "\"@\" email media OR advertising OR \"ad agency\" -\"@gmail.com\" -\"@yahoo.com\"" }
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