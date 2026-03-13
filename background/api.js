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
    { name: "Biotech / Pharmaceutical Researcher", value: "site:linkedin.com/in/ \"Biotech\" OR \"Pharmaceutical\" \"Researcher\"" },
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
    { name: "Coach / Head Coach", value: "site:linkedin.com/in/ Coach OR \"Head Coach\"" }
];

serpdigger.api.footprints.get = function (callback) {
    fetch(serpdigger.config.api.footprints.url, {
        method: serpdigger.config.api.footprints.method,
        cache: 'no-cache'
    })
    .then(function(response) { return response.text(); })
    .then(function(data) {
        var parsed = _parseFootprints(data);
        callback(parsed.length > 0 ? parsed : _builtinFootprints);
    })
    .catch(function() {
        callback(_builtinFootprints);
    });
};