export interface ProblemStatement {
    id: number;
    title: string;
    domain: string;
    background: string;
    problemStatement: string;
    directions: string[];
    evaluationCriteria: string[];
    type: 'AI' | 'Healthcare' | 'Fintech' | 'Open Innovation';
}

export const HACKATHON_PROBLEMS: ProblemStatement[] = [
    {
        id: 1,
        title: "Healthcare Accessibility Intelligence Platform",
        domain: "Healthcare / Inclusive Innovation",
        type: "Healthcare",
        background: `Access to healthcare remains a major challenge for persons with disabilities due to limited information about accessibility infrastructure in hospitals and clinics. Facilities often lack transparent details about features such as wheelchair access, accessible restrooms, sign language support, tactile navigation aids, or assistance services. As a result, individuals with disabilities may face significant barriers when seeking medical care, including physical inaccessibility, communication difficulties, and lack of appropriate support services. A centralized and reliable system that helps users identify accessible healthcare facilities can significantly improve healthcare inclusivity and patient experience.`,
        problemStatement: `Build a digital platform that helps individuals with disabilities discover healthcare facilities based on accessibility features. The system should aggregate information about hospitals, clinics, and diagnostic centers, highlighting infrastructure and services designed for accessibility. It should allow users to search and filter facilities based on specific accessibility needs, provide location-based discovery, and enable community feedback to improve data accuracy and transparency.`,
        directions: [
            "Accessibility Mapping: Create a structured database of healthcare facilities with details about accessibility features such as wheelchair ramps, elevators, tactile paths, accessible washrooms, and assistance services.",
            "Location Intelligence: Use geolocation to help users find nearby healthcare facilities that match their accessibility requirements.",
            "Community Contribution: Enable users to submit feedback, accessibility ratings, and updates about healthcare facility infrastructure.",
            "Accessibility Classification: Develop a standardized accessibility scoring system to help users quickly evaluate healthcare facilities.",
            "Inclusive Interface Design: Design the platform to support screen readers, voice navigation, high-contrast modes, and simplified UI for diverse accessibility needs."
        ],
        evaluationCriteria: [
            "Accessibility Coverage: Number and diversity of healthcare facilities mapped with accessibility information.",
            "Data Reliability: Accuracy and completeness of reported accessibility features.",
            "User Experience: Ease of discovering and filtering healthcare facilities based on accessibility needs.",
            "Inclusivity: Support for diverse accessibility requirements such as mobility, visual, and hearing impairments.",
            "Scalability: Ability to expand the platform to multiple regions and integrate with public health infrastructure."
        ]
    },
    {
        id: 2,
        title: "DeFi Fraud Prevention & Risk Monitoring",
        domain: "Fintech / Blockchain Security",
        type: "Fintech",
        background: `The decentralized finance (DeFi) ecosystem is prone to rug pulls, flash loan attacks, and smart contract vulnerabilities, leading to billions in lost funds. Retail investors often lack the technical expertise to audit contracts before investing.`,
        problemStatement: `Create a real-time risk assessment dashboard for DeFi protocols. The system should monitor on-chain transactions, analyze smart contract code for common vulnerabilities, and provide a 'Trust Score' for different liquidity pools.`,
        directions: [
            "Smart Contract Auditing: Automated static analysis of Solidity code.",
            "On-chain Analytics: Monitoring large movements of funds (whale tracking).",
            "Alert System: Push notifications for detected anomalies or sudden liquidity drops.",
            "Governance Tracking: Monitoring changes in protocol parameters."
        ],
        evaluationCriteria: [
            "Accuracy of Risk Scores: How well the system predicts or identifies malicious activity.",
            "Speed of Detection: Processing on-chain data in real-time.",
            "UI/UX: Making complex security data accessible to non-technical users."
        ]
    },
    {
        id: 3,
        title: "Localized AI Education Assistant",
        domain: "AI / Education",
        type: "AI",
        background: `Students in rural areas often struggle with complex STEM concepts due to language barriers and a lack of personalized tutoring. High-quality educational content is predominantly in English, leaving non-native speakers at a disadvantage.`,
        problemStatement: `Develop a multi-lingual AI tutor that can explain complex scientific and mathematical concepts in regional Indian languages. The assistant should allow students to upload images of their textbooks and receive simplified explanations, practice problems, and doubt resolution.`,
        directions: [
            "Multi-modal Entry: OCR for textbook images and voice input for questions.",
            "Translation & Transliteration: High-accuracy translation into regional languages.",
            "Adaptive Learning: Adjusting the complexity of explanations based on the student's level.",
            "Low Bandwidth Optimization: Ensuring functionality in areas with poor internet connectivity."
        ],
        evaluationCriteria: [
            "Linguistic Accuracy: Correctness of explanations in regional languages.",
            "Conceptual Clarity: Success in simplifying complex topics.",
            "Offline/Low-Bandwidth Support: Reliability in rural settings."
        ]
    },
    {
        id: 4,
        title: "Real-Time Fake News Detection Engine",
        domain: "AI for Digital Safety",
        type: "AI",
        background: `Misinformation spreads rapidly across social media platforms, causing real-world harm: communal tensions, health misinformation, financial scams, and election interference. A single viral fake news post can reach millions within hours before fact-checkers can respond. Users lack tools to verify content authenticity in real-time, especially in regional languages where fact-checking resources are limited.`,
        problemStatement: `Build an AI-powered fake news detection system that analyzes news articles, social media posts, images, and videos to identify misinformation in real-time. The system should provide credibility scores, identify manipulated media, cross-reference with verified sources, and explain its reasoning in simple language. It must work across multiple Indian languages and handle multimedia content.`,
        directions: [
            "NLP: Multi-lingual text analysis for sensational language, source credibility, and claim verification.",
            "Computer Vision: Deepfake detection, image manipulation identification, and reverse image search.",
            "Knowledge Graphs: Cross-referencing claims with verified fact-checking databases and trusted sources.",
            "Explainability: Clear reasoning for credibility scores that users can understand and trust.",
            "Browser Extension: Real-time fact-checking while users browse social media."
        ],
        evaluationCriteria: [
            "Detection Accuracy: Precision and recall on labeled fake news datasets.",
            "Speed: Real-time analysis with results available within seconds.",
            "Multi-lingual Support: Coverage of Hindi, English, and at least two regional languages.",
            "User Trust: Explainability and transparency of credibility assessments.",
            "Scalability: Ability to process high volumes of content from various social media APIs."
        ]
    },
    {
        id: 5,
        title: "Open Innovation / Freestyle Challenge",
        domain: "Cross-Domain Innovation",
        type: "Open Innovation",
        background: `The most disruptive innovations often come from identifying unaddressed gaps in everyday life. This track is for those who have a unique vision that doesn't fit into the predefined categories but solves a significant problem using technology.`,
        problemStatement: `Identify a pressing problem in any domain—be it Sustainability, Smart Cities, Social Impact, or Entertainment—and build a software-based solution. Your project should demonstrate technical depth, a clear value proposition, and a functional MVP.`,
        directions: [
            "Problem Identification: Clearly define the 'Why' behind your project.",
            "Technical Execution: Choose a robust stack that fits the requirements.",
            "User-Centric Design: Ensure the solution is intuitive and solves the core problem effectively.",
            "Impact Potential: How large is the problem being addressed?"
        ],
        evaluationCriteria: [
            "Creativity & Originality: How unique is the approach?",
            "Technical Complexity: The sophisticated use of algorithms, APIs, or data structures.",
            "Completeness: A working prototype that demonstrates core functionality.",
            "Scalability: The potential for the project to grow into a real-world application."
        ]
    }
];
