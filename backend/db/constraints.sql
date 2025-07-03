-- Constraints Definition --
-- Employee's Constraints
ALTER TABLE Employee ADD CONSTRAINT CHK_Employee_Role CHECK (
    Role IN ('Teacher', 'Learning Advisor', 'Manager')
);

ALTER TABLE Employee ADD CONSTRAINT CHK_Employee_Status CHECK (
    (Role = 'Teacher' AND TeacherStatus IN ('Available', 'Unavailable'))
    OR (Role <> 'Teacher' AND TeacherStatus IS NULL)
);

-----------------------------------------
-- StaffCheckin Constraints
ALTER TABLE StaffCheckin ADD CONSTRAINT CHK_StaffCheckin_Status CHECK (
    Status IN ('Not Checked In', 'Checked In', 'Late')
);

ALTER TABLE StaffCheckin ADD CONSTRAINT CHK_StaffCheckin_DateTime CHECK (
    DATEDIFF (CheckoutTime, CheckinTime) >= 0
);

ALTER TABLE StaffCheckin ADD CONSTRAINT FK_StaffCheckin_Employee 
    FOREIGN KEY (EmployeeID) REFERENCES Employee(ID);

----------------------------------------
-- LeaveRequest Constraints
ALTER TABLE LeaveRequest ADD CONSTRAINT CHK_LeaveRequest_Date CHECK (
    DATEDIFF (EndDate, StartDate) > 0
);

ALTER TABLE LeaveRequest ADD CONSTRAINT CHK_LeaveRequest_Status CHECK (
    Status IN ('Approved', 'Not Approved')
);
        
ALTER TABLE LeaveRequest ADD CONSTRAINT CHK_LeaveRequest_SubstituteID CHECK (
    EmployeeID <> SubstituteID
);

ALTER TABLE LeaveRequest ADD CONSTRAINT FK_EmployeeID_Employee
    FOREIGN KEY (EmployeeID) REFERENCES Employee(ID);

ALTER TABLE LeaveRequest ADD CONSTRAINT FK_SubstituteID_Employee
    FOREIGN KEY (SubstituteID) REFERENCES Employee(ID);

----------------------------------------
-- Account Constraints
ALTER TABLE Account ADD CONSTRAINT FK_Account_Employee
    FOREIGN KEY (EmployeeID) REFERENCES Employee(ID);

----------------------------------------
-- Class Constraints
ALTER TABLE Class ADD CONSTRAINT FK_Class_Employee
    FOREIGN KEY (TeacherID) REFERENCES Employee(ID);

----------------------------------------
-- Contract Constraints
ALTER TABLE Contract ADD CONSTRAINT CHK_Contract_Status CHECK (
    PaymentStatus IN ('In Progress', 'Paid')
);

ALTER TABLE Contract ADD CONSTRAINT CHK_Contract_Date CHECK (
    DATEDIFF (EndDate, StartDate) > 0
);

ALTER TABLE Contract ADD CONSTRAINT FK_Contract_Student
    FOREIGN KEY (StudentID) REFERENCES Student(ID);

ALTER TABLE Contract ADD CONSTRAINT FK_Contract_Employee
    FOREIGN KEY (EmployeeID) REFERENCES Employee(ID);

ALTER TABLE Contract ADD CONSTRAINT FK_Contract_Class
    FOREIGN KEY (ClassID, ClassDate) REFERENCES Class(ID, CreatedDate);

----------------------------------------
-- Enrolment Constraints
ALTER TABLE Enrolment ADD CONSTRAINT FK_Enrolment_Contract
    FOREIGN KEY (ContractID) REFERENCES Contract(ID);

ALTER TABLE Enrolment ADD CONSTRAINT FK_Enrolment_Student
    FOREIGN KEY (StudentID) REFERENCES Student(ID);

ALTER TABLE Enrolment ADD CONSTRAINT FK_Enrolment_Class
    FOREIGN KEY (ClassID, ClassDate) REFERENCES Class(ID, CreatedDate);

----------------------------------------
-- Room Constraints
ALTER TABLE Room ADD CONSTRAINT CHK_Room_Status CHECK (
    Status IN ('Free', 'Occupied', 'Maintenance')
);

----------------------------------------
-- ClassSession Constraints
ALTER TABLE ClassSession ADD CONSTRAINT CHK_ClassSession_Term CHECK (
    Term IN (1, 2)
);

