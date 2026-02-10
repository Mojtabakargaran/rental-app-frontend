Executive Overview
This document presents an AI-assisted, documentation-driven development methodology designed to enable scalable, large-scale microservice systems without architectural degradation. A sample microservice application is introduced at the end.
________________________________________
Overview of the Method
I have designed an innovative development method that leverages artificial intelligence to implement software systems based on precise, evolving specifications. Conceptually, this approach is a refined form of spec-driven development, adapted specifically for AI-assisted coding.
Unlike ad-hoc prompt-based or “vibe coding” approaches, development in this method strictly follows structured documentation. All technical details are progressively generated, expanded, and maintained by AI, while remaining fully transparent and editable for the development team at every stage.
An end-to-end sample microservice application has been built using this method and is available for inspection.
________________________________________
Core Components of the Method
The method consists of two fundamental phases:
1.	Use Case Definition
Use cases are generated with AI assistance and reviewed, edited, or authored by humans as needed. These use cases define the business logic, constraints, and expected behavior of the system.
2.	AI-Driven Implementation
Each approved use case is converted into back-end and front-end code entirely by AI, guided by the accumulated documentation and predefined architectural constraints.
Use cases are not required upfront. Development proceeds incrementally: each new use case extends the codebase and documentation in a controlled and consistent manner.
________________________________________
Role of Humans vs. AI
This method follows a clear human-in-the-loop model:
•	Humans define intent, business logic, constraints, and architectural decisions.
•	AI performs deterministic implementation: coding, validation layers, error handling, and documentation updates.
•	Documentation acts as the contract between human intent and AI execution.
The development team does not write code directly. Instead, their primary responsibility is to ensure the correctness and completeness of use cases and architectural decisions.
________________________________________
Responsibilities of the Development Team
1.	Authoring and Reviewing Use Cases
The team reviews and refines AI-generated use cases or authors them from scratch when domain knowledge is required. The quality of use cases directly determines the quality of the resulting system. For example, in the sample microservice application presented at the end, all use cases in this list are implemented by AI. The following link shows an example of a complete use case.
2.	Selecting Architecture and Technology
Architectural patterns, technology stacks, and constraints are selected by the team and recorded in predefined prompts. These decisions guide all subsequent AI-generated output.
All process documentation is automatically produced and maintained by AI; the team does not manually manage documentation artifacts.
________________________________________
Problems Addressed by This Method
Current AI-assisted development struggles with large-scale systems due to limited model context and lack of global architectural awareness. In practice, teams encounter duplicated logic, inconsistent abstractions, broken builds, and unresolvable errors after only a few use cases.
This method addresses these issues through:
•	Structured, evolving documentation
•	Controlled prompt design
•	Explicit separation of concerns
•	Incremental scope expansion per use case
As a result, AI retains an effective understanding of the system regardless of project size.
________________________________________
Business Impact
•	Reduced engineering cost by removing manual coding
•	Faster time-to-market through AI-speed implementation
•	Predictable and auditable development process
•	Reduced onboarding complexity for new developers
•	Consistent architecture and UI/UX across large codebases
________________________________________
Applicability and Scope
This method imposes no limitations on programming language, framework, architecture, or application size. It can be applied in any IDE connected to an AI assistant. The sample project was implemented using VS Code and GitHub Copilot, but the approach is tool-agnostic.
Existing projects can adopt this method provided their documentation is restructured according to the defined schema. While this migration requires effort, it is feasible.
________________________________________
Sample Application Specifications
The sample application is an equipment rental management system implemented to demonstrate the effectiveness of the method. The implemented features are visible in the list of use cases and in README-backend.md.
Key characteristics:
•	Event-driven microservice architecture
•	Full front-end and back-end validation
•	Comprehensive error handling
•	Bilingual support (English , Persian)
•	24 detailed use cases
Only selected modules (dashboard, users, categories, equipment) are implemented, as the goal was methodological demonstration rather than feature completeness.
Architecture and Technology Stack
Back End
•	Architecture: Event-driven Microservices with API Gateway
•	Language: TypeScript (strict mode)
•	Framework: NestJS
•	Database: PostgreSQL (per service)
•	ORM: TypeORM
•	Communication: gRPC
•	Messaging: RabbitMQ
•	Cache: Redis
•	API Documentation: Swagger/OpenAPI
Front End
•	Framework: Next.js 14+ (App Router)
•	Language: TypeScript (strict mode)
•	Styling: TailwindCSS with RTL support
•	UI: shadcn/ui, Radix UI
•	Forms & Validation: React Hook Form, Zod
•	State Management: TanStack Query, React Context
•	Internationalization: next-intl

link to sample application login page- link to sample application register page
________________________________________
Collaboration Opportunities
I am open to collaboration in the following forms:
•	Technology Transfer: Full acquisition of the method and its details
•	Strategic Partnership: Joint execution of a specific software project
•	Employment: Contribution without disclosure of the execution method
I would be glad to discuss potential collaboration opportunities.
Email: kargaran.1367@gmail.com
WhatsApp: 09151246455
