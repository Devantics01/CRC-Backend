import course from "../model/courseModel.js ";

export const createCourse = async(data)=>{
    try {
        await course.create({
            course_name: data.course_name,
            course_code: data.course_code,
            department: data.department,
            level: data.level,
            lecturer: data.lecturer,
            course_description: data.course_description,
            resourceApproval: 'pending'
        });
        return true;
    } catch (err) {
        return {error: err};
    }
};

export const getCourse = async(data)=>{
    try {
        const res = await course.findOne({
            where: {
                course_name: data.course_name,
                course_code: data.course_code
            }
        });
        return {
            course_name: res.dataValues.course_name,
            course_code: res.dataValues.course_code,
            course_description: res.dataValues.course_code,
            lecturer: res.dataValues.lecturer,
            resource_link: res.dataValues.resource_link,
            resourceApproval: res.dataValues.resourceApproval,
            assignment: res.dataValues.assignment
        };
    } catch (err) {
        return {error: err};
    };
};
export const getCourseByDepartment = async(department)=>{
    try {
        const res = await course.findAll({
            where: {
                department: department
            }
        });
        let courseList = [];
        let index = 0;
        while(index < res.length){
            let assignmentStatus = 'yes';
            if (res[index].assignment == null) {
                assignmentStatus = 'no';
            }
            courseList.push({
                course_name: res[index].dataValues.course_name,
                lecturer: res[index].dataValues.lecturer,
                course_code: res[index].dataValues.course_code,
                course_description: res[index].dataValues.course_description,
                assignment: assignmentStatus,
            });
            index++;
        };
        return {status: true, info: courseList};
    } catch (err) {
        return {error: err};
    };
};

export const getCourseByLecturer = async(lecturer)=>{
    try {
        const res = await course.findAll({
            where: {
                lecturer: lecturer
            }
        });
        let courseList = [];
        let index = 0;
        while(index < res.length){
            let assignmentStatus = 'yes';
            if (res[index].assignment == null) {
                assignmentStatus = 'no';
            }
            courseList.push({
                course_name: res[index].dataValues.course_name,
                lecturer: res[index].dataValues.lecturer,
                course_code: res[index].dataValues.course_code,
                course_description: res[index].dataValues.course_description,
                assignment: assignmentStatus,
            });
            index++;
        };
        return {status: true, info: courseList};
    } catch (err) {
        return {error: err};
    };
};


export const updateCourseMaterial = async(data)=>{
    try {
        await course.update({
            resource_link: data.resource_link,
            assignment: data.assignment
        }, {
            where: {
                course_name: data.course_name,
                course_code: data.course_code
            }
        });
        return true;
    } catch (err) {
        return {error: err};
    }
};

export const updateCourseResources = async(data)=>{
    try {
        await course.update({
            resource_link: data.resource_link
        }, {
            where: {
                course_code: data.course_code
            }
        });
        return true;
    } catch (err) {
        return {error: err};
    }
};

export const updateCourseInfo = async(data)=>{
    try {
        await course.update({
            course_name: data.newCourseName,
            course_code: newCourseCode,
            course_description: newCourseDescription
        }, {
            where: {
                course_code: data.course_code
            }
        });
        return true;
    } catch (err) {
        return {error: err};
    }
};

export const approveCourseMaterial = async(data)=>{
    try {
        await course.update({
            resource_link: data.resource_link
        }, {
            where: {
                course_code: data.course_code
            }
        });
        return true;
    } catch (err) {
        return {error: err};
    }
};

export const updateCourseAssignment = async(data)=>{
    try {
        await course.update({
            assignment: data.assignment
        }, {
            where: {
                course_code: data.course_code
            }
        })
        return true;
    } catch (err) {
        return {error: err};
    }
}

export const deleteCourse = async(data)=>{
    try {
        await course.destroy({
            where:{
                course_code: data.course_code
            }
        });
        return true;
    } catch (err) {
        
    }
}