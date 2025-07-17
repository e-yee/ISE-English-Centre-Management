INSERT INTO employee VALUES('EM001', 'Nguyễn Minh Khôi', 'nmkhoi069@gmail.com', '0901298756', 'Teacher', 'Available');
INSERT INTO employee VALUES('EM002', 'Hà Thư Hoàng', 'hthoang367@gmail.com', NULL, 'Learning Advisor', NULL);
INSERT INTO employee VALUES('EM003', 'Trương Công Thiên Phú', 'tctphu455@gmail.com', '0909088888', 'Manager', NULL);
INSERT INTO employee VALUES('EM004', 'Võ Trần Quốc Duy', 'vtqduy359@gmail.com', '0909011111', 'Learning Advisor', NULL);

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
INSERT INTO student VALUES('ST001', 'Võ Quốc Triệu', '2005-06-27', '0900123468 - Mom', '2025-07-17');
INSERT INTO student VALUES('ST002', 'Võ Minh Tuấn', '2005-04-30', '0904143468 - Dad', '2025-07-17');

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



