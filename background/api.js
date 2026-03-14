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

    // ── Blockchain / Crypto / Web3 ──
    { name: "Blockchain / Smart Contract Developer", value: "site:linkedin.com/in/ \"Blockchain Developer\" OR \"Smart Contract Developer\"" },
    { name: "Crypto Analyst", value: "site:linkedin.com/in/ \"Crypto Analyst\" OR \"Cryptocurrency Analyst\"" },
    { name: "Web3 Developer", value: "site:linkedin.com/in/ \"Web3 Developer\" OR \"DeFi Developer\"" },
    { name: "Tokenomics Specialist", value: "site:linkedin.com/in/ \"Tokenomics\" OR \"Token Economics\"" },
    { name: "NFT Project Manager", value: "site:linkedin.com/in/ \"NFT\" \"Project Manager\" OR \"NFT Lead\"" },
    { name: "Head of Crypto / Blockchain", value: "site:linkedin.com/in/ \"Head of\" crypto OR blockchain" },

    // ── LegalTech ──
    { name: "LegalTech Product Manager", value: "site:linkedin.com/in/ \"LegalTech\" OR \"Legal Technology\" \"Product Manager\"" },
    { name: "Legal Operations Manager", value: "site:linkedin.com/in/ \"Legal Operations Manager\"" },
    { name: "E-Discovery Specialist", value: "site:linkedin.com/in/ \"eDiscovery\" OR \"E-Discovery\" specialist" },
    { name: "Contract Manager / Analyst", value: "site:linkedin.com/in/ \"Contract Manager\" OR \"Contract Analyst\"" },
    { name: "Compliance Technology Lead", value: "site:linkedin.com/in/ \"Compliance\" technology OR \"RegTech\"" },

    // ── PropTech / Real Estate Tech ──
    { name: "PropTech Founder / CEO", value: "site:linkedin.com/in/ \"PropTech\" OR \"Property Technology\" CEO OR Founder" },
    { name: "Real Estate Technology Manager", value: "site:linkedin.com/in/ \"Real Estate\" technology manager" },
    { name: "Property Management Director", value: "site:linkedin.com/in/ \"Property Management\" Director" },

    // ── InsurTech ──
    { name: "InsurTech Product Manager", value: "site:linkedin.com/in/ \"InsurTech\" OR \"Insurance Technology\" \"Product Manager\"" },
    { name: "Actuarial Data Scientist", value: "site:linkedin.com/in/ \"Actuarial\" OR \"Actuary\" \"Data Scientist\"" },
    { name: "Insurance Underwriting Manager", value: "site:linkedin.com/in/ \"Underwriting Manager\" insurance" },

    // ── Additional Roles Across Industries ──
    { name: "Senior Project Manager", value: "site:linkedin.com/in/ \"Senior Project Manager\"" },
    { name: "Senior Program Manager", value: "site:linkedin.com/in/ \"Senior Program Manager\"" },
    { name: "Senior Business Analyst", value: "site:linkedin.com/in/ \"Senior Business Analyst\"" },
    { name: "Senior Financial Analyst", value: "site:linkedin.com/in/ \"Senior Financial Analyst\"" },
    { name: "Marketing Analyst", value: "site:linkedin.com/in/ \"Marketing Analyst\"" },
    { name: "Operations Analyst", value: "site:linkedin.com/in/ \"Operations Analyst\"" },
    { name: "Sales Coordinator", value: "site:linkedin.com/in/ \"Sales Coordinator\"" },
    { name: "Administrative Assistant", value: "site:linkedin.com/in/ \"Administrative Assistant\"" },
    { name: "Receptionist / Front Desk", value: "site:linkedin.com/in/ Receptionist OR \"Front Desk\"" },
    { name: "Training Manager / Coordinator", value: "site:linkedin.com/in/ \"Training Manager\" OR \"Training Coordinator\"" },
    { name: "Internal Auditor", value: "site:linkedin.com/in/ \"Internal Auditor\"" },
    { name: "Controller / Comptroller", value: "site:linkedin.com/in/ Controller OR Comptroller" },
    { name: "Logistics Coordinator", value: "site:linkedin.com/in/ \"Logistics Coordinator\"" },
    { name: "Communications Director", value: "site:linkedin.com/in/ \"Communications Director\"" },
    { name: "Scrum Master / Agile Coach", value: "site:linkedin.com/in/ \"Scrum Master\" OR \"Agile Coach\"" },
    { name: "DevOps Lead", value: "site:linkedin.com/in/ \"DevOps\" Lead OR Manager" },
    { name: "Cloud Architect", value: "site:linkedin.com/in/ \"Cloud Architect\"" },
    { name: "Technical Writer", value: "site:linkedin.com/in/ \"Technical Writer\"" },
    { name: "Content Writer / Copywriter", value: "site:linkedin.com/in/ \"Content Writer\" OR Copywriter" },
    { name: "Talent Acquisition Lead", value: "site:linkedin.com/in/ \"Talent Acquisition\" lead OR manager" },
    { name: "EHS / Safety Manager", value: "site:linkedin.com/in/ \"EHS Manager\" OR \"Safety Manager\" OR \"Health and Safety\"" },

    // ══════════════════════════════════════════════
    // Self-Employed / Freelancer / Individual
    // ══════════════════════════════════════════════

    // ── Freelancers & Independent Professionals ──
    { name: "Freelance Web Developer", value: "site:linkedin.com/in/ Freelance \"Web Developer\"" },
    { name: "Freelance Software Developer", value: "site:linkedin.com/in/ Freelance \"Software Developer\" OR \"Software Engineer\"" },
    { name: "Freelance Graphic Designer", value: "site:linkedin.com/in/ Freelance \"Graphic Designer\"" },
    { name: "Freelance UX/UI Designer", value: "site:linkedin.com/in/ Freelance \"UX Designer\" OR \"UI Designer\"" },
    { name: "Freelance Writer / Author", value: "site:linkedin.com/in/ Freelance Writer OR Author" },
    { name: "Freelance Copywriter", value: "site:linkedin.com/in/ Freelance Copywriter" },
    { name: "Freelance Editor / Proofreader", value: "site:linkedin.com/in/ Freelance Editor OR Proofreader" },
    { name: "Freelance Photographer", value: "site:linkedin.com/in/ Freelance Photographer" },
    { name: "Freelance Videographer", value: "site:linkedin.com/in/ Freelance Videographer OR \"Video Editor\"" },
    { name: "Freelance Social Media Manager", value: "site:linkedin.com/in/ Freelance \"Social Media Manager\"" },
    { name: "Freelance SEO Specialist", value: "site:linkedin.com/in/ Freelance \"SEO\" specialist OR consultant" },
    { name: "Freelance Digital Marketing", value: "site:linkedin.com/in/ Freelance \"Digital Marketing\"" },
    { name: "Freelance Data Scientist", value: "site:linkedin.com/in/ Freelance \"Data Scientist\" OR \"Data Analyst\"" },
    { name: "Freelance Bookkeeper / Accountant", value: "site:linkedin.com/in/ Freelance Bookkeeper OR Accountant" },
    { name: "Freelance Virtual Assistant", value: "site:linkedin.com/in/ Freelance \"Virtual Assistant\"" },
    { name: "Freelance Translator / Interpreter", value: "site:linkedin.com/in/ Freelance Translator OR Interpreter" },
    { name: "Freelance Illustrator", value: "site:linkedin.com/in/ Freelance Illustrator" },
    { name: "Freelance Motion Designer", value: "site:linkedin.com/in/ Freelance \"Motion Designer\" OR \"Motion Graphics\"" },
    { name: "Freelance Voice Actor", value: "site:linkedin.com/in/ Freelance \"Voice Actor\" OR \"Voice Over\"" },
    { name: "Freelance Music Producer", value: "site:linkedin.com/in/ Freelance \"Music Producer\" OR \"Audio Engineer\"" },

    // ── Consultants & Advisors ──
    { name: "Independent Consultant", value: "site:linkedin.com/in/ \"Independent Consultant\"" },
    { name: "Management Consultant (Independent)", value: "site:linkedin.com/in/ \"Management Consultant\" independent OR freelance OR self-employed" },
    { name: "Strategy Consultant (Independent)", value: "site:linkedin.com/in/ \"Strategy Consultant\" independent OR freelance" },
    { name: "IT Consultant (Independent)", value: "site:linkedin.com/in/ \"IT Consultant\" independent OR freelance" },
    { name: "Marketing Consultant (Independent)", value: "site:linkedin.com/in/ \"Marketing Consultant\" independent OR freelance" },
    { name: "Financial Advisor (Independent)", value: "site:linkedin.com/in/ \"Financial Advisor\" OR \"Financial Planner\" independent" },
    { name: "Tax Consultant / CPA (Self-Employed)", value: "site:linkedin.com/in/ \"Tax Consultant\" OR CPA self-employed OR independent" },
    { name: "HR Consultant (Independent)", value: "site:linkedin.com/in/ \"HR Consultant\" independent OR freelance" },
    { name: "Business Coach / Mentor", value: "site:linkedin.com/in/ \"Business Coach\" OR \"Business Mentor\"" },
    { name: "Executive Coach", value: "site:linkedin.com/in/ \"Executive Coach\"" },
    { name: "Life Coach", value: "site:linkedin.com/in/ \"Life Coach\"" },
    { name: "Career Coach / Counselor", value: "site:linkedin.com/in/ \"Career Coach\" OR \"Career Counselor\"" },
    { name: "Startup Advisor / Mentor", value: "site:linkedin.com/in/ \"Startup Advisor\" OR \"Startup Mentor\"" },

    // ── Solopreneurs & Small Business ──
    { name: "Solopreneur / Solo Founder", value: "site:linkedin.com/in/ Solopreneur OR \"Solo Founder\"" },
    { name: "Self-Employed Entrepreneur", value: "site:linkedin.com/in/ \"Self-Employed\" Entrepreneur" },
    { name: "Small Business Owner", value: "site:linkedin.com/in/ \"Small Business Owner\"" },
    { name: "Startup Founder (Solo)", value: "site:linkedin.com/in/ Founder \"Startup\" self-employed OR independent" },
    { name: "E-Commerce Entrepreneur", value: "site:linkedin.com/in/ \"E-Commerce\" OR Ecommerce Entrepreneur OR Owner" },
    { name: "Amazon / Etsy Seller", value: "site:linkedin.com/in/ Amazon OR Etsy Seller OR Owner" },
    { name: "Dropshipping Business Owner", value: "site:linkedin.com/in/ Dropshipping Owner OR Entrepreneur" },

    // ── Gig Workers & Contractors ──
    { name: "Independent Contractor", value: "site:linkedin.com/in/ \"Independent Contractor\"" },
    { name: "Contract Software Developer", value: "site:linkedin.com/in/ Contract \"Software Developer\" OR \"Software Engineer\"" },
    { name: "Contract Project Manager", value: "site:linkedin.com/in/ Contract \"Project Manager\"" },
    { name: "Contract Technical Writer", value: "site:linkedin.com/in/ Contract \"Technical Writer\"" },
    { name: "Contract Designer", value: "site:linkedin.com/in/ Contract Designer" },
    { name: "Gig Economy / On-Demand Worker", value: "site:linkedin.com/in/ \"Gig Economy\" OR \"On-Demand\"" },

    // ── Creative & Personal Brand ──
    { name: "Content Creator / Influencer", value: "site:linkedin.com/in/ \"Content Creator\" OR Influencer OR YouTuber" },
    { name: "Podcaster / Podcast Host", value: "site:linkedin.com/in/ Podcaster OR \"Podcast Host\"" },
    { name: "Blogger / Online Publisher", value: "site:linkedin.com/in/ Blogger OR \"Online Publisher\"" },
    { name: "Online Course Creator", value: "site:linkedin.com/in/ \"Course Creator\" OR \"Online Instructor\"" },
    { name: "Digital Nomad", value: "site:linkedin.com/in/ \"Digital Nomad\"" },
    { name: "Public Speaker / Keynote Speaker", value: "site:linkedin.com/in/ \"Public Speaker\" OR \"Keynote Speaker\"" },
    { name: "Author / Published Writer", value: "site:linkedin.com/in/ Author OR \"Published Writer\"" },

    // ── Self-Employed Trades & Services ──
    { name: "Self-Employed Realtor / Agent", value: "site:linkedin.com/in/ \"Real Estate Agent\" OR Realtor self-employed OR independent" },
    { name: "Self-Employed Insurance Agent", value: "site:linkedin.com/in/ \"Insurance Agent\" self-employed OR independent" },
    { name: "Self-Employed Attorney / Lawyer", value: "site:linkedin.com/in/ Attorney OR Lawyer \"solo practice\" OR self-employed OR independent" },
    { name: "Self-Employed Dentist / Doctor", value: "site:linkedin.com/in/ Dentist OR Doctor OR Physician \"private practice\" OR self-employed" },
    { name: "Self-Employed Therapist / Counselor", value: "site:linkedin.com/in/ Therapist OR Counselor \"private practice\" OR self-employed" },
    { name: "Self-Employed Personal Trainer", value: "site:linkedin.com/in/ \"Personal Trainer\" OR \"Fitness Trainer\" self-employed OR independent" },
    { name: "Self-Employed Tutor / Educator", value: "site:linkedin.com/in/ Tutor OR Educator self-employed OR independent" },
    { name: "Self-Employed Handyman / Contractor", value: "site:linkedin.com/in/ Handyman OR Contractor self-employed OR independent" },
    { name: "Self-Employed Chef / Caterer", value: "site:linkedin.com/in/ Chef OR Caterer self-employed OR independent" },
    { name: "Self-Employed Event Planner", value: "site:linkedin.com/in/ \"Event Planner\" self-employed OR independent OR freelance" },
    { name: "Self-Employed Interior Designer", value: "site:linkedin.com/in/ \"Interior Designer\" self-employed OR independent OR freelance" },

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
    { name: "SOC 11-0000 – Management Occupations", value: "site:linkedin.com/in/ manager OR director OR executive OR CEO OR \"vice president\"" },
    { name: "SOC 11-1000 – Top Executives", value: "site:linkedin.com/in/ CEO OR COO OR CFO OR \"chief executive\" OR \"general manager\"" },
    { name: "SOC 11-2000 – Advertising, Marketing, PR & Sales Managers", value: "site:linkedin.com/in/ \"marketing manager\" OR \"advertising manager\" OR \"PR manager\" OR \"sales manager\"" },
    { name: "SOC 11-3000 – Operations Specialties Managers", value: "site:linkedin.com/in/ \"operations manager\" OR \"IT manager\" OR \"financial manager\" OR \"compensation manager\"" },
    { name: "SOC 11-9000 – Other Management Occupations", value: "site:linkedin.com/in/ \"construction manager\" OR \"education administrator\" OR \"food service manager\" OR \"property manager\"" },
    { name: "SOC 13-0000 – Business & Financial Operations", value: "site:linkedin.com/in/ analyst OR accountant OR auditor OR \"business operations\" OR \"financial analyst\"" },
    { name: "SOC 13-1000 – Business Operations Specialists", value: "site:linkedin.com/in/ \"project manager\" OR \"management analyst\" OR \"compliance officer\" OR \"meeting planner\"" },
    { name: "SOC 13-2000 – Financial Specialists", value: "site:linkedin.com/in/ accountant OR auditor OR \"financial analyst\" OR \"budget analyst\" OR \"tax examiner\"" },
    { name: "SOC 15-0000 – Computer & Mathematical", value: "site:linkedin.com/in/ developer OR programmer OR \"software engineer\" OR \"data scientist\" OR mathematician" },
    { name: "SOC 15-1200 – Computer Occupations", value: "site:linkedin.com/in/ \"software developer\" OR \"systems administrator\" OR \"database administrator\" OR \"web developer\" OR \"network architect\"" },
    { name: "SOC 15-2000 – Mathematical Science", value: "site:linkedin.com/in/ mathematician OR statistician OR actuary OR \"operations research analyst\"" },
    { name: "SOC 17-0000 – Architecture & Engineering", value: "site:linkedin.com/in/ architect OR engineer OR surveyor OR drafter" },
    { name: "SOC 17-1000 – Architects, Surveyors & Cartographers", value: "site:linkedin.com/in/ architect OR \"landscape architect\" OR surveyor OR cartographer" },
    { name: "SOC 17-2000 – Engineers", value: "site:linkedin.com/in/ \"civil engineer\" OR \"mechanical engineer\" OR \"electrical engineer\" OR \"chemical engineer\" OR \"industrial engineer\"" },
    { name: "SOC 17-3000 – Drafters, Engineering Technicians", value: "site:linkedin.com/in/ drafter OR \"engineering technician\" OR \"surveying technician\" OR \"CAD technician\"" },
    { name: "SOC 19-0000 – Life, Physical & Social Science", value: "site:linkedin.com/in/ scientist OR researcher OR biologist OR chemist OR physicist OR sociologist" },
    { name: "SOC 19-1000 – Life Scientists", value: "site:linkedin.com/in/ biologist OR microbiologist OR zoologist OR \"conservation scientist\" OR epidemiologist" },
    { name: "SOC 19-2000 – Physical Scientists", value: "site:linkedin.com/in/ physicist OR chemist OR astronomer OR geoscientist OR \"atmospheric scientist\"" },
    { name: "SOC 19-3000 – Social Scientists", value: "site:linkedin.com/in/ economist OR psychologist OR sociologist OR \"political scientist\" OR \"urban planner\"" },
    { name: "SOC 19-4000 – Life, Physical & Social Science Technicians", value: "site:linkedin.com/in/ \"lab technician\" OR \"chemical technician\" OR \"biological technician\" OR \"environmental technician\"" },
    { name: "SOC 21-0000 – Community & Social Service", value: "site:linkedin.com/in/ counselor OR \"social worker\" OR \"community health\" OR \"substance abuse\" OR \"probation officer\"" },
    { name: "SOC 21-1000 – Counselors, Social Workers & Community Workers", value: "site:linkedin.com/in/ \"social worker\" OR counselor OR \"mental health counselor\" OR \"community health worker\" OR \"probation officer\"" },
    { name: "SOC 21-2000 – Religious Workers", value: "site:linkedin.com/in/ clergy OR pastor OR chaplain OR \"religious director\" OR minister" },
    { name: "SOC 23-0000 – Legal", value: "site:linkedin.com/in/ lawyer OR attorney OR judge OR paralegal OR \"legal assistant\"" },
    { name: "SOC 23-1000 – Lawyers, Judges & Related", value: "site:linkedin.com/in/ lawyer OR attorney OR judge OR magistrate OR \"administrative law judge\"" },
    { name: "SOC 23-2000 – Legal Support Workers", value: "site:linkedin.com/in/ paralegal OR \"legal assistant\" OR \"court reporter\" OR \"title examiner\"" },
    { name: "SOC 25-0000 – Educational Instruction & Library", value: "site:linkedin.com/in/ teacher OR professor OR instructor OR librarian OR tutor" },
    { name: "SOC 25-1000 – Postsecondary Teachers", value: "site:linkedin.com/in/ professor OR \"associate professor\" OR \"assistant professor\" OR lecturer OR \"postsecondary instructor\"" },
    { name: "SOC 25-2000 – Primary, Secondary & Special Ed Teachers", value: "site:linkedin.com/in/ \"elementary teacher\" OR \"middle school teacher\" OR \"high school teacher\" OR \"special education teacher\"" },
    { name: "SOC 25-3000 – Other Teachers & Instructors", value: "site:linkedin.com/in/ tutor OR \"substitute teacher\" OR \"adult education\" OR \"self-enrichment teacher\"" },
    { name: "SOC 25-4000 – Librarians, Curators & Archivists", value: "site:linkedin.com/in/ librarian OR curator OR archivist OR \"museum technician\"" },
    { name: "SOC 25-9000 – Other Educational Workers", value: "site:linkedin.com/in/ \"teaching assistant\" OR \"instructional coordinator\" OR \"education aide\" OR \"school counselor\"" },
    { name: "SOC 27-0000 – Arts, Design, Entertainment, Sports & Media", value: "site:linkedin.com/in/ designer OR artist OR writer OR reporter OR musician OR athlete" },
    { name: "SOC 27-1000 – Art & Design Workers", value: "site:linkedin.com/in/ \"graphic designer\" OR \"interior designer\" OR \"industrial designer\" OR \"floral designer\" OR illustrator" },
    { name: "SOC 27-2000 – Entertainers, Performers & Sports", value: "site:linkedin.com/in/ actor OR musician OR dancer OR athlete OR coach OR choreographer" },
    { name: "SOC 27-3000 – Media & Communication Workers", value: "site:linkedin.com/in/ reporter OR editor OR \"public relations\" OR writer OR author OR \"technical writer\"" },
    { name: "SOC 27-4000 – Media & Communication Equipment Workers", value: "site:linkedin.com/in/ photographer OR \"camera operator\" OR \"film editor\" OR \"sound engineer\" OR \"broadcast technician\"" },
    { name: "SOC 29-0000 – Healthcare Practitioners & Technical", value: "site:linkedin.com/in/ physician OR nurse OR pharmacist OR therapist OR \"registered nurse\"" },
    { name: "SOC 29-1000 – Health Diagnosing & Treating Practitioners", value: "site:linkedin.com/in/ physician OR surgeon OR dentist OR optometrist OR \"physician assistant\" OR \"nurse practitioner\"" },
    { name: "SOC 29-2000 – Health Technologists & Technicians", value: "site:linkedin.com/in/ \"medical technologist\" OR \"radiologic technician\" OR \"dental hygienist\" OR \"pharmacy technician\"" },
    { name: "SOC 29-9000 – Other Healthcare Practitioners", value: "site:linkedin.com/in/ \"health information\" OR dietitian OR audiologist OR \"athletic trainer\" OR \"occupational health\"" },
    { name: "SOC 31-0000 – Healthcare Support", value: "site:linkedin.com/in/ \"nursing assistant\" OR \"home health aide\" OR \"medical assistant\" OR \"physical therapy aide\"" },
    { name: "SOC 31-1000 – Nursing Assistants, Orderlies & Psychiatric Aides", value: "site:linkedin.com/in/ \"nursing assistant\" OR orderly OR \"psychiatric aide\" OR CNA" },
    { name: "SOC 31-9000 – Other Healthcare Support", value: "site:linkedin.com/in/ \"medical assistant\" OR phlebotomist OR \"physical therapy aide\" OR \"massage therapist\"" },
    { name: "SOC 33-0000 – Protective Service", value: "site:linkedin.com/in/ \"police officer\" OR firefighter OR \"security guard\" OR detective OR \"correctional officer\"" },
    { name: "SOC 33-1000 – Supervisors of Protective Service", value: "site:linkedin.com/in/ \"police sergeant\" OR \"fire captain\" OR \"security supervisor\" OR \"corrections supervisor\"" },
    { name: "SOC 33-2000 – Firefighting & Prevention", value: "site:linkedin.com/in/ firefighter OR \"fire inspector\" OR \"fire investigator\" OR \"forest firefighter\"" },
    { name: "SOC 33-3000 – Law Enforcement", value: "site:linkedin.com/in/ \"police officer\" OR detective OR \"criminal investigator\" OR sheriff OR \"transit police\"" },
    { name: "SOC 33-9000 – Other Protective Service", value: "site:linkedin.com/in/ \"security guard\" OR \"crossing guard\" OR \"lifeguard\" OR \"TSA officer\"" },
    { name: "SOC 35-0000 – Food Preparation & Serving", value: "site:linkedin.com/in/ chef OR cook OR \"food server\" OR bartender OR \"food preparation\"" },
    { name: "SOC 35-1000 – Supervisors of Food Preparation", value: "site:linkedin.com/in/ \"head chef\" OR \"kitchen manager\" OR \"food service supervisor\" OR \"executive chef\"" },
    { name: "SOC 35-2000 – Cooks & Food Preparation", value: "site:linkedin.com/in/ cook OR \"prep cook\" OR \"line cook\" OR \"short order cook\" OR \"food preparation worker\"" },
    { name: "SOC 35-3000 – Food & Beverage Serving", value: "site:linkedin.com/in/ waiter OR waitress OR bartender OR barista OR \"food server\"" },
    { name: "SOC 35-9000 – Other Food Preparation & Serving", value: "site:linkedin.com/in/ \"dining room attendant\" OR dishwasher OR \"food runner\" OR \"cafeteria attendant\"" },
    { name: "SOC 37-0000 – Building & Grounds Cleaning/Maintenance", value: "site:linkedin.com/in/ janitor OR custodian OR \"grounds keeper\" OR maid OR \"pest control\"" },
    { name: "SOC 37-1000 – Supervisors of Building & Grounds", value: "site:linkedin.com/in/ \"janitorial supervisor\" OR \"housekeeping supervisor\" OR \"grounds maintenance supervisor\"" },
    { name: "SOC 37-2000 – Building Cleaning & Pest Control", value: "site:linkedin.com/in/ janitor OR custodian OR maid OR \"pest control technician\" OR housekeeper" },
    { name: "SOC 37-3000 – Grounds Maintenance", value: "site:linkedin.com/in/ landscaper OR \"groundskeeper\" OR \"tree trimmer\" OR \"lawn service\"" },
    { name: "SOC 39-0000 – Personal Care & Service", value: "site:linkedin.com/in/ hairdresser OR \"fitness trainer\" OR \"child care\" OR \"personal care aide\"" },
    { name: "SOC 39-1000 – Supervisors of Personal Care", value: "site:linkedin.com/in/ \"personal care supervisor\" OR \"spa manager\" OR \"salon manager\" OR \"recreation supervisor\"" },
    { name: "SOC 39-2000 – Animal Care & Service", value: "site:linkedin.com/in/ \"animal trainer\" OR \"veterinary assistant\" OR \"dog groomer\" OR \"animal caretaker\"" },
    { name: "SOC 39-3000 – Entertainment Attendants", value: "site:linkedin.com/in/ \"usher\" OR \"amusement attendant\" OR \"recreation attendant\" OR \"locker room attendant\"" },
    { name: "SOC 39-4000 – Funeral Service", value: "site:linkedin.com/in/ \"funeral director\" OR mortician OR embalmer OR \"funeral attendant\"" },
    { name: "SOC 39-5000 – Personal Appearance", value: "site:linkedin.com/in/ hairdresser OR barber OR \"makeup artist\" OR \"skin care specialist\" OR manicurist" },
    { name: "SOC 39-9000 – Other Personal Care & Service", value: "site:linkedin.com/in/ \"personal care aide\" OR \"fitness trainer\" OR \"tour guide\" OR \"child care worker\"" },
    { name: "SOC 41-0000 – Sales & Related", value: "site:linkedin.com/in/ \"sales representative\" OR \"sales associate\" OR \"account executive\" OR cashier" },
    { name: "SOC 41-1000 – Supervisors of Sales", value: "site:linkedin.com/in/ \"sales manager\" OR \"sales supervisor\" OR \"retail manager\" OR \"store manager\"" },
    { name: "SOC 41-2000 – Retail Sales", value: "site:linkedin.com/in/ \"retail sales\" OR cashier OR \"sales associate\" OR \"sales clerk\"" },
    { name: "SOC 41-3000 – Sales Representatives, Services", value: "site:linkedin.com/in/ \"insurance agent\" OR \"real estate agent\" OR \"travel agent\" OR \"advertising sales\"" },
    { name: "SOC 41-4000 – Sales Representatives, Wholesale/Manufacturing", value: "site:linkedin.com/in/ \"sales representative\" OR \"account manager\" OR \"territory manager\" OR \"wholesale sales\"" },
    { name: "SOC 41-9000 – Other Sales & Related", value: "site:linkedin.com/in/ telemarketer OR \"door to door\" OR \"sales engineer\" OR \"parts salesperson\"" },
    { name: "SOC 43-0000 – Office & Administrative Support", value: "site:linkedin.com/in/ \"administrative assistant\" OR secretary OR clerk OR receptionist OR \"office manager\"" },
    { name: "SOC 43-1000 – Supervisors of Office & Administrative Support", value: "site:linkedin.com/in/ \"office manager\" OR \"administrative supervisor\" OR \"clerical supervisor\"" },
    { name: "SOC 43-2000 – Communications Equipment Operators", value: "site:linkedin.com/in/ \"switchboard operator\" OR \"telephone operator\" OR dispatcher OR \"communications operator\"" },
    { name: "SOC 43-3000 – Financial Clerks", value: "site:linkedin.com/in/ \"billing clerk\" OR bookkeeper OR \"payroll clerk\" OR teller OR \"accounting clerk\"" },
    { name: "SOC 43-4000 – Information & Record Clerks", value: "site:linkedin.com/in/ receptionist OR \"file clerk\" OR \"court clerk\" OR \"medical records\" OR \"customer service representative\"" },
    { name: "SOC 43-5000 – Material Recording & Dispatching", value: "site:linkedin.com/in/ dispatcher OR \"shipping clerk\" OR \"stock clerk\" OR \"production clerk\" OR \"order clerk\"" },
    { name: "SOC 43-6000 – Secretaries & Administrative Assistants", value: "site:linkedin.com/in/ secretary OR \"administrative assistant\" OR \"executive assistant\" OR \"legal secretary\" OR \"medical secretary\"" },
    { name: "SOC 43-9000 – Other Office & Administrative Support", value: "site:linkedin.com/in/ \"data entry\" OR \"mail clerk\" OR \"office clerk\" OR \"proofreader\" OR \"statistical assistant\"" },
    { name: "SOC 45-0000 – Farming, Fishing & Forestry", value: "site:linkedin.com/in/ farmer OR rancher OR fisherman OR \"logging worker\" OR \"agricultural worker\"" },
    { name: "SOC 45-1000 – Supervisors of Farming, Fishing & Forestry", value: "site:linkedin.com/in/ \"farm supervisor\" OR \"ranch foreman\" OR \"logging supervisor\" OR \"agricultural supervisor\"" },
    { name: "SOC 45-2000 – Agricultural Workers", value: "site:linkedin.com/in/ \"farm worker\" OR \"crop worker\" OR \"nursery worker\" OR \"agricultural inspector\"" },
    { name: "SOC 45-3000 – Fishing & Hunting Workers", value: "site:linkedin.com/in/ fisherman OR \"fishing vessel\" OR hunter OR trapper" },
    { name: "SOC 45-4000 – Forest, Conservation & Logging", value: "site:linkedin.com/in/ \"log grader\" OR \"forest worker\" OR \"conservation worker\" OR \"logging equipment operator\"" },
    { name: "SOC 47-0000 – Construction & Extraction", value: "site:linkedin.com/in/ carpenter OR electrician OR plumber OR \"construction worker\" OR welder" },
    { name: "SOC 47-1000 – Supervisors of Construction & Extraction", value: "site:linkedin.com/in/ \"construction supervisor\" OR \"construction foreman\" OR \"site superintendent\" OR \"extraction supervisor\"" },
    { name: "SOC 47-2000 – Construction Trades", value: "site:linkedin.com/in/ carpenter OR electrician OR plumber OR bricklayer OR roofer OR \"iron worker\"" },
    { name: "SOC 47-3000 – Helpers, Construction Trades", value: "site:linkedin.com/in/ \"construction helper\" OR \"electrician helper\" OR \"plumber helper\" OR \"carpenter helper\"" },
    { name: "SOC 47-4000 – Other Construction", value: "site:linkedin.com/in/ \"fence erector\" OR \"hazmat worker\" OR \"rail-track worker\" OR \"septic tank servicer\"" },
    { name: "SOC 47-5000 – Extraction Workers", value: "site:linkedin.com/in/ \"mining machine operator\" OR \"oil derrick\" OR \"rotary drill\" OR \"explosives worker\"" },
    { name: "SOC 49-0000 – Installation, Maintenance & Repair", value: "site:linkedin.com/in/ technician OR mechanic OR installer OR \"maintenance worker\" OR \"repair technician\"" },
    { name: "SOC 49-1000 – Supervisors of Installation & Maintenance", value: "site:linkedin.com/in/ \"maintenance supervisor\" OR \"installation supervisor\" OR \"repair supervisor\" OR \"mechanic supervisor\"" },
    { name: "SOC 49-2000 – Electrical & Electronic Equipment Mechanics", value: "site:linkedin.com/in/ \"electronics technician\" OR \"avionics technician\" OR \"electrical repairer\" OR \"telecom installer\"" },
    { name: "SOC 49-3000 – Vehicle & Mobile Equipment Mechanics", value: "site:linkedin.com/in/ \"auto mechanic\" OR \"diesel mechanic\" OR \"aircraft mechanic\" OR \"bus mechanic\"" },
    { name: "SOC 49-9000 – Other Installation, Maintenance & Repair", value: "site:linkedin.com/in/ \"HVAC technician\" OR locksmith OR \"maintenance worker\" OR \"appliance repairer\" OR millwright" },
    { name: "SOC 51-0000 – Production", value: "site:linkedin.com/in/ \"machine operator\" OR assembler OR welder OR \"production worker\" OR machinist" },
    { name: "SOC 51-1000 – Supervisors of Production", value: "site:linkedin.com/in/ \"production supervisor\" OR \"manufacturing supervisor\" OR \"plant foreman\"" },
    { name: "SOC 51-2000 – Assemblers & Fabricators", value: "site:linkedin.com/in/ assembler OR fabricator OR \"electrical assembler\" OR \"team assembler\"" },
    { name: "SOC 51-3000 – Food Processing", value: "site:linkedin.com/in/ \"food batchmaker\" OR \"meat cutter\" OR baker OR \"food processing worker\"" },
    { name: "SOC 51-4000 – Metal Workers & Plastic Workers", value: "site:linkedin.com/in/ machinist OR welder OR \"CNC operator\" OR \"tool and die maker\" OR \"metal fabricator\"" },
    { name: "SOC 51-5000 – Printing Workers", value: "site:linkedin.com/in/ \"printing press operator\" OR \"prepress technician\" OR \"print binding\" OR \"digital printing\"" },
    { name: "SOC 51-6000 – Textile, Apparel & Furnishings", value: "site:linkedin.com/in/ \"sewing machine operator\" OR tailor OR upholsterer OR \"textile worker\"" },
    { name: "SOC 51-7000 – Woodworkers", value: "site:linkedin.com/in/ cabinetmaker OR \"woodworking machine\" OR \"sawing machine operator\" OR woodworker" },
    { name: "SOC 51-8000 – Plant & System Operators", value: "site:linkedin.com/in/ \"power plant operator\" OR \"water treatment operator\" OR \"chemical plant operator\" OR \"stationary engineer\"" },
    { name: "SOC 51-9000 – Other Production", value: "site:linkedin.com/in/ inspector OR \"packaging operator\" OR \"painting worker\" OR \"jewelry maker\" OR \"dental lab technician\"" },
    { name: "SOC 53-0000 – Transportation & Material Moving", value: "site:linkedin.com/in/ driver OR pilot OR \"truck driver\" OR \"forklift operator\" OR \"material handler\"" },
    { name: "SOC 53-1000 – Supervisors of Transportation & Material Moving", value: "site:linkedin.com/in/ \"transportation supervisor\" OR \"warehouse supervisor\" OR \"logistics supervisor\"" },
    { name: "SOC 53-2000 – Air Transportation Workers", value: "site:linkedin.com/in/ pilot OR \"airline pilot\" OR \"flight engineer\" OR \"air traffic controller\"" },
    { name: "SOC 53-3000 – Motor Vehicle Operators", value: "site:linkedin.com/in/ \"truck driver\" OR \"bus driver\" OR \"delivery driver\" OR \"taxi driver\"" },
    { name: "SOC 53-4000 – Rail Transportation Workers", value: "site:linkedin.com/in/ \"locomotive engineer\" OR \"rail yard worker\" OR \"train conductor\" OR \"subway operator\"" },
    { name: "SOC 53-5000 – Water Transportation Workers", value: "site:linkedin.com/in/ \"ship captain\" OR \"ship engineer\" OR sailor OR \"boat operator\" OR mate" },
    { name: "SOC 53-6000 – Other Transportation Workers", value: "site:linkedin.com/in/ \"parking attendant\" OR \"traffic technician\" OR \"bridge tender\" OR \"transportation inspector\"" },
    { name: "SOC 53-7000 – Material Moving Workers", value: "site:linkedin.com/in/ \"forklift operator\" OR \"crane operator\" OR \"material handler\" OR \"conveyor operator\"" },
    { name: "SOC 55-0000 – Military Specific", value: "site:linkedin.com/in/ military OR \"armed forces\" OR veteran OR \"military officer\" OR \"enlisted military\"" },
    { name: "SOC 55-1000 – Military Officer Special & Tactical Operations", value: "site:linkedin.com/in/ \"military officer\" OR \"special operations\" OR \"tactical officer\" OR \"infantry officer\"" },
    { name: "SOC 55-2000 – First-Line Enlisted Military Supervisors", value: "site:linkedin.com/in/ sergeant OR \"staff sergeant\" OR \"master sergeant\" OR \"first sergeant\" OR \"military supervisor\"" },
    { name: "SOC 55-3000 – Military Enlisted Tactical Operations", value: "site:linkedin.com/in/ \"infantry\" OR \"combat engineer\" OR \"military intelligence\" OR \"special forces enlisted\"" }
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