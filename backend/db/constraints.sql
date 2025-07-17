ALTER TABLE employee ADD CONSTRAINT CHK_employee_role CHECK (
    role IN ('Teacher', 'Learning Advisor', 'Manager')
);

ALTER TABLE employee ADD CONSTRAINT CHK_employee_status CHECK (
    (role = 'Teacher' AND teacher_status IS NOT NULL AND teacher_status IN ('Available', 'Unavailable'))
    OR (role <> 'Teacher' AND teacher_status IS NULL)
);

ALTER TABLE staff_checkin ADD CONSTRAINT CHK_staff_checkin_status CHECK (
    status IN ('Not Checked In', 'Checked In', 'Late')
);

ALTER TABLE staff_checkin ADD CONSTRAINT CHK_staff_checkin_datetime CHECK (
    DATEDIFF (checkout_time, checkin_time) >= 0
);

ALTER TABLE staff_checkin ADD CONSTRAINT FK_staff_checkin_employee 
    FOREIGN KEY (employee_id) REFERENCES employee(id);

ALTER TABLE leave_request ADD CONSTRAINT CHK_leave_request_date CHECK (
    DATEDIFF (end_date, start_date) > 0
);

ALTER TABLE leave_request ADD CONSTRAINT CHK_leave_request_status CHECK (
    status IN ('Approved', 'Not Approved')
);
        
ALTER TABLE leave_request ADD CONSTRAINT CHK_leave_request_substitute__id CHECK (
    employee_id <> substitute_id
);

ALTER TABLE leave_request ADD CONSTRAINT FK_employee_id_employee
    FOREIGN KEY (employee_id) REFERENCES employee(id);

ALTER TABLE leave_request ADD CONSTRAINT FK_substitute_id_employee
    FOREIGN KEY (substitute_id) REFERENCES employee(id);

ALTER TABLE account ADD CONSTRAINT FK_account_employee
    FOREIGN KEY (employee_id) REFERENCES employee(id);

ALTER TABLE course ADD CONSTRAINT FK_course_employee
    FOREIGN KEY (learning_advisor_id) REFERENCES employee(id);

ALTER TABLE contract ADD CONSTRAINT CHK_contract_status CHECK (
    payment_status IN ('In Progress', 'Paid')
);

ALTER TABLE contract ADD CONSTRAINT CHK_contract_date CHECK (
    DATEDIFF (end_date, start_date) > 0
);

ALTER TABLE contract ADD CONSTRAINT FK_contract_student
    FOREIGN KEY (student_id) REFERENCES student(id);

ALTER TABLE contract ADD CONSTRAINT FK_contract_employee
    FOREIGN KEY (employee_id) REFERENCES employee(id);

ALTER TABLE contract ADD CONSTRAINT FK_contract_course
    FOREIGN KEY (course_id, course_date) REFERENCES course(id, created_date);

ALTER TABLE enrolment ADD CONSTRAINT FK_enrolment_contract
    FOREIGN KEY (contract_id) REFERENCES contract(id);

ALTER TABLE enrolment ADD CONSTRAINT FK_enrolment_student
    FOREIGN KEY (student_id) REFERENCES student(id);

ALTER TABLE enrolment ADD CONSTRAINT FK_enrolment_course
    FOREIGN KEY (course_id, course_date) REFERENCES course(id, created_date);

ALTER TABLE room ADD CONSTRAINT CHK_room_status CHECK (
    status IN ('Free', 'Occupied', 'Maintenance')
);

ALTER TABLE class ADD CONSTRAINT CHK_class_term CHECK (
    term IN (1, 2)
);

ALTER TABLE class ADD CONSTRAINT FK_class_course
    FOREIGN KEY (course_id, course_date) REFERENCES course(id, created_date);

ALTER TABLE class ADD CONSTRAINT FK_class_employee
    FOREIGN KEY (teacher_id) REFERENCES employee(id);

ALTER TABLE class ADD CONSTRAINT FK_class_room
    FOREIGN KEY (room_id) REFERENCES room(id);

ALTER TABLE student_attendance ADD CONSTRAINT CHK_student_attendance_status CHECK (
    status IN ('Present', 'Absent')
);
ALTER TABLE student_attendance ADD CONSTRAINT FK_student_attendance_student
    FOREIGN KEY (student_id) REFERENCES student(id);

ALTER TABLE student_attendance ADD CONSTRAINT FK_student_attendance_enrolment
    FOREIGN KEY (enrolment_id) REFERENCES enrolment(id);

ALTER TABLE student_attendance ADD CONSTRAINT FK_student_attendance_class
    FOREIGN KEY (class_id, course_id, course_date, term) 
    REFERENCES class(id, course_id, course_date, term);

ALTER TABLE makeup_class ADD CONSTRAINT FK_makeup_class_student_attendance
    FOREIGN KEY (student_id, class_id, course_id, course_date, term) 
    REFERENCES student_attendance(student_id, class_id, course_id, course_date, term);

ALTER TABLE makeup_class ADD CONSTRAINT FK_makeup_class_employee
    FOREIGN KEY (teacher_id) REFERENCES employee(id);

ALTER TABLE makeup_class ADD CONSTRAINT FK_makeup_class_room
    FOREIGN KEY (room_id) REFERENCES room(id);

ALTER TABLE evaluation ADD CONSTRAINT CHK_evaluation_type CHECK (
    assessment_type IN ( 
        'Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4',
        'Writing Project 1', 'Writing Project 2',
        'Reading Assessment 1', 'Reading Assessment 2'
    )
);

ALTER TABLE evaluation ADD CONSTRAINT FK_evaluation_student
    FOREIGN KEY (student_id) REFERENCES student(id);

ALTER TABLE evaluation ADD CONSTRAINT FK_evaluation_course
    FOREIGN KEY (course_id, course_date) REFERENCES course(id, created_date);

ALTER TABLE evaluation ADD CONSTRAINT FK_evaluation_employee
    FOREIGN KEY (teacher_id) REFERENCES employee(id);

ALTER TABLE evaluation ADD CONSTRAINT enrolment 
    FOREIGN KEY (enrolment_id) REFERENCES enrolment(id);

ALTER TABLE issue ADD CONSTRAINT CHK_issue_type CHECK (
    issue_type IN ('student Behavior', 'Technical')
);

ALTER TABLE issue ADD CONSTRAINT CHK_issue_student_room CHECK (
    (issue_type LIKE 'student Behavior' AND student_id IS NOT NULL AND room_id IS NULL)
    OR 
    (issue_type LIKE 'Technical' AND student_id IS NULL AND room_id IS NOT NULL)
);

ALTER TABLE issue ADD CONSTRAINT CHK_issue_status CHECK (
    status IN ('In Progress', 'Done')
);

ALTER TABLE issue ADD CONSTRAINT FK_issue_student
    FOREIGN KEY (student_id) REFERENCES student(id);

ALTER TABLE issue ADD CONSTRAINT FK_issue_employee
    FOREIGN KEY (teacher_id) REFERENCES employee(id);

ALTER TABLE issue ADD CONSTRAINT FK_issue_room
    FOREIGN KEY (room_id) REFERENCES room(id);