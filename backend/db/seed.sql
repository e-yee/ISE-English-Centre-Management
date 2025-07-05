-- Sample or initial data --
/*
-- Employee Samples
employee('EM001', 'Nguyễn Minh Khôi', 'nmkhoi069@gmail.com', '0901298756', 'Teacher', 'Available');
employee('EM002', 'Hà Thư Hoàng', 'hthoang367@gmail.com', NULL, 'Learning Advisor', NULL);
employee('EM003', 'Trương Công Thiên Phú', 'tctphu455@gmail.com', '0909088888', 'Manager', NULL);

------------------------

-- Staff Checkin Samples
staff_checkin('STC001', 'EM001', NULL, NULL, 'Not Checked In');
staff_checkin('STC002', 'EM002', '2025-07-04 08:00:00', '2025-07-04 17:00:00', 'Checked In');
staff_checkin('STC003', 'EM003', '2025-07-04 09:00:00', '2025-07-04 17:00:00', 'Late');

------------------------

-- Leave Request Samples
leave_request('LR001', 'EM001', 'EM004', '2025-07-04', '2025-07-07', 'Sick', 'Approved', '2025-07-01');

------------------------

-- Account Samples
account('ACC001', 'EM001', 'nmkhoi069', '123456', '2025-06-20');
account('ACC002', 'EM002', 'hthoang367', '123456', '2025-06-20');
account('ACC003', 'EM003', 'tctphu455', '123456', '2025-06-20');

------------------------

-- Student Samples
student('ST001', 'Võ Trần Quốc Duy', '2005-06-27', '0900123468 - Mom', '2025-07-01');
student('ST002', 'Võ Minh Tuấn', '2005-04-30', '0904143468 - Dad', '2025-07-01');

------------------------

-- Class Samples
class('CL001', '7th Grade Math', 'Math for 7th grade', 6, '2025-08-07', '2026-02-07', 'Mon - Tue, 06:45 - 09:45', 'EM001', 32000000, 'Passed 6th Grade', '2025-07-04');
class('CL002', 'Destination B2', 'Destination B2', 6, '2025-08-07', '2026-02-07', 'Wed - Thu, 06:45 - 09:45', 'EM004', 32000000, 'Passed Destination B1', '2025-07-04');

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


