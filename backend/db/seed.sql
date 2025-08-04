INSERT INTO employee (id, full_name, email, phone_number, nickname, philosophy, achievements, role, teacher_status) VALUES
('EMP001', 'John Smith', 'john.smith@example.com', '0912345678', 'Johnny', 'Teach with passion', 'Teacher of the Year 2023', 'Teacher', 'Available'),
('EMP002', 'Emily Jones', 'emily.jones@example.com', '0987654321', 'Em', 'Learn by doing', 'IELTS 8.5 Certificate', 'Teacher', 'Available'),
('EM003', 'Michael Williams', 'michael.w@example.com', '0911223344', 'Mike', 'Patience is key', '10 years experience', 'Teacher', 'Unavailable'),
('EM004', 'Jessica Brown', 'jess.brown@example.com', '0955667788', 'Jess', 'Every student can succeed', 'Cambridge CELTA', 'Teacher', 'Available'),
('EM005', 'David Garcia', 'david.garcia@example.com', '0933445566', 'Dave', 'Communication is everything', 'Top Performer Q1 2024', 'Learning Advisor', NULL),
('EM006', 'Sarah Miller', 'sarah.miller@example.com', '0977889900', 'Sarah', 'Guidance and support', 'Best Consultant 2023', 'Learning Advisor', NULL),
('EM007', 'Chris Wilson', 'chris.wilson@example.com', '0922334455', 'Chris', 'Lead by example', 'Managed 200% growth', 'Manager', NULL),
('EM008', 'Olivia Martinez', 'olivia.m@example.com', '0966778899', 'Liv', 'Inspire creativity', 'Published author', 'Teacher', 'Available'),
('EM009', 'Daniel Anderson', 'dan.anderson@example.com', '0912312312', 'Dan', 'Never stop learning', 'TESOL Certified', 'Teacher', 'Available'),
('EM010', 'Sophia Thomas', 'sophia.t@example.com', '0945645645', 'Soph', 'Clarity and precision', 'TOEIC 990', 'Teacher', 'Available'),
('EM011', 'James Taylor', 'james.taylor@example.com', '0988877766', 'Jamie', 'Future-focused education', NULL, 'Learning Advisor', NULL),
('EM012', 'Ava Moore', 'ava.moore@example.com', '0915161718', 'Ava', 'Excellence in all things', 'Employee of the Month', 'Manager', NULL);

------------------------

-- Staff Checkin Samples
staff_checkin('STC001', 'EM001', NULL, NULL, 'Not Checked In');
staff_checkin('STC002', 'EM002', '2025-07-04 08:00:00', '2025-07-04 17:00:00', 'Checked In');
staff_checkin('STC003', 'EM003', '2025-07-04 09:00:00', '2025-07-04 17:00:00', 'Late');

------------------------

-- Leave Request Samples
leave_request('LR001', 'EM001', 'EM004', '2025-07-04', '2025-07-07', 'Sick', 'Approved', '2025-07-01');

------------------------

-- Student Samples
INSERT INTO student (id, fullname, date_of_birth, contact_info, created_date) VALUES
('STU001', 'Tran Van An', '2005-08-15', 'parent_phone:0905111222', '2024-01-10'),
('STU002', 'Nguyen Thi Binh', '2006-11-20', 'parent_email:binh.parent@email.com', '2024-01-12'),
('STU003', 'Le Van Cuong', '2005-02-25', 'student_phone:0988111333', '2024-02-01'),
('STU004', 'Pham Thi Dung', '2007-07-07', 'parent_phone:0903444555', '2024-02-05'),
('STU005', 'Hoang Van Em', '2004-09-18', 'student_email:em.hoang@email.com', '2024-03-11'),
('STU006', 'Do Thi Giang', '2006-04-30', 'parent_phone:0918222777', '2024-03-15'),
('STU007', 'Vu Van Hung', '2005-01-01', 'student_phone:0977654321', '2024-04-02'),
('STU008', 'Dinh Thi Khanh', '2007-03-14', 'parent_email:khanh.mom@email.com', '2024-04-08'),
('STU009', 'Ngo Van Lam', '2004-12-12', 'student_email:lam.ngo@email.com', '2024-05-19'),
('STU010', 'Mai Thi My', '2006-10-09', 'parent_phone:0909090909', '2024-05-21'),
('STU011', 'Trinh Van Nam', '2008-06-22', 'parent_phone:0913131313', '2024-06-01');


------------------------

-- Course Samples
INSERT INTO course(id, name, description, duration, start_date, schedule, learning_advisor_id, fee, prerequisites, created_date) 
    VALUES('C001', '7th Grade Math', 'Math for 7th grade', 6, '2025-08-07', 'Mon - Tue, 06:45 - 09:45', 'EM002', 32000000, 'Passed 6th Grade', '2025-07-04');
INSERT INTO course(id, name, description, duration, start_date, schedule, learning_advisor_id, fee, prerequisites, created_date) 
    VALUES('C002', 'Destination B2', 'Destination B2', 6, '2025-08-07', 'Wed - Thu, 06:45 - 09:45', 'EM004', 32000000, 'Passed Destination B1', '2025-07-04');

------------------------

-- Contract Samples
contract('CT001', 'ST001', 'EM002', 'CL001', '2025-07-04', 32000000, 'In Progress', '2025-08-07', '2026-02-07');
contract('CT002', 'ST002', 'EM002', 'CL002', '2025-07-04', 32000000, 'In Progress', '2025-08-07', '2026-02-07');

------------------------

-- Enrolment Samples
enrolment('ER001', 'CT001', 'ST001', 'CL001', '2025-07-04', '2025-08-07');
enrolment('ER002', 'CT002', 'ST002', 'CL002', '2025-07-04', '2025-08-07');

------------------------

-- Room Samples
room('R001', 'Math Room', 'Free');
room('R002', 'English Room', 'Free');

------------------------

-- Class Session Samples
class_session('SES001', 'CL001', '2025-07-04', '1', 'EM001', 'R001', '2025-08-08');
class_session('SES001', 'CL002', '2025-07-04', '1', 'EM004', 'R002', '2025-08-08');

-- Student Attendance Samples
student_attendance('ST001', 'SES001', 'CL001', '2025-07-04', '1', 'ER001', 'Abscent')
student_attendance('ST002', 'SES001', 'CL001', '2025-07-04', '1', 'ER002', 'Present')

-- Make-up Class Samples
makeup_class('MAK001', 'ST001', 'SES001', 'CL001', '2025-07-04', '1', 'EM001', 'R001', '2025-07-05')

-- Evaluation Samples
evaluation('ST001', 'CL001', '2025-07-05', 'Quiz 1', 'EM001', 'A+', 'You so great me love you!', '2025-07-05')

-- Issue
issue('ISS001', 'EM001', 'ST001', NULL, 'Student Behavior', 'This student pee in my class', 'In Progress', '2025-07-05')
issue('ISS002', 'EM001', NULL, 'R001', 'Technical', 'This room is full of piss', 'In Progress', '2025-07-05')



