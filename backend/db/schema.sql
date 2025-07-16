CREATE TABLE
    employee (
        id VARCHAR(10),
        full_name NVARCHAR (2000) NOT NULL,
        email VARCHAR(320) NOT NULL, UNIQUE (email),
        phone_number VARCHAR(20), UNIQUE (phone_number),
        role VARCHAR(20) NOT NULL,
        teacher_status VARCHAR(20),

        PRIMARY KEY (id)
    );

CREATE TABLE
    staff_checkin (
        id VARCHAR(10),
        employee_id VARCHAR(10) NOT NULL,
        checkin_time DATETIME,
        checkout_time DATETIME,
        status VARCHAR(200) NOT NULL DEFAULT 'Not Checked In',

        PRIMARY KEY (id)
    );

CREATE TABLE
    leave_request (
        id VARCHAR(10),
        employee_id VARCHAR(10) NOT NULL,
        substitute_id VARCHAR(10) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason NVARCHAR (200) NOT NULL,
        status NVARCHAR (15) NOT NULL DEFAULT 'Not Approved',
        created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
        
        PRIMARY KEY (id)
    );

CREATE TABLE
    account (
        id VARCHAR(10),
        employee_id VARCHAR(10) NOT NULL,
        username VARCHAR(200) NOT NULL, UNIQUE(username),
        password_hash VARCHAR(200) NOT NULL,
        created_date DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (id)
    );

CREATE TABLE
    student (
        id VARCHAR(10),
        full_name NVARCHAR (2000) NOT NULL,
        date_of_birth DATE,
        contact_info VARCHAR(200) NOT NULL,
        created_date DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (id)
    );

CREATE TABLE
    class (
        id VARCHAR(10),
        class_name VARCHAR(200) NOT NULL,
        class_description VARCHAR(200),
        duration INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE GENERATED ALWAYS AS (DATE_ADD(start_date, INTERVAL duration MONTH)) STORED,
        schedule VARCHAR(200) NOT NULL,
        teacher_id VARCHAR(10) NOT NULL,
        fee INT NOT NULL,
        prerequisites VARCHAR(20) NOT NULL,
        created_date DATE,

        PRIMARY KEY (id, created_date)
    );

CREATE TABLE
    contract (
        id VARCHAR(10),
        student_id VARCHAR(10) NOT NULL,
        employee_id VARCHAR(10) NOT NULL,
        class_id VARCHAR(10) NOT NULL,
        class_date DATE NOT NULL,
        tuition_fee INT NOT NULL,
        payment_status VARCHAR(20) NOT NULL DEFAULT 'In Progress',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,

        PRIMARY KEY (id)
    );

CREATE TABLE
    enrolment (
        id VARCHAR(10),
        contract_id VARCHAR(10) NOT NULL, 
        student_id VARCHAR(10) NOT NULL,
        class_id VARCHAR(10) NOT NULL,
        class_date DATE NOT NULL,
        enrolment_date DATE NOT NULL,

        PRIMARY KEY (id)
    );

CREATE TABLE
    room (
        id VARCHAR(10),
        room_name VARCHAR(200) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Free',

        PRIMARY KEY (id)
    );

CREATE TABLE
    class_session (
        id VARCHAR(10),
        class_id VARCHAR(10),
        class_date DATE,
        term INT,
        teacher_id VARCHAR(10) NOT NULL,
        room_id VARCHAR(10) NOT NULL,
        session_date DATETIME NOT NULL,

        PRIMARY KEY (id, class_id, class_date, term)
    );

CREATE TABLE
    student_attendance (
        student_id VARCHAR(10),
        class_session_id VARCHAR(10),
        class_id VARCHAR(10),
        class_date DATE,
        term INT,
        enrolment_id VARCHAR(10) NOT NULL,
        status VARCHAR(20) NOT NULL,

        PRIMARY KEY (student_id, class_session_id, class_id, class_date, term)
    );

CREATE TABLE
    makeup_class (
        id VARCHAR(10),
        student_id VARCHAR(10) NOT NULL,
        class_session_id VARCHAR(10) NOT NULL,
        class_id VARCHAR(10) NOT NULL,
        class_date DATE NOT NULL,
        term INT NOT NULL,
        teacher_id VARCHAR(10) NOT NULL,
        room_id VARCHAR(10) NOT NULL,
        created_date DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (id)
    );

CREATE TABLE
    evaluation (
        student_id VARCHAR(10),
        class_id VARCHAR(10),
        class_date DATE,
        assessment_type VARCHAR(200),
        teacher_id VARCHAR(10) NOT NULL,
        grade VARCHAR(2) NOT NULL,
        comment NVARCHAR (2000) NOT NULL,
        enrolment_id VARCHAR(10) NOT NULL,
        evaluation_date DATE NOT NULL,

        PRIMARY KEY (student_id, class_id, class_date, assessment_type)
    );

CREATE TABLE
    issue (
        id VARCHAR(10),
        teacher_id VARCHAR(10) NOT NULL,
        student_id VARCHAR(10),
        room_id VARCHAR(10),
        issue_type VARCHAR(200) NOT NULL,
        issue_description NVARCHAR (200) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'In Progress',
        reported_date DATE NOT NULL DEFAULT (CURRENT_DATE),

        PRIMARY KEY (id)
    );

CREATE TABLE
    token_blocklist (
        id INT AUTO_INCREMENT,
        jti VARCHAR(36) NOT NULL,
        created_date DATE NOT NULL DEFAULT(CURRENT_DATE),

        PRIMARY KEY(id)
    );
