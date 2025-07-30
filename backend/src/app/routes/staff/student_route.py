from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from extensions import db
from ...auth import role_required
from ...models import Student, Enrolment, Contract, Course
from ...schemas.learning_advisor.student_schema import student_schema, students_schema
from ...schemas.learning_advisor.enrolment_schema import enrolment_schema, enrolments_schema
from ...http_status import HTTPStatus

student_bp = Blueprint("student_bp", __name__, url_prefix="/student")

@student_bp.post("/add")
@role_required("Learning Advisor")
def add_student(): 
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = student_schema.load(json_data)
        
        student = Student(
            id=validated["id"],
            fullname=validated["fullname"],
            contact_info=validated["contact_info"],
            date_of_birth=validated["date_of_birth"]
        )
        
        db.session.add(student)
        db.session.commit()
        return jsonify(student_schema.dump(student)), HTTPStatus.CREATED
   
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input",
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/")
@role_required("Learning Advisor")
def get_all():
    try:
        students = db.session.query(Student).all()
        return jsonify(students_schema.dump(students)), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/search")
@role_required("Learning Advisor")
def get_student():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing student ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        student = db.session.get(Student, id)
        if not student:
            return jsonify({
                "message": "Student not found"
            }), HTTPStatus.NOT_FOUND

        return jsonify(student_schema.dump(student)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.put("/update")
@role_required("Learning Advisor")
def update_student():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing student ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        student = db.session.get(Student, id)
        if not student:
            return jsonify({
                "message": "Student not found"
            }), HTTPStatus.NOT_FOUND
        
        if not request.is_json:
            return jsonify({
                "message: Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        update_data = student_schema.load(json_data, partial=True)
        for key, value in update_data.items():
            setattr(student, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Student updated successfully"
        }), HTTPStatus.OK
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input",
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.delete("/delete")
@role_required("Learning Advisor")
def delete_student():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing student ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        student = db.session.get(Student, id)
        if not student:
            return jsonify({
                "message": "Student not found"
            }), HTTPStatus.NOT_FOUND
        
        db.session.delete(student)
        db.session.commit()
        return jsonify({
            "message": "Student deleted successfully"
        }), HTTPStatus.OK
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@student_bp.post("/enrolment/add")
@role_required("Learning Advisor")
def add_enrolment():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
            
        json_data = request.get_json()
        validated = enrolment_schema.load(json_data)
        
        contract = db.session.get(Contract, validated["contract_id"])
        if not contract:
            return jsonify({
                "message": "Contract not found"
            }), HTTPStatus.NOT_FOUND
        
        student = db.session.get(Student, validated["student_id"])
        if not student:
            return jsonify({
                "message": "Student not found"
            }), HTTPStatus.NOT_FOUND
        
        course = db.session.get(Course, (validated["course_id"], validated["course_date"]))
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
        
        enrolment = Enrolment(
            id=validated["id"],
            contract_id=validated["contract_id"],
            student_id=validated["student_id"],
            course_id=validated["course_id"],
            course_date=validated["course_date"],
            enrolment_date=validated["enrolment_date"]
        )
        db.session.add(enrolment)
        db.session.commit()
        
        return jsonify(enrolment_schema.dump(enrolment)), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input",
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
        
    except Exception as e:
        db.session.rollback()
        
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/enrolment/")
@role_required("Learning Advisor")
def get_all_enrolments():
    try:
        enrolments = db.session.query(Enrolment).all()
        return jsonify(enrolments_schema.dump(enrolments)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/enrolment/search")
@role_required("Learning Advisor")
def get_enrolment():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing enrolment ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        enrolment = db.session.get(Enrolment, id)
        if not enrolment:
            return jsonify({
                "message": "Enrolment not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify(enrolment_schema.dump(enrolment)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.put("/enrolment/update")
@role_required("Learning Advisor")
def update_enrolment():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing enrolment ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        enrolment = db.session.get(Enrolment, id)
        if not enrolment:
            return jsonify({
                "message": "Enrolment not found"
            }), HTTPStatus.NOT_FOUND
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        update_data = enrolment_schema.load(json_data, partial=True)
        
       
        contract_id = update_data.get("contract_id", enrolment.contract_id)
        student_id = update_data.get("student_id", enrolment.student_id)
        course_id = update_data.get("course_id", enrolment.course_id)
        course_date = update_data.get("course_date", enrolment.course_date)
        
        if contract_id != enrolment.contract_id:
            contract = db.session.get(Contract, update_data["contract_id"])
            if not contract:
                return jsonify({
                    "message": "Contract not found"
                }), HTTPStatus.NOT_FOUND
        
        if student_id != enrolment.student_id:
            student = db.session.get(Student, update_data["student_id"])
            if not student:
                return jsonify({
                    "message": "Student not found"
                }), HTTPStatus.NOT_FOUND
                
        if course_id != enrolment.course_id or course_date != enrolment.course_date:
            course = db.session.get(Course, (update_data["course_id"], update_data["course_date"]))
            if not course:
                return jsonify({
                    "message": "Course not found"
                }), HTTPStatus.NOT_FOUND
        
        existed_course = db.session.query(Enrolment).filter_by(
            contract_id=contract_id,
            student_id=student_id,
            course_id=course_id,
            course_date=course_date
        ).first()
        if existed_course:
            return jsonify({
                "message": "Enrolment existed"
            }), HTTPStatus.CONFLICT
        
        for key, value in update_data.items():
            setattr(enrolment, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Enrolment updated successfully"
        }), HTTPStatus.OK
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input",
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
@student_bp.delete("/enrolment/delete")
@role_required("Learning Advisor")
def delete_enrolment():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing enrolment ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        enrolment = db.session.get(Enrolment, id)
        if not enrolment:
            return jsonify({
                "message": "Enrolment not found"
            }), HTTPStatus.BAD_REQUEST
        
        db.session.delete(enrolment)
        db.session.commit()
        return jsonify({
            "message": "Enrolment deleted successfully"
        }), HTTPStatus.OK
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR 