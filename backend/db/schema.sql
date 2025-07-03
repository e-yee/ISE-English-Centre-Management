-- Table Definitions
CREATE TABLE
    Employee (
        ID VARCHAR(10),
        FullName NVARCHAR (2000) NOT NULL,
        Email VARCHAR(320) NOT NULL, UNIQUE (Email),
        PhoneNumber VARCHAR(20),
        Role VARCHAR(20) NOT NULL,
        TeacherStatus VARCHAR(20),

        PRIMARY KEY (ID)
    );

CREATE TABLE
    StaffCheckin (
        ID VARCHAR(10),
        EmployeeID VARCHAR(10) NOT NULL,
        CheckinTime DATETIME NOT NULL,
        CheckoutTime DATETIME NOT NULL,
        Status VARCHAR(200) NOT NULL DEFAULT 'Not Checked In',

        PRIMARY KEY (ID)
    );

CREATE TABLE
    LeaveRequest (
        ID VARCHAR(10),
        EmployeeID VARCHAR(10) NOT NULL,
        SubstituteID VARCHAR(10) NOT NULL,
        StartDate DATE NOT NULL,
        EndDate DATE NOT NULL,
        Reason NVARCHAR (200) NOT NULL,
        Status NVARCHAR (15) NOT NULL DEFAULT 'Not Approved',
        CreatedDate DATE NOT NULL DEFAULT (CURRENT_DATE),
        
        PRIMARY KEY (ID)
    );

CREATE TABLE
    Account (
        ID VARCHAR(10),
        EmployeeID VARCHAR(10) NOT NULL,
        Username VARCHAR(200) NOT NULL,
        PasswordHash VARCHAR(200) NOT NULL,
        CreatedDate DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (ID)
    );

CREATE TABLE
    Student (
        ID VARCHAR(10),
        FullName NVARCHAR (2000) NOT NULL,
        DateOfBirth DATE,
        ContactInfo VARCHAR(200) NOT NULL,
        CreatedDate DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (ID)
    );

CREATE TABLE
    Class (
        ID VARCHAR(10),
        ClassName VARCHAR(200) NOT NULL,
        ClassDescription VARCHAR(200),
        Duration INT NOT NULL,
        StartDate DATE NOT NULL,
        EndDate DATE GENERATED ALWAYS AS (DATE_ADD(StartDate, INTERVAL Duration MONTH)) STORED,
        Schedule VARCHAR(200) NOT NULL,
        TeacherID VARCHAR(10) NOT NULL,
        Fee INT NOT NULL,
        Prerequisites VARCHAR(20) NOT NULL,
        CreatedDate DATE,

        PRIMARY KEY (ID, CreatedDate)
    );

CREATE TABLE
    Contract (
        ID VARCHAR(10),
        StudentID VARCHAR(10) NOT NULL,
        EmployeeID VARCHAR(10) NOT NULL,
        ClassID VARCHAR(10) NOT NULL,
        ClassDate DATE NOT NULL,
        TuitionFee INT NOT NULL,
        PaymentStatus VARCHAR(20) NOT NULL DEFAULT 'In Progress',
        StartDate DATE NOT NULL,
        EndDate DATE NOT NULL,

        PRIMARY KEY (ID)
    );

CREATE TABLE
    Enrolment (
        ID VARCHAR(10),
        ContractID VARCHAR(10) NOT NULL, 
        StudentID VARCHAR(10) NOT NULL,
        ClassID VARCHAR(10) NOT NULL,
        ClassDate DATE NOT NULL,
        EnrolmentDate DATE NOT NULL,

        PRIMARY KEY (ID)
    );

CREATE TABLE
    Room (
        ID VARCHAR(10),
        RoomName VARCHAR(200) NOT NULL,
        Status VARCHAR(20) NOT NULL DEFAULT 'Free',

        PRIMARY KEY (ID)
    );

CREATE TABLE
    ClassSession (
        ID VARCHAR(10),
        ClassID VARCHAR(10),
        ClassDate DATE,
        Term INT,
        TeacherID VARCHAR(10) NOT NULL,
        RoomID VARCHAR(10) NOT NULL,
        SessionDate DATETIME NOT NULL,

        PRIMARY KEY (ID, ClassID, ClassDate, Term)
    );

CREATE TABLE
    StudentAttendance (
        StudentID VARCHAR(10),
        ClassSessionID VARCHAR(10),
        ClassID VARCHAR(10),
        ClassDate DATE,
        Term INT,
        EnrolmentID VARCHAR(10) NOT NULL,
        Status VARCHAR(20) NOT NULL,

        PRIMARY KEY (StudentID, ClassSessionID, ClassID, ClassDate, Term)
    );

CREATE TABLE
    MakeupClass (
        ID VARCHAR(10),
        StudentID VARCHAR(10) NOT NULL,
        ClassSessionID VARCHAR(10) NOT NULL,
        ClassID VARCHAR(10) NOT NULL,
        ClassDate DATE NOT NULL,
        Term INT NOT NULL,
        TeacherID VARCHAR(10) NOT NULL,
        RoomID VARCHAR(10) NOT NULL,
        CreatedDate DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (ID)
    );

CREATE TABLE
    Evaluation (
        StudentID VARCHAR(10),
        ClassID VARCHAR(10),
        ClassDate DATE,
        AssessmentType VARCHAR(200),
        TeacherID VARCHAR(10) NOT NULL,
        Grade VARCHAR(2) NOT NULL,
        Comment NVARCHAR (2000) NOT NULL,
        EnrolmentID VARCHAR(10) NOT NULL,
        EvaluationDate DATE NOT NULL,

        PRIMARY KEY (StudentID, ClassID, ClassDate, AssessmentType)
    );

CREATE TABLE
    Issue (
        ID VARCHAR(10),
        TeacherID VARCHAR(10) NOT NULL,
        StudentID VARCHAR(10),
        RoomID VARCHAR(10),
        IssueType VARCHAR(200) NOT NULL,
        IssueDescription NVARCHAR (200) NOT NULL,
        Status VARCHAR(20) NOT NULL DEFAULT 'In Progress',
        ReportedDate DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (ID)
    );