ALTER TABLE ClassSession ADD CONSTRAINT FK_ClassSession_Class
    FOREIGN KEY (ClassID, ClassDate) REFERENCES Class(ID, CreatedDate);

ALTER TABLE ClassSession ADD CONSTRAINT FK_ClassSession_Employee
    FOREIGN KEY (TeacherID) REFERENCES Employee(ID);

ALTER TABLE ClassSession ADD CONSTRAINT FK_ClassSession_Room
    FOREIGN KEY (RoomID) REFERENCES Room(ID);

----------------------------------------
-- StudentAttendance Constraints
ALTER TABLE StudentAttendance ADD CONSTRAINT CHK_StudentAttendance_Status CHECK (
    Status IN ('Present', 'Absent')
);
ALTER TABLE StudentAttendance ADD CONSTRAINT FK_StudentAttendance_Student
    FOREIGN KEY (StudentID) REFERENCES Student(ID);

ALTER TABLE StudentAttendance ADD CONSTRAINT FK_StudentAttendance_Enrolment
    FOREIGN KEY (EnrolmentID) REFERENCES Enrolment(ID);

ALTER TABLE StudentAttendance ADD CONSTRAINT FK_StudentAttendance_ClassSession
    FOREIGN KEY (ClassSessionID, ClassID, ClassDate, Term) 
    REFERENCES ClassSession(ID, ClassID, ClassDate, Term);

----------------------------------------
-- MakeupClass Constraints
ALTER TABLE MakeupClass ADD CONSTRAINT FK_MakeupClass_StudentAttendance
    FOREIGN KEY (StudentID, ClassSessionID, ClassID, ClassDate, Term) 
    REFERENCES StudentAttendance(StudentID, ClassSessionID, ClassID, ClassDate, Term);

ALTER TABLE MakeupClass ADD CONSTRAINT FK_MakeupClass_Employee
    FOREIGN KEY (TeacherID) REFERENCES Employee(ID);

ALTER TABLE MakeupClass ADD CONSTRAINT FK_MakeupClass_Room
    FOREIGN KEY (RoomID) REFERENCES Room(ID);

----------------------------------------
-- Evaluation Constraints
ALTER TABLE Evaluation ADD CONSTRAINT CHK_Evaluation_Type CHECK (
    AssessmentType IN ( 
        'Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4',
        'Writing Project 1', 'Writing Project 2',
        'Reading Assessment 1', 'Reading Assessment 2'
    )
);

ALTER TABLE Evaluation ADD CONSTRAINT FK_Evaluation_Student
    FOREIGN KEY (StudentID) REFERENCES Student(ID);

ALTER TABLE Evaluation ADD CONSTRAINT FK_Evaluation_Class
    FOREIGN KEY (ClassID, ClassDate) REFERENCES Class(ID, CreatedDate);

ALTER TABLE Evaluation ADD CONSTRAINT FK_Evaluation_Employee
    FOREIGN KEY (TeacherID) REFERENCES Employee(ID);

ALTER TABLE Evaluation ADD CONSTRAINT Enrolment 
    FOREIGN KEY (EnrolmentID) REFERENCES Enrolment(ID);

----------------------------------------
-- Issue Constraints
ALTER TABLE Issue ADD CONSTRAINT CHK_Issue_Type CHECK (
    IssueType IN ('Student Behavior', 'Technical')
);

ALTER TABLE Issue ADD CONSTRAINT CHK_Issue_Student_Room CHECK (
    (IssueType LIKE 'Student Behavior' AND StudentID IS NOT NULL AND RoomID IS NULL)
    OR 
    (IssueType LIKE 'Technical' AND StudentID IS NULL AND RoomID IS NOT NULL)
);

ALTER TABLE Issue ADD CONSTRAINT CHK_Issue_Status CHECK (
    Status IN ('In Progress', 'Done')
);

ALTER TABLE Issue ADD CONSTRAINT FK_Issue_Student
    FOREIGN KEY (StudentID) REFERENCES Student(ID);

ALTER TABLE Issue ADD CONSTRAINT FK_Issue_Employee
    FOREIGN KEY (TeacherID) REFERENCES Employee(ID);

ALTER TABLE Issue ADD CONSTRAINT FK_Issue_Room
    FOREIGN KEY (RoomID) REFERENCES Room(ID);